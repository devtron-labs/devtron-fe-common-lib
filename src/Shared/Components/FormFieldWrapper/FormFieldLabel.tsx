import { FormFieldLabelProps } from './types'
import { getFormLabelElementId } from './utils'

const FormFieldLabel = ({ label, inputId, required }: FormFieldLabelProps) => {
    if (!label) {
        return null
    }

    const labelId = getFormLabelElementId(inputId)

    return (
        <label className="fs-13 lh-20 cn-7 fw-4 dc__block mb-0" htmlFor={inputId} id={labelId} data-testid={labelId}>
            {typeof label === 'string' ? (
                <span className={`flex left ${required ? 'dc__required-field' : ''}`}>
                    <span className="dc__truncate">{label}</span>
                    {required && <span>&nbsp;</span>}
                </span>
            ) : (
                label
            )}
        </label>
    )
}

export default FormFieldLabel
