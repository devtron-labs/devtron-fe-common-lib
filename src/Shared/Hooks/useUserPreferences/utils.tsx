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
    isInvalidAppId,
}: UserPreferenceFilteredListTypes) => {
    const _recentApps =
        userPreferencesResponse?.resources?.[ResourceKindType.devtronApplication]?.[
            UserPreferenceResourceActions.RECENTLY_VISITED
        ] || []

    const validApps = _recentApps.filter((app) => app?.appId && app?.appName)

    // Convert to a Map for uniqueness while maintaining stacking order
    const uniqueApps = (
        appId && appName ? [{ appId, appName }, ...validApps.filter((app) => app.appId !== appId)] : validApps
    ).slice(0, 6) // Limit to 6 items

    return isInvalidAppId ? uniqueApps.filter((app) => app.appId !== Number(appId)) : uniqueApps
}
