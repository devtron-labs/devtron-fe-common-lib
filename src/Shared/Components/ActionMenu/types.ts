import { ReactElement } from 'react'
import { GroupBase, OptionsOrGroups } from 'react-select'

import { IconsProps } from '../Icon'
import { SelectPickerOptionType, SelectPickerProps } from '../SelectPicker'

export type ActionMenuOptionType = Omit<SelectPickerOptionType, 'endIcon' | 'startIcon'> & {
    /** Indicates whether the menu option is disabled. */
    isDisabled?: boolean
    /**
     * Specifies the type of the menu option.
     * @default 'neutral'
     */
    type?: 'neutral' | 'negative'
    /** Defines the icon to be displayed at the start of the menu option. */
    startIcon?: Pick<IconsProps, 'name' | 'color'>
    /** Defines the icon to be displayed at the end of the menu option. */
    endIcon?: Pick<IconsProps, 'name' | 'color'>
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
     * The options or grouped options to display in the action menu.
     */
    options: OptionsOrGroups<ActionMenuOptionType, GroupBase<ActionMenuOptionType>>
    /**
     * Callback function triggered when an option is clicked.
     * @param option - The selected option of type `ActionMenuOptionType`.
     */
    onClick: (option: ActionMenuOptionType) => void
}

export type ActionMenuProps = UseActionMenuProps &
    Pick<SelectPickerProps, 'disableDescriptionEllipsis'> & {
        /** The React element to which the ActionMenu is attached. */
        children: ReactElement
    }

export type ActionMenuOptionProps = Pick<ActionMenuProps, 'onClick' | 'disableDescriptionEllipsis'> & {
    option: ActionMenuOptionType
    isFocused?: boolean
    onMouseEnter?: () => void
}
