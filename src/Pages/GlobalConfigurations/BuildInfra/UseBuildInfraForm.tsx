import { FormEvent, useEffect, useState } from 'react'
import { showError, useAsync } from '@Common/Helper'
import {
    BUILD_INFRA_DEFAULT_PLATFORM_NAME,
    BUILD_INFRA_INPUT_CONSTRAINTS,
    BUILD_INFRA_TEXT,
    BuildInfraConfigTypes,
    BuildInfraConfigurationMapType,
    BuildInfraConfigurationType,
    BuildInfraMetaConfigTypes,
    BuildInfraNodeSelectorValueType,
    BuildInfraProfileAdditionalErrorKeysType,
    BuildInfraProfileData,
    BuildInfraProfileInputActionType,
    BuildInfraToleranceEffectType,
    BuildInfraToleranceOperatorType,
    BuildInfraToleranceValueType,
    CREATE_MODE_REQUIRED_INPUT_FIELDS,
    createBuildInfraProfile,
    DEFAULT_PROFILE_NAME,
    getBuildInfraProfileByName,
    HandleProfileInputChangeType,
    NodeSelectorHeaderType,
    PROFILE_INPUT_ERROR_FIELDS,
    ProfileInputErrorType,
    TARGET_PLATFORM_ERROR_FIELDS_MAP,
    ToleranceHeaderType,
    updateBuildInfraProfile,
    UseBuildInfraFormProps,
    UseBuildInfraFormResponseType,
    ValidateRequestLimitResponseType,
    ValidateRequestLimitType,
    validateTargetPlatformName,
} from '@Pages/GlobalConfigurations/BuildInfra'
import {
    validateDescription,
    validateLabelKey,
    validateName,
    validateRequiredPositiveInteger,
    validateRequiredPositiveNumber,
    ValidationResponseType,
} from '@Shared/validations'
import { getUniqueId, ToastManager, ToastVariantType } from '@Shared/index'
import { PATTERNS } from '@Common/Constants'

const getInitialProfileInputErrors = (fromCreateView: boolean): ProfileInputErrorType => {
    if (fromCreateView) {
        const initialProfileInputErrors = { ...PROFILE_INPUT_ERROR_FIELDS }
        CREATE_MODE_REQUIRED_INPUT_FIELDS.forEach((field) => {
            initialProfileInputErrors[field] = ''
        })
        return initialProfileInputErrors
    }

    return {
        ...PROFILE_INPUT_ERROR_FIELDS,
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
    const existingValidations = validateLabelKey(key)
    if (!existingValidations.isValid) {
        return existingValidations
    }

    const isDuplicate = existingKeys.includes(key)
    if (isDuplicate) {
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

    const isDifferenceBigNumber = limitRequestUnitFactor * limitRequestFactor <= Number.MAX_SAFE_INTEGER

    if (!isDifferenceBigNumber) {
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

const useBuildInfraForm = ({
    name,
    editProfile,
    handleSuccessRedirection,
}: UseBuildInfraFormProps): UseBuildInfraFormResponseType => {
    const fromCreateView = !name

    const [isLoading, profileResponse, responseError, reloadRequest] = useAsync(
        () =>
            getBuildInfraProfileByName({
                name: name ?? DEFAULT_PROFILE_NAME,
                fromCreateView,
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

    // NOTE: Currently sending and receiving values as string, but will parse it to number for payload
    const handleProfileInputChange = ({ action, data }: HandleProfileInputChangeType) => {
        const currentInput = structuredClone(profileInput)
        const currentInputErrors = structuredClone(profileInputErrors)
        const targetPlatform =
            'targetPlatform' in data && Object.hasOwn(data, 'targetPlatform') ? data.targetPlatform : ''
        const currentConfiguration = currentInput.configurations[targetPlatform]
        const lastSavedConfiguration = profileResponse.profile.configurations[targetPlatform] || currentConfiguration

        switch (action) {
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

            case BuildInfraConfigTypes.CPU_LIMIT: {
                const { value, unit } = data

                currentConfiguration[BuildInfraConfigTypes.CPU_LIMIT] = {
                    ...currentConfiguration[BuildInfraConfigTypes.CPU_LIMIT],
                    key: BuildInfraConfigTypes.CPU_LIMIT,
                    value,
                    unit,
                }
                const { request, limit } = validateRequestLimit({
                    request: {
                        value: currentConfiguration[BuildInfraConfigTypes.CPU_REQUEST].value as number,
                        unit: currentConfiguration[BuildInfraConfigTypes.CPU_REQUEST].unit,
                    },
                    limit: {
                        value,
                        unit,
                    },
                    unitsMap: profileResponse.configurationUnits[BuildInfraConfigTypes.CPU_LIMIT],
                })

                currentInputErrors[BuildInfraConfigTypes.CPU_LIMIT] = limit.message
                currentInputErrors[BuildInfraConfigTypes.CPU_REQUEST] = request.message
                break
            }

            case BuildInfraConfigTypes.CPU_REQUEST: {
                const { value, unit } = data

                currentConfiguration[BuildInfraConfigTypes.CPU_REQUEST] = {
                    ...currentConfiguration[BuildInfraConfigTypes.CPU_REQUEST],
                    key: BuildInfraConfigTypes.CPU_REQUEST,
                    value,
                    unit,
                }

                const { request, limit } = validateRequestLimit({
                    request: {
                        value,
                        unit,
                    },
                    limit: {
                        value: currentConfiguration[BuildInfraConfigTypes.CPU_LIMIT].value as number,
                        unit: currentConfiguration[BuildInfraConfigTypes.CPU_LIMIT].unit,
                    },
                    unitsMap: profileResponse.configurationUnits[BuildInfraConfigTypes.CPU_LIMIT],
                })

                currentInputErrors[BuildInfraConfigTypes.CPU_LIMIT] = limit.message
                currentInputErrors[BuildInfraConfigTypes.CPU_REQUEST] = request.message
                break
            }

            case BuildInfraConfigTypes.MEMORY_LIMIT: {
                const { value, unit } = data

                currentConfiguration[BuildInfraConfigTypes.MEMORY_LIMIT] = {
                    ...currentConfiguration[BuildInfraConfigTypes.MEMORY_LIMIT],
                    key: BuildInfraConfigTypes.MEMORY_LIMIT,
                    value,
                    unit,
                }
                const { request, limit } = validateRequestLimit({
                    request: {
                        value: currentConfiguration[BuildInfraConfigTypes.MEMORY_REQUEST].value as number,
                        unit: currentConfiguration[BuildInfraConfigTypes.MEMORY_REQUEST].unit,
                    },
                    limit: {
                        value,
                        unit,
                    },
                    unitsMap: profileResponse.configurationUnits[BuildInfraConfigTypes.MEMORY_LIMIT],
                })

                currentInputErrors[BuildInfraConfigTypes.MEMORY_LIMIT] = limit.message
                currentInputErrors[BuildInfraConfigTypes.MEMORY_REQUEST] = request.message
                break
            }

            case BuildInfraConfigTypes.MEMORY_REQUEST: {
                const { value, unit } = data

                currentConfiguration[BuildInfraConfigTypes.MEMORY_REQUEST] = {
                    ...currentConfiguration[BuildInfraConfigTypes.MEMORY_REQUEST],
                    key: BuildInfraConfigTypes.MEMORY_REQUEST,
                    value,
                    unit,
                }
                const { request, limit } = validateRequestLimit({
                    request: {
                        value,
                        unit,
                    },
                    limit: {
                        value: currentConfiguration[BuildInfraConfigTypes.MEMORY_LIMIT].value as number,
                        unit: currentConfiguration[BuildInfraConfigTypes.MEMORY_LIMIT].unit,
                    },
                    unitsMap: profileResponse.configurationUnits[BuildInfraConfigTypes.MEMORY_LIMIT],
                })

                currentInputErrors[BuildInfraConfigTypes.MEMORY_LIMIT] = limit.message
                currentInputErrors[BuildInfraConfigTypes.MEMORY_REQUEST] = request.message
                break
            }

            case BuildInfraConfigTypes.BUILD_TIMEOUT: {
                const { value, unit } = data

                currentConfiguration[BuildInfraConfigTypes.BUILD_TIMEOUT] = {
                    ...currentConfiguration[BuildInfraConfigTypes.BUILD_TIMEOUT],
                    key: BuildInfraConfigTypes.BUILD_TIMEOUT,
                    value,
                    unit,
                }

                currentInputErrors[BuildInfraConfigTypes.BUILD_TIMEOUT] = validateRequiredPositiveInteger(value).message
                break
            }

            case 'activate_cpu':
                currentConfiguration[BuildInfraConfigTypes.CPU_LIMIT] = {
                    ...lastSavedConfiguration[BuildInfraConfigTypes.CPU_LIMIT],
                    active: true,
                }

                currentConfiguration[BuildInfraConfigTypes.CPU_REQUEST] = {
                    ...lastSavedConfiguration[BuildInfraConfigTypes.CPU_REQUEST],
                    active: true,
                }

                currentInputErrors[BuildInfraConfigTypes.CPU_LIMIT] = null
                currentInputErrors[BuildInfraConfigTypes.CPU_REQUEST] = null
                break

            case 'activate_memory':
                currentConfiguration[BuildInfraConfigTypes.MEMORY_LIMIT] = {
                    ...lastSavedConfiguration[BuildInfraConfigTypes.MEMORY_LIMIT],
                    active: true,
                }

                currentConfiguration[BuildInfraConfigTypes.MEMORY_REQUEST] = {
                    ...lastSavedConfiguration[BuildInfraConfigTypes.MEMORY_REQUEST],
                    active: true,
                }

                currentInputErrors[BuildInfraConfigTypes.MEMORY_LIMIT] = null
                currentInputErrors[BuildInfraConfigTypes.MEMORY_REQUEST] = null
                break

            case 'activate_timeout':
                currentConfiguration[BuildInfraConfigTypes.BUILD_TIMEOUT] = {
                    ...lastSavedConfiguration[BuildInfraConfigTypes.BUILD_TIMEOUT],
                    active: true,
                }

                currentInputErrors[BuildInfraConfigTypes.BUILD_TIMEOUT] = null
                break

            case 'activate_node selector':
                if (
                    lastSavedConfiguration[BuildInfraConfigTypes.NODE_SELECTOR].defaultValue.key !==
                    BuildInfraConfigTypes.NODE_SELECTOR
                ) {
                    break
                }

                currentConfiguration[BuildInfraConfigTypes.NODE_SELECTOR] = {
                    ...lastSavedConfiguration[BuildInfraConfigTypes.NODE_SELECTOR],
                    active: true,
                }

                currentInputErrors[BuildInfraConfigTypes.NODE_SELECTOR] = null
                break

            case 'activate_tolerance':
                if (
                    lastSavedConfiguration[BuildInfraConfigTypes.TOLERANCE].defaultValue.key !==
                    BuildInfraConfigTypes.TOLERANCE
                ) {
                    break
                }

                currentConfiguration[BuildInfraConfigTypes.TOLERANCE] = {
                    ...lastSavedConfiguration[BuildInfraConfigTypes.TOLERANCE],
                    active: true,
                }

                currentInputErrors[BuildInfraConfigTypes.TOLERANCE] = null
                break

            case 'de_activate_timeout':
                if (
                    lastSavedConfiguration[BuildInfraConfigTypes.BUILD_TIMEOUT].defaultValue.key !==
                    BuildInfraConfigTypes.BUILD_TIMEOUT
                ) {
                    break
                }

                // Reverting the value and unit to defaultValues
                currentConfiguration[BuildInfraConfigTypes.BUILD_TIMEOUT] = {
                    ...currentConfiguration[BuildInfraConfigTypes.BUILD_TIMEOUT],
                    ...lastSavedConfiguration[BuildInfraConfigTypes.BUILD_TIMEOUT].defaultValue,
                    active: false,
                }

                currentInputErrors[BuildInfraConfigTypes.BUILD_TIMEOUT] = null
                break

            case 'de_activate_cpu':
                if (
                    lastSavedConfiguration[BuildInfraConfigTypes.CPU_LIMIT].defaultValue.key !==
                        BuildInfraConfigTypes.CPU_LIMIT ||
                    lastSavedConfiguration[BuildInfraConfigTypes.CPU_REQUEST].defaultValue.key !==
                        BuildInfraConfigTypes.CPU_REQUEST
                ) {
                    break
                }

                currentConfiguration[BuildInfraConfigTypes.CPU_LIMIT] = {
                    ...currentConfiguration[BuildInfraConfigTypes.CPU_LIMIT],
                    ...lastSavedConfiguration[BuildInfraConfigTypes.CPU_LIMIT].defaultValue,
                    active: false,
                }

                currentConfiguration[BuildInfraConfigTypes.CPU_REQUEST] = {
                    ...currentConfiguration[BuildInfraConfigTypes.CPU_REQUEST],
                    ...lastSavedConfiguration[BuildInfraConfigTypes.CPU_REQUEST].defaultValue,
                    active: false,
                }

                currentInputErrors[BuildInfraConfigTypes.CPU_LIMIT] = null
                currentInputErrors[BuildInfraConfigTypes.CPU_REQUEST] = null
                break

            case 'de_activate_memory':
                if (
                    lastSavedConfiguration[BuildInfraConfigTypes.MEMORY_LIMIT].defaultValue.key !==
                        BuildInfraConfigTypes.MEMORY_LIMIT ||
                    lastSavedConfiguration[BuildInfraConfigTypes.MEMORY_REQUEST].defaultValue.key !==
                        BuildInfraConfigTypes.MEMORY_REQUEST
                ) {
                    break
                }

                currentConfiguration[BuildInfraConfigTypes.MEMORY_LIMIT] = {
                    ...currentConfiguration[BuildInfraConfigTypes.MEMORY_LIMIT],
                    ...lastSavedConfiguration[BuildInfraConfigTypes.MEMORY_LIMIT].defaultValue,
                    active: false,
                }

                currentConfiguration[BuildInfraConfigTypes.MEMORY_REQUEST] = {
                    ...currentConfiguration[BuildInfraConfigTypes.MEMORY_REQUEST],
                    ...lastSavedConfiguration[BuildInfraConfigTypes.MEMORY_REQUEST].defaultValue,
                    active: false,
                }

                currentInputErrors[BuildInfraConfigTypes.MEMORY_LIMIT] = null
                currentInputErrors[BuildInfraConfigTypes.MEMORY_REQUEST] = null
                break

            case 'de_activate_node selector':
                if (
                    lastSavedConfiguration[BuildInfraConfigTypes.NODE_SELECTOR].defaultValue.key !==
                    BuildInfraConfigTypes.NODE_SELECTOR
                ) {
                    break
                }

                currentConfiguration[BuildInfraConfigTypes.NODE_SELECTOR] = {
                    ...currentConfiguration[BuildInfraConfigTypes.NODE_SELECTOR],
                    ...lastSavedConfiguration[BuildInfraConfigTypes.NODE_SELECTOR].defaultValue,
                    active: false,
                } as BuildInfraConfigurationType

                currentInputErrors[BuildInfraConfigTypes.NODE_SELECTOR] = null
                break

            case 'de_activate_tolerance':
                if (
                    lastSavedConfiguration[BuildInfraConfigTypes.TOLERANCE].defaultValue.key !==
                    BuildInfraConfigTypes.TOLERANCE
                ) {
                    break
                }

                currentConfiguration[BuildInfraConfigTypes.TOLERANCE] = {
                    ...currentConfiguration[BuildInfraConfigTypes.TOLERANCE],
                    ...lastSavedConfiguration[BuildInfraConfigTypes.TOLERANCE].defaultValue,
                    active: false,
                } as BuildInfraConfigurationType

                currentInputErrors[BuildInfraConfigTypes.TOLERANCE] = null
                break

            case BuildInfraProfileInputActionType.ADD_TARGET_PLATFORM: {
                if (currentInput.configurations[targetPlatform]) {
                    ToastManager.showToast({
                        variant: ToastVariantType.error,
                        description: 'Platform already exists',
                    })
                    return
                }

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

                // Since target platform must have some length and we are adding a new platform
                currentInputErrors[BuildInfraProfileAdditionalErrorKeysType.TARGET_PLATFORM] = ''
                break
            }

            case BuildInfraProfileInputActionType.REMOVE_TARGET_PLATFORM: {
                if (!currentInput.configurations[targetPlatform]) {
                    ToastManager.showToast({
                        variant: ToastVariantType.error,
                        description: 'Platform does not exist',
                    })
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
                        description: 'Platform does not exist',
                    })
                    return
                }

                currentInputErrors[BuildInfraProfileAdditionalErrorKeysType.TARGET_PLATFORM] =
                    validateTargetPlatformName(newPlatformName, currentInput.configurations).message

                const newPlatformFallbackConfig =
                    profileResponse.fallbackPlatformConfigurationMap[newPlatformName] ||
                    // Ideally should update targetPlatform for each configuration here itself but since we iterating over it again, we will do it there
                    profileResponse.fallbackPlatformConfigurationMap[BUILD_INFRA_DEFAULT_PLATFORM_NAME]

                // Will replace targetPlatform, defaultValue along with current value if active is false
                currentInput.configurations[newPlatformName] = Object.entries(
                    originalPlatformConfig,
                ).reduce<BuildInfraConfigurationMapType>((acc, [configKey, configValue]) => {
                    // TODO: Check why need to do 'as'
                    const newDefaultValue = newPlatformFallbackConfig[configKey as BuildInfraConfigTypes].defaultValue
                    const newConfigValues = configValue.active ? {} : newDefaultValue

                    acc[configKey as BuildInfraConfigTypes] = {
                        ...configValue,
                        ...newConfigValues,
                        targetPlatform: newPlatformName,
                        defaultValue: newDefaultValue,
                    }

                    return acc
                }, {} as BuildInfraConfigurationMapType)

                // If original platform is present in snapshot we will restore it
                if (configSnapshot[originalPlatformName]) {
                    currentInput.configurations[originalPlatformName] = configSnapshot[originalPlatformName]
                    break
                }

                delete currentInput.configurations[originalPlatformName]
                break
            }

            case BuildInfraProfileInputActionType.RESTORE_PROFILE_CONFIG_SNAPSHOT: {
                const { configSnapshot } = data
                currentInput.configurations = configSnapshot

                Object.keys(currentInputErrors).forEach((key) => {
                    if (TARGET_PLATFORM_ERROR_FIELDS_MAP[key]) {
                        currentInputErrors[key] = null
                    }
                })

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

                const existingKeys = currentConfiguration[BuildInfraConfigTypes.NODE_SELECTOR].value
                    .filter((selector) => selector.key && selector.id !== id)
                    .map((selector) => selector.key)

                const keyErrorMessages = validateLabelKeyWithNoDuplicates(key, existingKeys).messages
                const valueErrorMessages = validateLabelValue(value).messages

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

                const isEmptyRow = !key && !value

                const hasError = !isEmptyRow && (keyErrorMessages.length > 0 || valueErrorMessages.length > 0)

                if (!currentInputErrors[BuildInfraConfigTypes.NODE_SELECTOR]?.[id]) {
                    if (!currentInputErrors[BuildInfraConfigTypes.NODE_SELECTOR]) {
                        currentInputErrors[BuildInfraConfigTypes.NODE_SELECTOR] = {}
                    }
                    currentInputErrors[BuildInfraConfigTypes.NODE_SELECTOR][id] = {}
                }

                currentInputErrors[BuildInfraConfigTypes.NODE_SELECTOR][id] = {
                    ...(keyErrorMessages.length > 0 && { [NodeSelectorHeaderType.KEY]: keyErrorMessages }),
                    ...(valueErrorMessages.length > 0 && { [NodeSelectorHeaderType.VALUE]: valueErrorMessages }),
                }

                if (!hasError) {
                    // Would delete id, and if not key left then delete key
                    delete currentInputErrors[BuildInfraConfigTypes.NODE_SELECTOR][id]
                    if (Object.keys(currentInputErrors[BuildInfraConfigTypes.NODE_SELECTOR]).length === 0) {
                        currentInputErrors[BuildInfraConfigTypes.NODE_SELECTOR] = null
                    }
                }

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
                    // TODO: Ask for constants
                    effect: BuildInfraToleranceEffectType.NO_SCHEDULE,
                    operator: BuildInfraToleranceOperatorType.EQUALS,
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
                    // Question: Should we parse it as per type or as would suffice?
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

                const isEmptyRow = !key && !value
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

            default:
                break
        }

        setProfileInput(currentInput)
        setProfileInputErrors(currentInputErrors)
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
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
            if (editProfile) {
                await updateBuildInfraProfile({ name, profileInput })
            } else {
                await createBuildInfraProfile({ profileInput })
            }
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
