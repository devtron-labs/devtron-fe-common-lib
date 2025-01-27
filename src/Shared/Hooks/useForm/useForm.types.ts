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

import { BaseSyntheticEvent } from 'react'

/**
 * Describes the "required" validation rule.
 * It can be a simple boolean or an object containing a boolean value and an error message.
 */
type ValidationRequired =
    | boolean
    | {
          value: boolean
          message: string
      }

/**
 * Describes the "pattern" validation rule, which ensures a value matches a specific regular expression.
 * It can be a single validation object or an array of multiple patterns.
 */
type ValidationPattern =
    | {
          value: RegExp
          message: string
      }
    | {
          value: RegExp
          message: string
      }[]

/**
 * Describes custom validation logic.
 * It checks if a value passes a custom validation function, which returns a boolean.
 * If validation fails, an error message is provided.
 */
type ValidationCustom =
    | {
          isValid: (value: any) => boolean
          message: string
      }
    | {
          isValid: (value: any) => boolean
          message: string
      }[]

/**
 * Defines the validation rules for form fields.
 * Includes `required`, `pattern`, and `custom` validation types.
 */
export interface UseFormValidation {
    required?: ValidationRequired
    pattern?: ValidationPattern
    custom?: ValidationCustom
}

/**
 * Represents the structure for form validation errors.
 * Maps each field to an array of error messages.
 */
export type UseFormErrors<T> = Partial<Record<keyof T, string[]>>

/**
 * Represents the fields that have been modified ("dirty") in the form.
 * Maps each field to a boolean value indicating whether it has been changed.
 */
export type DirtyFields<T> = Partial<Record<keyof T, boolean>>

/**
 * Represents the fields that have been interacted with ("touched") in the form.
 * Maps each field to a boolean value indicating whether it has been focused or interacted with.
 */
export type TouchedFields<T> = Partial<Record<keyof T, boolean>>

/**
 * Defines the structure for form validations.
 * Maps each form field to its corresponding validation rules.
 */
export type UseFormValidations<T extends {}> =
    | ((formData: T) => Partial<Record<keyof T, UseFormValidation>>)
    | Partial<Record<keyof T, UseFormValidation>>

/**
 * Describes the function signature for handling form submission.
 *
 * @param data - The form data collected during submission.
 * @param e - The event, optionally passed when `handleSubmit` is called.
 */
export type UseFormSubmitHandler<T extends {}> = (data: T, e?: BaseSyntheticEvent) => void

/**
 * A type defining the function signature for handling form validation errors.
 *
 * @param errors - An object containing the validation errors for form fields.
 * @param e - The event, optionally passed when `handleSubmit` is called.
 */
export type UseFormErrorHandler<T extends {}> = (errors: UseFormErrors<T>, e?: BaseSyntheticEvent) => void
