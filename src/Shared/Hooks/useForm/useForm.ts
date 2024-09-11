import { ChangeEvent, FormEvent, useState } from 'react'

import { checkValidation } from './useForm.utils'
import {
    DirtyFields,
    UseFormErrors,
    TouchedFields,
    UseFormSubmitHandler,
    UseFormValidation,
    UseFormValidations,
} from './useForm.types'

/**
 * A custom hook to manage form state, validation, and submission handling.
 *
 * @template T - A record type representing form data.
 * @param options (optional) - Options for initial form values, validation rules, and form mode.
 * @param options.validations - An object containing validation rules for form fields.
 * @param options.initialValues - An object representing the initial values of the form.
 * @param options.mode (default: `onChange`) - A string to set validation mode, either 'onChange' or 'onBlur'.
 * @returns Returns form state, handlers for change and submission, validation errors, and a trigger function for manual validation.
 */
export const useForm = <T extends Record<keyof T, any> = {}>(options?: {
    validations?: UseFormValidations<T>
    initialValues?: Partial<T>
    mode?: 'onChange' | 'onBlur'
}) => {
    const [data, setData] = useState<T>((options?.initialValues || {}) as T)
    const [dirtyFields, setDirtyFields] = useState<DirtyFields<T>>({})
    const [touchedFields, setTouchedFields] = useState<TouchedFields<T>>({})
    const [errors, setErrors] = useState<UseFormErrors<T>>({})

    /**
     * Handles change events for form inputs, updates the form data, and triggers validation.
     *
     * @template S - The sanitized value type.
     * @param key - The key of the form field to be updated.
     * @param sanitizeFn - An optional function to sanitize the input value.
     * @returns The event handler for input changes.
     */
    const onChange =
        <S extends unknown>(key: keyof T, sanitizeFn?: (value: string) => S) =>
        (e: ChangeEvent<HTMLInputElement & HTMLSelectElement>) => {
            const value = sanitizeFn ? sanitizeFn(e.target.value) : e.target.value
            setData({
                ...data,
                [key]: value,
            })
            setTouchedFields({
                ...data,
                [key]: true,
            })

            if (!options?.mode || options?.mode === 'onChange' || dirtyFields[key]) {
                const validations = options?.validations ?? {}
                const error = checkValidation<T>(value as T[keyof T], validations[key as string])
                setErrors({ ...errors, [key]: error })
            }
        }

    /**
     * Handles blur events for form inputs and triggers validation if the form mode is 'onBlur'.
     *
     * @param key - The key of the form field to be validated on blur.
     * @returns The event handler for the blur event.
     */
    const onBlur = (key: keyof T) => () => {
        setDirtyFields({ ...dirtyFields, [key]: options?.initialValues?.[key] === data[key] })
        if (options?.mode === 'onBlur') {
            const validations = options?.validations ?? {}
            const error = checkValidation<T>(data[key] as T[keyof T], validations[key as string])
            setErrors({ ...errors, [key]: error })
        }
    }

    /**
     * Handles form submission, validates all form fields, and calls the provided `onValid` function if valid.
     *
     * @param onValid - A function to handle valid form data on submission.
     * @returns The event handler for form submission.
     */
    const handleSubmit = (onValid: UseFormSubmitHandler<T>) => (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const validations = options?.validations
        if (validations) {
            const newErrors: UseFormErrors<T> = {}

            Object.keys(validations).forEach((key) => {
                const validation: UseFormValidation = validations[key]
                const error = checkValidation<T>(data[key], validation)
                if (error) {
                    newErrors[key] = error
                }
            })

            if (Object.keys(newErrors).length) {
                setErrors(newErrors)
                return
            }
        }

        setErrors({})
        onValid(data, e)
    }

    /**
     * Manually triggers validation for specific form fields.
     *
     * @param name - The key(s) of the form field(s) to validate.
     * @returns The validation error(s), if any.
     */
    const trigger = (name: keyof T | (keyof T)[]): (string | string[]) | (string | string[])[] => {
        const validations = options?.validations

        if (Array.isArray(name)) {
            const newErrors: UseFormErrors<T> = {}

            const _errors = name.map((key) => {
                if (validations) {
                    const validation = validations[key]
                    const error = checkValidation(data[key], validation)
                    newErrors[key] = error

                    return error
                }

                return null
            })

            if (Object.keys(newErrors).length) {
                setErrors({ ...errors, ...newErrors })
            }

            return _errors
        }

        if (validations) {
            const validation = validations[name]
            const error = checkValidation(data[name], validation)

            if (error) {
                setErrors({ ...errors, [name]: error })
            }

            return error
        }

        return null
    }

    /**
     * Registers form input fields with onChange and onBlur handlers.
     *
     * @param name - The key of the form field to register.
     * @param sanitizeFn - An optional function to sanitize the input value.
     * @returns An object containing `onChange` and `onBlur` event handlers.
     */
    const register = <S extends unknown>(name: keyof T, sanitizeFn?: (value: string) => S) => ({
        onChange: onChange(name, sanitizeFn),
        onBlur: onBlur(name),
    })

    return {
        data,
        errors,
        register,
        handleSubmit,
        trigger,
        touchedFields,
        dirtyFields,
        isDirty: Object.values(dirtyFields).some((value) => value),
    }
}
