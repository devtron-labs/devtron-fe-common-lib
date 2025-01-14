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

import {
    BuildInfraCMCSConfigType,
    BuildInfraCMCSValueType,
    BuildInfraConfigPayloadType,
    BuildInfraConfigurationItemPayloadType,
    BuildInfraPayloadType,
    BuildInfraProfileConfigBase,
    DEFAULT_PROFILE_NAME,
    INFRA_CONFIG_CONTAINING_SUB_VALUES,
    INFRA_CONFIG_TO_CM_SECRET_COMPONENT_TYPE_MAP,
} from '@Pages/index'
import { ROUTES } from '../../../Common'
import {
    BuildInfraConfigInfoType,
    BuildInfraConfigTypes,
    BuildInfraConfigurationDTO,
    BuildInfraConfigurationMapType,
    BuildInfraConfigurationMapTypeWithoutDefaultFallback,
    BuildInfraConfigurationType,
    BuildInfraConfigValuesType,
    BuildInfraInheritActions,
    BuildInfraLocators,
    BuildInfraPlatformConfigurationMapDTO,
    BuildInfraProfileBase,
    BuildInfraProfileData,
    BuildInfraProfileResponseType,
    BuildInfraProfileTransformerParamsType,
    BuildInfraProfileVariants,
    BuildInfraToleranceOperatorType,
    BuildInfraToleranceValueType,
    BuildXDriverType,
    CreateBuildInfraProfileType,
    GetBaseProfileObjectParamsType,
    GetPlatformConfigurationsWithDefaultValuesParamsType,
} from './types'
import {
    BUILD_INFRA_DEFAULT_PLATFORM_NAME,
    BUILD_INFRA_LATEST_API_VERSION,
    INFRA_CONFIG_NOT_SUPPORTED_BY_BUILD_X,
    USE_BUILD_X_DRIVER_FALLBACK,
} from './constants'
import {
    CMSecretConfigData,
    CMSecretPayloadType,
    getConfigMapSecretFormInitialValues,
    getConfigMapSecretPayload,
    getUniqueId,
} from '../../../Shared'

export const parsePlatformConfigIntoValue = (
    configuration: BuildInfraConfigValuesType,
    addUniqueId: boolean = true,
): BuildInfraConfigValuesType => {
    switch (configuration?.key) {
        case BuildInfraConfigTypes.NODE_SELECTOR:
            return {
                key: BuildInfraConfigTypes.NODE_SELECTOR,
                value: (configuration.value || [])
                    .map((nodeSelector) => ({
                        key: nodeSelector?.key,
                        value: nodeSelector?.value || '',
                        id: addUniqueId ? getUniqueId() : null,
                    }))
                    .filter((nodeSelector) => nodeSelector.key),
            }

        case BuildInfraConfigTypes.TOLERANCE:
            return {
                key: BuildInfraConfigTypes.TOLERANCE,
                value: (configuration.value || [])
                    .map<BuildInfraToleranceValueType>((toleranceItem) => {
                        const { key, effect, operator, value } = toleranceItem || {}

                        const baseObject: Pick<BuildInfraToleranceValueType, 'key' | 'effect' | 'id'> = {
                            key,
                            effect,
                            id: addUniqueId ? getUniqueId() : null,
                        }

                        if (operator === BuildInfraToleranceOperatorType.EQUALS) {
                            return {
                                ...baseObject,
                                operator: BuildInfraToleranceOperatorType.EQUALS,
                                value,
                            }
                        }

                        return {
                            ...baseObject,
                            operator: BuildInfraToleranceOperatorType.EXISTS,
                        }
                    })
                    .filter((toleranceItem) => toleranceItem.key),
            }

        case BuildInfraConfigTypes.CONFIG_MAP:
        case BuildInfraConfigTypes.SECRET:
            return {
                key: configuration.key,
                value: configuration.value || [],
            }

        case BuildInfraConfigTypes.BUILD_TIMEOUT:
        case BuildInfraConfigTypes.CPU_LIMIT:
        case BuildInfraConfigTypes.CPU_REQUEST:
        case BuildInfraConfigTypes.MEMORY_LIMIT:
        case BuildInfraConfigTypes.MEMORY_REQUEST:
            return {
                key: configuration.key,
                value: configuration.value,
                unit: configuration.unit,
            }

        default:
            return null
    }
}

export const getParsedValueForUseK8sDriver = (buildxDriverType: BuildXDriverType): boolean => {
    if (!buildxDriverType) {
        return USE_BUILD_X_DRIVER_FALLBACK
    }

    return buildxDriverType === BuildXDriverType.KUBERNETES
}

const getBaseProfileObject = ({
    fromCreateView,
    profile,
    canConfigureUseK8sDriver,
}: GetBaseProfileObjectParamsType): BuildInfraProfileBase => {
    const parsedUseK8sDriverValue = getParsedValueForUseK8sDriver(profile?.buildxDriverType)
    const useK8sDriver = canConfigureUseK8sDriver ? parsedUseK8sDriverValue : null

    if (fromCreateView || !profile) {
        return {
            name: '',
            description: '',
            type: BuildInfraProfileVariants.NORMAL,
            appCount: 0,
            useK8sDriver,
        }
    }

    return {
        id: profile.id,
        name: profile.name,
        description: profile.description?.trim() || '',
        type: profile.type,
        appCount: profile.appCount,
        useK8sDriver,
    }
}

/**
 * In case of locators other than cm/cs, we just pass data to parsePlatformConfigIntoValue
 * In case of cm/cs we convert the DTO into intermediatory UI form with defaultValue as it itself
 */
const parsePlatformServerConfigIntoUIConfig = (
    serverConfig: BuildInfraConfigurationDTO,
    isDefaultProfile: boolean,
): BuildInfraConfigValuesType => {
    if (!INFRA_CONFIG_CONTAINING_SUB_VALUES[serverConfig.key]) {
        // TODO: Can look for a better way to handle this typing?
        return parsePlatformConfigIntoValue(serverConfig as BuildInfraConfigValuesType)
    }

    const parsedCMCSFormValues: BuildInfraCMCSConfigType['value'] = (serverConfig.value as CMSecretConfigData[])?.map(
        (configMapSecretData) => {
            const cmSecretFormProps = getConfigMapSecretFormInitialValues({
                configMapSecretData,
                componentType: INFRA_CONFIG_TO_CM_SECRET_COMPONENT_TYPE_MAP[serverConfig.key],
                cmSecretStateLabel: null,
                isJob: true,
                fallbackMergeStrategy: null,
            })

            return {
                useFormProps: cmSecretFormProps,
                initialResponse: configMapSecretData,
                id: getUniqueId(),
                isOverridden: true,
                canOverride: !isDefaultProfile,
                defaultValue: cmSecretFormProps,
            }
        },
    )

    return {
        key: serverConfig.key as BuildInfraConfigTypes.CONFIG_MAP | BuildInfraConfigTypes.SECRET,
        value: parsedCMCSFormValues,
    }
}

const parseUIConfigToPayload = (uiConfig: BuildInfraConfigValuesType): BuildInfraConfigPayloadType => {
    const parsedConfig = parsePlatformConfigIntoValue(uiConfig, false)
    if (!INFRA_CONFIG_CONTAINING_SUB_VALUES[parsedConfig.key]) {
        return parsedConfig as BuildInfraConfigPayloadType
    }

    // Only overridden values are needed in payload
    const overriddenConfigs = (parsedConfig.value as BuildInfraCMCSValueType[])?.filter(
        (configMapSecretData) => configMapSecretData.isOverridden,
    )
    const parsedCMCSValues = overriddenConfigs?.map(({ useFormProps }) => getConfigMapSecretPayload(useFormProps))

    return {
        key: parsedConfig.key as BuildInfraConfigTypes.CONFIG_MAP | BuildInfraConfigTypes.SECRET,
        value: parsedCMCSValues,
    }
}

const getConfigurationMapWithoutDefaultFallback = (
    platformConfigurationMap: BuildInfraPlatformConfigurationMapDTO,
    isDefaultProfile: boolean,
): Record<string, BuildInfraConfigurationMapTypeWithoutDefaultFallback> =>
    Object.entries(platformConfigurationMap || {}).reduce<
        Record<string, BuildInfraConfigurationMapTypeWithoutDefaultFallback>
    >((acc, [platformName, configurations]) => {
        const platformConfigValuesMap: BuildInfraConfigurationMapTypeWithoutDefaultFallback =
            configurations?.reduce<BuildInfraConfigurationMapTypeWithoutDefaultFallback>(
                (configurationMap, configuration) => {
                    const configValues = parsePlatformServerConfigIntoUIConfig(configuration, isDefaultProfile)
                    const baseValue: BuildInfraProfileConfigBase = {
                        id: configuration.id,
                        profileName: configuration.profileName,
                        active: configuration.active,
                        targetPlatform: platformName,
                    }

                    const currentConfigValue: BuildInfraConfigInfoType = {
                        ...configValues,
                        ...baseValue,
                    }

                    // eslint-disable-next-line no-param-reassign
                    configurationMap[configuration.key] = {
                        ...currentConfigValue,
                        ...parsePlatformConfigIntoValue(currentConfigValue),
                    } as BuildInfraConfigInfoType

                    return configurationMap
                },
                {} as BuildInfraConfigurationMapTypeWithoutDefaultFallback,
            ) ?? ({} as BuildInfraConfigurationMapTypeWithoutDefaultFallback)

        acc[platformName] = platformConfigValuesMap

        return acc
    }, {})

const getPlatformConfigurationsWithDefaultValues = ({
    profileConfigurationsMap,
    defaultConfigurationsMap,
    platformName,
    isDefaultProfile = false,
}: GetPlatformConfigurationsWithDefaultValuesParamsType): BuildInfraConfigurationMapType =>
    Object.values(BuildInfraConfigTypes).reduce<BuildInfraConfigurationMapType>((acc, configType) => {
        const defaultConfiguration = defaultConfigurationsMap[configType]
        const profileConfiguration = profileConfigurationsMap[configType]?.active
            ? profileConfigurationsMap[configType]
            : null

        if (!defaultConfiguration) {
            return acc
        }

        const defaultValue = parsePlatformConfigIntoValue(defaultConfiguration)

        const configContainsSubValue = INFRA_CONFIG_CONTAINING_SUB_VALUES[configType] && !isDefaultProfile
        // If value is not present in profile that means we are inheriting the value
        let finalConfiguration: BuildInfraConfigurationType = profileConfiguration
            ? {
                  ...profileConfiguration,
                  defaultValue: !configContainsSubValue ? defaultValue : null,
              }
            : null

        if (configContainsSubValue) {
            /**
             * Logic is, all the values inside profileConfiguration are overridden values, and canOverride will be true, if name is present in defaultConfiguration and we will put that defaultConfiguration value in defaultValue
             * Then we will traverse all the values in defaultConfiguration, and if they are not overridden by user, we will add them to finalCMCSValues
             */

            const defaultConfigurationValueMap = (defaultConfiguration.value as BuildInfraCMCSValueType[])?.reduce<
                Record<string, BuildInfraCMCSValueType>
            >((defaultCMCSMap, configMapSecretData) => {
                // eslint-disable-next-line no-param-reassign
                defaultCMCSMap[configMapSecretData.useFormProps.name] = configMapSecretData
                return defaultCMCSMap
            }, {})

            const finalValues: BuildInfraCMCSValueType[] =
                (profileConfiguration?.value as BuildInfraCMCSValueType[])?.map((configMapSecretData) => ({
                    ...configMapSecretData,
                    defaultValue: defaultConfigurationValueMap[configMapSecretData.useFormProps.name].useFormProps,
                    isOverridden: true,
                    canOverride: !!defaultConfigurationValueMap[configMapSecretData.useFormProps.name],
                })) || []

            const overriddenValuesMap = finalValues.reduce<Record<string, BuildInfraCMCSValueType>>(
                (overriddenValuesAcc, overriddenValue) => {
                    // eslint-disable-next-line no-param-reassign
                    overriddenValuesAcc[overriddenValue.useFormProps.name] = overriddenValue
                    return overriddenValuesAcc
                },
                {} as Record<string, BuildInfraCMCSValueType>,
            )

            Object.values(defaultConfigurationValueMap).forEach((defaultCMCSValue) => {
                if (!overriddenValuesMap[defaultCMCSValue.useFormProps.name]) {
                    finalValues.push({
                        ...defaultCMCSValue,
                        isOverridden: false,
                        canOverride: true,
                    })
                }
            })

            finalConfiguration = {
                id: profileConfiguration?.id,
                profileName: profileConfiguration?.profileName,
                active: profileConfiguration?.active,
                targetPlatform: platformName,
                key: configType as BuildInfraConfigTypes.CONFIG_MAP | BuildInfraConfigTypes.SECRET,
                value: finalValues,
                defaultValue: null,
            }
        } else {
            finalConfiguration = finalConfiguration || {
                ...defaultValue,
                active: false,
                targetPlatform: platformName,
                defaultValue,
            }
        }

        acc[configType] = finalConfiguration

        return acc
    }, {} as BuildInfraConfigurationMapType)

// Would receive a single profile and return transformed response
export const getTransformedBuildInfraProfileResponse = ({
    configurationUnits,
    defaultConfigurations,
    profile,
    fromCreateView,
    canConfigureUseK8sDriver,
}: BuildInfraProfileTransformerParamsType): BuildInfraProfileResponseType => {
    const isDefaultProfile = !fromCreateView && profile?.name === DEFAULT_PROFILE_NAME

    // For cm/cs this will return the values with default as null and isOverridden as true
    const globalProfilePlatformConfigMap = getConfigurationMapWithoutDefaultFallback(
        defaultConfigurations,
        isDefaultProfile,
    )
    const profileConfigurations = getConfigurationMapWithoutDefaultFallback(
        fromCreateView
            ? {
                  [BUILD_INFRA_DEFAULT_PLATFORM_NAME]: [],
              }
            : profile?.configurations,
        isDefaultProfile,
    )

    // Would depict state of target platforms in current profile with their fallback/default value (we will display in case we inheriting) attached to them
    const configurations = Object.entries(profileConfigurations).reduce<BuildInfraProfileData['configurations']>(
        (acc, [platformName, profilePlatformConfigurationMap]) => {
            const globalProfilePlatformConfigurationMap =
                globalProfilePlatformConfigMap[platformName] ||
                globalProfilePlatformConfigMap[BUILD_INFRA_DEFAULT_PLATFORM_NAME]

            acc[platformName] = getPlatformConfigurationsWithDefaultValues({
                profileConfigurationsMap: profilePlatformConfigurationMap,
                defaultConfigurationsMap: globalProfilePlatformConfigurationMap,
                platformName,
                isDefaultProfile,
            })

            return acc
        },
        {},
    )

    // Would be used in case we are going to create a new platform, to get the default values from global profile
    const fallbackPlatformConfigurationMap = Object.entries(globalProfilePlatformConfigMap).reduce<
        BuildInfraProfileResponseType['fallbackPlatformConfigurationMap']
    >((acc, [platformName, globalPlatformConfig]) => {
        // Logic is, if we will pre-fill profile with default platform of current profile, and set active to true, i.e, overridden, with default values from global profile
        const baseConfigurations = configurations[BUILD_INFRA_DEFAULT_PLATFORM_NAME]

        acc[platformName] = Object.values(BuildInfraConfigTypes).reduce<BuildInfraConfigurationMapType>(
            (fallbackAcc, configType) => {
                if (!globalPlatformConfig[configType]) {
                    return fallbackAcc
                }

                const baseValue = parsePlatformConfigIntoValue(baseConfigurations[configType])
                const defaultValue = parsePlatformConfigIntoValue(globalPlatformConfig[configType])

                // It does not matter what value we have in case its inheriting runner, since we show the values of runner
                // eslint-disable-next-line no-param-reassign
                fallbackAcc[configType] = {
                    ...baseValue,
                    defaultValue,
                    active: true,
                    targetPlatform: platformName,
                }

                return fallbackAcc
            },
            {} as BuildInfraConfigurationMapType,
        )

        return acc
    }, {})

    return {
        configurationUnits,
        fallbackPlatformConfigurationMap,
        profile: {
            ...getBaseProfileObject({
                fromCreateView,
                profile,
                canConfigureUseK8sDriver,
            }),
            configurations,
        },
    }
}

export const getBuildxDriverTypeFromUseK8sDriver = (useK8sDriver: boolean): BuildXDriverType =>
    useK8sDriver ? BuildXDriverType.KUBERNETES : BuildXDriverType.DOCKER_CONTAINER

export const getBuildInfraProfilePayload = (
    profileInput: CreateBuildInfraProfileType['profileInput'],
    canConfigureUseK8sDriver: boolean,
): BuildInfraPayloadType => {
    const platformConfigurationMap = profileInput.configurations || {}
    const configurations: BuildInfraPayloadType['configurations'] = Object.entries(platformConfigurationMap).reduce<
        BuildInfraPayloadType['configurations']
    >((acc, [platformName, configurationLocatorMap]) => {
        // This converts the map of config types mapped to values into an array of values if user has activated the configuration or is editing it
        const configurationList = Object.values(configurationLocatorMap).reduce<
            BuildInfraConfigurationItemPayloadType[]
        >((configurationListAcc, configuration) => {
            const locatorContainsSubValues = !!INFRA_CONFIG_CONTAINING_SUB_VALUES[configuration.key]
            const doesCMCSContainsOverriddenValues =
                locatorContainsSubValues &&
                (configuration.value as BuildInfraCMCSValueType[])?.some(
                    (configMapSecretData) => configMapSecretData.isOverridden,
                )

            if (configuration.id || configuration.active || doesCMCSContainsOverriddenValues) {
                const infraConfigValues = parseUIConfigToPayload(configuration)
                if (!infraConfigValues) {
                    return configurationListAcc
                }

                const response: BuildInfraConfigurationItemPayloadType = {
                    ...infraConfigValues,
                    id: configuration.id,
                    active: locatorContainsSubValues
                        ? (infraConfigValues.value as CMSecretPayloadType[])?.length > 0
                        : configuration.active,
                }

                configurationListAcc.push(response)
                return configurationListAcc
            }

            return configurationListAcc
        }, [])

        acc[platformName] = configurationList
        return acc
    }, {})

    // Deleting un-supported locators in case locators are not supported by buildX
    Object.entries(configurations).forEach(([platformName, platformConfigurations]) => {
        if (platformName !== BUILD_INFRA_DEFAULT_PLATFORM_NAME) {
            configurations[platformName] = platformConfigurations.filter(
                (config) => !INFRA_CONFIG_NOT_SUPPORTED_BY_BUILD_X[config.key],
            )
        }
    })

    // Filtering out platforms if not using K8sDriver
    if (canConfigureUseK8sDriver && !profileInput.useK8sDriver) {
        Object.keys(configurations).forEach((platformName) => {
            if (platformName !== BUILD_INFRA_DEFAULT_PLATFORM_NAME) {
                delete configurations[platformName]
            }
        })
    }

    const payload: BuildInfraPayloadType = {
        name: profileInput.name,
        description: profileInput.description?.trim(),
        type: profileInput.type,
        configurations,
        ...(canConfigureUseK8sDriver && {
            buildxDriverType: getBuildxDriverTypeFromUseK8sDriver(profileInput.useK8sDriver),
        }),
    }
    return payload
}

export const getBuildInfraProfileEndpoint = (): string =>
    `${ROUTES.INFRA_CONFIG_PROFILE}/${BUILD_INFRA_LATEST_API_VERSION}`

export const getBuildInfraInheritActionFromLocator = (
    locator: BuildInfraLocators,
    activateLocator: boolean,
): BuildInfraInheritActions =>
    (activateLocator ? `activate_${locator}` : `de_activate_${locator}`) satisfies BuildInfraInheritActions
