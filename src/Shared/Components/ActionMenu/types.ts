import { ReactElement } from 'react'
import { GroupBase, OptionsOrGroups } from 'react-select'
import { SelectPickerOptionType, SelectPickerProps } from '../SelectPicker'

type ActionMenuOptionType = SelectPickerOptionType & {
    isDisabled?: boolean
    /**
     * @default 'neutral'
     */
    type?: 'neutral' | 'negative'
}

export interface ActionMenuProps extends Pick<SelectPickerProps, 'disableDescriptionEllipsis'> {
    children: ReactElement
    options: OptionsOrGroups<ActionMenuOptionType, GroupBase<ActionMenuOptionType>>
    onClick: (option: SelectPickerOptionType) => void
}

export interface ActionMenuOptionProps extends Pick<ActionMenuProps, 'onClick' | 'disableDescriptionEllipsis'> {
    option: ActionMenuOptionType
}
