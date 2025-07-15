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
    GetUserPreferencesParsedDTO,
    GetUserPreferencesQueryParamsType,
    PreferredResourceKindType,
    UpdateUserPreferencesPayloadType,
    UserPathValueMapType,
    UserPreferenceFilteredListTypes,
    UserPreferenceResourceActions,
    UserPreferenceResourceProps,
    UserPreferencesPayloadValueType,
    UserPreferencesType,
    ViewIsPipelineRBACConfiguredRadioTabs,
} from './types'
import { getFilteredUniqueAppList, getParsedResourcesMap } from './utils'

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
 * Centralized function to build updated resources map
 * This eliminates the need to manually update resources in multiple places
 */
const buildUpdatedResourcesMap = (
    existingResources: UserPreferencesType['resources'],
    resourceKind: string,
    value: any,
) => {
    const baseResources = existingResources || {}

    return {
        ...baseResources,
        [resourceKind]: {
            ...baseResources[resourceKind],
            [UserPreferenceResourceActions.RECENTLY_VISITED]: Array.isArray(value)
                ? value.map(({ id, name }) => ({ id, name }))
                : [],
        },
    }
}

/**
 * @description This function updates the user preferences in the server.
 * @param path - The path of the user preference to be updated.
 * @param value - The value of the user preference to be updated.
 * @param resourceKind - The resource kind to be updated.
 * @param userPreferencesResponse - The current user preferences response. If not provided, it will be fetched from the server.
 * @returns
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
            return {
                resources: buildUpdatedResourcesMap(userPreferencesResponse?.resources, resourceKind, value),
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
        // If userPreferencesResponse is not provided, fetch current preferences
        const currentUserPreferences = userPreferencesResponse || (await getUserPreferences())

        const payload: UpdateUserPreferencesPayloadType = {
            key: USER_PREFERENCES_ATTRIBUTE_KEY,
            value: JSON.stringify(
                await getUserPreferencePayload({
                    path,
                    value,
                    resourceKind,
                    userPreferencesResponse: currentUserPreferences,
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

/**
 * Optimized function to get updated user preferences with resource filtering
 * Can work with provided userPreferences or fetch from server/localStorage
 * Centralizes all resource updating logic
 */
export const getUpdatedUserPreferences = async ({
    id,
    name,
    resourceKind,
    userPreferencesResponse,
}: UserPreferenceFilteredListTypes & {
    userPreferencesResponse?: UserPreferencesType
}): Promise<UserPreferencesType> => {
    // Get base user preferences from multiple sources (priority: provided > localStorage > server)
    let baseUserPreferences: UserPreferencesType

    if (userPreferencesResponse) {
        baseUserPreferences = userPreferencesResponse
    } else {
        try {
            const localStorageData = localStorage.getItem('userPreferences')
            if (localStorageData) {
                baseUserPreferences = JSON.parse(localStorageData)
            } else {
                baseUserPreferences = await getUserPreferences()
            }
        } catch {
            baseUserPreferences = await getUserPreferences()
        }
    }

    // If no resourceKind provided, return base preferences
    if (!resourceKind) {
        return baseUserPreferences
    }

    // Get filtered unique apps using centralized logic
    const uniqueFilteredApps = getFilteredUniqueAppList({
        userPreferencesResponse: baseUserPreferences,
        id,
        name,
        resourceKind,
    })

    // Use centralized resource building function
    const updatedResources = buildUpdatedResourcesMap(baseUserPreferences?.resources, resourceKind, uniqueFilteredApps)

    return {
        ...baseUserPreferences,
        resources: updatedResources,
    }
}

/**
 * Centralized function to update and persist user preferences
 * Handles both local state and server updates automatically
 * Eliminates the need for manual resource management in multiple places
 */
export const updateAndPersistUserPreferences = async ({
    id,
    name,
    resourceKind,
    shouldThrowError = false,
    updateLocalStorage = true,
}: {
    id?: number
    name?: string
    resourceKind?: PreferredResourceKindType
    shouldThrowError?: boolean
    updateLocalStorage?: boolean
}): Promise<UserPreferencesType> => {
    // Get updated preferences with filtered resources
    const updatedPreferences = await getUpdatedUserPreferences({
        id,
        name,
        resourceKind,
    })

    // Update localStorage if requested
    if (updateLocalStorage) {
        localStorage.setItem('userPreferences', JSON.stringify(updatedPreferences))
    }

    // Update server with the new resource list if resourceKind is provided
    if (resourceKind && updatedPreferences.resources?.[resourceKind]) {
        await updateUserPreferences({
            path: 'resources',
            value: updatedPreferences.resources[resourceKind][UserPreferenceResourceActions.RECENTLY_VISITED],
            resourceKind,
            shouldThrowError,
            userPreferencesResponse: updatedPreferences,
        })
    }

    return updatedPreferences
}
