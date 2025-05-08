import { ReactElement } from 'react'

import { IconsProps } from '../Icon'
import { SelectPickerOptionType, SelectPickerProps } from '../SelectPicker'

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
}

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

export type UseActionMenuProps = {
    /**
     * The width of the action menu. \
     * Can be a number representing the width in pixels or the string 'auto' for automatic sizing (upto 250px).
     * @default 'auto'
     */
    width?: number | 'auto'
    /**
     * The position of the action menu relative to its trigger element. \
     * Possible values are:
     * - 'bottom': Positions the menu below the trigger.
     * - 'top': Positions the menu above the trigger.
     * - 'left': Positions the menu to the left of the trigger.
     * - 'right': Positions the menu to the right of the trigger.
     * @default 'bottom'
     */
    position?: 'bottom' | 'top' | 'left' | 'right'
    /**
     * The alignment of the action menu relative to its trigger element. \
     * Possible values are:
     * - 'start': Aligns the menu to the start of the trigger.
     * - 'middle': Aligns the menu to the center of the trigger.
     * - 'end': Aligns the menu to the end of the trigger.
     * @default 'start'
     */
    alignment?: 'start' | 'middle' | 'end'
    /**
     * The options to display in the action menu.
     */
    options: ActionMenuOptionType[]
    /**
     * Determines whether the action menu is searchable.
     */
    isSearchable?: boolean
    /**
     * Callback function triggered when an item is clicked.
     * @param item - The selected item.
     */
    onClick: (item: ActionMenuItemType) => void
}

export type ActionMenuProps = UseActionMenuProps &
    Pick<SelectPickerProps, 'disableDescriptionEllipsis'> & {
        /** The React element to which the ActionMenu is attached. */
        children: ReactElement
    }

export type ActionMenuItemProps = Pick<ActionMenuProps, 'onClick' | 'disableDescriptionEllipsis'> & {
    item: ActionMenuItemType
    isFocused?: boolean
    onMouseEnter?: () => void
}
