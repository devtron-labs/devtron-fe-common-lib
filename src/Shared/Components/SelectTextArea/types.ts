import { ReactElement } from 'react'

import { ResizableTagTextAreaProps } from '@Common/CustomTagSelector'

import { SelectPickerOptionType, SelectPickerProps } from '../SelectPicker'

export type SelectTextAreaProps = Pick<SelectPickerProps<string, false>, 'inputId' | 'options'> &
    Pick<ResizableTagTextAreaProps, 'refVar' | 'dependentRef'> & {
        value: string
        Icon?: ReactElement
        onChange?: (selectedValue: SelectPickerOptionType<string>) => void
        disabled?: boolean
        placeholder?: string
        textAreaProps?: Omit<
            ResizableTagTextAreaProps,
            'refVar' | 'dependentRef' | 'id' | 'value' | 'onChange' | 'placeholder' | 'disabled'
        >
        selectPickerProps?: Omit<
            SelectPickerProps<string, false>,
            | 'inputId'
            | 'options'
            | 'isDisabled'
            | 'onChange'
            | 'variant'
            | 'value'
            | 'placeholder'
            | 'fullWidth'
            | 'selectRef'
            | 'onCreateOption'
            | 'isMulti'
        >
    }
