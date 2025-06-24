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

import { ROUTES } from '@Common/Constants'
import { get, getUrlWithSearchParams, patch, showError } from '@Common/index'
import { THEME_PREFERENCE_MAP } from '@Shared/Providers/ThemeProvider/types'

import { USER_PREFERENCES_ATTRIBUTE_KEY } from './constants'
import {
    BaseRecentlyVisitedEntitiesTypes,
    GetUserPreferencesParsedDTO,
    GetUserPreferencesQueryParamsType,
    UpdateUserPreferencesPayloadType,
    UserPathValueMapType,
    UserPreferenceResourceActions,
    UserPreferenceResourceProps,
    UserPreferencesPayloadValueType,
    UserPreferencesType,
    ViewIsPipelineRBACConfiguredRadioTabs,
} from './types'
import { getUserPreferenceResourcesMetadata } from './utils'

export const getParsedResourcesMap = (resources: GetUserPreferencesParsedDTO['resources']) => {
    const resourcesMap = resources || {}
    const parsedResourcesMap: UserPreferencesType['resources'] = {}

    Object.entries(resourcesMap).forEach(([resourceKind, resourceActions]) => {
        parsedResourcesMap[resourceKind] = resourceActions
    })

    return parsedResourcesMap
}

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
        resources: getParsedResourcesMap(parsedResult.resources),
    }
}
/**
 * @description This function updates the user preferences in the server. It constructs a payload with the updated user preferences and sends a PATCH request to the server. If the request is successful, it returns true. If an error occurs, it shows an error message and returns false.
 * @param updatedUserPreferences - The updated user preferences to be sent to the server.
 * @param recentlyVisitedDevtronApps - The recently visited Devtron apps to be sent to the server.
 * @param shouldThrowError - A boolean indicating whether to throw an error if the request fails. Default is false.
 * @returns A promise that resolves to true if the request is successful, or false if an error occurs.
 * @throws Will throw an error if `shouldThrowError` is true and the request fails.
 */

const getUserPreferencePayload = async ({
    path,
    value,
    resourceKind,
    userPreferencesResponse,
}: UserPathValueMapType): Promise<Partial<UserPreferencesPayloadValueType>> => {
    switch (path) {
        case 'themePreference':
            return {
                computedAppTheme:
                    value.themePreference === THEME_PREFERENCE_MAP.auto ? `system-${value.appTheme}` : value.appTheme,
            }
        case 'pipelineRBACViewSelectedTab':
            return {
                viewPermittedEnvOnly:
                    value.pipelineRBACViewSelectedTab === ViewIsPipelineRBACConfiguredRadioTabs.ACCESS_ONLY,
            }

        case 'resources': {
            const existingResources = userPreferencesResponse?.resources || {}

            const updatedResources = {
                ...existingResources,
                [resourceKind]: {
                    ...existingResources[resourceKind],
                    [UserPreferenceResourceActions.RECENTLY_VISITED]:
                        getUserPreferenceResourcesMetadata(value as BaseRecentlyVisitedEntitiesTypes[], resourceKind)[
                            resourceKind
                        ]?.[UserPreferenceResourceActions.RECENTLY_VISITED] || [],
                },
            }

            return {
                resources: updatedResources,
            }
        }
        default:
            return {}
    }
}

export const updateUserPreferences = async ({
    path,
    value,
    resourceKind,
    shouldThrowError = false,
    userPreferencesResponse,
}: UserPreferenceResourceProps): Promise<boolean> => {
    try {
        const payload: UpdateUserPreferencesPayloadType = {
            key: USER_PREFERENCES_ATTRIBUTE_KEY,
            value: JSON.stringify(
                await getUserPreferencePayload({
                    path,
                    value,
                    resourceKind,
                    userPreferencesResponse,
                } as UserPathValueMapType),
            ),
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
