import { useCallback, useMemo, useRef } from 'react'
import { SelectInstance, ValueContainerProps } from 'react-select'
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
    SelectPickerValueContainer,
} from './common'
import { AsyncSelectProps, SelectPickerOptionType } from './type'
import { FormFieldWrapper } from '../FormFieldWrapper'
import { getCommonSelectStyle } from './utils'

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
}: AsyncSelectProps) => {
    const selectRef = useRef<SelectInstance>(null)

    // Option disabled, group null state, checkbox hover, create option visibility (scroll reset on search)
    const selectStyles = useMemo(
        () =>
            getCommonSelectStyle({
                error,
                size,
                menuSize,
                variant,
                getIsOptionValid,
                isGroupHeadingSelectable,
                shouldMenuAlignRight,
            }),
        [error, size, menuSize, variant, isGroupHeadingSelectable, shouldMenuAlignRight],
    )

    const handleOnKeyDown = (event) => {
        if (event.key === 'Escape') {
            selectRef.current?.inputRef.blur()
        }
    }
    type OptionValue = string | number

    const renderValueContainer = useCallback(
        (valueContainerProps: ValueContainerProps<SelectPickerOptionType<OptionValue>>) => (
            <SelectPickerValueContainer {...valueContainerProps} />
        ),
        [],
    )

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
            <div className="w-100">
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
                        ValueContainer: renderValueContainer,
                        // MultiValueLabel: renderMultiValueLabel,
                        MultiValueRemove: SelectPickerMultiValueRemove,
                        // GroupHeading: renderGroupHeading,
                        // NoOptionsMessage: renderNoOptionsMessage,
                        Input: SelectPickerInput,
                    }}
                    value={defaultOptions?.[0]}
                    styles={selectStyles}
                    // aria-describedby={getFormHelperTextElementId('app-selector')}
                />
            </div>
        </FormFieldWrapper>
    )
}
