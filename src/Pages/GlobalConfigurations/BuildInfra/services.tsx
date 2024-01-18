// TODO: Remove these comment on API integration
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import { get, post, put, trash } from '../../../Common'
import {
    BuildInfraConfigTypes,
    BuildInfraConfigurationMapType,
    BuildInfraConfigurationType,
    BuildInfraProfileAPIResponseType,
    BuildInfraProfileResponseType,
    BuildInfraProfileVariants,
    BuildInfraUnitsMapType,
    ConfigurationUnitMapType,
    CreateBuildInfraProfileType,
    CreateBuildInfraSerivcePayloadType,
    CreateBuildInfraServiceConfigurationType,
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
            type: BuildInfraProfileVariants.NORMAL,
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

// Would recieve a single profile and return transformed response
export const getTransformedBuildInfraProfileResponse = ({
    configurationUnits,
    defaultConfigurations,
    profile,
}: BuildInfraProfileAPIResponseType): BuildInfraProfileResponseType => {
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
        // TODO: Would remove profileName from it since it can change and won't send profileName to api
        if (profileConfiguration) {
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
            ...(profile && profile),
            configurations,
        },
    }
}

export const getBuildInfraProfileByName = async (name: string): Promise<BuildInfraProfileResponseType> => {
    // Adding a timeout to show the loader
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 1000))
    // TODO: Capture error for toast

    const response = await Promise.resolve(getSampleResponse1(name))
    const { code, result } = response

    if (code === 200 && result) {
        const { configurationUnits, defaultConfigurations, profile } = result as BuildInfraProfileAPIResponseType
        return getTransformedBuildInfraProfileResponse({ configurationUnits, defaultConfigurations, profile })
    }

    return {
        configurationUnits: null,
        profile: null,
    }
    // return get(`${ROUTES}/${name}`)
}

const getBuildInfraProfilePayload = (
    profileInput: CreateBuildInfraProfileType['profileInput'],
): CreateBuildInfraSerivcePayloadType => {
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

    const payload: CreateBuildInfraSerivcePayloadType = {
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
