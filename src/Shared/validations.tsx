export interface ValidationResponseType {
    isValid: boolean
    message?: string
}

const MESSAGES = {
    PROVIDE_A_NUMBER: 'Please provide a number',
    LOWERCASE_ALPHANUMERIC: 'Only lowercase alphanumeric characters, -, _ or . allowed',
    CAN_NOT_START_END_WITH_SEPARATORS: 'Cannot start/end with -, _ or .',
    getMinMaxCharMessage: (min: number, max: number) => `Minimum ${min} and maximum ${max} characters allowed`,
    getMaxCharMessage: (max: number) => `Maximum ${max} characters are allowed`,
    VALID_POSITIVE_NUMBER: 'This field should be a valid positive number',
    VALID_POSITIVE_INTEGER: 'This field should be a valid positive integer',
    MAX_SAFE_INTEGER: `Maximum allowed value is ${Number.MAX_SAFE_INTEGER}`,
}

const MAX_DESCRIPTION_LENGTH = 300

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

export const validateRequiredPositiveNumber = (value: string | number): ValidationResponseType => {
    if (!value) {
        return {
            isValid: false,
            message: MESSAGES.PROVIDE_A_NUMBER,
        }
    }

    // TODO: Look if regex is available for this, since 0002 is not a valid number
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

export const validatePositiveInteger = (value: string | number): ValidationResponseType => {
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
