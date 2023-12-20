import { CustomInputProps } from './Types'
import { ReactComponent as Info } from '../../Assets/Icon/ic-info-filled.svg'
import { ReactComponent as FormError } from '../../Assets/Icon/ic-warning.svg'

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
    autoFocus = false,
    rootClassName = '',
    autoComplete = 'off',
    showLink = false,
    linkText = '',
    link = '',
    helperText = '',
    handleOnBlur,
    readOnly = false,
    noTrim = false,
    ref,
    onKeyPress,
    defaultValue,
    onKeyDown,
    required,
    additionalErrorInfo
}: CustomInputProps) {

    const renderLabelHelperText = () => {
        return (
            <a target="_blank" href={link} className="cursor fs-13 onlink ml-4">
                {linkText}
            </a>
        )
    }

    function handleError(error: any): any[] {
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

    const renderInputErrorMessage = (error: string) => {
        return (
            <div className="form__error" key={error}>
                <FormError className="form__icon form__icon--error" />
                {error}
                {typeof additionalErrorInfo === 'function' && additionalErrorInfo()}
            </div>
        )
    }

    const getInputError = () => {
        if (error.length === 0) {
            return null
        } else {
            if (typeof error === 'object') {
                return handleError(error).map((err: string) => renderInputErrorMessage(err))
            }
            return renderInputErrorMessage(error)
        }
    }

    const renderInputLabel = () => {
        if(label){
            if(typeof label === "string"){
                return  <label className={`form__label ${labelClassName}`} data-testid={`label-${dataTestid}`}>
                  <span className={`${isRequiredField ? 'dc__required-field' : ''}`}>{label}</span>
                  {showLink && renderLabelHelperText()}
              </label>
              } else if(typeof label === "function"){
                  return label()
              }
        } else {
            return null
        }
    }

    return (
        <div className="flex column left top">
           {renderInputLabel()}
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
                ref={ref}
                onKeyPress={onKeyPress}
                defaultValue={defaultValue}
                onKeyDown={onKeyDown}
                required={required}
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
