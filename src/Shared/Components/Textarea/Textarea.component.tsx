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

import { TextareaHTMLAttributes, useCallback, useEffect, useRef, useState } from 'react'

import { useThrottledEffect } from '@Common/Helper'
import {
    COMPONENT_SIZE_TYPE_TO_FONT_AND_BLOCK_PADDING_MAP,
    COMPONENT_SIZE_TYPE_TO_INLINE_PADDING_MAP,
    ComponentSizeType,
} from '@Shared/constants'
import { deriveBorderRadiusAndBorderClassFromConfig } from '@Shared/Helpers'

import { FormFieldWrapper, getFormFieldAriaAttributes } from '../FormFieldWrapper'
import { TextareaProps } from './types'
import { getTextAreaConstraintsForSize } from './utils'

import './textarea.scss'

const Textarea = ({
    name,
    label,
    textareaRef: textareaRefProp,
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
    labelTooltipConfig,
    labelTippyCustomizedConfig,
    hideFormFieldInfo,
    value,
    borderConfig,
    disableResize,
    newlineOnShiftEnter = false,
    ...props
}: TextareaProps) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    // If the passed value remains the same, the component will behave as un-controlled
    // else, it behaves as controlled
    const [text, setText] = useState('')

    const { MIN_HEIGHT, AUTO_EXPANSION_MAX_HEIGHT } = getTextAreaConstraintsForSize(size)

    const updateRefsHeight = (height: number) => {
        const refElement = textareaRef.current
        if (refElement) {
            refElement.style.height = `${height}px`
        }
    }

    const refCallback = useCallback((node: HTMLTextAreaElement) => {
        if (textareaRefProp) {
            if (typeof textareaRefProp === 'function') {
                textareaRefProp(node)
            } else {
                // eslint-disable-next-line no-param-reassign
                textareaRefProp.current = node
            }
        }

        textareaRef.current = node
    }, [])

    const reInitHeight = () => {
        const textarea = textareaRef.current
        if (!textarea) {
            return
        }

        textarea.style.height = 'auto'
        let nextHeight = textarea.scrollHeight

        if (nextHeight > AUTO_EXPANSION_MAX_HEIGHT) {
            nextHeight = AUTO_EXPANSION_MAX_HEIGHT
            textarea.style.overflowY = 'auto'
        } else {
            textarea.style.overflowY = 'hidden'
        }

        nextHeight = Math.max(MIN_HEIGHT, nextHeight)
        updateRefsHeight(nextHeight)
    }

    useEffect(() => {
        setText(value)
    }, [value])

    useThrottledEffect(reInitHeight, 300, [text])

    const handleChange: TextareaProps['onChange'] = (e) => {
        setText(e.target.value)

        props.onChange?.(e)
    }

    const handleBlur: TextareaProps['onBlur'] = (event) => {
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
        if (typeof onBlur === 'function') {
            onBlur(event)
        }
    }

    const handleKeyDown: TextareaHTMLAttributes<HTMLTextAreaElement>['onKeyDown'] = (
        event: React.KeyboardEvent<HTMLTextAreaElement>,
    ) => {
        if (event.key === 'Enter' || event.key === 'Escape') {
            event.stopPropagation()

            if (newlineOnShiftEnter && event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
            }

            if (event.key === 'Escape') {
                textareaRef.current.blur()
            }
        }
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
            borderConfig={borderConfig}
            borderRadiusConfig={borderRadiusConfig}
            labelTooltipConfig={labelTooltipConfig}
            labelTippyCustomizedConfig={labelTippyCustomizedConfig}
            hideFormFieldInfo={hideFormFieldInfo}
        >
            <textarea
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
                value={text}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className={`${COMPONENT_SIZE_TYPE_TO_FONT_AND_BLOCK_PADDING_MAP[size]} ${COMPONENT_SIZE_TYPE_TO_INLINE_PADDING_MAP[size]} ${deriveBorderRadiusAndBorderClassFromConfig({ borderConfig, borderRadiusConfig })} w-100 dc__overflow-auto textarea`}
                ref={refCallback}
                style={{
                    // No max height when user is expanding
                    maxHeight: 'none',
                    minHeight: MIN_HEIGHT,
                    resize: disableResize ? 'none' : 'vertical',
                }}
            />
        </FormFieldWrapper>
    )
}

export default Textarea
