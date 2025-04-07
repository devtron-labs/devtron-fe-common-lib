import { BaseAppMetaData, ResourceKindType } from '@Shared/index'
import { UserPreferenceFilteredListTypes, UserPreferenceResourceActions, UserPreferenceResourceType } from './types'

export const getUserPreferenceResourcesMetadata = (recentlyVisited: BaseAppMetaData[]): UserPreferenceResourceType => ({
    [ResourceKindType.devtronApplication]: {
        [UserPreferenceResourceActions.RECENTLY_VISITED]: recentlyVisited.map(({ appId, appName }) => ({
            appId,
            appName,
        })),
    },
})

export const getFilteredUniqueAppList = ({
    userPreferencesResponse,
    appId,
    appName,
}: UserPreferenceFilteredListTypes) => {
    const _recentApps =
        userPreferencesResponse?.resources?.[ResourceKindType.devtronApplication]?.[
            UserPreferenceResourceActions.RECENTLY_VISITED
        ] || []

    const isInvalidApp = appId && !appName

    const validApps = _recentApps.filter((app) => {
        if (!app?.appId || !app?.appName) {
            return false
        }

        if (isInvalidApp) {
            return app.appId !== appId
        }

        return true
    })

    // Convert to a Map for uniqueness while maintaining stacking order
    const uniqueApps = (
        appId && appName ? [{ appId, appName }, ...validApps.filter((app) => app.appId !== appId)] : validApps
    ).slice(0, 6) // Limit to 6 items

    return uniqueApps
}
