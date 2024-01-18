export interface ValidationResponseType {
    isValid: boolean
    message?: string
}

export const validateName = (name: string): ValidationResponseType => {
    if (!/^.{3,50}$/.test(name)) {
        return {
            isValid: false,
            message: 'Minimum 3 and maximum 50 characters allowed',
        }
    }

    if (!/^[a-z0-9-._]+$/.test(name)) {
        return {
            isValid: false,
            message: 'Only lowercase alphanumeric characters, -, _ or . allowed',
        }
    }

    if (!/^(?![-._]).*[^-._]$/.test(name)) {
        return {
            isValid: false,
            message: 'Cannot start/end with -, _ or .',
        }
    }

    return {
        isValid: true,
    }
}

export const validateDescription = (description: string): ValidationResponseType => {
    if (description?.length > 300) {
        return {
            isValid: false,
            message: 'Maximum 300 characters are allowed',
        }
    }

    return {
        isValid: true,
    }
}

export const validateRequiredPositiveNumber = (value: string | Number): ValidationResponseType => {
    if (!value) {
        return {
            isValid: false,
            message: 'This field is required',
        }
    }

    // TODO: Look if regex is available for this, since 0002 is not a valid number
    if (!/^\d+(\.\d+)?$/.test(value.toString())) {
        return {
            isValid: false,
            message: 'This field should be a valid positive number',
        }
    }

    if (Number(value) < 0) {
        return {
            isValid: false,
            message: 'Only positive numbers are allowed',
        }
    }

    return {
        isValid: true,
    }
}
