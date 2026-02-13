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
    extends
        Omit<FormFieldWrapperProps, 'children' | 'inputId'>,
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
    size?: Extract<ComponentSizeType, ComponentSizeType.small | ComponentSizeType.medium | ComponentSizeType.large>
    /**
     * Value of the textarea
     */
    value: string
    /**
     * If true, the textarea resize is disabled
     *
     * @default false
     */
    disableResize?: true
    /**
     * Allows inserting a newline with Shift + Enter instead of Enter alone.
     *
     * When enabled, pressing Enter submits the form, while Shift + Enter inserts a newline.
     * Useful for forms where Enter should trigger submission, but multiline input is still needed.
     *
     * @default false
     */
    newlineOnShiftEnter?: boolean
    textareaRef?: React.MutableRefObject<HTMLTextAreaElement> | React.RefCallback<HTMLTextAreaElement>
}
