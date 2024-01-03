import { TitleFieldProps } from '@rjsf/utils'

export const TitleField = ({ id, title, required }: TitleFieldProps) => (
    <legend className="fs-13 fw-6 cn-9 lh-20 pb-8 dc__border-bottom en-1 mb-12" id={id}>
        <span>{title}</span>
        {required && <span className="cr-5">&nbsp;*</span>}
    </legend>
)
