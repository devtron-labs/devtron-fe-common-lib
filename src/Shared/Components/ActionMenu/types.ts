import { ReactElement } from 'react'
import { SelectPickerOptionType } from '../SelectPicker'

export interface ActionMenuProps {
    children: ReactElement
    options: SelectPickerOptionType[]
    onClick: (option: SelectPickerOptionType) => void
}
