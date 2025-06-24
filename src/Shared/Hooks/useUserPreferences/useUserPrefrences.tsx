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

import { useState } from 'react'

import { useAsync } from '@Common/Helper'
import { ServerErrors } from '@Common/ServerError'
import { useTheme } from '@Shared/Providers'

import { getUserPreferences, updateUserPreferences } from './service'
import {
    BaseRecentlyVisitedEntitiesTypes,
    UserPreferenceResourceActions,
    UserPreferencesType,
    UseUserPreferencesProps,
    ViewIsPipelineRBACConfiguredRadioTabs,
} from './types'
import { getFilteredUniqueAppList } from './utils'

export const useUserPreferences = ({ migrateUserPreferences, recentlyVisitedFetchConfig }: UseUserPreferencesProps) => {
    const [userPreferences, setUserPreferences] = useState<UserPreferencesType>(null)
    const [userPreferencesError, setUserPreferencesError] = useState<ServerErrors>(null)

    const { id, name, resourceKind, isDataAvailable } = recentlyVisitedFetchConfig ?? {}

    const { handleThemeSwitcherDialogVisibilityChange, handleThemePreferenceChange } = useTheme()

    const fetchRecentlyVisitedParsedEntities = async (): Promise<UserPreferencesType> => {
        const userPreferencesResponse = await getUserPreferences()

        const uniqueFilteredApps = getFilteredUniqueAppList({
            userPreferencesResponse,
            id,
            name,
            resourceKind,
        })

        await updateUserPreferences({
            path: 'resources',
            value: uniqueFilteredApps,
            resourceKind,
            userPreferencesResponse,
        })

        const updatedUserPreferences = {
            ...userPreferencesResponse,
            resources: {
                ...userPreferencesResponse?.resources,
                [resourceKind]: {
                    ...userPreferencesResponse?.resources?.[resourceKind],
                    [UserPreferenceResourceActions.RECENTLY_VISITED]: uniqueFilteredApps,
                },
            },
        }

        return updatedUserPreferences
    }

    const [, recentResourcesResult] = useAsync(() => fetchRecentlyVisitedParsedEntities(), [id, name], isDataAvailable)

    const recentlyVisitedResources =
        recentResourcesResult?.resources?.[resourceKind]?.[UserPreferenceResourceActions.RECENTLY_VISITED] ||
        ([] as BaseRecentlyVisitedEntitiesTypes[])

    const handleInitializeUserPreferencesFromResponse = (userPreferencesResponse: UserPreferencesType) => {
        if (!userPreferencesResponse?.themePreference) {
            handleThemeSwitcherDialogVisibilityChange(true)
        } else if (userPreferencesResponse?.themePreference) {
            handleThemePreferenceChange(userPreferencesResponse.themePreference)
        }
        setUserPreferences(userPreferencesResponse)
    }

    const handleFetchUserPreferences = async () => {
        try {
            setUserPreferencesError(null)
            const userPreferencesResponse = await getUserPreferences()
            if (migrateUserPreferences) {
                const migratedUserPreferences = await migrateUserPreferences(userPreferencesResponse)
                handleInitializeUserPreferencesFromResponse(migratedUserPreferences)
            } else {
                handleInitializeUserPreferencesFromResponse(userPreferencesResponse)
            }
        } catch (error) {
            setUserPreferencesError(error)
        }
    }

    // To handle in case through browser prompt user cancelled the refresh
    const handleUpdatePipelineRBACViewSelectedTab = (selectedTab: ViewIsPipelineRBACConfiguredRadioTabs) => {
        setUserPreferences((prev) => ({
            ...prev,
            pipelineRBACViewSelectedTab: selectedTab,
        }))
    }

    const handleUpdateUserThemePreference = (themePreference: UserPreferencesType['themePreference']) => {
        setUserPreferences((prev) => ({
            ...prev,
            themePreference,
        }))
    }

    return {
        userPreferences,
        userPreferencesError,
        handleFetchUserPreferences,
        handleUpdatePipelineRBACViewSelectedTab,
        handleUpdateUserThemePreference,
        fetchRecentlyVisitedParsedEntities,
        recentlyVisitedResources,
    }
}
