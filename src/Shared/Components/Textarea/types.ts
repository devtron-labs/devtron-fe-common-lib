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

import { TextareaHTMLAttributes } from 'react'
import { ComponentSizeType } from '@Shared/constants'
import { FormFieldWrapperProps } from '../FormFieldWrapper'

export interface TextareaProps
    extends Omit<FormFieldWrapperProps, 'children' | 'inputId'>,
        Pick<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onBlur' | 'disabled' | 'autoFocus' | 'onFocus'>,
        Required<Pick<TextareaHTMLAttributes<HTMLTextAreaElement>, 'placeholder' | 'onChange' | 'name'>> {
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
     * Value of the textarea
     */
    value: string
}
