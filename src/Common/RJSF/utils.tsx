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

import { TranslatableString, englishStringTranslator } from '@rjsf/utils'
import { buildObjectFromPath, convertJSONPointerToJSONPath, joinObjects, logExceptionToSentry } from '@Common/Helper'
import { JSONPath } from 'jsonpath-plus'
import { applyOperation, applyPatch, compare } from 'fast-json-patch'
import {
    GetFormStateFromFormDataProps,
    HiddenType,
    MetaHiddenType,
    RJSFFormSchema,
    UpdateFormDataFromFormStateProps,
} from './types'

/**
 * Override for the TranslatableString from RJSF
 */
export const translateString = (stringToTranslate: TranslatableString, params?: string[]): string => {
    switch (stringToTranslate) {
        case TranslatableString.NewStringDefault:
            // Use an empty string for the new additionalProperties string default value
            return ''
        default:
            return englishStringTranslator(stringToTranslate, params)
    }
}

/**
 * Returns the redirection props for a url
 */
export const getRedirectionProps = (
    url: string,
): React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    url: string
} => {
    try {
        // The URL is validated when added using the form
        const isInternalUrl = new URL(url).origin === window.location.origin
        return {
            href: url,
            target: isInternalUrl ? '_self' : '_blank',
            rel: isInternalUrl ? undefined : 'external noreferrer',
            url,
        }
    } catch {
        return {
            href: url,
            target: '_blank',
            url: `${url} (Invalid URL)`,
        }
    }
}

/**
 * Infers the type for json schema from value type
 */
export const getInferredTypeFromValueType = (value) => {
    const valueType = typeof value

    switch (valueType) {
        case 'boolean':
        case 'string':
        case 'number':
            return valueType
        case 'object':
            if (Array.isArray(value)) {
                return 'array'
            }
            if (value === null) {
                return 'null'
            }
            return valueType
        default:
            // Unsupported or undefined types
            return 'null'
    }
}

export const conformPathToPointers = (path: string): string => {
    if (!path) {
        return ''
    }

    const trimmedPath = path.trim()
    const trimmedPathWithStartSlash = /^\/.+$/g.test(trimmedPath) ? trimmedPath : `/${trimmedPath}`
    const finalPath = trimmedPathWithStartSlash.replaceAll(/\./g, '/')
    // NOTE: test if the path is a valid JSON pointer
    const pointerRegex = /(\/(([^/~])|(~[01]))*)/g

    return pointerRegex.test(finalPath) ? finalPath : ''
}

const emptyMetaHiddenTypeInstance: MetaHiddenType = {
    value: false,
    path: '',
}

export const parseSchemaHiddenType = (hiddenSchema: HiddenType): MetaHiddenType => {
    if (!hiddenSchema) {
        return null
    }
    const clone = structuredClone(hiddenSchema)
    if (typeof clone === 'string') {
        return {
            value: true,
            path: conformPathToPointers(clone),
        }
    }
    if (typeof clone !== 'object') {
        return structuredClone(emptyMetaHiddenTypeInstance)
    }
    if (
        Object.hasOwn(clone, 'condition') &&
        'condition' in clone &&
        Object.hasOwn(clone, 'value') &&
        'value' in clone
    ) {
        return {
            value: clone.condition,
            path: conformPathToPointers(clone.value),
        }
    }
    if (Object.hasOwn(clone, 'value') && 'value' in clone && Object.hasOwn(clone, 'path') && 'path' in clone) {
        return {
            value: clone.value,
            path: conformPathToPointers(clone.path),
        }
    }
    return structuredClone(emptyMetaHiddenTypeInstance)
}

const _getSchemaPathToUpdatePathMap = (schema: RJSFFormSchema, path: string, map: Record<string, string>) => {
    if (!schema) {
        return
    }

    if (schema.type === 'object' && schema.properties && typeof schema.properties === 'object') {
        Object.entries(schema.properties).forEach(([key, value]) => {
            _getSchemaPathToUpdatePathMap(value, `${path}/${key}`, map)
        })
    }

    if (
        schema.type === 'boolean' ||
        schema.type === 'string' ||
        schema.type === 'number' ||
        schema.type === 'integer'
    ) {
        // eslint-disable-next-line no-param-reassign
        map[path] = conformPathToPointers(schema.updatePath ?? path)
    }
}

export const getSchemaPathToUpdatePathMap = (schema: RJSFFormSchema): Record<string, string> => {
    const map = {}
    _getSchemaPathToUpdatePathMap(schema, '', map)
    return map
}

const _recursivelyRemoveElement = (obj: Record<string, any>, index: number, tokens: string[]) => {
    if (index >= tokens.length) {
        return obj
    }

    const key = tokens[index]

    if (index === tokens.length - 1) {
        const copy = structuredClone(obj)
        delete copy[key]
        return copy
    }

    if (obj[key]) {
        // eslint-disable-next-line no-param-reassign
        obj[key] = _recursivelyRemoveElement(obj[key], index + 1, tokens)
    }

    if (Object.keys(obj[key] ?? {}).length === 0) {
        const copy = structuredClone(obj)
        delete copy[key]
        return copy
    }

    return obj
}

const recursivelyRemoveElement = (obj: Record<string, any>, path: string) => {
    if (!obj || typeof obj !== 'object') {
        throw new Error('Invalid object')
    }

    if (!path || !path.startsWith('/')) {
        throw new Error('Invalid path')
    }

    const tokens = path.split('/').slice(1)
    return _recursivelyRemoveElement(obj, 0, tokens)
}

export const updateFormDataFromFormState = ({
    formState,
    oldFormState,
    formData,
    schemaPathToUpdatePathMap,
}: UpdateFormDataFromFormStateProps) => {
    let updatedFormData = formState

    const patches = compare(oldFormState, formState)
    patches.forEach((operation) => {
        const { op, path } = operation

        if (!schemaPathToUpdatePathMap[path] || path === schemaPathToUpdatePathMap[path]) {
            return
        }

        if (op === 'add') {
            updatedFormData = joinObjects([
                buildObjectFromPath(schemaPathToUpdatePathMap[path], operation.value),
                updatedFormData,
            ])

            return
        }

        if (op === 'replace') {
            applyOperation(
                updatedFormData,
                {
                    op: 'replace',
                    path: schemaPathToUpdatePathMap[path],
                    value: operation.value,
                },
                false,
                true,
            )

            return
        }

        if (op === 'remove') {
            updatedFormData = recursivelyRemoveElement(updatedFormData, schemaPathToUpdatePathMap[path])

            return
        }

        logExceptionToSentry('JSON Patch operation type other than add, replace, remove found')
    })

    Object.entries(schemaPathToUpdatePathMap).forEach(([path, updatePath]) => {
        if (path === updatePath || !updatePath) {
            return
        }

        const oldValueAgainstPath = JSONPath({
            json: formData,
            path: convertJSONPointerToJSONPath(path),
            resultType: 'value',
            wrap: false,
        })

        if (oldValueAgainstPath === undefined) {
            updatedFormData = recursivelyRemoveElement(updatedFormData, path)

            return
        }

        applyOperation(updatedFormData, { op: 'add', path, value: oldValueAgainstPath }, false, true)
    })

    updatedFormData = formData ? applyPatch(formData, compare(formData, updatedFormData)).newDocument : updatedFormData

    return updatedFormData
}

export const getFormStateFromFormData = ({ formData, schemaPathToUpdatePathMap }: GetFormStateFromFormDataProps) =>
    joinObjects([
        ...Object.entries(schemaPathToUpdatePathMap).map(([path, updatePath]) => {
            if (path === updatePath || !updatePath) {
                return {}
            }

            const value = JSONPath({
                json: formData,
                path: convertJSONPointerToJSONPath(updatePath),
                resultType: 'value',
                wrap: false,
            })

            if (value === undefined) {
                return {}
            }

            return buildObjectFromPath(path, value)
        }),
        structuredClone(formData),
    ])
