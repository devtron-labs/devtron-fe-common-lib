import {
    BaseRecentlyVisitedEntitiesTypes,
    PreferredResourceKindType,
    UserPreferenceFilteredListTypes,
    UserPreferenceResourceActions,
    UserPreferenceResourceType,
} from './types'

export const getUserPreferenceResourcesMetadata = (
    recentlyVisited: BaseRecentlyVisitedEntitiesTypes[],
    resourceKind: PreferredResourceKindType,
): UserPreferenceResourceType => ({
    [resourceKind]: {
        [UserPreferenceResourceActions.RECENTLY_VISITED]: recentlyVisited.map(({ id, name }) => ({
            id,
            name,
        })),
    },
})

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
        if (!app?.id || !app?.name) {
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
