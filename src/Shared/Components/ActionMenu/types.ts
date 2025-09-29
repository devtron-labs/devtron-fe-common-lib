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

import { LegacyRef, MouseEvent, Ref } from 'react'
import { LinkProps } from 'react-router-dom'

import { PopoverProps, UsePopoverProps } from '../Popover'
import { SelectPickerOptionType, SelectPickerProps } from '../SelectPicker'
import { ActionMenuItemIconType, TrailingItemType } from '../TrailingItem'

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

export type ActionMenuItemType<T extends string | number = string | number> = Omit<
    SelectPickerOptionType,
    'label' | 'value' | 'endIcon' | 'startIcon'
> & {
    /** A unique identifier for the action menu item. */
    id: T
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
    startIcon?: ActionMenuItemIconType
    /** Defines the item to be displayed at the end of the menu item. */
    trailingItem?: TrailingItemType
    /** Prevents the menu from closing when the item is clicked. */
    doNotCloseMenuOnClick?: boolean
    dataAttributesId?: number
} & ConditionalActionMenuComponentType

export type ActionMenuOptionType<T extends string | number> = {
    /**
     * The label for the group of menu items. \
     * This is optional and can be used to categorize items under a specific group.
     */
    groupLabel?: string
    /**
     * The list of items belonging to this group.
     */
    items: ActionMenuItemType<T>[]
}

export type UseActionMenuProps<T extends string | number> = Omit<
    UsePopoverProps,
    'onPopoverKeyDown' | 'onTriggerKeyDown'
> & {
    /**
     * The options to display in the action menu.
     */
    options: ActionMenuOptionType<T>[]
    /**
     * Determines whether the action menu is searchable.
     */
    isSearchable?: boolean
}

export type ActionMenuProps<T extends string | number = string | number> = UseActionMenuProps<T> &
    Pick<SelectPickerProps, 'disableDescriptionEllipsis'> & {
        /**
         * Callback function triggered when an item is clicked.
         * @param item - The selected item.
         */
        onClick: (item: ActionMenuItemType<T>, e: MouseEvent<HTMLAnchorElement> | MouseEvent<HTMLButtonElement>) => void
        /**
         * Config for the footer at the bottom of action menu list. It is sticky by default
         */
        footerConfig?: SelectPickerProps['menuListFooterConfig']
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

export type ActionMenuItemProps<T extends string | number> = Pick<
    ActionMenuProps<T>,
    'onClick' | 'disableDescriptionEllipsis'
> & {
    item: ActionMenuItemType<T>
    itemRef: Ref<HTMLAnchorElement> | LegacyRef<HTMLAnchorElement | HTMLButtonElement>
    isFocused?: boolean
    onMouseEnter?: () => void
}
