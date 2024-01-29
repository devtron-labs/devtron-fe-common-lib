import { ROUTES, ResponseType, get, post, put, showError } from '../../../Common'
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
    CreateBuildInfraProfileType,
    CreateBuildInfraServicePayloadType,
    CreateBuildInfraServiceConfigurationType,
    GetBuildInfraProfileType,
    UpdateBuildInfraProfileType,
    BuildInfraConfigurationMapWithoutDefaultType,
} from './types'

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

// Would receive a single profile and return transformed response
export const getTransformedBuildInfraProfileResponse = ({
    configurationUnits,
    defaultConfigurations,
    profile,
    fromCreateView,
}: BuildInfraProfileTransformerType): BuildInfraProfileResponseType => {
    // Assuming would contain all the keys
    const defaultConfigurationsMap =
        defaultConfigurations?.reduce((acc, configuration) => {
            acc[configuration.key] = configuration
            return acc
        }, {} as BuildInfraConfigurationMapWithoutDefaultType) ?? ({} as BuildInfraConfigurationMapWithoutDefaultType)

    const profileConfigurations =
        profile?.configurations?.reduce((acc, configuration) => {
            acc[configuration.key] = configuration
            return acc
        }, {} as BuildInfraConfigurationMapWithoutDefaultType) ?? ({} as BuildInfraConfigurationMapWithoutDefaultType)

    const configurations = Object.keys(defaultConfigurationsMap).reduce((acc, key) => {
        const defaultConfiguration: BuildInfraConfigurationType = defaultConfigurationsMap[key]
        const profileConfiguration = profileConfigurations[key]
        // Pushing default value in configurations in case we de-activate the configuration
        const defaultValue = {
            value: defaultConfiguration.value,
            unit: defaultConfiguration.unit,
        }

        if (fromCreateView) {
            acc[key] = {
                key,
                value: defaultConfiguration.value,
                unit: defaultConfiguration.unit,
                active: CREATE_VIEW_CHECKED_CONFIGS[key] ?? false,
                defaultValue,
            }
            return acc
        }

        if (profileConfiguration) {
            acc[key] = {
                ...profileConfiguration,
                defaultValue,
            }
            return acc
        }

        // Removing id from it since we do not have a configuration
        // While generating payload, we will check on the basis of id and active flag.
        acc[key] = {
            key,
            value: defaultConfiguration.value,
            // saving profile name as undefined and this would be a check, if we are deriving from default or not
            unit: defaultConfiguration.unit,
            active: false,
            defaultValue,
        }
        return acc
    }, {} as BuildInfraConfigurationMapType)

    return {
        configurationUnits,
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
                // TODO: Ask maybe can send 0 instead of null
                id: configuration.id,
                key,
                value: Number(configuration.value),
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

export const updateBuildInfraProfile = ({ name, profileInput }: UpdateBuildInfraProfileType) => {
    const payload = getBuildInfraProfilePayload(profileInput)
    return put(`${ROUTES.INFRA_CONFIG_PROFILE}/${name}`, payload)
}

export const createBuildInfraProfile = async ({ profileInput }: CreateBuildInfraProfileType) => {
    const payload = getBuildInfraProfilePayload(profileInput)
    return post(ROUTES.INFRA_CONFIG_PROFILE, payload)
}
