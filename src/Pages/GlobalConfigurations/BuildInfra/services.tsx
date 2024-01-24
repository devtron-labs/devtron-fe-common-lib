// TODO: Remove these comment on API integration
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ROUTES, ResponseType, get, showError } from '../../../Common'
import { CREATE_PROFILE_BASE_VALUE, CREATE_VIEW_CHECKED_CONFIGS } from './constants'
import {
    BuildInfraConfigTypes,
    BuildInfraConfigurationMapType,
    BuildInfraConfigurationType,
    BuildInfraProfileAPIResponseType,
    BuildInfraProfileBase,
    BuildInfraProfileResponseDataType,
    BuildInfraProfileResponseType,
    BuildInfraProfileTransformerType,
    BuildInfraProfileVariants,
    BuildInfraUnitsMapType,
    ConfigurationUnitMapType,
    CreateBuildInfraProfileType,
    CreateBuildInfraServicePayloadType,
    CreateBuildInfraServiceConfigurationType,
    GetBuildInfraProfileType,
    UpdateBuildInfraProfileType,
} from './types'

const getSampleResponse1 = (name: string) => ({
    code: 200,
    result: {
        configurationUnits: [
            {
                name: 'build_timeout',
                units: [
                    {
                        name: 'mi',
                        conversionFactor: 1,
                    },
                    {
                        name: 'hourWithAVeryLongTextSoThatICanTestReactSelect',
                        conversionFactor: 3600,
                    },
                ],
            },
            {
                name: 'cpu_request',
                units: [
                    {
                        name: 'mi',
                        conversionFactor: 1,
                    },
                    {
                        name: 'm',
                        conversionFactor: 1000,
                    },
                ],
            },
            {
                name: 'cpu_limit',
                units: [
                    {
                        name: 'mi',
                        conversionFactor: 1,
                    },
                    {
                        name: 'm',
                        conversionFactor: 1000,
                    },
                ],
            },
            {
                name: 'mem_limit',
                units: [
                    {
                        name: 'mi',
                        conversionFactor: 1,
                    },
                    {
                        name: 'm',
                        conversionFactor: 1000,
                    },
                ],
            },
            {
                name: 'mem_request',
                units: [
                    {
                        name: 'mi',
                        conversionFactor: 1,
                    },
                    {
                        name: 'm',
                        conversionFactor: 1000,
                    },
                ],
            },
        ],
        defaultConfigurations: [
            {
                id: 1,
                key: 'cpu_limit',
                value: '0.5',
                profileName: `${name}`,
                unit: 'mi',
                active: true,
            },
            {
                id: 2,
                key: 'cpu_request',
                value: '0.5',
                profileName: `${name}`,
                unit: 'mi',
                active: true,
            },
            {
                id: 3,
                key: 'mem_limit',
                value: '0.5',
                profileName: `${name}`,
                unit: 'mi',
                active: true,
            },
            {
                id: 4,
                key: 'mem_request',
                value: '0.5',
                profileName: `${name}`,
                unit: 'mi',
                active: true,
            },
            {
                id: 5,
                key: 'build_timeout',
                value: '0.5',
                profileName: `${name}`,
                unit: 'mi',
                active: true,
            },
        ],
        profile: {
            id: 1,
            name: `${name}`,
            description: 'all java apps should have this infra profile',
            type: BuildInfraProfileVariants.NORMAL,
            configurations: [
                {
                    id: 1,
                    key: 'cpu_limit',
                    value: '2000',
                    profileName: `${name}`,
                    unit: 'mi',
                    active: true,
                },
                {
                    id: 2,
                    key: 'cpu_request',
                    value: '100',
                    profileName: `${name}`,
                    unit: 'mi',
                    active: true,
                },
            ],
            appCount: 1,
            createdAt: '2021-06-01T06:30:00.000Z',
            updatedAt: '2021-06-01T06:30:00.000Z',
            createdBy: '1',
            updatedBy: '1',
        },
    },
})

// Default same as profile
const getSampleResponse2 = (name: string) => ({
    code: 200,
    result: {
        configurationUnits: [
            {
                name: 'build_timeout',
                units: [
                    {
                        name: 'mi',
                        conversionFactor: 1,
                    },
                    {
                        name: 'hourWithAVeryLongTextSoThatICanTestReactSelect',
                        conversionFactor: 3600,
                    },
                ],
            },
            {
                name: 'cpu_request',
                units: [
                    {
                        name: 'mi',
                        conversionFactor: 1,
                    },
                    {
                        name: 'm',
                        conversionFactor: 1000,
                    },
                ],
            },
            {
                name: 'cpu_limit',
                units: [
                    {
                        name: 'mi',
                        conversionFactor: 1,
                    },
                    {
                        name: 'm',
                        conversionFactor: 1000,
                    },
                ],
            },
            {
                name: 'mem_limit',
                units: [
                    {
                        name: 'mi',
                        conversionFactor: 1,
                    },
                    {
                        name: 'm',
                        conversionFactor: 1000,
                    },
                ],
            },
            {
                name: 'mem_request',
                units: [
                    {
                        name: 'mi',
                        conversionFactor: 1,
                    },
                    {
                        name: 'm',
                        conversionFactor: 1000,
                    },
                ],
            },
        ],
        defaultConfigurations: [
            {
                id: 1,
                key: 'cpu_limit',
                value: '0.5',
                profileName: `${name}`,
                unit: 'mi',
                active: true,
            },
            {
                id: 2,
                key: 'cpu_request',
                value: '0.5',
                profileName: `${name}`,
                unit: 'mi',
                active: true,
            },
            {
                id: 3,
                key: 'mem_limit',
                value: '0.5',
                profileName: `${name}`,
                unit: 'mi',
                active: true,
            },
            {
                id: 4,
                key: 'mem_request',
                value: '0.5',
                profileName: `${name}`,
                unit: 'mi',
                active: true,
            },
            {
                id: 5,
                key: 'build_timeout',
                value: '0.5',
                profileName: `${name}`,
                unit: 'mi',
                active: true,
            },
        ],
        profile: {
            id: 1,
            name: `${name}`,
            description: 'all java apps should have this infra profile',
            type: BuildInfraProfileVariants.DEFAULT,
            configurations: [
                {
                    id: 1,
                    key: 'cpu_limit',
                    value: '0.5',
                    profileName: `${name}`,
                    unit: 'mi',
                    active: true,
                },
                {
                    id: 2,
                    key: 'cpu_request',
                    value: '0.5',
                    profileName: `${name}`,
                    unit: 'mi',
                    active: true,
                },
                {
                    id: 3,
                    key: 'mem_limit',
                    value: '0.5',
                    profileName: `${name}`,
                    unit: 'mi',
                    active: true,
                },
                {
                    id: 4,
                    key: 'mem_request',
                    value: '0.5',
                    profileName: `${name}`,
                    unit: 'mi',
                    active: true,
                },
                {
                    id: 5,
                    key: 'build_timeout',
                    value: '0.5',
                    profileName: `${name}`,
                    unit: 'mi',
                    active: true,
                },
            ],
            appCount: 1,
            createdAt: '2021-06-01T06:30:00.000Z',
            updatedAt: '2021-06-01T06:30:00.000Z',
            createdBy: '1',
            updatedBy: '1',
        },
    },
})

const getBaseProfileObject = (
    fromCreateView: boolean,
    profile: BuildInfraProfileResponseDataType,
): BuildInfraProfileBase => {
    if (fromCreateView) {
        return CREATE_PROFILE_BASE_VALUE
    }

    return {
        id: profile.id,
        name: profile.name,
        description: profile.description,
        type: profile.type,
        appCount: profile.appCount,
    }
}

// Would recieve a single profile and return transformed response
export const getTransformedBuildInfraProfileResponse = ({
    configurationUnits,
    defaultConfigurations,
    profile,
    fromCreateView,
}: BuildInfraProfileTransformerType): BuildInfraProfileResponseType => {
    const configurationUnitsMap = configurationUnits?.reduce((acc, profileUnitList) => {
        acc[profileUnitList.name] = profileUnitList.units.reduce((accumulator, units) => {
            accumulator[units.name] = units
            return accumulator
        }, {} as ConfigurationUnitMapType)
        return acc
    }, {} as BuildInfraUnitsMapType)

    // Assuming would contain all the keys
    const defaultConfigurationsMap =
        defaultConfigurations?.reduce((acc, configuration) => {
            acc[configuration.key] = configuration
            return acc
        }, {}) ?? {}

    const profileConfigurations =
        profile?.configurations?.reduce((acc, configuration) => {
            acc[configuration.key] = configuration
            return acc
        }, {}) ?? {}

    // traversing defaultConfigurationsMap and if key is present in profileConfigurations then use that else use defaultConfigurationsMap
    const configurations = Object.keys(defaultConfigurationsMap).reduce((acc, key) => {
        const defaultConfiguration: BuildInfraConfigurationType = defaultConfigurationsMap[key]
        const profileConfiguration = profileConfigurations[key]
        if (fromCreateView) {
            acc[key] = {
                key,
                value: defaultConfiguration.value,
                unit: defaultConfiguration.unit,
                active: CREATE_VIEW_CHECKED_CONFIGS[key] ?? false,
            }
        } else if (profileConfiguration) {
            acc[key] = profileConfiguration
        } else {
            // Removing id from it since we do not have a configuration
            // While generating payload, we will check on the basis of id and active flag.
            acc[key] = {
                key,
                value: defaultConfiguration.value,
                // saving profile name as undefined and this would be a check, if we are deriving from default or not
                unit: defaultConfiguration.unit,
                active: false,
            }
        }
        acc[key].defaultValue = {
            value: defaultConfiguration.value,
            unit: defaultConfiguration.unit,
        }
        return acc
    }, {} as BuildInfraConfigurationMapType)

    return {
        configurationUnits: configurationUnitsMap,
        profile: {
            ...(profile && getBaseProfileObject(fromCreateView, profile)),
            configurations,
        },
    }
}

export const getBuildInfraProfileByName = async ({
    name,
    fromCreateView,
}: GetBuildInfraProfileType): Promise<BuildInfraProfileResponseType> => {
    try {
        const response = await get(`${ROUTES.INFRA_CONFIG_PROFILE}/${name}`)
        const {
            result: { configurationUnits, defaultConfigurations, profile },
        } = response as ResponseType<BuildInfraProfileAPIResponseType>

        return getTransformedBuildInfraProfileResponse({
            configurationUnits,
            defaultConfigurations,
            profile,
            fromCreateView,
        })
    } catch (error) {
        showError(error)
        throw error
    }
}

const getBuildInfraProfilePayload = (
    profileInput: CreateBuildInfraProfileType['profileInput'],
): CreateBuildInfraServicePayloadType => {
    const currentConfigurations = profileInput.configurations
    const configurationKeys = Object.keys(currentConfigurations) as BuildInfraConfigTypes[]
    // would only keep the configurations with id or active flag as true
    const configurations: CreateBuildInfraServiceConfigurationType[] = configurationKeys.reduce((acc, key) => {
        const configuration = currentConfigurations[key]
        if (configuration.id || configuration.active) {
            acc.push({
                id: configuration.id,
                key,
                value: configuration.value,
                unit: configuration.unit,
                active: configuration.active,
            })
        }
        return acc
    }, [] as CreateBuildInfraServiceConfigurationType[])

    const payload: CreateBuildInfraServicePayloadType = {
        name: profileInput.name,
        description: profileInput.description,
        type: profileInput.type,
        configurations,
    }
    return payload
}

export const updateBuildInfraProfile = async ({ name, profileInput }: UpdateBuildInfraProfileType) => {
    // Adding a timeout to show the loader
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const payload = getBuildInfraProfilePayload(profileInput)
    // TODO: Would remove this
    console.log(payload, 'edit payload')
    return Promise.resolve({
        code: 200,
        result: profileInput,
    })
    // return put(`${ROUTES}/${name}`, payload)
}

export const createBuildInfraProfile = async ({ profileInput }: CreateBuildInfraProfileType) => {
    // Adding a timeout to show the loader
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const payload = getBuildInfraProfilePayload(profileInput)
    // TODO: Remove this
    console.log(payload, 'create payload')
    return Promise.resolve({
        code: 200,
        result: profileInput,
    })
    // return post(`${ROUTES}/${name}`, payload)
}

export const deleteBuildInfraProfileByName = async (name: string) => {
    // Adding a timeout to show the loader
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return Promise.resolve({
        code: 200,
        result: null,
    })
    // return trash(`${ROUTES}/${name}`)
}
