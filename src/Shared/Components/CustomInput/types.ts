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

import { InputHTMLAttributes } from 'react'
import { ComponentSizeType } from '@Shared/constants'
import { FormFieldWrapperProps } from '../FormFieldWrapper'
import { ButtonComponentType, ButtonProps } from '../Button'

export interface CustomInputProps
    extends Omit<FormFieldWrapperProps, 'children' | 'inputId'>,
        Pick<InputHTMLAttributes<HTMLInputElement>, 'onBlur' | 'disabled' | 'autoFocus' | 'onFocus' | 'onKeyDown'>,
        Required<Pick<InputHTMLAttributes<HTMLInputElement>, 'placeholder' | 'onChange' | 'value' | 'name'>> {
    /**
     * If false, the input is not trimmed on blur
     *
     * @default true
     */
    shouldTrim?: boolean
    /**
     * Size of the textarea
     *
     * @default ComponentSizeType.large
     */
    size?: Extract<ComponentSizeType, ComponentSizeType.medium | ComponentSizeType.large>
    /**
     * Type for the input
     *
     * Note: For password field, use PasswordField component
     *
     * @default 'text'
     */
    type?: Exclude<InputHTMLAttributes<HTMLInputElement>['type'], 'password'>
    /**
     * End icon button configuration
     */
    endIconButtonConfig?: Required<Pick<ButtonProps<ButtonComponentType.button>, 'icon' | 'onClick' | 'ariaLabel'>> &
        Pick<ButtonProps<ButtonComponentType.button>, 'disabled' | 'showAriaLabelInTippy' | 'style'>
}

export interface PasswordFieldProps extends Omit<CustomInputProps, 'endIconButtonConfig' | 'type'> {
    /**
     * If true, the value is cleared & default placeholder is shown on blur
     */
    shouldShowDefaultPlaceholderOnBlur: boolean
}
