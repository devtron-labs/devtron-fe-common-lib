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

import { ObjectFieldTemplateProps, canExpand, titleId } from '@rjsf/utils'
import { FieldRowWithLabel } from '../common/FieldRow'
import { TitleField } from './TitleField'
import { AddButton } from './ButtonTemplates'
import { JSONPath } from 'jsonpath-plus'
import { RJSFFormSchema } from '../types'

const Field = ({
    disabled,
    formData,
    idSchema,
    onAddClick,
    properties,
    readonly,
    registry,
    required,
    schema,
    title,
    uiSchema,
}: ObjectFieldTemplateProps<any, RJSFFormSchema, any>) => {
    const hasAdditionalProperties = !!schema.additionalProperties

    const ActionButton = canExpand(schema, uiSchema, formData) && (
        <AddButton
            label={title}
            className="object-property-expand"
            onClick={onAddClick(schema)}
            disabled={disabled || readonly}
            uiSchema={uiSchema}
            registry={registry}
        />
    )

    const Properties = properties
        .filter((prop) => {
            const hiddenSchemaProp = schema.properties?.[prop.name]?.hidden
            if (!hiddenSchemaProp) {
                return true
            }
            const value = JSONPath({ path: hiddenSchemaProp.match, json: formData })?.[0]
            const isHidden = value === undefined || hiddenSchemaProp.condition === value
            // NOTE: if should be hidden then filter it out i.e return false
            return !isHidden
        })
        // NOTE: we probably should use uiSchema instead?
        .sort((prop) => (schema.properties?.[prop.name]?.type === 'boolean' ? -1 : 1))
        .map((prop) => prop.content)

    if (hasAdditionalProperties) {
        if (properties.length) {
            return (
                <>
                    <FieldRowWithLabel
                        label={title}
                        required={required}
                        showLabel
                        id={idSchema.$id}
                        shouldAlignCenter={false}
                    >
                        <div>{Properties}</div>
                    </FieldRowWithLabel>
                    {ActionButton}
                </>
            )
        }
        return (
            <FieldRowWithLabel label={title} required={required} showLabel id={idSchema.$id}>
                {ActionButton}
            </FieldRowWithLabel>
        )
    }
    return (
        <>
            {Properties}
            {ActionButton}
        </>
    )
}

export const ObjectFieldTemplate = (props: ObjectFieldTemplateProps<any, RJSFFormSchema, any>) => {
    const { idSchema, registry, required, schema, title, uiSchema, description } = props
    const hasAdditionalProperties = !!schema.additionalProperties
    const showTitle = title && !hasAdditionalProperties

    return (
        <fieldset id={idSchema.$id}>
            {showTitle && (
                <TitleField
                    id={titleId(idSchema)}
                    title={title}
                    required={required}
                    schema={schema}
                    uiSchema={uiSchema}
                    registry={registry}
                    description={description}
                />
            )}
            {/* Not adding the border and padding for non-objects and root schema */}
            <div
                className={`${
                    schema.properties && !hasAdditionalProperties && idSchema.$id !== 'root'
                        ? 'dc__border-left pl-12'
                        : ''
                } flexbox-col dc__gap-8`}
            >
                <Field {...props} />
            </div>
        </fieldset>
    )
}
