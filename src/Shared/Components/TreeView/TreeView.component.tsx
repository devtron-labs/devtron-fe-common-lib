import { NavLink, useLocation } from 'react-router-dom'

import { Tooltip } from '@Common/Tooltip'

import { Icon } from '../Icon'
import { TrailingItem } from '../TrailingItem'
import { TreeHeading, TreeViewProps } from './types'

import './TreeView.scss'

// Only selected element should have tab-index 0 and for tab navigation use keyboard events
const TreeView = ({ nodes, expandedMap, selectedId, onToggle, onSelect, depth = 0 }: TreeViewProps) => {
    const { pathname } = useLocation()
    const isFirstLevel = depth === 0

    const getToggleNode = (node: TreeHeading) => () => {
        onToggle(node)
    }

    return (
        <div
            className={`tree-view__container bg__primary ${isFirstLevel ? 'dc__overflow-auto w-100 h-100 flex-grow-1' : ''}`}
            {...(isFirstLevel ? { role: 'tree' } : {})}
        >
            {nodes.map((node) => {
                const content = (
                    <span className="flexbox flex-grow-1 px-8 py-6 flexbox dc__gap-8 dc__align-start">
                        {node.startIconConfig && (
                            <Tooltip
                                alwaysShowTippyOnHover={!!node.startIconConfig.tooltipContent}
                                content={node.startIconConfig.tooltipContent}
                            >
                                <Icon name={node.startIconConfig.name} color={node.startIconConfig.color} size={16} />
                            </Tooltip>
                        )}

                        {/* TODO: Tooltip */}
                        <span className="flexbox-col">
                            <span
                                className={`tree-view__container--title dc__truncate dc__align-left cn-9 fs-13 fw-6 lh-1-5 ${node.strikeThrough ? 'dc__strike-through' : ''}`}
                            >
                                {node.title}
                            </span>
                            {node.subtitle && (
                                <span className="dc__align-left dc__truncate cn-7 fs-12 fw-4 lh-1-5">
                                    {node.subtitle}
                                </span>
                            )}
                        </span>
                    </span>
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
                                className={`flexbox w-100 dc__align-start w-100 ${isFirstLevel ? 'dc__position-sticky dc__top-0 dc__zi-1' : ''} bg__primary`}
                            >
                                <div className="flexbox w-100 dc__align-start w-100">
                                    {depth > 1 &&
                                        Array.from({ length: depth - 1 }).map((_, index) => (
                                            <span
                                                // eslint-disable-next-line react/no-array-index-key
                                                key={index}
                                                className="dc__grid dc__align-self-stretch dc__content-center pl-8 w-24"
                                            >
                                                <span className="dc__inline-block w-1 bcn-2 h-100" />
                                            </span>
                                        ))}

                                    <button
                                        type="button"
                                        className="tree-view__container--item dc__transparent p-0-imp flexbox dc__align-start flex-grow-1 bg__hover--opaque br-4"
                                        onClick={getToggleNode(node)}
                                    >
                                        {depth > 0 && (
                                            <span className="dc__grid dc__align-self-stretch dc__content-center pl-8 w-24 dc__align-items-center">
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

                                    {node.trailingItem && <TrailingItem {...node.trailingItem} />}
                                </div>
                            </div>

                            {isExpanded && (
                                <div role="group" className="flexbox">
                                    {!node.items?.length ? (
                                        <span>{node.noItemsText || 'No items found.'}</span>
                                    ) : (
                                        <div className="flexbox-col flex-grow-1">
                                            {node.items.map((nodeItem) => (
                                                <TreeView
                                                    key={nodeItem.id}
                                                    expandedMap={expandedMap}
                                                    selectedId={selectedId}
                                                    onToggle={onToggle}
                                                    onSelect={onSelect}
                                                    nodes={[nodeItem]}
                                                    depth={depth + 1}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )
                }

                const isSelected = selectedId === node.id
                const baseClass =
                    'dc__transparent p-0-imp flexbox dc__align-start flex-grow-1 bg__hover--opaque br-4 tree-view__container--item'

                const itemDivider =
                    depth > 0 ? (
                        <span className="dc__grid dc__align-self-stretch dc__content-center pl-8 w-24 dc__align-items-center">
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
                        {/* TODO: Duplicate element */}
                        {depth > 1 &&
                            Array.from({ length: depth - 1 }).map((_, index) => (
                                <span
                                    // eslint-disable-next-line react/no-array-index-key
                                    key={index}
                                    className="dc__grid dc__align-self-stretch dc__content-center pl-8 w-24"
                                >
                                    <span className="dc__inline-block w-1 bcn-2 h-100" />
                                </span>
                            ))}

                        {node.as === 'link' ? (
                            <NavLink
                                to={node.clearQueryParamsOnNavigation ? { pathname: node.href, search: '' } : node.href}
                                className={baseClass}
                                onClick={(e) => {
                                    // Prevent navigation to the same page
                                    if (node.href === pathname) {
                                        e.preventDefault()
                                    }
                                    node.onClick?.(e)
                                    onSelect(node)
                                }}
                            >
                                {itemDivider}
                                {content}
                            </NavLink>
                        ) : (
                            <button
                                type="button"
                                disabled={node.isDisabled}
                                className={baseClass}
                                onClick={(e) => {
                                    node.onClick?.(e)
                                    onSelect(node)
                                }}
                            >
                                {itemDivider}
                                {content}
                            </button>
                        )}

                        {node.trailingItem && <TrailingItem {...node.trailingItem} />}
                    </div>
                )
            })}
        </div>
    )
}

export default TreeView
