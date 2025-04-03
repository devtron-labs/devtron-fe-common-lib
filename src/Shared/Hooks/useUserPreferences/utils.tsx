import { BaseAppMetaData, ResourceKindType, UserPreferenceResourceKeys } from '@Shared/index'
import { UserPreferenceFilteredListTypes, UserPreferenceResourceActions, UserPreferenceResourceType } from './types'

export const getUserPreferenceResourcesMetaData = (recentlyVisited: BaseAppMetaData[]): UserPreferenceResourceType =>
    UserPreferenceResourceKeys.reduce((acc, resource) => {
        acc[resource] = {
            [UserPreferenceResourceActions.RECENTLY_VISITED]: recentlyVisited,
        }
        return acc
    }, {} as UserPreferenceResourceType)

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

    // Ensure all items have valid `appId` and `appName`
    const validApps = _recentApps.filter((app) => app?.appId && app?.appName)

    // Convert to a Map for uniqueness while maintaining stacking order
    const uniqueApps = [
        { appId, appName }, // Ensure new app is on top
        ...validApps.filter((app) => app.appId !== appId), // Keep previous order, remove duplicate
    ].slice(0, 6) // Limit to 6 items

    const uniqueFilteredApps = isInvalidAppId ? uniqueApps.filter((app) => app.appId !== Number(appId)) : uniqueApps
    return uniqueFilteredApps
}
