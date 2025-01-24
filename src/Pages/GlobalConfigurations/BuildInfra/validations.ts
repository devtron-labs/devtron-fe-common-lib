import { PATTERNS } from '@Common/Constants'
import {
    BUILD_INFRA_INPUT_CONSTRAINTS,
    BUILD_INFRA_TEXT,
    BuildInfraConfigTypes,
    NodeSelectorHeaderType,
    ValidateNodeSelectorParamsType,
    ValidateRequestLimitResponseType,
    ValidateRequestLimitType,
} from '@Pages/index'
import {
    requiredField,
    validateLabelKey,
    validateRequiredPositiveNumber,
    validateStringLength,
    ValidationResponseType,
} from '@Shared/validations'

/**
 * @description A valid platform name should not be empty and be less than 128 characters. Plus profile can not have duplicate platform names
 */
export const validateTargetPlatformName = (
    name: string,
    platformMap: Record<string, unknown>,
): ValidationResponseType => {
    const requiredValidation = requiredField(name)
    if (!requiredValidation.isValid) {
        return requiredValidation
    }

    const lengthValidation = validateStringLength(name, 50, 1)
    if (!lengthValidation.isValid) {
        return lengthValidation
    }

    if (platformMap[name]) {
        return {
            isValid: false,
            message: 'Configuration is already defined for this platform. Try different platform.',
        }
    }

    return {
        isValid: true,
    }
}

export const validateLabelValue = (
    value?: string,
): Pick<ValidationResponseType, 'isValid'> & { messages: string[] } => {
    if (!value) {
        return {
            isValid: false,
            messages: ['Value is required'],
        }
    }

    const messages: string[] = []

    if (value.length >= BUILD_INFRA_INPUT_CONSTRAINTS.MAX_LABEL_VALUE_LENGTH) {
        messages.push(`Value should be less than ${BUILD_INFRA_INPUT_CONSTRAINTS.MAX_LABEL_VALUE_LENGTH} characters`)
    }

    const firstLastAlphanumeric = PATTERNS.START_END_ALPHANUMERIC.test(value)
    if (!firstLastAlphanumeric) {
        messages.push('Value should start and end with alphanumeric characters')
    }

    const validValue = PATTERNS.ALPHANUMERIC_WITH_SPECIAL_CHAR.test(value)
    if (!validValue) {
        messages.push('Value should contain only alphanumeric characters and special characters')
    }

    if (messages.length > 0) {
        return {
            isValid: false,
            messages,
        }
    }

    return {
        isValid: true,
        messages: [],
    }
}

const validateLabelKeyWithNoDuplicates = (
    key: string,
    existingKeys: string[],
): Pick<ValidationResponseType, 'isValid'> & { messages: string[] } => {
    const existingValidations = validateLabelKey(key, false)
    if (!existingValidations.isValid) {
        return existingValidations
    }

    // existing keys would include the key itself
    const keyCount = existingKeys.filter((existingKey) => existingKey === key).length

    if (keyCount > 1) {
        return {
            isValid: false,
            messages: ['Key should be unique'],
        }
    }

    return {
        isValid: true,
        messages: [],
    }
}

export const validateRequestLimit = ({
    request,
    limit,
    unitsMap,
}: ValidateRequestLimitType): ValidateRequestLimitResponseType => {
    // Request <= Limit
    // Request and Limit should be numbers can be decimals
    // Request and Limit should be positive numbers
    // Request and Limit should be less than Number.MAX_SAFE_INTEGER
    // Request and Limit should can have at most BUILD_INFRA_INPUT_CONSTRAINTS.DECIMAL_PLACES
    // Both request and limit should be there
    const requestNumber = Number(request.value)
    const limitNumber = Number(limit.value)
    const requestUnit = Number(unitsMap[request.unit]?.conversionFactor)
    const limitUnit = Number(unitsMap[limit.unit]?.conversionFactor)

    const requestLimitValidationResponse: ValidateRequestLimitResponseType = {
        request: {
            isValid: true,
        },
        limit: {
            isValid: true,
        },
    }

    const requestValidationMessage = validateRequiredPositiveNumber(request.value).message
    const limitValidationMessage = validateRequiredPositiveNumber(limit.value).message

    if (requestValidationMessage) {
        requestLimitValidationResponse.request = {
            message: requestValidationMessage,
            isValid: false,
        }
    }

    if (limitValidationMessage) {
        requestLimitValidationResponse.limit = {
            message: limitValidationMessage,
            isValid: false,
        }
    }

    if (limitValidationMessage || requestValidationMessage) {
        return requestLimitValidationResponse
    }

    // only two decimal places are allowed
    const requestDecimalPlaces = String(request.value).split('.')[1]?.length ?? 0
    const limitDecimalPlaces = String(limit.value).split('.')[1]?.length ?? 0

    if (requestDecimalPlaces > BUILD_INFRA_INPUT_CONSTRAINTS.DECIMAL_PLACES) {
        requestLimitValidationResponse.request = {
            message: BUILD_INFRA_TEXT.VALIDATE_REQUEST_LIMIT.REQUEST_DECIMAL_PLACES,
            isValid: false,
        }

        return requestLimitValidationResponse
    }
    if (limitDecimalPlaces > BUILD_INFRA_INPUT_CONSTRAINTS.DECIMAL_PLACES) {
        requestLimitValidationResponse.limit = {
            message: BUILD_INFRA_TEXT.VALIDATE_REQUEST_LIMIT.LIMIT_DECIMAL_PLACES,
            isValid: false,
        }

        return requestLimitValidationResponse
    }

    // Assuming requestUnit and requestNumber are not 0
    const limitRequestUnitFactor = limitUnit / requestUnit
    const limitRequestFactor = limitNumber / requestNumber

    const isDifferenceComputable = limitRequestUnitFactor * limitRequestFactor <= Number.MAX_SAFE_INTEGER

    if (!isDifferenceComputable) {
        requestLimitValidationResponse.request = {
            message: BUILD_INFRA_TEXT.VALIDATE_REQUEST_LIMIT.CAN_NOT_COMPUTE,
            isValid: false,
        }

        return requestLimitValidationResponse
    }

    if (limitRequestUnitFactor * limitRequestFactor < 1) {
        requestLimitValidationResponse.request = {
            message: BUILD_INFRA_TEXT.VALIDATE_REQUEST_LIMIT.REQUEST_LESS_THAN_LIMIT,
            isValid: false,
        }

        return requestLimitValidationResponse
    }

    return requestLimitValidationResponse
}

export const validateNodeSelector = ({
    selector: { key, value, id },
    existingKeys,
    profileInputErrors: currentInputErrors,
}: ValidateNodeSelectorParamsType) => {
    const keyErrorMessages = validateLabelKeyWithNoDuplicates(key, existingKeys).messages
    const valueErrorMessages = validateLabelValue(value).messages

    const isEmptyRow = !key && !value
    const hasError = !isEmptyRow && (keyErrorMessages.length > 0 || valueErrorMessages.length > 0)

    if (!currentInputErrors[BuildInfraConfigTypes.NODE_SELECTOR]?.[id]) {
        if (!currentInputErrors[BuildInfraConfigTypes.NODE_SELECTOR]) {
            // eslint-disable-next-line no-param-reassign
            currentInputErrors[BuildInfraConfigTypes.NODE_SELECTOR] = {}
        }
        // eslint-disable-next-line no-param-reassign
        currentInputErrors[BuildInfraConfigTypes.NODE_SELECTOR][id] = {}
    }

    // eslint-disable-next-line no-param-reassign
    currentInputErrors[BuildInfraConfigTypes.NODE_SELECTOR][id] = {
        ...(keyErrorMessages.length > 0 && { [NodeSelectorHeaderType.KEY]: keyErrorMessages }),
        ...(valueErrorMessages.length > 0 && { [NodeSelectorHeaderType.VALUE]: valueErrorMessages }),
    }

    if (!hasError) {
        // Would delete id, and if not key left then delete key
        // eslint-disable-next-line no-param-reassign
        delete currentInputErrors[BuildInfraConfigTypes.NODE_SELECTOR][id]

        if (Object.keys(currentInputErrors[BuildInfraConfigTypes.NODE_SELECTOR]).length === 0) {
            // eslint-disable-next-line no-param-reassign
            currentInputErrors[BuildInfraConfigTypes.NODE_SELECTOR] = null
        }
    }
}
