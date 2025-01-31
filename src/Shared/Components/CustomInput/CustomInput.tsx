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

import { InputHTMLAttributes, useEffect, useRef } from 'react'
import { FormFieldWrapper, getFormFieldAriaAttributes } from '@Shared/Components/FormFieldWrapper'
import {
    COMPONENT_SIZE_TYPE_TO_FONT_AND_BLOCK_PADDING_MAP,
    COMPONENT_SIZE_TYPE_TO_INLINE_PADDING_MAP,
    ComponentSizeType,
} from '@Shared/constants'
import { getFormFieldBorderClassName } from '@Shared/Components/FormFieldWrapper/utils'
import { CustomInputProps } from './types'
import { Button, ButtonProps, ButtonStyleType, ButtonVariantType } from '../Button'
import { CUSTOM_INPUT_TO_ICON_BUTTON_SIZE_MAP } from './constants'
import './customInput.scss'

const CustomInput = ({
    name,
    label,
    fullWidth,
    error,
    helperText,
    warningText,
    layout,
    required,
    onBlur,
    shouldTrim = true,
    size = ComponentSizeType.large,
    ariaLabel,
    borderRadiusConfig,
    type = 'text',
    autoFocus = false,
    endIconButtonConfig,
    ...props
}: CustomInputProps) => {
    const inputRef = useRef<HTMLInputElement>()

    useEffect(() => {
        setTimeout(() => {
            // Added timeout to ensure the autofocus code is executed post the re-renders
            if (inputRef.current && autoFocus) {
                inputRef.current.focus()
            }
        }, 100)
    }, [autoFocus])

    const handleBlur: CustomInputProps['onBlur'] = (event) => {
        // NOTE: This is to prevent the input from being trimmed when the user do not want to trim the input
        if (shouldTrim) {
            const trimmedValue = event.target.value?.trim()

            if (event.target.value !== trimmedValue) {
                event.stopPropagation()
                // eslint-disable-next-line no-param-reassign
                event.target.value = trimmedValue
                props.onChange(event)
            }
        }
        onBlur?.(event)
    }

    const handleKeyDown: InputHTMLAttributes<HTMLInputElement>['onKeyDown'] = (event) => {
        if (event.key === 'Enter' || event.key === 'Escape') {
            event.stopPropagation()
        }

        props.onKeyDown?.(event)
    }

    const handleEndIconButtonClick: CustomInputProps['endIconButtonConfig']['onClick'] = (event) => {
        event.stopPropagation()
        inputRef.current.focus()
        endIconButtonConfig?.onClick(event)
    }

    return (
        <FormFieldWrapper
            inputId={name}
            layout={layout}
            label={label}
            error={error}
            helperText={helperText}
            warningText={warningText}
            required={required}
            fullWidth={fullWidth}
            ariaLabel={ariaLabel}
            borderRadiusConfig={borderRadiusConfig}
        >
            <>
                <input
                    {...props}
                    {...getFormFieldAriaAttributes({
                        inputId: name,
                        required,
                        label,
                        ariaLabel,
                        error,
                        helperText,
                    })}
                    autoComplete="off"
                    name={name}
                    id={name}
                    spellCheck={false}
                    data-testid={name}
                    required={required}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    type={type}
                    ref={inputRef}
                    className={`${COMPONENT_SIZE_TYPE_TO_FONT_AND_BLOCK_PADDING_MAP[size]} ${COMPONENT_SIZE_TYPE_TO_INLINE_PADDING_MAP[size]} ${getFormFieldBorderClassName(borderRadiusConfig)} ${endIconButtonConfig ? `custom-input__with-icon-button--${size}` : ''} w-100 dc__overflow-auto`}
                />
                {endIconButtonConfig && (
                    <div className={`dc__no-shrink dc__position-abs custom-input__icon-button--${size}`}>
                        <Button
                            style={ButtonStyleType.neutral}
                            {...(endIconButtonConfig as ButtonProps)}
                            dataTestId={`${name}-end-icon`}
                            variant={ButtonVariantType.borderLess}
                            size={CUSTOM_INPUT_TO_ICON_BUTTON_SIZE_MAP[size]}
                            onClick={handleEndIconButtonClick}
                        />
                    </div>
                )}
            </>
        </FormFieldWrapper>
    )
}

export default CustomInput
