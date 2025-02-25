/*
 * Copyright (c) 2024. Devtron Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { forwardRef, useMemo } from 'react'
import RJSF from '@rjsf/core'

import { SCHEMA_07_VALIDATOR } from '@Shared/validations'
import { templates, widgets } from './config'
import { FormProps } from './types'
import {
    getFormStateFromFormData,
    getSchemaPathToUpdatePathMap,
    translateString,
    updateFormDataFromFormState,
} from './utils'
import './rjsfForm.scss'

// Need to use this way because the default import was not working as expected
// The default import resolves to an object instead of a function
const Form = RJSF
const validator = SCHEMA_07_VALIDATOR

export const RJSFForm = forwardRef((props: FormProps, ref: FormProps['ref']) => {
    const { schemaPathToUpdatePathMap, isUpdatePathKeywordPresent } = useMemo(() => {
        const map = getSchemaPathToUpdatePathMap(props.schema)

        return {
            schemaPathToUpdatePathMap: map,
            isUpdatePathKeywordPresent: Object.entries(map).some(([path, updatePath]) => path !== updatePath),
        }
    }, [props.schema])

    const formState = useMemo(() => {
        if (!isUpdatePathKeywordPresent) {
            return props.formData
        }

        return getFormStateFromFormData({ formData: props.formData ?? {}, schemaPathToUpdatePathMap })
    }, [props.formData, schemaPathToUpdatePathMap, isUpdatePathKeywordPresent])

    const handleOnChange: FormProps['onChange'] = (data) => {
        if (!props.onChange) {
            return
        }

        const updatedFormData = updateFormDataFromFormState({
            formState: data.formData,
            oldFormState: formState,
            formData: props.formData,
            schemaPathToUpdatePathMap,
        })

        props.onChange({ ...data, formData: updatedFormData })
    }

    const handleOnSubmit: FormProps['onSubmit'] = (data, event) => {
        if (!props.onSubmit) {
            return
        }

        const updatedFormData = updateFormDataFromFormState({
            formState: data.formData,
            oldFormState: formState,
            formData: props.formData,
            schemaPathToUpdatePathMap,
        })

        props.onSubmit?.({ ...data, formData: updatedFormData }, event)
    }

    return (
        <Form
            noHtml5Validate
            showErrorList={false}
            autoComplete="off"
            {...props}
            formData={formState}
            {...(isUpdatePathKeywordPresent
                ? {
                      onChange: handleOnChange,
                      onSubmit: handleOnSubmit,
                  }
                : {})}
            className={`rjsf-form-template__container ${props.className || ''}`}
            validator={validator}
            templates={{
                ...templates,
                ...props.templates,
            }}
            formContext={formState}
            widgets={{ ...widgets, ...props.widgets }}
            translateString={translateString}
            ref={ref}
        />
    )
})
