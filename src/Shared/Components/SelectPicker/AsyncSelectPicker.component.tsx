import AsyncSelect from 'react-select/async'
import { deriveBorderRadiusAndBorderClassFromConfig } from '@Shared/Helpers'
import { AsyncSelectProps } from './type'
import { FormFieldWrapper, getFormFieldAriaAttributes } from '../FormFieldWrapper'
import { useSelectHooks } from './useSelectHooks'
import { BaseSelectComponents } from './constants'

export const AsyncSelectPicker = ({
    defaultOptions,
    loadOptions,
    noOptionsMessage,
    onChange,
    error,
    size,
    menuSize,
    variant,
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
    icon,
    name,
    classNamePrefix,
    isSearchable = true,
    onKeyDown,
    onBlur,
    ...props
}: AsyncSelectProps) => {
    // Option disabled, group null state, checkbox hover, create option visibility (scroll reset on search)
    const { styles, selectRef, handleKeyDown, handleBlur, handleFocus, isFocussed } = useSelectHooks({
        error,
        size,
        menuSize,
        variant,
        shouldMenuAlignRight,
        onKeyDown,
        onBlur,
    })

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
                {...props}
                {...getFormFieldAriaAttributes({
                    inputId,
                    required,
                    label,
                    ariaLabel,
                    error,
                    helperText,
                })}
                classNames={{
                    control: () => deriveBorderRadiusAndBorderClassFromConfig({ borderConfig, borderRadiusConfig }),
                }}
                name={name || inputId}
                classNamePrefix={classNamePrefix || inputId}
                isSearchable={isSearchable}
                ref={selectRef}
                blurInputOnSelect
                onKeyDown={handleKeyDown}
                defaultOptions={defaultOptions}
                loadOptions={loadOptions}
                noOptionsMessage={noOptionsMessage}
                onChange={onChange}
                components={BaseSelectComponents}
                value={value}
                styles={styles}
                isOptionDisabled={isOptionDisabled}
                placeholder={placeholder}
                onBlur={handleBlur}
                onFocus={handleFocus}
                isFocussed={isFocussed}
                icon={icon}
            />
        </FormFieldWrapper>
    )
}
