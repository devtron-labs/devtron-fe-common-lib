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

import { getSanitizedIframe } from '@Common/Helper'
import { PATTERNS } from '@Common/Constants'
import { URLProtocolType } from './types'
import { SKIP_LABEL_KEY_VALIDATION_PREFIX } from './constants'

export interface ValidationResponseType {
    isValid: boolean
    message?: string
}

export const MESSAGES = {
    PROVIDE_A_NUMBER: 'Please provide a number',
    LOWERCASE_ALPHANUMERIC: 'Only lowercase alphanumeric characters, -, _ or . allowed',
    CAN_NOT_START_END_WITH_SEPARATORS: 'Cannot start/end with -, _ or .',
    getMinMaxCharMessage: (min: number, max: number) => `Minimum ${min} and maximum ${max} characters allowed`,
    getMaxCharMessage: (max: number) => `Maximum ${max} characters are allowed`,
    getMinCharMessage: (min: number) => `Minimum ${min} characters are required`,
    VALID_POSITIVE_NUMBER: 'This field should be a valid positive number',
    VALID_POSITIVE_INTEGER: 'This field should be a valid positive integer',
    MAX_SAFE_INTEGER: `Maximum allowed value is ${Number.MAX_SAFE_INTEGER}`,
    INVALID_SEMANTIC_VERSION: 'Please follow semantic versioning',
    INVALID_DATE: 'Please enter a valid date',
    DATE_BEFORE_CURRENT_TIME: 'The date & time cannot be before the current time',
}

const MAX_DESCRIPTION_LENGTH = 350
const DISPLAY_NAME_CONSTRAINTS = {
    MAX_LIMIT: 50,
    MIN_LIMIT: 3,
}

export const validateLabelValue = (value: string): string[] => {
    const errorList = []
    if (value.length > 63) {
        errorList.push('Can be max 63 characters')
    }
    const firstLastAlphanumeric = PATTERNS.START_END_ALPHANUMERIC.test(value)
    if (!firstLastAlphanumeric) {
        errorList.push('Must start and end with an alphanumeric character')
    }
    const validValue = PATTERNS.ALPHANUMERIC_WITH_SPECIAL_CHAR.test(value)
    if (!validValue) {
        errorList.push('Can only contain alphanumeric chars and (-), (_), (.)')
    }
    return errorList
}

export const validateLabelKey = (
    key: string,
    skipValidationIfSpecialPrefix: boolean = true,
): { isValid: boolean; messages: string[] } => {
    const errorList = []
    const skipValidation = skipValidationIfSpecialPrefix && key.startsWith(SKIP_LABEL_KEY_VALIDATION_PREFIX)

    if (!key) {
        errorList.push('Key is required')
    } else if (!skipValidation) {
        const noOfSlashInKey = key.split('/').length - 1
        if (noOfSlashInKey > 1) {
            errorList.push('Key: Max 1 ( / ) allowed')
        } else if (noOfSlashInKey === 1) {
            const [prefix, name] = key.split('/')
            errorList.push(...validateLabelValue(name).map((error) => `Name: ${error}`))
            if (prefix.length > 253) {
                errorList.push('Prefix: Can be max 253 characters')
            }
            const validPrefix = PATTERNS.KUBERNETES_KEY_PREFIX.test(prefix)
            if (!validPrefix) {
                errorList.push('Prefix: Must be a DNS subdomain (a series of DNS labels separated by dots (.)')
            }
        } else {
            errorList.push(...validateLabelValue(key).map((error) => `Name: ${error}`))
        }
    }
    return { isValid: errorList.length === 0, messages: errorList }
}

export const requiredField = (value: string): ValidationResponseType => {
    if (!value?.trim()) {
        return { message: 'This field is required', isValid: false }
    }
    return { isValid: true }
}

export const validateName = (name: string): ValidationResponseType => {
    if (!/^.{3,50}$/.test(name)) {
        return {
            isValid: false,
            message: MESSAGES.getMinMaxCharMessage(3, 50),
        }
    }

    if (!/^[a-z0-9-._]+$/.test(name)) {
        return {
            isValid: false,
            message: MESSAGES.LOWERCASE_ALPHANUMERIC,
        }
    }

    if (!/^(?![-._]).*[^-._]$/.test(name)) {
        return {
            isValid: false,
            message: MESSAGES.CAN_NOT_START_END_WITH_SEPARATORS,
        }
    }

    return {
        isValid: true,
    }
}

export const validateDescription = (description: string): ValidationResponseType => {
    if (description?.length > MAX_DESCRIPTION_LENGTH) {
        return {
            isValid: false,
            message: MESSAGES.getMaxCharMessage(MAX_DESCRIPTION_LENGTH),
        }
    }

    return {
        isValid: true,
    }
}

export const validateStringLength = (value: string, maxLimit: number, minLimit: number): ValidationResponseType => {
    if (value?.length < minLimit) {
        return {
            isValid: false,
            message: MESSAGES.getMinCharMessage(minLimit),
        }
    }

    if (value?.length > maxLimit) {
        return {
            isValid: false,
            message: MESSAGES.getMaxCharMessage(maxLimit),
        }
    }

    return {
        isValid: true,
    }
}

export const validateRequiredPositiveNumber = (value: string | number): ValidationResponseType => {
    if (!value) {
        return {
            isValid: false,
            message: MESSAGES.PROVIDE_A_NUMBER,
        }
    }

    // 0002 is a valid number
    if (!/^\d+(\.\d+)?$/.test(value.toString())) {
        return {
            isValid: false,
            message: MESSAGES.VALID_POSITIVE_NUMBER,
        }
    }

    const numericValue = Number(value)

    if (numericValue > Number.MAX_SAFE_INTEGER) {
        return {
            isValid: false,
            message: MESSAGES.MAX_SAFE_INTEGER,
        }
    }

    if (numericValue <= 0) {
        return {
            isValid: false,
            message: MESSAGES.VALID_POSITIVE_NUMBER,
        }
    }

    return {
        isValid: true,
    }
}

export const validateRequiredPositiveInteger = (value: string | number): ValidationResponseType => {
    if (!value) {
        return {
            isValid: false,
            message: MESSAGES.PROVIDE_A_NUMBER,
        }
    }

    if (!/^\d+$/.test(value.toString())) {
        return {
            isValid: false,
            message: MESSAGES.VALID_POSITIVE_INTEGER,
        }
    }

    const numericValue = Number(value)

    if (numericValue > Number.MAX_SAFE_INTEGER) {
        return {
            isValid: false,
            message: MESSAGES.MAX_SAFE_INTEGER,
        }
    }

    if (numericValue <= 0) {
        return {
            isValid: false,
            message: MESSAGES.VALID_POSITIVE_INTEGER,
        }
    }

    return {
        isValid: true,
    }
}

/**
 * Check if the URL starts with the base64 URL prefix
 */
const isBase64Url = (url: string): boolean => /^data:.*;base64,/.test(url)

export const validateURL = (url: string, allowBase64Url: boolean = true): ValidationResponseType => {
    try {
        if (!allowBase64Url && isBase64Url(url)) {
            throw new Error('Base64 URLs are not allowed')
        }
        // eslint-disable-next-line no-new
        new URL(url)
    } catch (err) {
        return {
            isValid: false,
            message: err.message || 'Invalid URL',
        }
    }

    return {
        isValid: true,
    }
}

export const validateProtocols = (
    url: string,
    protocols: URLProtocolType[],
    isRequired?: boolean,
): ValidationResponseType => {
    if (isRequired && !url) {
        return {
            isValid: false,
            message: 'This field is required',
        }
    }

    try {
        const { protocol } = new URL(url)
        if (protocol && protocols.includes(protocol as URLProtocolType)) {
            return {
                isValid: true,
            }
        }
    } catch {
        // Do nothing
    }

    return {
        isValid: false,
        message: `Invalid URL/protocol. Supported protocols are: ${protocols.join(', ')}`,
    }
}

export const validateIfImageExist = (url: string): Promise<ValidationResponseType> =>
    new Promise<ValidationResponseType>((resolve) => {
        const img = new Image()

        img.src = url
        img.onload = () => {
            img.onload = null
            img.onerror = null

            return resolve({
                isValid: true,
            })
        }
        img.onerror = () => {
            img.src = ''
            img.onload = null
            img.onerror = null

            return resolve({
                isValid: false,
                message: 'Invalid URL',
            })
        }
    })

export const validateUniqueKeys = (keys: string[]) => {
    const keysMap: Record<string, number> = keys.reduce(
        (acc, key) => {
            if (acc[key]) {
                acc[key] += 1
                return acc
            }

            acc[key] = 1
            return acc
        },
        {} as Record<string, number>,
    )

    const duplicateKeys = Object.keys(keysMap).filter((key) => keysMap[key] > 1)
    if (!duplicateKeys.length) {
        return {
            isValid: true,
        }
    }

    return {
        isValid: false,
        message: `Duplicate variable name: ${duplicateKeys.join(', ')}`,
    }
}

/**
 * Rules for valid semantic version:
 * 1. version.length < 128 and not empty
 * 2. version should follow semantic versioning regex from https://semver.org/
 */
export const validateSemanticVersioning = (version: string): ValidationResponseType => {
    if (!version) {
        return {
            isValid: false,
            message: 'Please provide a version',
        }
    }

    if (version.length > 128) {
        return {
            isValid: false,
            message: MESSAGES.getMaxCharMessage(128),
        }
    }

    if (
        !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/.test(
            version,
        )
    ) {
        return {
            isValid: false,
            message: MESSAGES.INVALID_SEMANTIC_VERSION,
        }
    }

    return {
        isValid: true,
    }
}

/**
 * A valid display name should be between 3 and 50 characters
 */
export const validateDisplayName = (name: string): ValidationResponseType =>
    validateStringLength(name, DISPLAY_NAME_CONSTRAINTS.MAX_LIMIT, DISPLAY_NAME_CONSTRAINTS.MIN_LIMIT)

export const validateJSON = (json: string): ValidationResponseType => {
    try {
        if (json) {
            JSON.parse(json)
        }
        return {
            isValid: true,
        }
    } catch (err) {
        return {
            isValid: false,
            message: err.message,
        }
    }
}

export const validateDateAndTime = (date: Date): ValidationResponseType => {
    if (date) {
        const currentDate = new Date()
        if (currentDate.getTime() > date.getTime()) {
            return {
                isValid: false,
                message: MESSAGES.DATE_BEFORE_CURRENT_TIME,
            }
        }
    } else {
        return {
            isValid: false,
            message: MESSAGES.INVALID_DATE,
        }
    }

    return {
        isValid: true,
    }
}

export const validateIframe = (input: string): ValidationResponseType => {
    const sanitizedInput = getSanitizedIframe(input)
    const parentDiv = document.createElement('div')
    parentDiv.innerHTML = sanitizedInput

    const iframe = parentDiv.querySelector('iframe')

    // TODO: Can also check for accessability and security tags like sandbox, title, lazy, etc
    if (!iframe || parentDiv.children.length !== 1) {
        return { isValid: false, message: 'Input must contain a single iframe tag.' }
    }

    const src = iframe.getAttribute('src')
    if (!src) {
        return { isValid: false, message: 'Iframe must have a valid src attribute.' }
    }

    const urlValidationResponse = validateURL(src)

    if (!urlValidationResponse.isValid) {
        return urlValidationResponse
    }

    return { isValid: true }
}
