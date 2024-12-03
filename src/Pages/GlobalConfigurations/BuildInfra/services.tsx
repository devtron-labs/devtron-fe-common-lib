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

import { getBuildInfraProfilePayload, getTransformedBuildInfraProfileResponse } from '@Pages/index'
import { ROUTES, get, post, put, showError } from '../../../Common'
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
        const {
            result: { configurationUnits, defaultConfigurations, profile },
        } = await get<BuildInfraProfileDTO>(`${ROUTES.INFRA_CONFIG_PROFILE}/${name}`)
        // const {
        //     result: { configurationUnits, defaultConfigurations, profile },
        // } = GLOBAL_PROFILE_MOCK

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

export const updateBuildInfraProfile = ({ name, profileInput }: UpdateBuildInfraProfileType) =>
    put<ReturnType<typeof put>, BuildInfraProfileInfoDTO>(
        `${ROUTES.INFRA_CONFIG_PROFILE}/${name}`,
        getBuildInfraProfilePayload(profileInput),
    )

export const createBuildInfraProfile = async ({ profileInput }: CreateBuildInfraProfileType) =>
    post<ReturnType<typeof post>, BuildInfraProfileInfoDTO>(
        ROUTES.INFRA_CONFIG_PROFILE,
        getBuildInfraProfilePayload(profileInput),
    )
