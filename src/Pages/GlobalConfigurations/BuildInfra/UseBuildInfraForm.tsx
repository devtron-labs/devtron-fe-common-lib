import { FormEvent, useEffect, useState } from 'react'
import { logExceptionToSentry, showError, useAsync } from '@Common/Helper'
import {
    ACTION_TO_PERSISTED_VALUE_MAP,
    BUILD_INFRA_DEFAULT_PLATFORM_NAME,
    BUILD_INFRA_INHERIT_ACTIONS,
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
    INFRA_CONFIG_TO_CM_SECRET_COMPONENT_TYPE_MAP,
    PROFILE_INPUT_ERROR_FIELDS,
    ProfileInputErrorType,
    TARGET_PLATFORM_ERROR_FIELDS_MAP,
    ToleranceHeaderType,
    upsertBuildInfraProfile,
    UseBuildInfraFormProps,
    UseBuildInfraFormResponseType,
} from '@Pages/index'
import {
    validateDescription,
    validateLabelKey,
    validateName,
    validateRequiredPositiveInteger,
} from '@Shared/validations'
import {
    CM_SECRET_STATE,
    getConfigMapSecretFormInitialValues,
    getUniqueId,
    ToastManager,
    ToastVariantType,
} from '@Shared/index'
import {
    validateLabelValue,
    validateNodeSelector,
    validateRequestLimit,
    validateTargetPlatformName,
} from './validations'

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
            case 'activate_cs':
            case 'de_activate_cm':
            case 'de_activate_cs': {
                const { id, componentType } = data
                // Would just convert isOverridden to true and replace value with default value
                const cmSecretValue = currentConfiguration[CM_SECRET_COMPONENT_TYPE_TO_INFRA_CONFIG_MAP[componentType]]
                    .value as BuildInfraCMCSValueType[]
                const selectedCMCSIndex = cmSecretValue.findIndex((configMapItem) => configMapItem.id === id)

                if (selectedCMCSIndex === -1 || !cmSecretValue[selectedCMCSIndex].canOverride) {
                    const errorMessage = 'Unable to customize this CM/CS'

                    ToastManager.showToast({
                        variant: ToastVariantType.error,
                        description: errorMessage,
                    })

                    logExceptionToSentry(new Error(errorMessage))
                    return
                }

                const isActivation = action === 'activate_cm' || action === 'activate_cs'
                cmSecretValue[selectedCMCSIndex].useFormProps = cmSecretValue[selectedCMCSIndex].defaultValue
                cmSecretValue[selectedCMCSIndex].isOverridden = isActivation
                cmSecretValue[selectedCMCSIndex].initialResponse =
                    cmSecretValue[selectedCMCSIndex].defaultValueInitialResponse

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

            case BuildInfraProfileInputActionType.ADD_CM_CS_ITEM: {
                const { id, infraConfigType } = data

                const useFormProps = getConfigMapSecretFormInitialValues({
                    configMapSecretData: null,
                    componentType: INFRA_CONFIG_TO_CM_SECRET_COMPONENT_TYPE_MAP[infraConfigType],
                    cmSecretStateLabel: CM_SECRET_STATE.BASE,
                    isJob: true,
                    fallbackMergeStrategy: null,
                })

                const finalValue: BuildInfraCMCSValueType = {
                    useFormProps,
                    id,
                    isOverridden: true,
                    canOverride: false,
                    initialResponse: null,
                    defaultValue: null,
                    defaultValueInitialResponse: null,
                }

                ;(currentConfiguration[infraConfigType].value as BuildInfraCMCSValueType[]).push(finalValue)
                break
            }

            case BuildInfraProfileInputActionType.SYNC_CM_CS_ITEM: {
                const { id, value, hasError, componentType } = data

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

                ;(
                    currentConfiguration[CM_SECRET_COMPONENT_TYPE_TO_INFRA_CONFIG_MAP[componentType]]
                        .value as BuildInfraCMCSValueType[]
                )[selectedCMCSIndex].useFormProps = value

                if (!currentInputErrors[CM_SECRET_COMPONENT_TYPE_TO_INFRA_CONFIG_MAP[componentType]]) {
                    currentInputErrors[CM_SECRET_COMPONENT_TYPE_TO_INFRA_CONFIG_MAP[componentType]] = {}
                }

                if (hasError) {
                    currentInputErrors[CM_SECRET_COMPONENT_TYPE_TO_INFRA_CONFIG_MAP[componentType]][id] = true
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
