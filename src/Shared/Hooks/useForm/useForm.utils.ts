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

import { UseFormValidation } from './useForm.types'

/**
 * Validates a form field based on the provided validation rules.
 *
 * @template T - A record type representing form data.
 * @param value - The value of the form field to be validated.
 * @param validation - The validation rules for the form field.
 * @returns Returns error message(s) or null if valid.
 */
export const checkValidation = <T extends Record<keyof T, any> = {}>(
    value: T[keyof T],
    validation: UseFormValidation,
): string[] | null => {
    if (
        validation?.required &&
        (typeof validation.required === 'object' ? validation.required.value : validation.required) &&
        (value === null || value === undefined || value === '')
    ) {
        return [typeof validation.required === 'object' ? validation.required.message : 'This is a required field']
    }

    const errors = []
    const pattern = validation?.pattern
    if (Array.isArray(pattern)) {
        const error = pattern.reduce<string[]>((acc, p) => {
            if (!p.value.test(value)) {
                acc.push(p.message)
            }
            return acc
        }, [])

        if (error.length) {
            errors.push(...error)
        }
    } else if (pattern?.value && !pattern.value.test(value)) {
        errors.push(pattern.message)
    }

    const custom = validation?.custom
    if (Array.isArray(custom)) {
        const error = custom.reduce<string[]>((acc, c) => {
            if (!c.isValid(value)) {
                acc.push(c.message)
            }
            return acc
        }, [])

        if (error.length) {
            errors.push(...error)
        }
    } else if (custom?.isValid && !custom.isValid(value)) {
        errors.push(custom.message)
    }

    return errors.length ? errors : null
}
