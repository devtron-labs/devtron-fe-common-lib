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
import { getUniqueId } from '../../../Shared'

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

const getConfigurationMapWithoutDefaultFallback = (
    platformConfigurationMap: BuildInfraPlatformConfigurationMapDTO,
): Record<string, BuildInfraConfigurationMapTypeWithoutDefaultFallback> =>
    Object.entries(platformConfigurationMap || {}).reduce<
        Record<string, BuildInfraConfigurationMapTypeWithoutDefaultFallback>
    >((acc, [platformName, configurations]) => {
        const platformConfigValuesMap: BuildInfraConfigurationMapTypeWithoutDefaultFallback =
            configurations?.reduce<BuildInfraConfigurationMapTypeWithoutDefaultFallback>(
                (configurationMap, configuration) => {
                    const currentConfigValue: BuildInfraConfigInfoType = {
                        ...configuration,
                        targetPlatform: platformName,
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
        // If value is not present in profile that means we are inheriting the value
        const finalConfiguration: BuildInfraConfigurationType = profileConfiguration
            ? {
                  ...profileConfiguration,
                  defaultValue,
              }
            : {
                  ...defaultValue,
                  active: false,
                  targetPlatform: platformName,
                  defaultValue,
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
    // Ideal assumption is defaultConfigurations would contain all the required keys
    const globalProfilePlatformConfigMap = getConfigurationMapWithoutDefaultFallback(defaultConfigurations)
    const profileConfigurations = getConfigurationMapWithoutDefaultFallback(
        fromCreateView
            ? {
                  [BUILD_INFRA_DEFAULT_PLATFORM_NAME]: [],
              }
            : profile?.configurations,
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
): BuildInfraProfileInfoDTO => {
    const platformConfigurationMap = profileInput.configurations || {}
    const configurations: BuildInfraProfileInfoDTO['configurations'] = Object.entries(platformConfigurationMap).reduce<
        BuildInfraProfileInfoDTO['configurations']
    >((acc, [platformName, configurationLocatorMap]) => {
        // This converts the map of config types mapped to values into an array of values if user has activated the configuration or is editing it
        const configurationList = Object.values(configurationLocatorMap).reduce<BuildInfraConfigurationDTO[]>(
            (configurationListAcc, configuration) => {
                if (configuration.id || configuration.active) {
                    const infraConfigValues: BuildInfraConfigValuesType = parsePlatformConfigIntoValue(
                        configuration,
                        false,
                    )
                    if (!infraConfigValues) {
                        return configurationListAcc
                    }

                    const response: BuildInfraConfigurationDTO = {
                        ...infraConfigValues,
                        id: configuration.id,
                        active: configuration.active,
                    }

                    configurationListAcc.push(response)
                    return configurationListAcc
                }

                return configurationListAcc
            },
            [],
        )

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

    const payload: BuildInfraProfileInfoDTO = {
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
