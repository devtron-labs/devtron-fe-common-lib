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
