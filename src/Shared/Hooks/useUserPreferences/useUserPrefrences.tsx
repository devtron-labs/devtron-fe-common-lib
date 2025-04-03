import { ResourceKindType, useTheme } from '@Shared/index'
import { useState } from 'react'
import { ServerErrors } from '@Common/ServerError'
import {
    UserPreferenceResourceActions,
    UserPreferencesType,
    UseUserPreferencesProps,
    ViewIsPipelineRBACConfiguredRadioTabs,
} from './types'
import { getUserPreferences, updateUserPreferences } from './service'

export const useUserPreferences = ({ migrateUserPreferences }: UseUserPreferencesProps) => {
    const [userPreferences, setUserPreferences] = useState<UserPreferencesType>(null)
    const [userPreferencesError, setUserPreferencesError] = useState<ServerErrors>(null)

    const { handleThemeSwitcherDialogVisibilityChange, handleThemePreferenceChange } = useTheme()

    const fetchRecentlyVisitedParsedApps = async (appId: number, appName: string, isInvalidAppId: boolean = false) => {
        const userPreferencesResponse = await getUserPreferences()
        const _recentApps =
            userPreferencesResponse?.resources?.[ResourceKindType.devtronApplication]?.[
                UserPreferenceResourceActions.RECENTLY_VISITED
            ] || []

        // Ensure all items have valid `appId` and `appName`
        const validApps = _recentApps.filter((app) => app?.appId && app?.appName)

        // Convert to a Map for uniqueness while maintaining stacking order
        const uniqueApps = [
            { appId, appName }, // Ensure new app is on top
            ...validApps.filter((app) => app.appId !== appId), // Keep previous order, remove duplicate
        ].slice(0, 6) // Limit to 6 items

        const uniqueFilteredApps = isInvalidAppId ? uniqueApps.filter((app) => app.appId !== Number(appId)) : uniqueApps
        setUserPreferences((prev) => ({
            ...prev,
            resources: {
                ...prev?.resources,
                [ResourceKindType.devtronApplication]: {
                    ...prev?.resources?.[ResourceKindType.devtronApplication],
                    [UserPreferenceResourceActions.RECENTLY_VISITED]: uniqueFilteredApps,
                },
            },
        }))
        await updateUserPreferences(null, uniqueFilteredApps)
    }

    const handleInitializeUserPreferencesFromResponse = (userPreferencesResponse: UserPreferencesType) => {
        if (!userPreferencesResponse?.themePreference) {
            handleThemeSwitcherDialogVisibilityChange(true)
        } else if (userPreferencesResponse?.themePreference) {
            handleThemePreferenceChange(userPreferencesResponse?.themePreference)
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
        fetchRecentlyVisitedParsedApps,
    }
}
