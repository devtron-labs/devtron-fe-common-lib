import { useRef } from 'react'
import { SelectInstance } from 'react-select'
import AsyncSelect from 'react-select/async'
import {
    SelectPickerClearIndicator,
    SelectPickerControl,
    SelectPickerDropdownIndicator,
    SelectPickerInput,
    SelectPickerLoadingIndicator,
    SelectPickerMenuList,
    SelectPickerMultiValueRemove,
    SelectPickerOption,
    SelectPickerSingleValue,
    SelectPickerValueContainer,
} from './common'
import { AsyncSelectProps } from './type'
import { FormFieldWrapper } from '../FormFieldWrapper'
import useSelectStyles from './utils'

export const AsyncSelectPicker = ({
    defaultOptions,
    loadOptions,
    noOptionsMessage,
    onChange,
    error,
    size,
    menuSize,
    variant,
    getIsOptionValid,
    isGroupHeadingSelectable,
    shouldMenuAlignRight,
    inputId,
    layout,
    label,
    helperText,
    warningText,
    required,
    fullWidth,
    ariaLabel,
    borderConfig,
    borderRadiusConfig,
    labelTippyCustomizedConfig,
    labelTooltipConfig,
    placeholder,
    value,
    isOptionDisabled,
}: AsyncSelectProps) => {
    const selectRef = useRef<SelectInstance>(null)

    // Option disabled, group null state, checkbox hover, create option visibility (scroll reset on search)
    const selectStyles = useSelectStyles({
        error,
        size,
        menuSize,
        variant,
        getIsOptionValid,
        isGroupHeadingSelectable,
        shouldMenuAlignRight,
    })

    const handleOnKeyDown = (event) => {
        if (event.key === 'Escape') {
            selectRef.current?.inputRef.blur()
        }
    }

    return (
        <FormFieldWrapper
            inputId={inputId}
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
            labelTippyCustomizedConfig={labelTippyCustomizedConfig}
            labelTooltipConfig={labelTooltipConfig}
        >
            <AsyncSelect
                ref={selectRef}
                blurInputOnSelect
                onKeyDown={handleOnKeyDown}
                defaultOptions={defaultOptions}
                loadOptions={loadOptions}
                noOptionsMessage={noOptionsMessage}
                onChange={onChange}
                components={{
                    IndicatorSeparator: null,
                    LoadingIndicator: SelectPickerLoadingIndicator,
                    DropdownIndicator: SelectPickerDropdownIndicator,
                    Control: SelectPickerControl,
                    Option: SelectPickerOption,
                    MenuList: SelectPickerMenuList,
                    ClearIndicator: SelectPickerClearIndicator,
                    MultiValueRemove: SelectPickerMultiValueRemove,
                    Input: SelectPickerInput,
                    SingleValue: SelectPickerSingleValue,
                    ValueContainer: SelectPickerValueContainer,
                }}
                value={value}
                styles={selectStyles}
                isOptionDisabled={isOptionDisabled}
                placeholder={placeholder}
            />
        </FormFieldWrapper>
    )
}
