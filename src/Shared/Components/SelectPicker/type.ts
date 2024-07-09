import { OptionType } from '@Common/Types'
import { ReactElement, ReactNode } from 'react'
import { Props as ReactSelectProps } from 'react-select'

// TODO Eshank: Add customization using generics
export interface SelectPickerOptionType extends OptionType<number | string, ReactNode> {
    description?: string
    startIcon?: ReactElement
    endIcon?: ReactElement
}

type SelectProps = ReactSelectProps<SelectPickerOptionType>

export interface SelectPickerProps
    extends Pick<
            SelectProps,
            | 'options'
            | 'value'
            | 'onChange'
            | 'isSearchable'
            | 'isClearable'
            | 'isLoading'
            | 'placeholder'
            | 'hideSelectedOptions'
            | 'controlShouldRenderValue'
            | 'closeMenuOnSelect'
            | 'isDisabled'
            | 'isLoading'
            | 'required'
        >,
        Required<Pick<SelectProps, 'classNamePrefix' | 'inputId'>> {
    icon?: ReactElement
    error?: ReactNode
    renderMenuListFooter?: () => ReactNode
    helperText?: ReactNode
    label?: ReactNode
    // TODO Eshank: Add support for border less
}
