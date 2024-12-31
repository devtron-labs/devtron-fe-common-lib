import { useEffect, useRef, useState } from 'react'
import { InputActionMeta, SelectInstance, SingleValue } from 'react-select'

import { ReactSelectInputAction } from '@Common/Constants'

import SelectPicker from './SelectPicker.component'
import { SelectPickerOptionType, SelectPickerTextAreaProps } from './type'

export const SelectPickerTextArea = ({
    value,
    options,
    isCreatable,
    onChange,
    ...props
}: SelectPickerTextAreaProps) => {
    // STATES
    const [inputValue, setInputValue] = useState((value as SingleValue<SelectPickerOptionType<string>>)?.value || '')

    // REFS
    const selectRef = useRef<SelectInstance<SelectPickerOptionType<string>>>(null)

    useEffect(() => {
        const selectValue = value as SingleValue<SelectPickerOptionType<string>>
        setInputValue(selectValue?.value || '')
    }, [value])

    // METHODS
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
            const wrapper = selectRef.current.controlRef

            // Get the caret position relative to the scrollable area
            const lineHeight = parseInt(getComputedStyle(textarea).lineHeight, 10)
            const caretPosition = textarea.selectionStart
            const linesAboveCaret = textarea.value.substring(0, caretPosition).split('\n').length

            // Estimate caret position by line height
            const caretY = linesAboveCaret * lineHeight
            const scrollOffset = caretY - wrapper.scrollTop

            // Adjust scroll to ensure caret is visible
            if (scrollOffset < 0) {
                // Scroll up
                wrapper.scrollTop += scrollOffset
            } else if (scrollOffset > wrapper.offsetHeight - lineHeight) {
                // Scroll down
                wrapper.scrollTop += scrollOffset - wrapper.offsetHeight + lineHeight
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
