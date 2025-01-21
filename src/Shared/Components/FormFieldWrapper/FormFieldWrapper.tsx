import { FormFieldWrapperProps } from './types'
import FormFieldLabel from './FormFieldLabel'
import FormFieldInfo from './FormFieldInfo'

const FormFieldWrapper = ({
    layout,
    fullWidth,
    label,
    inputId,
    error,
    helperText,
    warningText,
    required,
    children,
}: Required<FormFieldWrapperProps>) => {
    const isRowLayout = layout === 'row'

    return (
        <div className={`flex left top dc__gap-6 ${!isRowLayout ? 'column' : ''} ${fullWidth ? 'w-100' : ''}`}>
            <div className={isRowLayout ? 'w-250' : ''}>
                <FormFieldLabel inputId={inputId} label={label} required={required} />
                {isRowLayout && <div />}
            </div>
            <div className="flex column left top dc__gap-4 w-100">
                <div className="w-100">{children}</div>
                <FormFieldInfo inputId={inputId} error={error} helperText={helperText} warningText={warningText} />
            </div>
        </div>
    )
}

export default FormFieldWrapper
