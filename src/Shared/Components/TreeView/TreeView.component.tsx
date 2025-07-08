import { SyntheticEvent, useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import { Icon } from '../Icon'
import { TrailingItem } from '../TrailingItem'
import { DEFAULT_NO_ITEMS_TEXT, VARIANT_TO_BG_CLASS_MAP, VARIANT_TO_HOVER_CLASS_MAP } from './constants'
import TreeViewNodeContent from './TreeViewNodeContent'
import { NodeElementType, TreeHeading, TreeItem, TreeViewProps } from './types'
import { getSelectedIdParentNodes, getVisibleNodes } from './utils'

import './TreeView.scss'

const Divider = () => (
    <span className="dc__grid dc__align-self-stretch dc__content-center pl-8 w-24 dc__no-shrink">
        <span className="dc__inline-block w-1 bcn-2 h-100" />
    </span>
)

const TreeView = <DataAttributeType = null,>({
    nodes,
    isControlled = false,
    expandedMap: expandedMapProp = {},
    selectedId,
    onToggle: onToggleProp,
    onSelect,
    depth = 0,
    mode = 'navigation',
    flatNodeList: flatNodeListProp,
    getUpdateItemsRefMap: getUpdateItemsRefMapProp,
    variant = 'primary',
    defaultExpandedMap = {},
}: TreeViewProps<DataAttributeType>) => {
    const { pathname } = useLocation()
    const isFirstLevel = depth === 0

    const getDefaultExpandedMap = (): Record<string, boolean> => {
        const defaultMap: Record<string, boolean> = defaultExpandedMap
        if (!selectedId) {
            return defaultMap
        }

        const selectedIdParentNodes = getSelectedIdParentNodes<DataAttributeType>({
            selectedId,
            nodes,
        })
        selectedIdParentNodes.forEach((id) => {
            defaultMap[id] = true
        })
        return defaultMap
    }

    const [itemIdToScroll, setItemIdToScroll] = useState<string | null>(null)

    // Using this at root level
    const itemsRef = useRef<Record<string, NodeElementType | null>>({})
    // This will in actuality be used in first level of tree view since we are sending isControlled prop as true to all the nested tree views
    const [currentLevelExpandedMap, setCurrentLevelExpandedMap] =
        useState<Record<string, boolean>>(getDefaultExpandedMap)

    const expandedMap = isControlled ? expandedMapProp : currentLevelExpandedMap

    const fallbackTabIndex = mode === 'navigation' ? -1 : 0

    useEffect(() => {
        // isControlled is false for first level of the tree view so should set the expanded map only from first level
        if (isFirstLevel) {
            const selectedIdParentNodes = getSelectedIdParentNodes<DataAttributeType>({
                selectedId,
                nodes,
            })
            setCurrentLevelExpandedMap((prev) => {
                const newExpandedMap = { ...prev }
                selectedIdParentNodes.forEach((id) => {
                    newExpandedMap[id] = true
                })
                return newExpandedMap
            })

            setItemIdToScroll(selectedId)
        }
    }, [selectedId])

    const getToggleNode = (node: TreeHeading<DataAttributeType>) => () => {
        if (isControlled) {
            onToggleProp(node)
        } else {
            setCurrentLevelExpandedMap((prev) => ({
                ...prev,
                [node.id]: !prev[node.id],
            }))
        }
    }

    const childItemsOnToggle = (node: TreeHeading<DataAttributeType>) => {
        if (isControlled) {
            onToggleProp(node)
        } else {
            getToggleNode(node)()
        }
    }

    const getUpdateItemsRefMap = (id: string) => (el: NodeElementType) => {
        if (!isFirstLevel) {
            throw new Error('getUpdateItemsRefMap should only be used at the first level of the tree view.')
        }

        if (id === itemIdToScroll) {
            el?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center',
            })
            setItemIdToScroll(null)
        }
        itemsRef.current[id] = el
    }

    const flatNodeList = useMemo(() => {
        if (flatNodeListProp) {
            return flatNodeListProp
        }

        return getVisibleNodes<DataAttributeType>({
            nodeList: nodes,
            expandedMap,
        })
    }, [nodes, expandedMap, flatNodeListProp])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (mode !== 'navigation' || !isFirstLevel) {
            return
        }

        const { key } = e

        if (!['ArrowUp', 'ArrowDown'].includes(key)) {
            return
        }

        e.preventDefault()

        const target = e.target as HTMLButtonElement | HTMLAnchorElement
        const nodeId = target.getAttribute('data-node-id')
        if (!nodeId) {
            return
        }

        // Find the index of the current node in the flatNodeList
        const currentIndex = flatNodeList.indexOf(nodeId)
        if (currentIndex === -1) {
            return
        }

        if (key === 'ArrowDown' && currentIndex < flatNodeList.length - 1) {
            itemsRef.current[flatNodeList[currentIndex + 1]]?.focus()
            return
        }

        if (key === 'ArrowUp' && currentIndex > 0) {
            itemsRef.current[flatNodeList[currentIndex - 1]]?.focus()
        }
    }

    const commonClickHandler = (e: SyntheticEvent, node: TreeItem<DataAttributeType>) => {
        node.onClick?.(e)
        onSelect?.(node)
    }

    const getNodeItemButtonClick = (node: TreeItem<DataAttributeType>) => (e: SyntheticEvent) => {
        commonClickHandler(e, node)
    }

    const getNodeItemNavLinkClick = (node: TreeItem<DataAttributeType>) => (e: SyntheticEvent) => {
        // Prevent navigation to the same page
        if (node.href === pathname) {
            e.preventDefault()
        }
        commonClickHandler(e, node)
    }

    const renderNodeItemAction = (
        node: TreeItem<DataAttributeType>,
        itemDivider: JSX.Element,
        content: JSX.Element,
    ) => {
        const isSelected = selectedId === node.id
        const baseClass =
            'dc__transparent p-0-imp flexbox dc__align-start flex-grow-1 tree-view__container--item dc__select-text'

        if (node.as === 'div') {
            return (
                <div
                    className={baseClass}
                    data-node-id={node.id}
                    data-testid={`tree-view-item-${node.title}`}
                    ref={getUpdateItemsRefMapProp ? getUpdateItemsRefMapProp(node.id) : getUpdateItemsRefMap(node.id)}
                    {...(node.dataAttributes ? node.dataAttributes : {})}
                >
                    {itemDivider}
                    {content}
                </div>
            )
        }

        if (node.as === 'link') {
            return (
                <NavLink
                    to={node.clearQueryParamsOnNavigation ? { pathname: node.href, search: '' } : node.href}
                    className={baseClass}
                    onClick={getNodeItemNavLinkClick(node)}
                    tabIndex={isSelected ? 0 : fallbackTabIndex}
                    data-node-id={node.id}
                    data-testid={`tree-view-item-${node.title}`}
                    ref={getUpdateItemsRefMapProp ? getUpdateItemsRefMapProp(node.id) : getUpdateItemsRefMap(node.id)}
                    {...(node.dataAttributes ? node.dataAttributes : {})}
                >
                    {itemDivider}
                    {content}
                </NavLink>
            )
        }

        return (
            <button
                type="button"
                disabled={node.isDisabled}
                className={baseClass}
                onClick={getNodeItemButtonClick(node)}
                tabIndex={isSelected ? 0 : fallbackTabIndex}
                data-node-id={node.id}
                ref={getUpdateItemsRefMapProp ? getUpdateItemsRefMapProp(node.id) : getUpdateItemsRefMap(node.id)}
                data-testid={`tree-view-item-${node.title}`}
                {...(node.dataAttributes ? node.dataAttributes : {})}
            >
                {itemDivider}
                {content}
            </button>
        )
    }

    return (
        <div
            className={`tree-view__container ${VARIANT_TO_BG_CLASS_MAP[variant]} ${isFirstLevel ? 'dc__overflow-auto w-100 h-100 flex-grow-1' : ''}`}
            // Setting key down event here instead of button and navlink to minimize the number of event listeners
            {...(isFirstLevel ? { role: 'tree', onKeyDown: handleKeyDown } : {})}
        >
            {nodes.map((node) => {
                const isSelected = selectedId === node.id

                const dividerPrefix =
                    depth > 1 &&
                    // eslint-disable-next-line react/no-array-index-key
                    Array.from({ length: depth - 1 }).map((_, index) => <Divider key={`divider-${index}`} />)

                const content = (
                    <TreeViewNodeContent
                        startIconConfig={node.startIconConfig}
                        title={node.title}
                        subtitle={node.subtitle}
                        type={node.type}
                        customTooltipConfig={node.customTooltipConfig}
                        strikeThrough={node.strikeThrough}
                        isSelected={isSelected}
                    />
                )

                if (node.type === 'heading') {
                    const isExpanded = expandedMap[node.id] ?? false

                    return (
                        <div
                            key={node.id}
                            role="treeitem"
                            aria-selected={false}
                            aria-expanded={isExpanded}
                            className="flexbox-col w-100"
                            aria-level={depth + 1}
                        >
                            <div
                                className={`flexbox w-100 dc__align-start ${VARIANT_TO_BG_CLASS_MAP[variant]} ${isFirstLevel ? 'dc__position-sticky dc__top-0 dc__zi-1' : ''}`}
                            >
                                <div className="flexbox w-100 dc__align-start">
                                    {dividerPrefix}

                                    <div
                                        className={`flexbox w-100 dc__align-start br-4 ${isSelected ? 'bcb-1' : VARIANT_TO_HOVER_CLASS_MAP[variant]}`}
                                    >
                                        <button
                                            type="button"
                                            className="tree-view__container--item dc__transparent p-0-imp flexbox dc__align-start flex-grow-1 dc__select-text"
                                            onClick={getToggleNode(node)}
                                            tabIndex={fallbackTabIndex}
                                            data-node-id={node.id}
                                            data-testid={`tree-view-heading-${node.title}`}
                                            ref={
                                                getUpdateItemsRefMapProp
                                                    ? getUpdateItemsRefMapProp(node.id)
                                                    : getUpdateItemsRefMap(node.id)
                                            }
                                            {...(node.dataAttributes ? node.dataAttributes : {})}
                                        >
                                            {depth > 0 && (
                                                <span className="dc__grid dc__align-self-stretch dc__content-center pl-8 w-24 dc__no-shrink dc__align-items-center">
                                                    <span className="dc__inline-block w-1 bcn-2 h-100 tree-view__divider" />
                                                </span>
                                            )}

                                            <span className="dc__grid icon-with-divider dc__align-self-stretch">
                                                <span className="dc__no-shrink pl-8 pt-8">
                                                    <Icon
                                                        name="ic-expand-sm"
                                                        color={null}
                                                        rotateBy={isExpanded ? 270 : 180}
                                                        size={16}
                                                    />
                                                </span>

                                                {isExpanded && (
                                                    <span className="flex pl-8">
                                                        <span className="dc__inline-block w-1 bcn-2 h-100" />
                                                    </span>
                                                )}
                                            </span>

                                            {content}
                                        </button>

                                        {node.trailingItem && (
                                            <div className="flex py-6 pr-8 dc__no-shrink">
                                                <TrailingItem {...node.trailingItem} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence initial={false}>
                                {isExpanded && (
                                    <motion.div
                                        role="group"
                                        className="flexbox"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2, easings: ['easeOut'] }}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        {!node.items?.length ? (
                                            <>
                                                {dividerPrefix}
                                                <Divider />
                                                <span className="px-8 py-6">
                                                    {node.noItemsText || DEFAULT_NO_ITEMS_TEXT}
                                                </span>
                                            </>
                                        ) : (
                                            <div className="flexbox-col flex-grow-1">
                                                {node.items.map((nodeItem) => (
                                                    <TreeView
                                                        key={nodeItem.id}
                                                        expandedMap={expandedMap}
                                                        selectedId={selectedId}
                                                        isControlled
                                                        onToggle={childItemsOnToggle}
                                                        onSelect={onSelect}
                                                        nodes={[nodeItem]}
                                                        depth={depth + 1}
                                                        mode={mode}
                                                        getUpdateItemsRefMap={
                                                            getUpdateItemsRefMapProp || getUpdateItemsRefMap
                                                        }
                                                        flatNodeList={flatNodeList}
                                                        variant={variant}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )
                }

                const itemDivider =
                    depth > 0 ? (
                        <span className="dc__grid dc__align-self-stretch dc__content-center pl-8 w-24 dc__no-shrink dc__align-items-center">
                            <span className="dc__inline-block w-1 bcn-2 h-100 tree-view__divider" />
                        </span>
                    ) : null

                return (
                    <div
                        key={node.id}
                        role="treeitem"
                        aria-selected={isSelected}
                        className="flexbox flex-grow-1 w-100"
                        aria-level={depth + 1}
                    >
                        {dividerPrefix}

                        <div
                            className={`flexbox flex-grow-1 w-100 br-4 ${isSelected ? 'bcb-1' : VARIANT_TO_HOVER_CLASS_MAP[variant]}`}
                        >
                            {renderNodeItemAction(node, itemDivider, content)}

                            {node.trailingItem && (
                                <div className="flex py-6 pr-8 dc__no-shrink">
                                    <TrailingItem {...node.trailingItem} />
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default TreeView
