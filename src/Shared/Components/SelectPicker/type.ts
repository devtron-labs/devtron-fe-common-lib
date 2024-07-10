import { OptionType } from '@Common/Types'
import { ComponentSizeType } from '@Shared/constants'
import { ReactElement, ReactNode } from 'react'
import { Props as ReactSelectProps } from 'react-select'

export interface SelectPickerOptionType extends OptionType<number | string, ReactNode> {
    description?: string
    startIcon?: ReactElement
    endIcon?: ReactElement
}

type SelectProps = ReactSelectProps<SelectPickerOptionType>

// TODO: Add support for border less
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
    /**
     * Height of the dropdown
     *
     * @default 'ComponentSizeType.medium'
     */
    size?: Extract<ComponentSizeType, ComponentSizeType.medium | ComponentSizeType.large>
    /**
     * Content to be shown in a tippy when disabled
     */
    disabledTippyContent?: ReactNode
    /**
     * If true, the selected options count is shown in a chip inside ValueContainer
     *
     * @default 'false'
     */
    showSelectedOptionsCount?: boolean
    /**
     * Width of the menu list
     *
     * Note: the overflow needs to be handled explicitly for non-small variants
     *
     * @default 'ComponentSizeType.small'
     */
    menuSize?: ComponentSizeType
}
