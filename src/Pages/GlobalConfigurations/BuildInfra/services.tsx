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
    getBuildInfraProfileEndpoint,
    getBuildInfraProfilePayload,
    getTransformedBuildInfraProfileResponse,
} from '@Pages/index'
import { get, getUrlWithSearchParams, post, put, showError } from '../../../Common'
import {
    BuildInfraProfileDTO,
    BuildInfraProfileInfoDTO,
    BuildInfraProfileResponseType,
    CreateBuildInfraProfileType,
    GetBuildInfraProfileType,
    UpdateBuildInfraProfileType,
} from './types'

export const getBuildInfraProfileByName = async ({
    name,
    fromCreateView,
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
        })
    } catch (error) {
        showError(error)
        throw error
    }
}

export const updateBuildInfraProfile = async ({ name, profileInput }: UpdateBuildInfraProfileType) => {
    const updateProfilePayload: Pick<BuildInfraProfileDTO['profile'], 'name'> = { name }
    const response = await put<ReturnType<typeof put>, BuildInfraProfileInfoDTO>(
        getUrlWithSearchParams(getBuildInfraProfileEndpoint(), updateProfilePayload),
        getBuildInfraProfilePayload(profileInput),
    )

    return response
}

export const createBuildInfraProfile = async ({ profileInput }: CreateBuildInfraProfileType) =>
    post<ReturnType<typeof post>, BuildInfraProfileInfoDTO>(
        getBuildInfraProfileEndpoint(),
        getBuildInfraProfilePayload(profileInput),
    )
