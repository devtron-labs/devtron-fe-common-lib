import ReactSelect, { ControlProps, MenuProps } from 'react-select'
import { useCallback, useMemo } from 'react'
import { ReactComponent as ErrorIcon } from '@Icons/ic-warning.svg'
import { ReactComponent as ICInfoFilledOverride } from '@Icons/ic-info-filled-override.svg'
import { getCommonSelectStyle } from './utils'
import {
    SelectPickerClearIndicator,
    SelectPickerControl,
    SelectPickerDropdownIndicator,
    SelectPickerLoadingIndicator,
    SelectPickerMenu,
    SelectPickerOption,
} from './common'
import { SelectPickerOptionType, SelectPickerProps } from './type'

const SelectPicker = ({
    error,
    icon,
    renderMenuListFooter,
    helperText,
    placeholder = 'Select a option',
    label,
    ...props
}: SelectPickerProps) => {
    const { inputId, required } = props

    const selectStyles = useMemo(
        () =>
            getCommonSelectStyle({
                hasError: !!error,
            }),
        [error],
    )

    const renderControl = useCallback(
        (controlProps: ControlProps) => <SelectPickerControl {...controlProps} icon={icon} />,
        [icon],
    )

    const renderMenu = useCallback(
        (menuProps: MenuProps) => <SelectPickerMenu {...menuProps} renderMenuListFooter={renderMenuListFooter} />,
        [],
    )

    return (
        <div className="flex column left top dc__gap-4">
            {/* TODO Eshank: Common out for fields */}
            <div className="flex column left top dc__gap-6 w-100">
                {label && (
                    <label
                        className="fs-13 lh-20 cn-7 fw-4 dc__block mb-0"
                        htmlFor={inputId}
                        data-testid={`label-${inputId}`}
                    >
                        {typeof label === 'string' ? (
                            <span className={`flex left ${required ? 'dc__required-field' : ''}`}>
                                <span className="dc__truncate">{label}</span>
                                {required && <span>&nbsp;</span>}
                            </span>
                        ) : (
                            label
                        )}
                    </label>
                )}
                <ReactSelect<SelectPickerOptionType, boolean>
                    {...props}
                    placeholder={placeholder}
                    components={{
                        IndicatorSeparator: null,
                        LoadingIndicator: SelectPickerLoadingIndicator,
                        DropdownIndicator: SelectPickerDropdownIndicator,
                        Control: renderControl,
                        Option: SelectPickerOption,
                        Menu: renderMenu,
                        ClearIndicator: SelectPickerClearIndicator,
                        // TODO Eshank: need to export variants of ValueContainer: Icon, No Icon etc
                    }}
                    styles={selectStyles}
                    className="w-100"
                    menuPlacement="auto"
                    menuPosition="fixed"
                    menuShouldScrollIntoView
                    backspaceRemovesValue={false}
                />
            </div>
            {error && (
                <div className="flex left dc__gap-4 cr-5 fs-11 lh-16 fw-4">
                    <ErrorIcon className="icon-dim-16 p-1 form__icon--error dc__no-shrink dc__align-self-start" />
                    <span className="dc__ellipsis-right__2nd-line">{error}</span>
                </div>
            )}
            {/* TODO Eshank: Common out for input fields */}
            {helperText && (
                <div className="flex left dc__gap-4 fs-11 lh-16 cn-7">
                    <ICInfoFilledOverride className="icon-dim-16 dc__no-shrink dc__align-self-start" />
                    <span className="dc__ellipsis-right__2nd-line">{helperText}</span>
                </div>
            )}
        </div>
    )
}

export default SelectPicker
