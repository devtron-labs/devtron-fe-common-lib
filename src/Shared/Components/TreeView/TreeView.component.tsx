import { NavLink, useLocation } from 'react-router-dom'

import { Tooltip } from '@Common/Tooltip'

import { Icon } from '../Icon'
import { TrailingItem } from '../TrailingItem'
import { TreeViewProps } from './types'

import './TreeView.scss'

// Only selected element should have tab-index 0 and for tab navigation use keyboard events
const TreeView = ({ nodes, expandedMap, selectedId, onToggle, onSelect, depth = 0 }: TreeViewProps) => {
    const { pathname } = useLocation()
    return (
        <div
            className={`tree-view__container bg__primary ${depth === 0 ? 'dc__overflow-auto w-100 h-100 flex-grow-1' : ''}`}
            {...(depth === 0 ? { role: 'tree' } : {})}
        >
            {nodes.map((node) => {
                if (node.type === 'heading') {
                    const isExpanded = expandedMap[node.id] ?? false

                    return (
                        <div
                            key={node.id}
                            role="treeitem"
                            aria-selected={false}
                            aria-expanded={isExpanded}
                            className={`flexbox-col w-100 tree-view__heading-group-wrapper ${isExpanded ? 'tree-view__heading-group-wrapper--expanded' : ''}`}
                            aria-level={depth + 1}
                        >
                            <div
                                className={`flexbox w-100 dc__align-start w-100 ${depth === 0 ? 'dc__position-sticky dc__top-0 dc__zi-3' : ''} bg__primary bg__hover--opaque br-4`}
                            >
                                <div className="flexbox w-100 dc__align-start w-100">
                                    <button
                                        type="button"
                                        className="dc__transparent flexbox dc__align-start flex-grow-1 tree-view__heading"
                                        onClick={() => onToggle(node)}
                                    >
                                        {/* TODO: below that take all available space with a line if expanded */}
                                        <span className="dc__no-shrink pl-8 pt-8">
                                            <Icon
                                                name="ic-expand-sm"
                                                color={null}
                                                rotateBy={isExpanded ? 270 : 180}
                                                size={16}
                                            />
                                        </span>

                                        <span className="flexbox flex-grow-1 px-8 py-6 flexbox dc__gap-8 dc__align-start">
                                            {node.startIconConfig && (
                                                <Tooltip
                                                    alwaysShowTippyOnHover={!!node.startIconConfig.tooltipContent}
                                                    content={node.startIconConfig.tooltipContent}
                                                >
                                                    <Icon
                                                        name={node.startIconConfig.name}
                                                        color={node.startIconConfig.color}
                                                        size={16}
                                                    />
                                                </Tooltip>
                                            )}

                                            {/* TODO: Tooltip */}
                                            <span className="flexbox-col">
                                                <span className="tree-view__container--title">{node.title}</span>
                                                {node.subtitle && <span>{node.subtitle}</span>}
                                            </span>
                                        </span>
                                    </button>

                                    {node.trailingItem && <TrailingItem {...node.trailingItem} />}
                                </div>
                            </div>

                            {isExpanded && (
                                <div role="group" className="flexbox tree-view__group">
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
                            {/* TODO: Strike through */}
                            <span className="tree-view__container--title">{node.title}</span>
                            {node.subtitle && <span>{node.subtitle}</span>}
                        </span>
                    </span>
                )

                return (
                    <div
                        key={node.id}
                        role="treeitem"
                        aria-selected={isSelected}
                        className="flexbox flex-grow-1 w-100 bg__hover--opaque br-4"
                        aria-level={depth + 1}
                    >
                        {node.as === 'link' ? (
                            <NavLink
                                to={node.clearQueryParamsOnNavigation ? { pathname: node.href, search: '' } : node.href}
                                className="dc__transparent flexbox dc__align-start flex-grow-1 tree-view__item"
                                onClick={(e) => {
                                    // Prevent navigation to the same page
                                    if (node.href === pathname) {
                                        e.preventDefault()
                                    }
                                    node.onClick?.(e)
                                    onSelect(node)
                                }}
                            >
                                {content}
                            </NavLink>
                        ) : (
                            <button
                                type="button"
                                disabled={node.isDisabled}
                                className="dc__transparent flexbox dc__align-start flex-grow-1 tree-view__item"
                                onClick={(e) => {
                                    node.onClick?.(e)
                                    onSelect(node)
                                }}
                            >
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
