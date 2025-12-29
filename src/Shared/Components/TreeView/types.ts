/*
 * Copyright (c) 2024. Devtron Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { SyntheticEvent } from 'react'

import { TooltipProps } from '@Common/Tooltip'
import { DataAttributes, Never } from '@Shared/types'

import { IconsProps } from '../Icon'
import { TrailingItemProps } from '../TrailingItem'

// eslint-disable-next-line no-use-before-define
export type TreeNode<DataAttributeType = null> = TreeHeading<DataAttributeType> | TreeItem<DataAttributeType>

/**
 * Represents a base node structure for a tree view component.
 *
 * @typeParam DataAttributeType - The type for data attributes, defaults to null. If it extends `DataAttributes`, the node can have `dataAttributes` of this type.
 *
 * @property id - Unique identifier for the node.
 * @property title - The main title text displayed for the node.
 * @property subtitle - Optional subtitle text for the node.
 * @property customTooltipConfig - Optional configuration for a custom tooltip.
 * @property strikeThrough - If true, the title will be rendered with a line-through style.
 * @property startIconConfig - Optional configuration for a start icon, which can be either a standard icon (with `name` and `color`) or a custom JSX element.
 * @property trailingItem - Optional configuration for a trailing item (e.g., button, icon) displayed at the end of the node.
 * @property dataAttributes - Optional data attributes, present only if `DataAttributeType` extends `DataAttributes`.
 */
type BaseNode<DataAttributeType = null> = {
    /**
     * id - Unique identifier for the node.
     */
    id: string
    /**
     * The title of the list item.
     */
    title: string
    /**
     * The subtitle of the list item.
     */
    subtitle?: string
    /**
     *  Optional configuration for a custom tooltip.
     */
    customTooltipConfig?: TooltipProps
    /**
     * If true, the title will be rendered with line-through.
     */
    strikeThrough?: boolean
    /**
     * Optional configuration for a start icon, which can be either a standard icon (with `name` and `color`) or a custom JSX element.
     */
    startIconConfig?: {
        tooltipContent?: string
    } & (
        | (Pick<IconsProps, 'name' | 'color'> & { customIcon?: never })
        | (Never<Pick<IconsProps, 'name' | 'color'>> & { customIcon?: JSX.Element })
    )
    trailingItem?: TrailingItemProps
} & (DataAttributeType extends DataAttributes
    ? {
          dataAttributes?: DataAttributeType
      }
    : {
          dataAttributes?: never
      })

export type TreeHeading<DataAttributeType = null> = BaseNode<DataAttributeType> & {
    type: 'heading'
    items?: TreeNode<DataAttributeType>[]
    /**
     * Text to display when there are no items in the list.
     * @default DEFAULT_NO_ITEMS_TEXT
     */
    noItemsText?: string
}

export type NodeElementType = HTMLDivElement | HTMLButtonElement | HTMLAnchorElement

/**
 * Represents an item node in a tree structure, supporting different rendering modes.
 *
 * @template DataAttributeType - The type for custom data attributes, defaults to null.
 *
 * A `TreeItem` can be rendered as a button, link, or div, each with its own set of properties:
 * - When `as` is `'button'` (default), it can have an `onClick` handler.
 * - When `as` is `'link'`, it requires an `href`, can have an `onClick` handler, and supports clearing query parameters on navigation.
 * - When `as` is `'div'`, it is a non-interactive container.
 *
 * @property {'item'} type - Identifies the node as an item.
 * @property {boolean} [isDisabled=false] - If true, disables the item.
 * @property {'button' | 'link' | 'div'} [as] - Determines the rendered element type.
 * @property {(e: SyntheticEvent) => void} [onClick] - Callback for click events (button or link only).
 * @property {string} [href] - The navigation URL (link only).
 * @property {boolean} [clearQueryParamsOnNavigation=false] - If true, clears query parameters during navigation (link only).
 */
export type TreeItem<DataAttributeType = null> = BaseNode<DataAttributeType> & {
    type: 'item'
    /**
     * @default false
     */
    isDisabled?: boolean
} & (
        | {
              as?: 'button'
              /**
               * The callback function to handle click events on the button.
               */
              onClick?: (e: SyntheticEvent) => void
              href?: never
              clearQueryParamsOnNavigation?: never
              activeClassName?: never
          }
        | {
              as: 'link'
              href: string
              activeClassName?: string
              /**
               * The callback function to handle click events on the nav link.
               */
              onClick?: (e: SyntheticEvent) => void
              /**
               * If `true`, clears query parameters during navigation.
               * @default false
               */
              clearQueryParamsOnNavigation?: boolean
          }
        | {
              as: 'div'
              href?: never
              onClick?: never
              clearQueryParamsOnNavigation?: never
              activeClassName?: never
          }
    )

/**
 * Props for the TreeView component.
 *
 * @template DataAttributeType - The type for data attributes associated with tree nodes.
 *
 * @property nodes - An array of tree nodes to be rendered in the tree view.
 * @property selectedId - (Optional) The ID of the currently selected tree item.
 * @property onSelect - (Optional) Callback invoked when a tree item is selected.
 * @property mode - (Optional) Determines the navigation mode of the tree view.
 *   - `'navigation'`: Enables keyboard navigation and focuses only the selected item.
 *   - `'form'`: Leaves navigation to the browser.
 *   - @default 'navigation'
 * @property variant - (Optional) Visual variant of the tree view.
 *   - `'primary'`: Uses primary background and hover colors.
 *   - `'secondary'`: Uses secondary background and hover colors.
 *   - @default 'primary'
 * @property defaultExpandedMap - (Optional) Initial map of node IDs to their expanded state.
 *   - @default {}
 *
 * @property depth - (Internal use only) The current depth level in the tree.
 * @property getUpdateItemsRefMap - (Internal use only) Function to update the ref map for item buttons/anchors.
 * @property flatNodeList - (Internal use only) List of all visible node IDs for keyboard navigation.
 * @property onToggle - (Internal use only) Callback invoked when a tree heading is toggled.
 * @property expandedMap - (Internal use only) Map of node IDs to their expanded state.
 * @property isControlled - (Internal use only) Indicates if the tree view is controlled.
 */
export type TreeViewProps<DataAttributeType = null> = {
    nodes: TreeNode<DataAttributeType>[]
    selectedId?: string
    onSelect?: (item: TreeItem<DataAttributeType>) => void
    /**
     * If navigation mode, the tree view will provide navigation through keyboard actions and make the only selected item focusable.
     * If form mode, will leave the navigation to browser.
     * @default 'navigation'
     */
    mode?: 'navigation' | 'form'
    /**
     * If primary the background color will be bg__primary and bg__hover--opaque \
     * if secondary the background color will be bg__secondary bg__hover-secondary--opaque,
     * if sidenav the background color will be bg__transparent bg__hover-sidebar-item.
     * @default 'primary'
     */
    variant?: 'primary' | 'secondary' | 'sidenav'
    /**
     * @default {}
     */
    defaultExpandedMap?: Record<string, boolean>
    /**
     * When true, the selected heading (`selectedId`) will be highlighted only when it is collapsed.
     * @default false
     */
    highlightSelectedHeadingOnlyWhenCollapsed?: boolean
    /**
     * @default true
     */
    useOverflowAuto?: boolean
} /**
 * WARNING: For internal use only.
 */ & (
    | {
          depth: number
          /**
           * Would pass this to item button/ref and store it in out ref map through this function.
           */
          getUpdateItemsRefMap: (id: string) => (element: NodeElementType) => void

          /**
           * List of all nodes visible in tree view for keyboard navigation.
           */
          flatNodeList: string[]
          /**
           * Would be called when the user toggles a heading.
           */
          onToggle: (item: TreeHeading<DataAttributeType>) => void
          /**
           * Map of id to whether the item is expanded or not.
           */
          expandedMap: Record<string, boolean>
          isControlled: true
      }
    | {
          depth?: never
          getUpdateItemsRefMap?: never
          flatNodeList?: never
          onToggle?: never
          expandedMap?: never
          isControlled?: false
      }
)

export interface TreeViewNodeContentProps
    extends Pick<BaseNode, 'startIconConfig' | 'title' | 'subtitle' | 'customTooltipConfig' | 'strikeThrough'>,
        Required<Pick<TreeViewProps, 'variant'>> {
    type: 'heading' | 'item'
    isSelected: boolean
}

export interface GetSelectedIdParentNodesProps<DataAttributeType = null>
    extends Pick<TreeViewProps<DataAttributeType>, 'nodes' | 'selectedId'> {}

export interface FindSelectedIdParentNodesProps<DataAttributeType = null>
    extends Pick<GetSelectedIdParentNodesProps<DataAttributeType>, 'selectedId'> {
    node: TreeNode<DataAttributeType>
    onFindParentNode: (id: string) => void
}

export interface GetVisibleNodesProps<DataAttributeType = null>
    extends Pick<TreeViewProps<DataAttributeType>, 'expandedMap'> {
    nodeList: TreeNode<DataAttributeType>[]
}
