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

import { FormFieldInfoProps, FormFieldLabelProps, FormFieldWrapperProps } from './types'

export const getFormErrorElementId = (inputId: FormFieldLabelProps['inputId']) => `${inputId}-error-msg`

export const getFormLabelElementId = (inputId: FormFieldLabelProps['inputId']) => `${inputId}-label`

export const getFormHelperTextElementId = (inputId: FormFieldLabelProps['inputId']) => `${inputId}-helper-text`

export const getFormFieldAriaAttributes = ({
    inputId,
    label,
    ariaLabel,
    required,
    error,
    helperText,
}: Required<
    Pick<FormFieldLabelProps, 'label' | 'ariaLabel' | 'required' | 'inputId'> &
        Pick<FormFieldInfoProps, 'error' | 'helperText'>
>) => ({
    'aria-required': required,
    ...(helperText
        ? {
              'aria-describedby': getFormHelperTextElementId(inputId),
          }
        : {}),
    ...(error
        ? {
              'aria-errormessage': getFormErrorElementId(inputId),
              'aria-invalid': !!error,
          }
        : {}),
    ...(label
        ? {
              'aria-labelledby': getFormLabelElementId(inputId),
          }
        : {
              'aria-label': ariaLabel,
          }),
})

export const getFormFieldBorderClassName = (borderRadiusConfig: FormFieldWrapperProps['borderRadiusConfig'] = {}) => {
    const { top = true, right = true, bottom = true, left = true } = borderRadiusConfig

    return `${!top ? 'dc__no-top-radius' : ''} ${!right ? 'dc__no-right-radius' : ''} ${!bottom ? 'dc__no-bottom-radius' : ''} ${!left ? 'dc__no-left-radius' : ''}`
}
