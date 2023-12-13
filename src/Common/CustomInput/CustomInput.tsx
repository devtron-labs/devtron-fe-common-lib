import { CustomInputProps } from './Types'
import { ReactComponent as Info } from '../../Assets/Icon/ic-info-filled.svg'
import { ReactComponent as FormError } from '../../Assets/Icon/ic-warning.svg'
import { useCallback } from 'react'

export function CustomInput({
    name,
    value,
    error,
    onChange,
    onFocus = (e) => {},
    label = '',
    type = 'text',
    disabled = false,
    labelClassName = '',
    placeholder = '',
    tabIndex = 1,
    dataTestid = '',
    isRequiredField = false,
    autoFocus = true,
    rootClassName = '',
    autoComplete = 'off',
    showLink = false,
    linkText = '',
    link = '',
    helperText = '',
    handleOnBlur,
    readOnly = false,
    noTrim = false,
}: CustomInputProps) {
    const renderLabelHelperText = () => {
        return (
            <span>
                <a target="_blank" href={link} className="cursor fs-13 onlink ml-4">
                    {linkText}
                </a>
            </span>
        )
    }

    function handleError(error: any): any[] {
        if (!error) {
            return []
        }

        if (!Array.isArray(error)) {
            return [error]
        }

        return error
    }

    const onBlur = (event) => {
        //NOTE: This is to prevent the input from being trimmed when the user do not want to trim the input
        if (!noTrim) {
            event.stopPropagation()
            event.target.value = event.target.value?.trim()
            onChange(event)
        }
        if (typeof handleOnBlur === 'function') {
            handleOnBlur(event)
        }
    }

    const renderFormError = () => {
        if (error?.length > 0) {
            if (typeof error === 'object') {
                return handleError(error).map((err: string) => (
                    <div className="form__error" key={err}>
                        <FormError className="form__icon form__icon--error" />
                        {err}
                    </div>
                ))
            }
            return (
                <div className="form__error">
                    <FormError className="form__icon form__icon--error" />
                    {error}
                </div>
            )
        }
    }

    return (
        <div className="flex column left top">
            {label && (
                <label className={`form__label ${labelClassName}`} data-testid={`label-${dataTestid}`}>
                    <span className={`${isRequiredField ? 'dc__required-field' : ''}`}>{label}</span>
                    {showLink && renderLabelHelperText()}
                </label>
            )}
            <input
                data-testid={dataTestid}
                type={type}
                name={name}
                autoComplete={autoComplete}
                className={`form__input ${rootClassName}`}
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
            />

            {renderFormError()}
            {helperText && (
                <div className="form__text-field-info">
                    <Info className="form__icon form__icon--info" />
                    <p className="sentence-case">{helperText}</p>
                </div>
            )}
        </div>
    )
}
