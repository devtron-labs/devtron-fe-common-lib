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

import { ViewIsPipelineRBACConfiguredRadioTabs } from '@Shared/types'
import { get, getUrlWithSearchParams, post, ROUTES, showError } from '../../Common'
import { USER_PREFERENCES_ATTRIBUTE_KEY } from './constants'
import {
    GetPolicyApiUrlProps,
    GetResourceApiUrlProps,
    GetUserPreferencesParsedDTO,
    GetUserPreferencesQueryParamsType,
    UpdateUserPreferencesParsedValueType,
    UpdateUserPreferencesPayloadType,
    UserPreferencesType,
} from './types'

export const getResourceApiUrl = <T>({ baseUrl, kind, version, suffix, queryParams }: GetResourceApiUrlProps<T>) =>
    getUrlWithSearchParams(`${baseUrl}/${kind}/${version}${suffix ? `/${suffix}` : ''}`, queryParams)

export const getPolicyApiUrl = <T>({ kind, version, queryParams, suffix }: GetPolicyApiUrlProps<T>) =>
    getUrlWithSearchParams(`global/policy/${kind}/${version}${suffix ? `/${suffix}` : ''}`, queryParams)

export const saveCDPipeline = (request) => post(ROUTES.CD_CONFIG, request)

export const getUserPreferences = async (): Promise<UserPreferencesType> => {
    const queryParamsPayload: Pick<GetUserPreferencesQueryParamsType, 'key'> = {
        key: USER_PREFERENCES_ATTRIBUTE_KEY,
    }

    const { result } = await get<{ value: string }>(
        getUrlWithSearchParams(`${ROUTES.ATTRIBUTES_USER}/${ROUTES.GET}`, queryParamsPayload),
    )

    if (!result?.value) {
        return null
    }

    const parsedResult: GetUserPreferencesParsedDTO = JSON.parse(result.value)

    const pipelineRBACViewSelectedTab = parsedResult.viewPermittedEnvOnly
        ? ViewIsPipelineRBACConfiguredRadioTabs.ACCESS_ONLY
        : ViewIsPipelineRBACConfiguredRadioTabs.ALL_ENVIRONMENTS

    return {
        pipelineRBACViewSelectedTab,
    }
}

export const updateUserPreferences = async (
    updatedUserPreferences: UserPreferencesType,
    shouldThrowError: boolean = false,
): Promise<boolean> => {
    try {
        const value: UpdateUserPreferencesParsedValueType = {
            viewPermittedEnvOnly:
                updatedUserPreferences.pipelineRBACViewSelectedTab ===
                ViewIsPipelineRBACConfiguredRadioTabs.ACCESS_ONLY,
        }

        const payload: UpdateUserPreferencesPayloadType = {
            key: USER_PREFERENCES_ATTRIBUTE_KEY,
            value: JSON.stringify(value),
        }

        await post(`${ROUTES.ATTRIBUTES_USER}/${ROUTES.UPDATE}`, payload)
        return true
    } catch (error) {
        if (shouldThrowError) {
            throw error
        }

        showError(error)
        return false
    }
}
