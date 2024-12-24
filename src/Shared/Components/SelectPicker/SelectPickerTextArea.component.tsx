import { useEffect, useRef, useState } from 'react'
import { InputActionMeta, SelectInstance, SingleValue } from 'react-select'

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
        if (action === 'input-change') {
            setInputValue(newValue)
            if (!newValue) {
                onChange?.(null, {
                    action: 'remove-value',
                    removedValue: value as SingleValue<SelectPickerOptionType<string>>,
                })
            }
        } else if (action === 'input-blur') {
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

            // Move the cursor to the next line
            // Using setTimeout so that the cursor adjustment happens after React completes its update,
            // ensuring the desired cursor position remains intact.
            setTimeout(() => {
                selectRef.current.inputRef.selectionStart = selectRef.current.inputRef.selectionEnd
                selectRef.current.controlRef.scrollTo({ top: selectRef.current.controlRef.scrollHeight })
                selectRef.current.focus()
                selectRef.current.openMenu('first')
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
