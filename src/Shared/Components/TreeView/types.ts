import { SyntheticEvent } from 'react'

import { TooltipProps } from '@Common/Tooltip'
import { DataAttributes, Never } from '@Shared/types'

import { IconsProps } from '../Icon'
import { TrailingItemProps } from '../TrailingItem'

// eslint-disable-next-line no-use-before-define
export type TreeNode<DataAttributeType = null> = TreeHeading<DataAttributeType> | TreeItem<DataAttributeType>

type BaseNode<DataAttributeType = null> = {
    id: string
    /**
     * The title of the list item.
     */
    title: string
    /**
     * The subtitle of the list item.
     */
    subtitle?: string
    customTooltipConfig?: TooltipProps
    /**
     * If true, the title will be rendered with line-through.
     */
    strikeThrough?: boolean
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

export type TreeItem<DataAttributeType = null> = BaseNode<DataAttributeType> & {
    type: 'item'
    /**
     * @default false
     */
    isDisabled?: boolean
} & ( // Should we add as `div` as well?
        | {
              as?: 'button'
              /**
               * The callback function to handle click events on the button.
               */
              onClick?: (e: SyntheticEvent) => void
              href?: never
              clearQueryParamsOnNavigation?: never
          }
        | {
              as: 'link'
              href: string
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
    )

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
     * If primary the background color will be bg__primary and bg__hover--opaque, if secondary the background color will be bg__secondary bg__hover-secondary--opaque.
     * @default 'primary'
     */
    variant?: 'primary' | 'secondary'
    /**
     * If true, means on change of selectedId, the tree view will scroll to the selected item.
     * Assumption: parents of the selected item are expanded.
     * @default true
     */
    shouldScrollOnChange?: boolean
} & (
    | {
          isUncontrolled: true
          /**
           * @default {}
           */
          defaultExpandedMap?: Record<string, boolean>
          expandedMap?: never
          onToggle?: never
      }
    | {
          isUncontrolled?: false
          expandedMap: Record<string, boolean>
          onToggle: (item: TreeHeading<DataAttributeType>) => void
          defaultExpandedMap?: never
      }
) &
    (
        | {
              /**
               * WARNING: For internal use only.
               */
              depth: number
              /**
               * WARNING: For internal use only.
               * Would pass this to item button/ref and store it in out ref map through this function.
               */
              getUpdateItemsRefMap: (id: string) => (element: HTMLButtonElement | HTMLAnchorElement) => void

              /**
               * WARNING: For internal use only.
               * List of all nodes visible in tree view for keyboard navigation.
               */
              flatNodeList: string[]
          }
        | {
              depth?: never
              getUpdateItemsRefMap?: never
              flatNodeList?: never
          }
    )

export interface TreeViewNodeContentProps
    extends Pick<BaseNode, 'startIconConfig' | 'title' | 'subtitle' | 'customTooltipConfig' | 'strikeThrough'> {
    type: 'heading' | 'item'
    isSelected: boolean
}
