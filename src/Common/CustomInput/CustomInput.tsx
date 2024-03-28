import { CustomInputProps } from './Types'
import React from 'react'
import { ReactComponent as Info } from '../../Assets/Icon/ic-info-filled.svg'
import { ReactComponent as ErrorIcon } from '../../Assets/Icon/ic-warning.svg'

export const CustomInput = ({
    name,
    value,
    error,
    onChange,
    onFocus = (e) => {},
    label,
    type = 'text',
    disabled = false,
    labelClassName = '',
    placeholder = '',
    tabIndex = 0,
    dataTestid = '',
    isRequiredField = false,
    autoFocus = false,
    rootClassName = '',
    autoComplete = 'off',
    helperText = '',
    handleOnBlur,
    readOnly = false,
    noTrim = false,
    ref,
    onKeyPress,
    defaultValue,
    onKeyDown,
    required,
    additionalErrorInfo,
    inputWrapClassName = '',
    inputProps = {},
}: CustomInputProps) => {
    function handleError(error: any): any[] {
        if (!Array.isArray(error)) {
            return [error]
        }
        return error
    }

    const onBlur = (event) => {
        // NOTE: This is to prevent the input from being trimmed when the user do not want to trim the input
        if (!noTrim) {
            event.stopPropagation()
            event.target.value = event.target.value?.trim()
            onChange(event)
        }
        if (typeof handleOnBlur === 'function') {
            handleOnBlur(event)
        }
    }

    const renderFormErrorWithIcon = (error: string) => (
        <div className="form__error" key={error}>
            <ErrorIcon className="form__icon form__icon--error" />
            {error}
            {error && typeof additionalErrorInfo === 'function' && additionalErrorInfo()}
        </div>
    )

    const getInputError = () => {
        if (!error?.length) {
            return null
        }
        if (typeof error === 'object') {
            return handleError(error).map((err: string) => renderFormErrorWithIcon(err))
        }
        return renderFormErrorWithIcon(error)
    }

    const renderInputLabelConditionally = () => {
        if (typeof label === 'string') {
            return <span className={`${isRequiredField ? 'dc__required-field' : ''}`}>{label}</span>
        }
        return label
    }

    const renderInputLabel = () => {
        if (!label) {
            return null
        }
        return (
            <label className={`form__label ${labelClassName}`} data-testid={`label-${dataTestid}`}>
                {renderInputLabelConditionally()}
            </label>
        )
    }

    return (
        <div className={`flex column left top ${inputWrapClassName}`}>
            {renderInputLabel()}
            <input
                data-testid={dataTestid}
                type={type}
                name={name}
                autoComplete={autoComplete}
                className={`form__input fs-13 lh-20 fw-4 ${rootClassName}`}
                onChange={(e) => {
                    e.persist()
                    onChange(e)
                }}
                onBlur={onBlur}
                onFocus={onFocus}
                placeholder={placeholder}
                value={value}
                disabled={disabled}
                tabIndex={tabIndex}
                autoFocus={autoFocus}
                readOnly={readOnly}
                ref={ref}
                onKeyPress={onKeyPress}
                defaultValue={defaultValue}
                onKeyDown={onKeyDown}
                required={required}
                // Will be passing other props like other data attributes etc from inputProps
                {...inputProps}
            />

            {getInputError()}
            {helperText && (
                <div className="form__text-field-info">
                    <Info className="form__icon form__icon--info" />
                    <p className="sentence-case">{helperText}</p>
                </div>
            )}
        </div>
    )
}
