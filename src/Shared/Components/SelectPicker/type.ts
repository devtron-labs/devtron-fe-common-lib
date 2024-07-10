import { OptionType } from '@Common/Types'
import { ReactElement, ReactNode } from 'react'
import { Props as ReactSelectProps } from 'react-select'

export interface SelectPickerOptionType extends OptionType<number | string, ReactNode> {
    description?: string
    startIcon?: ReactElement
    endIcon?: ReactElement
}

type SelectProps = ReactSelectProps<SelectPickerOptionType>

// TODO Eshank: Add support for border less
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
        Required<Pick<SelectProps, 'classNamePrefix' | 'inputId' | 'name'>> {
    icon?: ReactElement
    error?: ReactNode
    renderMenuListFooter?: () => ReactNode
    helperText?: ReactNode
    label?: ReactNode
    /**
     * If true, the selected option icon is shown in the container.
     * startIcon has higher priority than endIcon.
     *
     * @default 'true'
     */
    showSelectedOptionIcon?: boolean
}
