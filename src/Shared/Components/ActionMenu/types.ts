import { ReactElement } from 'react'
import { GroupBase, OptionsOrGroups } from 'react-select'
import { SelectPickerOptionType, SelectPickerProps } from '../SelectPicker'

export interface ActionMenuProps extends Pick<SelectPickerProps, 'disableDescriptionEllipsis'> {
    children: ReactElement
    options: OptionsOrGroups<SelectPickerOptionType, GroupBase<SelectPickerOptionType>>
    onClick: (option: SelectPickerOptionType) => void
}

export interface ActionMenuOptionProps extends Pick<ActionMenuProps, 'onClick' | 'disableDescriptionEllipsis'> {
    option: SelectPickerOptionType
}
