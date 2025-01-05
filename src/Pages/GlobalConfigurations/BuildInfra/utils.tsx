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
    OverrideMergeStrategyType,
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
    BuildInfraProfileInfoDTO,
    BuildInfraProfileResponseType,
    BuildInfraProfileTransformerParamsType,
    BuildInfraToleranceOperatorType,
    BuildInfraToleranceValueType,
    CreateBuildInfraProfileType,
    GetPlatformConfigurationsWithDefaultValuesParamsType,
} from './types'
import {
    CREATE_PROFILE_BASE_VALUE,
    BUILD_INFRA_DEFAULT_PLATFORM_NAME,
    BUILD_INFRA_LATEST_API_VERSION,
    INFRA_CONFIG_NOT_SUPPORTED_BY_BUILD_X,
} from './constants'
import {
    CM_SECRET_STATE,
    CMSecretComponentType,
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
            return {
                key: BuildInfraConfigTypes.CONFIG_MAP,
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

const getBaseProfileObject = (fromCreateView: boolean, profile: BuildInfraProfileInfoDTO): BuildInfraProfileBase => {
    if (fromCreateView) {
        return structuredClone(CREATE_PROFILE_BASE_VALUE)
    }

    return {
        id: profile.id,
        name: profile.name,
        description: profile.description,
        type: profile.type,
        appCount: profile.appCount,
    }
}

const parsePlatformServerConfigIntoUIConfig = (
    serverConfig: BuildInfraConfigurationDTO,
    isDefaultProfile: boolean,
): BuildInfraConfigValuesType => {
    if (serverConfig.key !== BuildInfraConfigTypes.CONFIG_MAP) {
        return parsePlatformConfigIntoValue(serverConfig)
    }

    const parsedCMCSFormValues: BuildInfraCMCSConfigType['value'] = serverConfig.value?.map((configMapSecretData) => {
        const baseCMCSValue = getConfigMapSecretFormInitialValues({
            configMapSecretData,
            componentType:
                serverConfig.key === BuildInfraConfigTypes.CONFIG_MAP
                    ? CMSecretComponentType.ConfigMap
                    : CMSecretComponentType.Secret,
            // TODO: Check if for target platforms need to change
            cmSecretStateLabel: CM_SECRET_STATE.BASE,
            isJob: true,
            // FIXME: Can delete as well
            fallbackMergeStrategy: OverrideMergeStrategyType.REPLACE,
        })

        return {
            ...baseCMCSValue,
            id: getUniqueId(),
            isOverridden: true,
            canOverride: !isDefaultProfile,
            defaultValue: baseCMCSValue,
        }
    })

    return {
        key: BuildInfraConfigTypes.CONFIG_MAP,
        value: parsedCMCSFormValues,
    }
}

const parseUIConfigToPayload = (uiConfig: BuildInfraConfigValuesType): BuildInfraConfigPayloadType => {
    const parsedConfig = parsePlatformConfigIntoValue(uiConfig, false)
    if (parsedConfig.key !== BuildInfraConfigTypes.CONFIG_MAP) {
        return parsedConfig
    }

    // Only overridden values are needed in payload
    const overriddenConfigs = parsedConfig.value?.filter((configMapSecretData) => configMapSecretData.isOverridden)
    const parsedCMCSValues = overriddenConfigs?.map((configMapSecretFormData) =>
        getConfigMapSecretPayload(configMapSecretFormData),
    )

    return {
        key: BuildInfraConfigTypes.CONFIG_MAP,
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

        const isSpecialParsingRequired = configType === BuildInfraConfigTypes.CONFIG_MAP && !isDefaultProfile
        // If value is not present in profile that means we are inheriting the value
        let finalConfiguration: BuildInfraConfigurationType = profileConfiguration
            ? {
                  ...profileConfiguration,
                  defaultValue: isSpecialParsingRequired ? defaultValue : null,
              }
            : null

        if (isSpecialParsingRequired) {
            /**
             * Logic is, all the values inside profileConfiguration are overridden values, and canOverride will be true, if name is present in defaultConfiguration and we will put that defaultConfiguration value in defaultValue
             * Then we will traverse all the values in defaultConfiguration, and if they are not overridden by user, we will add them to finalCMCSValues
             */

            const defaultConfigurationValueMap = (defaultConfiguration.value as BuildInfraCMCSValueType[])?.reduce<
                Record<string, BuildInfraCMCSValueType>
            >((defaultCMCSMap, configMapSecretData) => {
                // eslint-disable-next-line no-param-reassign
                defaultCMCSMap[configMapSecretData.name] = configMapSecretData
                return defaultCMCSMap
            }, {})

            const finalValues: BuildInfraCMCSValueType[] =
                (profileConfiguration?.value as BuildInfraCMCSValueType[])?.map((configMapSecretData) => ({
                    ...configMapSecretData,
                    defaultValue: defaultConfigurationValueMap[configMapSecretData.name],
                    isOverridden: true,
                    canOverride: !!defaultConfigurationValueMap[configMapSecretData.name],
                })) || []

            const overriddenValuesMap = finalValues.reduce<Record<string, BuildInfraCMCSValueType>>(
                (overriddenValuesAcc, overriddenValue) => {
                    // eslint-disable-next-line no-param-reassign
                    overriddenValuesAcc[overriddenValue.name] = overriddenValue
                    return overriddenValuesAcc
                },
                {} as Record<string, BuildInfraCMCSValueType>,
            )

            Object.values(defaultConfigurationValueMap).forEach((defaultCMCSValue) => {
                if (!overriddenValuesMap[defaultCMCSValue.name]) {
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
                key: configType,
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
}: BuildInfraProfileTransformerParamsType): BuildInfraProfileResponseType => {
    // For cm/cs this will return the values with default as null and isOverridden as true
    const globalProfilePlatformConfigMap = getConfigurationMapWithoutDefaultFallback(
        defaultConfigurations,
        profile?.name === DEFAULT_PROFILE_NAME,
    )
    const profileConfigurations = getConfigurationMapWithoutDefaultFallback(
        fromCreateView
            ? {
                  [BUILD_INFRA_DEFAULT_PLATFORM_NAME]: [],
              }
            : profile?.configurations,
        profile?.name === DEFAULT_PROFILE_NAME,
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
                isDefaultProfile: !fromCreateView && profile.name === DEFAULT_PROFILE_NAME,
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
            ...(profile && getBaseProfileObject(fromCreateView, profile)),
            configurations,
        },
    }
}

export const getBuildInfraProfilePayload = (
    profileInput: CreateBuildInfraProfileType['profileInput'],
): BuildInfraPayloadType => {
    const platformConfigurationMap = profileInput.configurations || {}
    const configurations: BuildInfraPayloadType['configurations'] = Object.entries(platformConfigurationMap).reduce<
        BuildInfraPayloadType['configurations']
    >((acc, [platformName, configurationLocatorMap]) => {
        // This converts the map of config types mapped to values into an array of values if user has activated the configuration or is editing it
        const configurationList = Object.values(configurationLocatorMap).reduce<
            BuildInfraConfigurationItemPayloadType[]
        >((configurationListAcc, configuration) => {
            if (configuration.id || configuration.active) {
                const locatorContainsSubValues = !!INFRA_CONFIG_CONTAINING_SUB_VALUES[configuration.key]
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

    // Deleting un-supported locators in case target platform is not default platform
    Object.entries(configurations).forEach(([platformName, platformConfigurations]) => {
        if (platformName !== BUILD_INFRA_DEFAULT_PLATFORM_NAME) {
            configurations[platformName] = platformConfigurations.filter(
                (config) => !INFRA_CONFIG_NOT_SUPPORTED_BY_BUILD_X[config.key],
            )
        }
    })

    const payload: BuildInfraPayloadType = {
        name: profileInput.name,
        description: profileInput.description,
        type: profileInput.type,
        configurations,
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
