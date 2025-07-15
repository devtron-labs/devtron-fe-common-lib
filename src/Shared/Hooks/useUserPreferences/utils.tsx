import { DEFAULT_RESOURCES_MAP } from './constants'
import {
    GetUserPreferencesParsedDTO,
    UserPreferenceFilteredListTypes,
    UserPreferenceResourceActions,
    UserPreferencesType,
} from './types'

export const getFilteredUniqueAppList = ({
    userPreferencesResponse,
    id,
    name,
    resourceKind,
}: UserPreferenceFilteredListTypes) => {
    const _recentApps =
        userPreferencesResponse?.resources?.[resourceKind]?.[UserPreferenceResourceActions.RECENTLY_VISITED] || []

    const isInvalidApp = id && !name

    const validEntities = _recentApps.filter((app) => {
        if (!app?.id || !app.name) {
            return false
        }

        if (isInvalidApp) {
            return app.id !== id
        }

        return true
    })

    // Convert to a Map for uniqueness while maintaining stacking order
    const uniqueApps = (
        id && name ? [{ id, name }, ...validEntities.filter((entity) => entity.id !== id)] : validEntities
    ).slice(0, 6) // Limit to 6 items

    return uniqueApps
}

export const getParsedResourcesMap = (
    resources: GetUserPreferencesParsedDTO['resources'],
): UserPreferencesType['resources'] => {
    const parsedResourcesMap: UserPreferencesType['resources'] = {}

    Object.keys(DEFAULT_RESOURCES_MAP).forEach((resourceKind) => {
        parsedResourcesMap[resourceKind] = resources?.[resourceKind]
    })

    return parsedResourcesMap || {}
}
