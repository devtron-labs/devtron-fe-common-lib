import { ChangeEvent, useRef } from 'react'
import { SelectInstance } from 'react-select'

import { ReactComponent as ICClearSquare } from '@Icons/ic-clear-square.svg'
import { useEffectAfterMount } from '@Common/Helper'

import {
    getSelectPickerOptionByValue,
    SelectPicker,
    SelectPickerOptionType,
    SelectPickerVariantType,
} from '../SelectPicker'
import { MultipleResizableTextArea } from '../MultipleResizableTextArea'
import { SelectTextAreaProps } from './types'

export const SelectTextArea = ({
    value,
    selectedOptionIcon: Icon,
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
        if (value && refVar?.current) {
            refVar.current.focus()
            const refElement = refVar.current
            refElement.selectionStart = refElement.value.length
        } else if (!value && selectRef.current) {
            selectRef.current.focus()
            selectRef.current.openMenu('first')
        }
    }, [value])

    // METHODS
    const onTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value)
    }

    const onSelectPickerChange = (selectedOption: SelectPickerOptionType<string>) => {
        onChange(selectedOption.value)
    }

    const onSelectPickerCreateOption = (inputValue: string) => {
        onChange(inputValue)
    }

    const onClear = () => {
        onChange('')
    }

    return (
        <div className="select-text-area flexbox dc__align-items-center dc__gap-4 w-100 dc__position-rel">
            {!!(Icon && selectedValue) && Icon}
            <MultipleResizableTextArea
                {...textAreaProps}
                id={inputId}
                refVar={refVar}
                dependentRefs={dependentRefs}
                className={`${textAreaProps?.className || ''} ${disabled ? 'cursor-not-allowed' : ''} ${!value ? 'dc__hide-section' : ''}`}
                value={value}
                onChange={onTextAreaChange}
                placeholder={placeholder}
            />
            {!value ? (
                <SelectPicker<string, false>
                    {...selectPickerProps}
                    inputId={inputId}
                    selectRef={selectRef}
                    isCreatable
                    variant={SelectPickerVariantType.BORDER_LESS}
                    onCreateOption={onSelectPickerCreateOption}
                    options={options}
                    value={selectedValue}
                    onChange={onSelectPickerChange}
                    placeholder={placeholder}
                    isDisabled={disabled}
                    fullWidth
                />
            ) : (
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
