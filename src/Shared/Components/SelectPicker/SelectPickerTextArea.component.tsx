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

import { useEffect, useRef, useState } from 'react'
import { InputActionMeta, SelectInstance, SingleValue } from 'react-select'

import { ReactSelectInputAction } from '@Common/Constants'
import { useThrottledEffect } from '@Common/Helper'

import SelectPicker from './SelectPicker.component'
import { SelectPickerOptionType, SelectPickerTextAreaProps } from './type'

export const SelectPickerTextArea = ({
    value,
    options,
    isCreatable,
    onChange,
    minHeight,
    maxHeight,
    refVar,
    dependentRefs,
    ...props
}: SelectPickerTextAreaProps) => {
    // STATES
    const [inputValue, setInputValue] = useState((value as SingleValue<SelectPickerOptionType<string>>)?.value || '')

    // REFS
    const selectRef = useRef<SelectInstance<SelectPickerOptionType<string>>>(null)

    useEffect(() => {
        const inputRef = refVar
        if (inputRef) {
            inputRef.current = selectRef.current.inputRef as unknown as HTMLTextAreaElement
        }
    }, [refVar])

    useEffect(() => {
        const selectValue = value as SingleValue<SelectPickerOptionType<string>>
        setInputValue(selectValue?.value || '')
    }, [value])

    // METHODS
    const updateDependentRefsHeight = (height: number) => {
        Object.values(dependentRefs || {}).forEach((ref) => {
            const dependentRefElement = ref?.current
            if (dependentRefElement) {
                dependentRefElement.style.height = `${height}px`
            }
        })
    }

    const updateRefsHeight = (height: number) => {
        const refElement = refVar?.current
        if (refElement) {
            refElement.style.height = `${height}px`
        }
        updateDependentRefsHeight(height)
    }

    const reInitHeight = () => {
        updateRefsHeight(minHeight || 0)

        let nextHeight = refVar?.current?.scrollHeight || 0

        if (dependentRefs) {
            Object.values(dependentRefs).forEach((ref) => {
                const refElement = ref.current
                if (refElement && refElement.scrollHeight > nextHeight) {
                    nextHeight = refElement.scrollHeight
                }
            })
        }

        if (minHeight && nextHeight < minHeight) {
            nextHeight = minHeight
        }

        if (maxHeight && nextHeight > maxHeight) {
            nextHeight = maxHeight
        }

        updateRefsHeight(nextHeight)
    }

    useThrottledEffect(reInitHeight, 500, [inputValue])

    const onInputChange = (newValue: string, { action }: InputActionMeta) => {
        if (action === ReactSelectInputAction.inputChange) {
            setInputValue(newValue)

            if (!newValue) {
                onChange?.(null, {
                    action: 'remove-value',
                    removedValue: value as SingleValue<SelectPickerOptionType<string>>,
                })
            }
        } else if (action === ReactSelectInputAction.inputBlur) {
            // Reverting input to previously selected value in case of blur event. (no-selection)
            const selectValue = value as SingleValue<SelectPickerOptionType<string>>
            setInputValue(selectValue?.value || '')
        }
    }

    const handleCreateOption = (newValue: string) => {
        onChange?.(
            { label: newValue, value: newValue },
            { action: 'create-option', option: { label: newValue, value: newValue } },
        )
        selectRef.current.blurInput()
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' && event.shiftKey) {
            // Prevent the default Enter key behavior
            event.preventDefault()

            // Add a new line at the current cursor position
            const { selectionStart, selectionEnd } = selectRef.current.inputRef
            const updatedText = `${inputValue.slice(0, selectionStart)}\n${inputValue.slice(selectionEnd)}`

            setInputValue(updatedText)

            const textarea = selectRef.current.inputRef

            // Get the caret position
            const caretPosition = textarea.selectionStart

            // Split the text up to the caret position into lines
            const textBeforeCaret = textarea.value.substring(0, caretPosition)
            const lines = textBeforeCaret.split('\n')

            // Calculate the caret position in pixels
            const lineHeight = parseInt(getComputedStyle(textarea).lineHeight, 10)
            const caretY = lines.length * lineHeight

            // Check if caret is outside of the visible area
            const scrollOffset = caretY - textarea.scrollTop

            if (scrollOffset < 0) {
                // Scroll up if the caret is above the visible area
                textarea.scrollTop += scrollOffset
            } else if (scrollOffset > textarea.offsetHeight - lineHeight) {
                // Scroll down if the caret is below the visible area
                textarea.scrollTop += scrollOffset - textarea.offsetHeight + lineHeight
            }

            // Move the cursor to the next line
            // Using setTimeout so that the cursor adjustment happens after React completes its update,
            // ensuring the desired cursor position remains intact.
            setTimeout(() => {
                selectRef.current.inputRef.selectionStart = selectionStart + 1
                selectRef.current.inputRef.selectionEnd = selectionStart + 1
            })

            return
        }

        if (isCreatable && event.key === 'Enter') {
            handleCreateOption(inputValue)
        }
    }

    return (
        <SelectPicker<string, false>
            {...props}
            isCreatable={isCreatable}
            options={options}
            selectRef={selectRef}
            inputValue={inputValue}
            value={value}
            onInputChange={onInputChange}
            controlShouldRenderValue={false}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            onCreateOption={handleCreateOption}
            shouldRenderTextArea
        />
    )
}
