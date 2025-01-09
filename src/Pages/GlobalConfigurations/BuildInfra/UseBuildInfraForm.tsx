import { FormEvent, useEffect, useState } from 'react'
import { logExceptionToSentry, showError, useAsync } from '@Common/Helper'
import {
    ACTION_TO_PERSISTED_VALUE_MAP,
    BUILD_INFRA_DEFAULT_PLATFORM_NAME,
    BUILD_INFRA_INHERIT_ACTIONS,
    BUILD_INFRA_INPUT_CONSTRAINTS,
    BUILD_INFRA_LOCATOR_CONFIG_TYPES_MAP,
    BUILD_INFRA_TEXT,
    BuildInfraCMCSValueType,
    BuildInfraConfigTypes,
    BuildInfraConfigurationMapType,
    BuildInfraConfigurationType,
    BuildInfraMetaConfigTypes,
    BuildInfraNodeSelectorValueType,
    BuildInfraProfileAdditionalErrorKeysType,
    BuildInfraProfileData,
    BuildInfraProfileInputActionType,
    BuildInfraToleranceOperatorType,
    BuildInfraToleranceValueType,
    CM_SECRET_COMPONENT_TYPE_TO_INFRA_CONFIG_MAP,
    CREATE_MODE_REQUIRED_INPUT_FIELDS,
    DEFAULT_PROFILE_NAME,
    DEFAULT_TOLERANCE_EFFECT,
    DEFAULT_TOLERANCE_OPERATOR,
    getBuildInfraProfileByName,
    HandleProfileInputChangeType,
    NodeSelectorHeaderType,
    OverrideMergeStrategyType,
    PROFILE_INPUT_ERROR_FIELDS,
    ProfileInputErrorType,
    TARGET_PLATFORM_ERROR_FIELDS_MAP,
    ToleranceHeaderType,
    upsertBuildInfraProfile,
    UseBuildInfraFormProps,
    UseBuildInfraFormResponseType,
    ValidateNodeSelectorParamsType,
    ValidateRequestLimitResponseType,
    ValidateRequestLimitType,
} from '@Pages/index'
import {
    requiredField,
    validateDescription,
    validateLabelKey,
    validateName,
    validateRequiredPositiveInteger,
    validateRequiredPositiveNumber,
    validateStringLength,
    ValidationResponseType,
} from '@Shared/validations'
import {
    CM_SECRET_STATE,
    getConfigMapSecretFormInitialValues,
    getUniqueId,
    ToastManager,
    ToastVariantType,
} from '@Shared/index'
import { PATTERNS } from '@Common/Constants'

// TODO: Move validators out of this file

const getInitialProfileInputErrors = (fromCreateView: boolean): ProfileInputErrorType => {
    const initialProfileInputErrors = structuredClone(PROFILE_INPUT_ERROR_FIELDS)
    if (fromCreateView) {
        CREATE_MODE_REQUIRED_INPUT_FIELDS.forEach((field) => {
            initialProfileInputErrors[field] = ''
        })
        return initialProfileInputErrors
    }

    return initialProfileInputErrors
}

/**
 * @description A valid platform name should not be empty and be less than 128 characters. Plus profile can not have duplicate platform names
 */
const validateTargetPlatformName = (name: string, platformMap: Record<string, unknown>): ValidationResponseType => {
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

const validateLabelValue = (value?: string): Pick<ValidationResponseType, 'isValid'> & { messages: string[] } => {
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

const validateRequestLimit = ({
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

const validateNodeSelector = ({
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

const useBuildInfraForm = ({
    name,
    editProfile,
    handleSuccessRedirection,
    canConfigureUseK8sDriver = false,
}: UseBuildInfraFormProps): UseBuildInfraFormResponseType => {
    const fromCreateView = !name

    const [isLoading, profileResponse, responseError, reloadRequest] = useAsync(
        () =>
            getBuildInfraProfileByName({
                name: name ?? DEFAULT_PROFILE_NAME,
                fromCreateView,
                canConfigureUseK8sDriver,
            }),
        [name],
    )
    // If configuration is existing and is active then use it else use default from profileResponse
    const [profileInput, setProfileInput] = useState<BuildInfraProfileData>(null)
    const [profileInputErrors, setProfileInputErrors] = useState<ProfileInputErrorType>(
        structuredClone(PROFILE_INPUT_ERROR_FIELDS),
    )
    const [loadingActionRequest, setLoadingActionRequest] = useState<boolean>(false)

    useEffect(() => {
        if (!isLoading && profileResponse?.configurationUnits && profileResponse?.profile) {
            setProfileInput({
                ...profileResponse.profile,
            })

            setProfileInputErrors(getInitialProfileInputErrors(fromCreateView))
        }
    }, [profileResponse, isLoading])

    const getReservedPlatformNameMap = (currentInputConfigurations: Record<string, unknown>): Record<string, true> => {
        const currentConfigPlatforms = Object.keys(currentInputConfigurations || {})
        const originalConfigPlatforms = Object.keys(profileResponse?.profile?.configurations || {})

        return currentConfigPlatforms
            .concat(originalConfigPlatforms)
            .reduce<Record<string, true>>((acc, platformName) => {
                acc[platformName] = true
                return acc
            }, {})
    }

    // NOTE: Currently sending and receiving values as string, but will parse it to number for payload
    const handleProfileInputChange = ({ action, data }: HandleProfileInputChangeType) => {
        const currentInput = structuredClone(profileInput)
        const currentInputErrors = structuredClone(profileInputErrors)
        const targetPlatform =
            data && 'targetPlatform' in data && Object.hasOwn(data, 'targetPlatform') ? data.targetPlatform : ''
        const currentConfiguration = currentInput.configurations[targetPlatform]
        const lastSavedConfiguration = profileResponse.profile.configurations[targetPlatform] || currentConfiguration

        switch (action) {
            case BuildInfraProfileInputActionType.TOGGLE_USE_K8S_DRIVER: {
                currentInput.useK8sDriver = !currentInput.useK8sDriver
                break
            }

            case BuildInfraMetaConfigTypes.DESCRIPTION: {
                const { value } = data
                currentInput.description = value
                currentInputErrors[BuildInfraMetaConfigTypes.DESCRIPTION] = validateDescription(value).message
                break
            }

            case BuildInfraMetaConfigTypes.NAME: {
                const { value } = data
                currentInput.name = value
                currentInputErrors[BuildInfraMetaConfigTypes.NAME] = validateName(value).message
                break
            }

            case BuildInfraConfigTypes.CPU_LIMIT:
            case BuildInfraConfigTypes.CPU_REQUEST:
            case BuildInfraConfigTypes.MEMORY_LIMIT:
            case BuildInfraConfigTypes.MEMORY_REQUEST: {
                const { value, unit } = data

                currentConfiguration[action] = {
                    ...currentConfiguration[action],
                    key: action,
                    value,
                    unit,
                }

                const { keyToPersist, keyToPersistConfigType } = ACTION_TO_PERSISTED_VALUE_MAP[action]

                const { request, limit } = validateRequestLimit({
                    request: {
                        value,
                        unit,
                    },
                    limit: {
                        value,
                        unit,
                    },
                    [keyToPersist]: {
                        value: currentConfiguration[keyToPersistConfigType].value,
                        unit: currentConfiguration[keyToPersistConfigType].unit,
                    },
                    unitsMap: profileResponse.configurationUnits[action],
                })

                if (keyToPersist === 'limit') {
                    currentInputErrors[keyToPersistConfigType] = limit.message
                    currentInputErrors[action] = request.message
                    break
                }

                currentInputErrors[action] = limit.message
                currentInputErrors[keyToPersistConfigType] = request.message
                break
            }

            case BuildInfraConfigTypes.BUILD_TIMEOUT: {
                const { value, unit } = data

                currentConfiguration[action] = {
                    ...currentConfiguration[action],
                    key: action,
                    value,
                    unit,
                }

                currentInputErrors[action] = validateRequiredPositiveInteger(value).message
                break
            }

            case 'activate_tolerance':
            case 'activate_node selector':
            case 'activate_timeout':
            case 'activate_memory':
            case 'activate_cpu': {
                const locator = BUILD_INFRA_INHERIT_ACTIONS[action]
                const infraConfigTypes = BUILD_INFRA_LOCATOR_CONFIG_TYPES_MAP[locator]

                infraConfigTypes?.forEach((infraConfigType) => {
                    currentConfiguration[infraConfigType] = {
                        ...lastSavedConfiguration[infraConfigType],
                        active: true,
                    }

                    currentInputErrors[infraConfigType] = null
                })
                break
            }

            case 'de_activate_tolerance':
            case 'de_activate_node selector':
            case 'de_activate_memory':
            case 'de_activate_timeout':
            case 'de_activate_cpu': {
                const locator = BUILD_INFRA_INHERIT_ACTIONS[action]
                const infraConfigTypes = BUILD_INFRA_LOCATOR_CONFIG_TYPES_MAP[locator]

                infraConfigTypes?.forEach((infraConfigType) => {
                    currentConfiguration[infraConfigType] = {
                        ...currentConfiguration[infraConfigType],
                        ...lastSavedConfiguration[infraConfigType]?.defaultValue,
                        active: false,
                    } as BuildInfraConfigurationType

                    currentInputErrors[infraConfigType] = null
                })

                break
            }

            case 'activate_cm':
            case 'activate_cs': {
                const { id, componentType } = data
                // Would just convert isOverridden to true and replace value with default value
                const cmSecretValue = currentConfiguration[CM_SECRET_COMPONENT_TYPE_TO_INFRA_CONFIG_MAP[componentType]]
                    .value as BuildInfraCMCSValueType[]
                const selectedCMCSIndex = cmSecretValue.findIndex((configMapItem) => configMapItem.id === id)

                if (selectedCMCSIndex === -1 || !cmSecretValue[selectedCMCSIndex].canOverride) {
                    ToastManager.showToast({
                        variant: ToastVariantType.error,
                        description: 'Unable to customize this CM/CS',
                    })

                    logExceptionToSentry(new Error('Unable to customize this CM/CS'))
                    return
                }

                cmSecretValue[selectedCMCSIndex].isOverridden = true
                cmSecretValue[selectedCMCSIndex] = {
                    ...cmSecretValue[selectedCMCSIndex],
                    ...cmSecretValue[selectedCMCSIndex].defaultValue,
                }

                // Will remove error if present
                if (currentInputErrors[CM_SECRET_COMPONENT_TYPE_TO_INFRA_CONFIG_MAP[componentType]]) {
                    delete currentInputErrors[CM_SECRET_COMPONENT_TYPE_TO_INFRA_CONFIG_MAP[componentType]][id]

                    if (
                        Object.keys(currentInputErrors[CM_SECRET_COMPONENT_TYPE_TO_INFRA_CONFIG_MAP[componentType]])
                            .length === 0
                    ) {
                        currentInputErrors[CM_SECRET_COMPONENT_TYPE_TO_INFRA_CONFIG_MAP[componentType]] = null
                    }
                }

                break
            }

            case 'de_activate_cm':
            case 'de_activate_cs': {
                const { id, componentType } = data
                // Would just convert isOverridden to true and replace value with default value
                const cmSecretValue = currentConfiguration[CM_SECRET_COMPONENT_TYPE_TO_INFRA_CONFIG_MAP[componentType]]
                    .value as BuildInfraCMCSValueType[]
                const selectedCMCSIndex = cmSecretValue.findIndex((configMapItem) => configMapItem.id === id)

                if (selectedCMCSIndex === -1 || !cmSecretValue[selectedCMCSIndex].canOverride) {
                    ToastManager.showToast({
                        variant: ToastVariantType.error,
                        description: 'Unable to customize this CM/CS',
                    })

                    logExceptionToSentry(new Error('Unable to customize this CM/CS'))
                    return
                }

                // TODO: Only this is diff should combine
                cmSecretValue[selectedCMCSIndex].isOverridden = false
                cmSecretValue[selectedCMCSIndex] = {
                    ...cmSecretValue[selectedCMCSIndex],
                    ...cmSecretValue[selectedCMCSIndex].defaultValue,
                }

                // Will remove error if present
                if (currentInputErrors[CM_SECRET_COMPONENT_TYPE_TO_INFRA_CONFIG_MAP[componentType]]) {
                    delete currentInputErrors[CM_SECRET_COMPONENT_TYPE_TO_INFRA_CONFIG_MAP[componentType]][id]

                    if (
                        Object.keys(currentInputErrors[CM_SECRET_COMPONENT_TYPE_TO_INFRA_CONFIG_MAP[componentType]])
                            .length === 0
                    ) {
                        currentInputErrors[CM_SECRET_COMPONENT_TYPE_TO_INFRA_CONFIG_MAP[componentType]] = null
                    }
                }

                break
            }

            case BuildInfraProfileInputActionType.ADD_TARGET_PLATFORM: {
                // If no target platform is given error will be '' so that we won;t show error but capture it
                currentInputErrors[BuildInfraProfileAdditionalErrorKeysType.TARGET_PLATFORM] = !targetPlatform
                    ? ''
                    : validateTargetPlatformName(
                          targetPlatform,
                          getReservedPlatformNameMap(currentInput.configurations),
                      ).message

                currentInput.configurations[targetPlatform] =
                    profileResponse.fallbackPlatformConfigurationMap[targetPlatform] ||
                    // Here need to update target platform name for each configuration
                    Object.entries(
                        profileResponse.fallbackPlatformConfigurationMap[BUILD_INFRA_DEFAULT_PLATFORM_NAME],
                    ).reduce<BuildInfraConfigurationMapType>((acc, [configKey, configValue]) => {
                        acc[configKey as BuildInfraConfigTypes] = {
                            ...configValue,
                            targetPlatform,
                        }

                        return acc
                    }, {} as BuildInfraConfigurationMapType)
                break
            }

            case BuildInfraProfileInputActionType.REMOVE_TARGET_PLATFORM: {
                if (!currentInput.configurations[targetPlatform]) {
                    ToastManager.showToast({
                        variant: ToastVariantType.error,
                        description: 'Platform does not exist',
                    })

                    logExceptionToSentry(new Error('Platform does not exist'))
                    return
                }

                delete currentInput.configurations[targetPlatform]

                Object.keys(currentInputErrors).forEach((key) => {
                    if (TARGET_PLATFORM_ERROR_FIELDS_MAP[key]) {
                        currentInputErrors[key] = null
                    }
                })
                break
            }

            case BuildInfraProfileInputActionType.RENAME_TARGET_PLATFORM: {
                const { originalPlatformName, newPlatformName, configSnapshot } = data
                const originalPlatformConfig = currentInput.configurations[originalPlatformName]

                if (originalPlatformName === newPlatformName) {
                    return
                }

                if (!originalPlatformConfig) {
                    ToastManager.showToast({
                        variant: ToastVariantType.error,
                        description: 'Original platform does not exist',
                    })
                    return
                }

                currentInputErrors[BuildInfraProfileAdditionalErrorKeysType.TARGET_PLATFORM] =
                    validateTargetPlatformName(
                        newPlatformName,
                        getReservedPlatformNameMap(currentInput.configurations),
                    ).message

                const newPlatformFallbackConfig =
                    profileResponse.fallbackPlatformConfigurationMap[newPlatformName] ||
                    // Ideally should update targetPlatform for each configuration here itself but since we iterating over it again, we will do it there
                    profileResponse.fallbackPlatformConfigurationMap[BUILD_INFRA_DEFAULT_PLATFORM_NAME]

                // Will replace targetPlatform, defaultValue along with current value if active is false
                currentInput.configurations[newPlatformName] = Object.entries(
                    originalPlatformConfig,
                ).reduce<BuildInfraConfigurationMapType>(
                    (acc, [configKey, configValue]: [BuildInfraConfigTypes, BuildInfraConfigurationType]) => {
                        // Would be null incase of not supported by buildX
                        const newDefaultValue = newPlatformFallbackConfig[configKey]?.defaultValue
                        const newConfigValues = configValue?.active ? {} : newDefaultValue

                        acc[configKey] = {
                            ...configValue,
                            ...newConfigValues,
                            targetPlatform: newPlatformName,
                            defaultValue: newDefaultValue,
                        }

                        return acc
                    },
                    {} as BuildInfraConfigurationMapType,
                )

                // If original platform is present in snapshot we will restore it
                if (configSnapshot[originalPlatformName]) {
                    currentInput.configurations[originalPlatformName] = configSnapshot[originalPlatformName]
                    break
                }

                delete currentInput.configurations[originalPlatformName]
                break
            }

            case BuildInfraProfileInputActionType.ADD_NODE_SELECTOR_ITEM: {
                if (
                    currentConfiguration[BuildInfraConfigTypes.NODE_SELECTOR].key !==
                    BuildInfraConfigTypes.NODE_SELECTOR
                ) {
                    break
                }

                const id = getUniqueId()
                const newSelector: BuildInfraNodeSelectorValueType = {
                    id,
                    key: '',
                    value: '',
                }

                currentConfiguration[BuildInfraConfigTypes.NODE_SELECTOR].value.unshift(newSelector)
                break
            }

            case BuildInfraProfileInputActionType.DELETE_NODE_SELECTOR_ITEM: {
                if (
                    currentConfiguration[BuildInfraConfigTypes.NODE_SELECTOR].key !==
                    BuildInfraConfigTypes.NODE_SELECTOR
                ) {
                    break
                }

                const { id } = data
                currentConfiguration[BuildInfraConfigTypes.NODE_SELECTOR].value = currentConfiguration[
                    BuildInfraConfigTypes.NODE_SELECTOR
                ].value.filter((nodeSelector) => nodeSelector.id !== id)

                delete currentInputErrors[BuildInfraConfigTypes.NODE_SELECTOR]?.[id]

                if (Object.keys(currentInputErrors[BuildInfraConfigTypes.NODE_SELECTOR] || {}).length === 0) {
                    currentInputErrors[BuildInfraConfigTypes.NODE_SELECTOR] = null
                }

                // Will validate all the keys since checking duplicates
                const existingKeys = currentConfiguration[BuildInfraConfigTypes.NODE_SELECTOR].value.map(
                    (selector) => selector.key,
                )

                currentConfiguration[BuildInfraConfigTypes.NODE_SELECTOR].value.forEach((selector) => {
                    validateNodeSelector({
                        selector,
                        existingKeys,
                        profileInputErrors: currentInputErrors,
                    })
                })

                break
            }

            case BuildInfraProfileInputActionType.EDIT_NODE_SELECTOR_ITEM: {
                if (
                    currentConfiguration[BuildInfraConfigTypes.NODE_SELECTOR].key !==
                    BuildInfraConfigTypes.NODE_SELECTOR
                ) {
                    break
                }

                const { id, key, value } = data

                const nodeSelector = currentConfiguration[BuildInfraConfigTypes.NODE_SELECTOR].value.find(
                    (selector) => selector.id === id,
                )

                if (!nodeSelector) {
                    currentConfiguration[BuildInfraConfigTypes.NODE_SELECTOR].value.unshift({
                        id,
                        key,
                        value,
                    })
                } else {
                    nodeSelector.key = key
                    nodeSelector.value = value
                }

                // Will validate all the keys since checking duplicates
                const existingKeys = currentConfiguration[BuildInfraConfigTypes.NODE_SELECTOR].value.map(
                    (selector) => selector.key,
                )

                currentConfiguration[BuildInfraConfigTypes.NODE_SELECTOR].value.forEach((selector) => {
                    validateNodeSelector({
                        selector,
                        existingKeys,
                        profileInputErrors: currentInputErrors,
                    })
                })
                break
            }

            case BuildInfraProfileInputActionType.ADD_TOLERANCE_ITEM: {
                if (currentConfiguration[BuildInfraConfigTypes.TOLERANCE].key !== BuildInfraConfigTypes.TOLERANCE) {
                    break
                }

                const id = getUniqueId()

                const newToleranceItem: BuildInfraToleranceValueType = {
                    id,
                    key: '',
                    effect: DEFAULT_TOLERANCE_EFFECT,
                    operator: DEFAULT_TOLERANCE_OPERATOR,
                    value: '',
                }

                currentConfiguration[BuildInfraConfigTypes.TOLERANCE].value.unshift(newToleranceItem)
                break
            }

            case BuildInfraProfileInputActionType.DELETE_TOLERANCE_ITEM: {
                if (currentConfiguration[BuildInfraConfigTypes.TOLERANCE].key !== BuildInfraConfigTypes.TOLERANCE) {
                    break
                }

                const { id } = data
                currentConfiguration[BuildInfraConfigTypes.TOLERANCE].value = currentConfiguration[
                    BuildInfraConfigTypes.TOLERANCE
                ].value.filter((toleranceItem) => toleranceItem.id !== id)

                delete currentInputErrors[BuildInfraConfigTypes.TOLERANCE]?.[id]

                if (Object.keys(currentInputErrors[BuildInfraConfigTypes.TOLERANCE] || {}).length === 0) {
                    currentInputErrors[BuildInfraConfigTypes.TOLERANCE] = null
                }
                break
            }

            case BuildInfraProfileInputActionType.EDIT_TOLERANCE_ITEM: {
                if (currentConfiguration[BuildInfraConfigTypes.TOLERANCE].key !== BuildInfraConfigTypes.TOLERANCE) {
                    break
                }

                const { id, key, effect, operator, value } = data
                const toleranceItem = currentConfiguration[BuildInfraConfigTypes.TOLERANCE].value.find(
                    (tolerance) => tolerance.id === id,
                )

                if (!toleranceItem) {
                    currentConfiguration[BuildInfraConfigTypes.TOLERANCE].value.unshift({
                        id,
                        key,
                        effect,
                        operator,
                        value,
                    } as BuildInfraToleranceValueType)
                } else {
                    toleranceItem.key = key
                    toleranceItem.effect = effect
                    toleranceItem.operator = operator
                    toleranceItem.value = value

                    if (operator === BuildInfraToleranceOperatorType.EXISTS) {
                        delete toleranceItem.value
                    }
                }

                const keyErrorMessages = validateLabelKey(key).messages
                const valueErrorMessages =
                    operator !== BuildInfraToleranceOperatorType.EXISTS ? validateLabelValue(value).messages : []

                const isEmptyRow = operator === BuildInfraToleranceOperatorType.EXISTS ? !key : !key && !value
                const hasError = !isEmptyRow && (keyErrorMessages.length > 0 || valueErrorMessages.length > 0)

                if (!currentInputErrors[BuildInfraConfigTypes.TOLERANCE]?.[id]) {
                    if (!currentInputErrors[BuildInfraConfigTypes.TOLERANCE]) {
                        currentInputErrors[BuildInfraConfigTypes.TOLERANCE] = {}
                    }

                    currentInputErrors[BuildInfraConfigTypes.TOLERANCE][id] = {}
                }

                currentInputErrors[BuildInfraConfigTypes.TOLERANCE][id] = {
                    ...(keyErrorMessages.length > 0 && { [ToleranceHeaderType.KEY]: keyErrorMessages }),
                    ...(valueErrorMessages.length > 0 && { [ToleranceHeaderType.VALUE]: valueErrorMessages }),
                }

                if (!hasError) {
                    // Would delete id, and if not key left then delete key
                    delete currentInputErrors[BuildInfraConfigTypes.TOLERANCE][id]
                    if (Object.keys(currentInputErrors[BuildInfraConfigTypes.TOLERANCE]).length === 0) {
                        currentInputErrors[BuildInfraConfigTypes.TOLERANCE] = null
                    }
                }

                break
            }

            // TODO: Check error scenario here
            case BuildInfraProfileInputActionType.ADD_CM_CS_ITEM: {
                const { id, componentType } = data

                const cmSecretData = getConfigMapSecretFormInitialValues({
                    configMapSecretData: null,
                    componentType,
                    // TODO: Check something related to decode in secureValues
                    cmSecretStateLabel: CM_SECRET_STATE.BASE,
                    isJob: true,
                    // FIXME: Can delete as well
                    fallbackMergeStrategy: OverrideMergeStrategyType.REPLACE,
                })

                const finalValue: BuildInfraCMCSValueType = {
                    ...cmSecretData,
                    id,
                    isOverridden: true,
                    canOverride: false,
                    initialResponse: null,
                    defaultValue: null,
                }

                ;(
                    currentConfiguration[CM_SECRET_COMPONENT_TYPE_TO_INFRA_CONFIG_MAP[componentType]]
                        .value as BuildInfraCMCSValueType[]
                ).push(finalValue)
                break
            }

            case BuildInfraProfileInputActionType.SYNC_CM_CS_ITEM: {
                const { id, value, errors, componentType } = data

                const selectedCMCSIndex = (
                    currentConfiguration[CM_SECRET_COMPONENT_TYPE_TO_INFRA_CONFIG_MAP[componentType]]
                        .value as BuildInfraCMCSValueType[]
                ).findIndex((configMapItem) => configMapItem.id === id)

                if (selectedCMCSIndex === -1) {
                    ToastManager.showToast({
                        variant: ToastVariantType.error,
                        description: 'ConfigMap does not exist',
                    })

                    logExceptionToSentry(new Error('ConfigMap does not exist'))
                    return
                }

                const finalCMValue: BuildInfraCMCSValueType = {
                    ...(
                        currentConfiguration[CM_SECRET_COMPONENT_TYPE_TO_INFRA_CONFIG_MAP[componentType]]
                            .value as BuildInfraCMCSValueType[]
                    )[selectedCMCSIndex],
                    ...value,
                }

                currentConfiguration[CM_SECRET_COMPONENT_TYPE_TO_INFRA_CONFIG_MAP[componentType]].value[
                    selectedCMCSIndex
                ] = finalCMValue
                // TODO: Confirm once if its correct does useForm handle nested objects?
                const isAnyErrorPresent = errors && Object.keys(errors).some((key) => errors[key])

                if (!currentInputErrors[CM_SECRET_COMPONENT_TYPE_TO_INFRA_CONFIG_MAP[componentType]]) {
                    currentInputErrors[CM_SECRET_COMPONENT_TYPE_TO_INFRA_CONFIG_MAP[componentType]] = {}
                }

                if (isAnyErrorPresent) {
                    currentInputErrors[CM_SECRET_COMPONENT_TYPE_TO_INFRA_CONFIG_MAP[componentType]][id] = errors
                } else if (currentInputErrors[CM_SECRET_COMPONENT_TYPE_TO_INFRA_CONFIG_MAP[componentType]][id]) {
                    delete currentInputErrors[CM_SECRET_COMPONENT_TYPE_TO_INFRA_CONFIG_MAP[componentType]][id]
                }

                const errorKeys = Object.keys(
                    currentInputErrors[CM_SECRET_COMPONENT_TYPE_TO_INFRA_CONFIG_MAP[componentType]],
                )
                if (errorKeys.length === 0) {
                    currentInputErrors[CM_SECRET_COMPONENT_TYPE_TO_INFRA_CONFIG_MAP[componentType]] = null
                }

                break
            }

            case BuildInfraProfileInputActionType.DELETE_CM_CS_ITEM: {
                const { id, componentType } = data

                const finalCMCSValueList = (
                    currentConfiguration[CM_SECRET_COMPONENT_TYPE_TO_INFRA_CONFIG_MAP[componentType]]
                        .value as BuildInfraCMCSValueType[]
                ).filter((configMapItem) => configMapItem.id !== id)

                currentConfiguration[CM_SECRET_COMPONENT_TYPE_TO_INFRA_CONFIG_MAP[componentType]].value =
                    finalCMCSValueList

                if (currentInputErrors[CM_SECRET_COMPONENT_TYPE_TO_INFRA_CONFIG_MAP[componentType]]) {
                    delete currentInputErrors[CM_SECRET_COMPONENT_TYPE_TO_INFRA_CONFIG_MAP[componentType]][id]

                    if (
                        Object.keys(currentInputErrors[CM_SECRET_COMPONENT_TYPE_TO_INFRA_CONFIG_MAP[componentType]])
                            .length === 0
                    ) {
                        currentInputErrors[CM_SECRET_COMPONENT_TYPE_TO_INFRA_CONFIG_MAP[componentType]] = null
                    }
                }

                break
            }

            default:
                break
        }

        setProfileInput(currentInput)
        setProfileInputErrors(currentInputErrors)
    }

    const handleSubmit = async (event?: FormEvent<HTMLFormElement>) => {
        event?.preventDefault()
        // Since considering '' as a valid error message
        const hasErrors =
            Object.keys(profileInputErrors).filter(
                (item) => profileInputErrors[item] !== null && profileInputErrors[item] !== undefined,
            ).length > 0

        if (hasErrors) {
            ToastManager.showToast({
                variant: ToastVariantType.error,
                description: BUILD_INFRA_TEXT.INVALID_FORM_MESSAGE,
            })
            return
        }

        setLoadingActionRequest(true)
        try {
            await upsertBuildInfraProfile({
                name,
                profileInput,
                canConfigureUseK8sDriver,
            })
            setLoadingActionRequest(false)
            ToastManager.showToast({
                variant: ToastVariantType.success,
                description: BUILD_INFRA_TEXT.getSubmitSuccessMessage(profileInput.name, editProfile),
            })

            if (handleSuccessRedirection) {
                handleSuccessRedirection()
            } else {
                reloadRequest()
            }
        } catch (err) {
            showError(err)
            setLoadingActionRequest(false)
        }
    }

    return {
        isLoading,
        profileResponse,
        responseError,
        reloadRequest,
        profileInput,
        profileInputErrors,
        handleProfileInputChange,
        loadingActionRequest,
        handleSubmit,
    }
}

export default useBuildInfraForm
