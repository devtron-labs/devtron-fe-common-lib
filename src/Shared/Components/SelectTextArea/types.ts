import { ReactElement } from 'react'

import { SelectPickerOptionType, SelectPickerProps } from '../SelectPicker'
import { MultipleResizableTextAreaProps } from '../MultipleResizableTextArea'

export type SelectTextAreaProps = Pick<SelectPickerProps<string, false>, 'inputId' | 'options'> &
    Pick<MultipleResizableTextAreaProps, 'refVar' | 'dependentRefs'> & {
        value: string
        Icon?: ReactElement
        onChange?: (selectedValue: SelectPickerOptionType<string>) => void
        disabled?: boolean
        placeholder?: string
        textAreaProps?: Omit<
            MultipleResizableTextAreaProps,
            'refVar' | 'dependentRefs' | 'id' | 'value' | 'onChange' | 'placeholder' | 'disabled'
        >
        selectPickerProps?: Omit<
            SelectPickerProps<string, false>,
            | 'inputId'
            | 'options'
            | 'isDisabled'
            | 'onChange'
            | 'variant'
            | 'isCreatable'
            | 'value'
            | 'placeholder'
            | 'fullWidth'
            | 'selectRef'
            | 'onCreateOption'
            | 'isMulti'
        >
    }
