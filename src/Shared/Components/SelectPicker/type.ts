/*
 * Copyright (c) 2024. Devtron Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { OptionType } from '@Common/Types'
import { ComponentSizeType } from '@Shared/constants'
import { ReactElement, ReactNode } from 'react'
import { Props as ReactSelectProps } from 'react-select'

export interface SelectPickerOptionType extends OptionType<number | string, ReactNode> {
    /**
     * Description to be displayed for the option
     */
    description?: string
    /**
     * Icon at the start of the option
     */
    startIcon?: ReactElement
    /**
     * Icon at the end of the option
     */
    endIcon?: ReactElement
}

export enum SelectPickerVariantType {
    DEFAULT = 'default',
    BORDERLESS = 'borderless',
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
            | 'hideSelectedOptions'
            | 'controlShouldRenderValue'
            | 'closeMenuOnSelect'
            | 'isDisabled'
            | 'isLoading'
            | 'required'
            | 'isOptionDisabled'
            | 'placeholder'
        >,
        Required<Pick<SelectProps, 'classNamePrefix' | 'inputId' | 'name'>> {
    /**
     * Icon to be rendered in the control
     */
    icon?: ReactElement
    /**
     * Error message for the select
     */
    error?: ReactNode
    /**
     * Render function for the footer at the bottom of menu list. It is sticky by default
     */
    renderMenuListFooter?: () => ReactNode
    /**
     * Info text for the select, if any
     */
    helperText?: ReactNode
    /**
     * Label for the select. if required is added, the corresponding * is also added
     */
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
    /**
     * Variant of the select.
     *
     * @default SelectPickerVariantType.DEFAULT
     */
    variant?: SelectPickerVariantType
    /**
     * Disables the ellipsis on description, it will be shown in full width, wrapped if required.
     *
     * @default false
     */
    disableDescriptionEllipsis?: boolean
    menuAlignToRight?: boolean
}
