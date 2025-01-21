import { ReactComponent as ICWarning } from '@Icons/ic-warning.svg'
import { ReactComponent as ICError } from '@Icons/ic-error.svg'
import { ReactComponent as ICInfoFilledOverride } from '@Icons/ic-info-filled-override.svg'
import { FormFieldInfoProps, FormInfoItemProps } from './types'

const FormInfoItem = ({ id, text, icon, textClass }: FormInfoItemProps) => (
    <div className="flex left dc__gap-4 fs-11 lh-16 fw-4" id={id}>
        <span className="dc__no-shrink icon-dim-16 flex top dc__fill-available-space">{icon}</span>
        <span className={`dc__ellipsis-right__2nd-line cr-5 ${textClass}`}>{text}</span>
    </div>
)

const FormFieldInfo = ({ error, helperText, warningText, inputId }: FormFieldInfoProps) => (
    <div className="flex left column dc__gap-4">
        {error && <FormInfoItem text={error} icon={<ICError />} textClass="cr-5" id={`${inputId}-error-msg`} />}
        {helperText && (
            <FormInfoItem
                text={helperText}
                icon={<ICInfoFilledOverride />}
                textClass="cn-7"
                id={`${inputId}-helper-text`}
            />
        )}
        {warningText && (
            <FormInfoItem
                text={warningText}
                icon={<ICWarning className="warning-icon-y7" />}
                textClass="cy-7"
                id={`${inputId}-warning-msg`}
            />
        )}
    </div>
)

export default FormFieldInfo
