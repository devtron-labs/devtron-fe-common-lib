import { ChangeEvent, useRef } from 'react'
import { SelectInstance } from 'react-select'

import { ReactComponent as ICClearSquare } from '@Icons/ic-clear-square.svg'
import { useEffectAfterMount } from '@Common/Helper'
import { ResizableTagTextArea } from '@Common/CustomTagSelector'

import {
    getSelectPickerOptionByValue,
    SelectPicker,
    SelectPickerOptionType,
    SelectPickerVariantType,
} from '../SelectPicker'
import { SelectTextAreaProps } from './types'

export const SelectTextArea = ({
    value,
    Icon,
    onChange,
    options,
    inputId,
    placeholder,
    refVar,
    dependentRefs,
    disabled,
    selectPickerProps,
    textAreaProps,
}: SelectTextAreaProps) => {
    // REFS
    const selectRef = useRef<SelectInstance<SelectPickerOptionType<string>>>(null)

    // CONSTANTS
    const selectedValue = getSelectPickerOptionByValue<string>(options, value, null)

    useEffectAfterMount(() => {
        if (!value && selectRef.current) {
            selectRef.current.focus()
            selectRef.current.openMenu('first')
        }
    }, [value])

    // METHODS
    const onTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const inputValue = e.target.value
        onChange({ label: inputValue, value: inputValue })
    }

    const onSelectPickerChange = (selectedOption: SelectPickerOptionType<string>) => {
        onChange(selectedOption)
    }

    const onSelectPickerCreateOption = (inputValue: string) => {
        onChange({ label: inputValue, value: inputValue })
    }

    const onClear = () => {
        onChange({ label: '', value: '' })
    }

    return (
        <div className="select-text-area flexbox dc__align-items-center dc__gap-4 w-100 dc__position-rel">
            {!!Icon && Icon}
            <ResizableTagTextArea
                {...textAreaProps}
                id={inputId}
                refVar={refVar}
                dependentRefs={dependentRefs}
                className={`${textAreaProps?.className || ''} ${disabled ? 'cursor-not-allowed' : ''} ${!value ? 'dc__hide-section' : ''}`}
                value={value}
                onChange={onTextAreaChange}
                placeholder={placeholder}
            />
            <div className={`w-100 ${value ? 'select-picker-hidden dc__hide-section' : ''}`}>
                <SelectPicker<string, false>
                    isCreatable
                    {...selectPickerProps}
                    inputId={inputId}
                    selectRef={selectRef}
                    variant={SelectPickerVariantType.BORDER_LESS}
                    onCreateOption={onSelectPickerCreateOption}
                    options={options}
                    value={selectedValue}
                    onChange={onSelectPickerChange}
                    placeholder={placeholder}
                    isDisabled={disabled}
                    fullWidth
                />
            </div>
            {value && (
                <button
                    type="button"
                    className="flex dc__transparent dc__position-abs dc__top-8 dc__right-8"
                    onClick={onClear}
                >
                    <ICClearSquare className="icon-dim-16" />
                </button>
            )}
        </div>
    )
}
