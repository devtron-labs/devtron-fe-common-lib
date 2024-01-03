import RJSF from '@rjsf/core'
import RJSFValidator from '@rjsf/validator-ajv8'

import { templates, widgets } from './config'
import { FormProps } from './types'
import { translateString } from './utils'
import './rjsfForm.scss'

// Need to use this way because the default import was not working as expected
// The default import resolves to an object intead of a function
const Form = (RJSF as any).default as typeof RJSF
const validator = (RJSFValidator as any).default as typeof RJSFValidator

export const RJSFForm = (props: FormProps) => (
    <Form
        noHtml5Validate
        showErrorList={false}
        autoComplete="off"
        {...props}
        validator={validator}
        templates={{
            ...templates,
            ...props.templates,
        }}
        widgets={{ ...widgets, ...props.widgets }}
        translateString={translateString}
    />
)
