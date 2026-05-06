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

import { canExpand, deepEquals, ObjectFieldTemplateProps, titleId } from '@rjsf/utils'
import { JSONPath } from 'jsonpath-plus'

import { convertJSONPointerToJSONPath } from '@Common/Helper'

import { FieldRowWithLabel } from '../common/FieldRow'
import { RJSFFormSchema } from '../types'
import { parseSchemaHiddenType } from '../utils'
import { AddButton } from './ButtonTemplates'
import { TitleField } from './TitleField'

const Field = ({
    disabled,
    formData,
    fieldPathId,
    onAddProperty,
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
            onClick={onAddProperty}
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
            try {
                const hiddenSchema = parseSchemaHiddenType(hiddenSchemaProp)
                if (!hiddenSchema.path) {
                    throw new Error('Empty path property of hidden descriptor field')
                }
                // NOTE: formContext is the formData passed to RJSFForm
                const value = JSONPath({
                    path: convertJSONPointerToJSONPath(hiddenSchema.path),
                    json: registry.formContext,
                    resultType: 'value',
                    wrap: false,
                })
                const isHidden = value === undefined || deepEquals(hiddenSchema.value, value)
                return !isHidden
            } catch {
                return true
            }
        })
        .map((prop) => prop.content)

    if (hasAdditionalProperties) {
        if (properties.length) {
            return (
                <>
                    <FieldRowWithLabel
                        label={title}
                        required={required}
                        showLabel
                        id={fieldPathId.$id}
                        shouldAlignCenter={false}
                    >
                        <div>{Properties}</div>
                    </FieldRowWithLabel>
                    {ActionButton}
                </>
            )
        }
        return (
            <FieldRowWithLabel label={title} required={required} showLabel id={fieldPathId.$id}>
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
    const { fieldPathId, registry, required, schema, title, uiSchema, description } = props
    const hasAdditionalProperties = !!schema.additionalProperties
    const showTitle = title && !hasAdditionalProperties

    return (
        <fieldset id={fieldPathId.$id}>
            {showTitle && (
                <TitleField
                    id={titleId(fieldPathId)}
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
                    schema.properties && !hasAdditionalProperties && fieldPathId.$id !== 'root'
                        ? 'dc__border-left pl-12'
                        : ''
                } ${fieldPathId.$id === 'root' ? 'dc__separated-flexbox dc__separated-flexbox--vertical' : 'flexbox-col dc__gap-8'}`}
            >
                <Field {...props} />
            </div>
        </fieldset>
    )
}
