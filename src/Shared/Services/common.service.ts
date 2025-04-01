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

import { AppConfigProps, GetTemplateAPIRouteType } from '@Pages/index'
import { ViewIsPipelineRBACConfiguredRadioTabs } from '@Shared/types'
import { THEME_PREFERENCE_MAP } from '@Shared/Providers/ThemeProvider/types'
import { BaseAppMetaData, getTemplateAPIRoute, ResourceKindType, ResourcesKindTypeActions, ResourceType } from '..'
import { get, getUrlWithSearchParams, patch, post, ROUTES, showError } from '../../Common'
import { USER_PREFERENCES_ATTRIBUTE_KEY } from './constants'
import {
    EnvironmentDataValuesDTO,
    GetPolicyApiUrlProps,
    GetResourceApiUrlProps,
    GetUserPreferencesParsedDTO,
    GetUserPreferencesQueryParamsType,
    UpdatedUserPreferencesType,
    UserPreferencesPayloadValueType,
    UpdateUserPreferencesPayloadType,
    UserPreferencesType,
} from './types'

export const getResourceApiUrl = <T>({ baseUrl, kind, version, suffix, queryParams }: GetResourceApiUrlProps<T>) =>
    getUrlWithSearchParams(`${baseUrl}/${kind}/${version}${suffix ? `/${suffix}` : ''}`, queryParams)

export const getPolicyApiUrl = <T>({ kind, version, queryParams, suffix }: GetPolicyApiUrlProps<T>) =>
    getUrlWithSearchParams(`global/policy/${kind}/${version}${suffix ? `/${suffix}` : ''}`, queryParams)

export const saveCDPipeline = (request, { isTemplateView }: Required<Pick<AppConfigProps, 'isTemplateView'>>) => {
    const url = isTemplateView
        ? getTemplateAPIRoute({
              type: GetTemplateAPIRouteType.CD_PIPELINE,
              queryParams: {
                  id: request.appId,
              },
          })
        : ROUTES.CD_CONFIG

    return post(url, request)
}

export const getEnvironmentData = () => get<EnvironmentDataValuesDTO>(ROUTES.ENVIRONMENT_DATA)

/**
 * @returns UserPreferencesType
 * @description This function fetches the user preferences from the server. It uses the `get` method to make a request to the server and retrieves the user preferences based on the `USER_PREFERENCES_ATTRIBUTE_KEY`. The result is parsed and returned as a `UserPreferencesType` object.
 * @throws Will throw an error if the request fails or if the result is not in the expected format.
 */
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
        themePreference:
            parsedResult.computedAppTheme === 'system-dark' || parsedResult.computedAppTheme === 'system-light'
                ? THEME_PREFERENCE_MAP.auto
                : parsedResult.computedAppTheme,
        resources: parsedResult.resources,
    }
}

export const resourceTypes: ResourceKindType[] = [ResourceKindType.devtronApplication]

const resourcesObj = (recentlyVisited: BaseAppMetaData[]): ResourceType =>
    resourceTypes.reduce((acc, resource) => {
        acc[resource] = {
            [ResourcesKindTypeActions.RECENTLY_VISITED]: recentlyVisited,
        }
        return acc
    }, {} as ResourceType)

/**
 * @description This function updates the user preferences in the server. It constructs a payload with the updated user preferences and sends a PATCH request to the server. If the request is successful, it returns true. If an error occurs, it shows an error message and returns false.
 * @param updatedUserPreferences - The updated user preferences to be sent to the server.
 * @param recentlyVisitedDevtronApps - The recently visited Devtron apps to be sent to the server.
 * @param shouldThrowError - A boolean indicating whether to throw an error if the request fails. Default is false.
 * @returns A promise that resolves to true if the request is successful, or false if an error occurs.
 * @throws Will throw an error if `shouldThrowError` is true and the request fails.
 */

export const updateUserPreferences = async (
    updatedUserPreferences?: UpdatedUserPreferencesType,
    recentlyVisitedDevtronApps?: BaseAppMetaData[],
    shouldThrowError: boolean = false,
): Promise<boolean> => {
    try {
        let value: UserPreferencesPayloadValueType = null
        const { themePreference, appTheme, pipelineRBACViewSelectedTab } = updatedUserPreferences
        value = {
            viewPermittedEnvOnly: pipelineRBACViewSelectedTab === ViewIsPipelineRBACConfiguredRadioTabs.ACCESS_ONLY,
            computedAppTheme: themePreference === THEME_PREFERENCE_MAP.auto ? `system-${appTheme}` : appTheme,
        }
        if (recentlyVisitedDevtronApps?.length) {
            value.resources = resourcesObj(recentlyVisitedDevtronApps)
        }

        const payload: UpdateUserPreferencesPayloadType = {
            key: USER_PREFERENCES_ATTRIBUTE_KEY,
            value: JSON.stringify(value),
        }

        await patch(`${ROUTES.ATTRIBUTES_USER}/${ROUTES.PATCH}`, payload)
        return true
    } catch (error) {
        if (shouldThrowError) {
            throw error
        }

        showError(error)
        return false
    }
}
