import ReactSelect, { ControlProps, Props as ReactSelectProps } from 'react-select'
import { ReactNode, useCallback, useMemo } from 'react'
import { ReactComponent as ErrorIcon } from '@Icons/ic-warning.svg'
import { getCommonSelectStyle } from './utils'
import { ControlWithIcon, DropdownIndicator, SingleSelectOption, LoadingIndicator } from './common'
import { SelectPickerOptionType } from './type'

export interface SelectPickerProps
    extends Pick<
        ReactSelectProps,
        | 'isMulti'
        | 'onChange'
        | 'isSearchable'
        | 'isClearable'
        | 'isLoading'
        | 'placeholder'
        | 'hideSelectedOptions'
        | 'controlShouldRenderValue'
        | 'backspaceRemovesValue'
        | 'closeMenuOnSelect'
        | 'isDisabled'
        | 'isLoading'
        | 'inputId'
    > {
    icon?: ReactNode
    error?: ReactNode
    options: SelectPickerOptionType[]
    value?: SelectPickerOptionType
}

const SelectPicker = ({ error, icon, placeholder = 'Select a option', ...props }: SelectPickerProps) => {
    const selectStyles = useMemo(
        () =>
            getCommonSelectStyle({
                hasError: !!error,
            }),
        [error],
    )

    const renderControl = useCallback(
        (controlProps: ControlProps) => <ControlWithIcon {...controlProps} icon={icon} />,
        [icon],
    )

    return (
        <div>
            <ReactSelect<SelectPickerOptionType, boolean>
                {...props}
                placeholder={placeholder}
                components={{
                    IndicatorSeparator: null,
                    LoadingIndicator,
                    DropdownIndicator,
                    Control: renderControl,
                    Option: SingleSelectOption,
                    // ValueContainer,
                }}
                styles={selectStyles}
            />
            {error && (
                <div className="flex left dc__gap-4 cr-5 fs-11 lh-16 fw-4">
                    <div className="dc__no-shrink dc__align-self-start p-2">
                        <ErrorIcon className="icon-dim-12 form__icon--error" />
                    </div>
                    <span>{error}</span>
                </div>
            )}
        </div>
    )
}

export default SelectPicker
