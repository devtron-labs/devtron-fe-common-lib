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

import { useMemo, useState } from 'react'

import { ReactComponent as ICVisibilityOff } from '@Icons/ic-visibility-off.svg'
import { ReactComponent as ICVisibilityOn } from '@Icons/ic-visibility-on.svg'
import { DEFAULT_SECRET_PLACEHOLDER } from '@Shared/constants'

import CustomInput from './CustomInput'
import { CustomInputProps, PasswordFieldProps } from './types'

const PasswordField = ({ onFocus, onBlur, shouldShowDefaultPlaceholderOnBlur, ...props }: PasswordFieldProps) => {
    const [fieldType, setFieldType] = useState<CustomInputProps['type']>('password')
    const [isFocussed, setIsFocussed] = useState(false)

    const isFieldTypePassword = fieldType === 'password'
    const value = useMemo(() => {
        if (shouldShowDefaultPlaceholderOnBlur && isFocussed && props.value === DEFAULT_SECRET_PLACEHOLDER) {
            return ''
        }

        return !shouldShowDefaultPlaceholderOnBlur ||
            isFocussed ||
            (typeof props.value === 'string' && props.value?.length > 0)
            ? props.value
            : DEFAULT_SECRET_PLACEHOLDER
    }, [shouldShowDefaultPlaceholderOnBlur, isFocussed, props.value])

    const handleFocus: CustomInputProps['onFocus'] = (event) => {
        setIsFocussed(true)
        onFocus?.(event)
    }

    const handleBlur: CustomInputProps['onBlur'] = (event) => {
        setIsFocussed(false)
        setFieldType('password')
        onBlur?.(event)
    }

    return (
        <CustomInput
            {...props}
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            type={fieldType}
            endIconButtonConfig={
                value && value !== DEFAULT_SECRET_PLACEHOLDER
                    ? {
                          icon: isFieldTypePassword ? <ICVisibilityOn /> : <ICVisibilityOff />,
                          onClick: () => {
                              setFieldType((prevFieldType) => (prevFieldType === 'password' ? 'text' : 'password'))
                          },
                          ariaLabel: isFieldTypePassword ? 'Show password' : 'Hide password',
                      }
                    : null
            }
        />
    )
}

export default PasswordField
