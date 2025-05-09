import { LegacyRef, Ref } from 'react'
import { LinkProps } from 'react-router-dom'

import { IconsProps } from '../Icon'
import { PopoverProps, UsePopoverProps } from '../Popover'
import { SelectPickerOptionType, SelectPickerProps } from '../SelectPicker'

type ConditionalActionMenuComponentType =
    | {
          /**
           * @default 'button'
           */
          componentType?: 'button'
          href?: never
          to?: never
      }
    | {
          componentType?: 'anchor'
          /** Specifies the URL for the `<a>` tag. */
          href: string
          to?: never
      }
    | {
          componentType?: 'link'
          /** Specifies the `to` property for react-router `Link` */
          to: LinkProps['to']
          href?: never
      }

export type ActionMenuItemType = Omit<SelectPickerOptionType, 'label' | 'endIcon' | 'startIcon'> & {
    /** The text label for the menu item. */
    label: string
    /** Indicates whether the menu item is disabled. */
    isDisabled?: boolean
    /**
     * Specifies the type of the menu item.
     * @default 'neutral'
     */
    type?: 'neutral' | 'negative'
    /** Defines the icon to be displayed at the start of the menu item. */
    startIcon?: Pick<IconsProps, 'name' | 'color'>
    /** Defines the icon to be displayed at the end of the menu item. */
    endIcon?: Pick<IconsProps, 'name' | 'color'>
} & ConditionalActionMenuComponentType

export type ActionMenuOptionType = {
    /**
     * The label for the group of menu items. \
     * This is optional and can be used to categorize items under a specific group.
     */
    groupLabel?: string
    /**
     * The list of items belonging to this group.
     */
    items: ActionMenuItemType[]
}

export type UseActionMenuProps = Omit<UsePopoverProps, 'onPopoverKeyDown' | 'onTriggerKeyDown'> & {
    /**
     * The options to display in the action menu.
     */
    options: ActionMenuOptionType[]
    /**
     * Determines whether the action menu is searchable.
     */
    isSearchable?: boolean
}

export type ActionMenuProps = UseActionMenuProps &
    Pick<SelectPickerProps, 'disableDescriptionEllipsis'> & {
        /**
         * Callback function triggered when an item is clicked.
         * @param item - The selected item.
         */
        onClick: (item: ActionMenuItemType) => void
    } & (
        | {
              /**
               * The React element to which the ActionMenu is attached.
               * @note only use when children is not `Button` component otherwise use `buttonProps`.
               */
              children: NonNullable<PopoverProps['triggerElement']>
              buttonProps?: never
          }
        | {
              children?: never
              /**
               * Properties for the button to which the Popover is attached.
               */
              buttonProps: NonNullable<PopoverProps['buttonProps']>
          }
    )

export type ActionMenuItemProps = Pick<ActionMenuProps, 'onClick' | 'disableDescriptionEllipsis'> & {
    item: ActionMenuItemType
    itemRef: Ref<HTMLAnchorElement> | LegacyRef<HTMLAnchorElement | HTMLButtonElement>
    isFocused?: boolean
    onMouseEnter?: () => void
}
