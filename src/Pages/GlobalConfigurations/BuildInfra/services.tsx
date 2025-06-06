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
    BuildInfraPayloadType,
    getBuildInfraProfileEndpoint,
    getBuildInfraProfilePayload,
    getTransformedBuildInfraProfileResponse,
} from '@Pages/index'

import { get, getUrlWithSearchParams, post, put, showError } from '../../../Common'
import {
    BuildInfraProfileDTO,
    BuildInfraProfileResponseType,
    GetBuildInfraProfileType,
    UpsertBuildInfraProfileServiceParamsType,
} from './types'

export const getBuildInfraProfileByName = async ({
    name,
    fromCreateView,
    canConfigureUseK8sDriver,
}: GetBuildInfraProfileType): Promise<BuildInfraProfileResponseType> => {
    try {
        const profilePayload: Pick<BuildInfraProfileDTO['profile'], 'name'> = { name }

        const {
            result: { configurationUnits, defaultConfigurations, profile },
        } = await get<BuildInfraProfileDTO>(getUrlWithSearchParams(getBuildInfraProfileEndpoint(), profilePayload))

        return getTransformedBuildInfraProfileResponse({
            configurationUnits,
            defaultConfigurations,
            profile,
            fromCreateView,
            canConfigureUseK8sDriver,
        })
    } catch (error) {
        showError(error)
        throw error
    }
}

export const createBuildInfraProfileService = async (payload: BuildInfraPayloadType) => {
    const response = await post<ReturnType<typeof post>, BuildInfraPayloadType>(getBuildInfraProfileEndpoint(), payload)
    return response
}

export const upsertBuildInfraProfile = async ({
    name,
    profileInput,
    canConfigureUseK8sDriver,
}: UpsertBuildInfraProfileServiceParamsType) => {
    const isEditView = !!name
    const payload = getBuildInfraProfilePayload(profileInput, canConfigureUseK8sDriver)

    if (isEditView) {
        const updateProfileQueryPayload: Pick<BuildInfraProfileDTO['profile'], 'name'> = { name }
        const response = await put<ReturnType<typeof put>, BuildInfraPayloadType>(
            getUrlWithSearchParams(getBuildInfraProfileEndpoint(), updateProfileQueryPayload),
            payload,
        )

        return response
    }

    const response = await createBuildInfraProfileService(payload)
    return response
}
