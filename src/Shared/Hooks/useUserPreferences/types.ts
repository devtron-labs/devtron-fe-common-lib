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

import { USER_PREFERENCES_ATTRIBUTE_KEY } from '@Shared/Hooks/useUserPreferences/constants'
import { AppThemeType, ThemeConfigType, ThemePreferenceType } from '@Shared/Providers/ThemeProvider/types'
import { ResourceKindType } from '@Shared/types'

export interface GetUserPreferencesQueryParamsType {
    key: typeof USER_PREFERENCES_ATTRIBUTE_KEY
}

export enum ViewIsPipelineRBACConfiguredRadioTabs {
    ALL_ENVIRONMENTS = 'All environments',
    ACCESS_ONLY = 'Access only',
}

export enum UserPreferenceResourceActions {
    RECENTLY_VISITED = 'recently-visited',
}
export type PreferredResourceKindType =
    | ResourceKindType.devtronApplication
    | ResourceKindType.job
    | 'app-group'
    | ResourceKindType.cluster

export interface BaseRecentlyVisitedEntitiesTypes {
    id: number
    name: string
}
export interface UserPreferenceRecentlyVisitedAppsTypes extends BaseRecentlyVisitedEntitiesTypes {
    resourceKind: PreferredResourceKindType
}

export interface UserResourceKindActionType {
    [UserPreferenceResourceActions.RECENTLY_VISITED]: BaseRecentlyVisitedEntitiesTypes[]
}
export type UserPreferenceResourceType = Partial<Record<PreferredResourceKindType, UserResourceKindActionType>>
export interface GetUserPreferencesParsedDTO {
    viewPermittedEnvOnly?: boolean
    /**
     * Computed app theme for the user
     *
     * Could be 'light' | 'dark' | 'system-light' | 'system-dark'
     */
    computedAppTheme?: AppThemeType | `system-${AppThemeType}`
    /**
     * @description resources object with key as resource kind and value as ResourceType
     *
     */
    resources?: UserPreferenceResourceType
}
export interface UserPreferencesPayloadValueType extends GetUserPreferencesParsedDTO {}
export interface UpdateUserPreferencesPayloadType extends Pick<GetUserPreferencesQueryParamsType, 'key'> {
    value: string
}
export interface UserPreferencesType {
    /**
     * Preferred theme for the user
     * If null, would forcibly show user theme switcher dialog for user to select
     */
    themePreference?: ThemePreferenceType | null
    /**
     * @type {ViewIsPipelineRBACConfiguredRadioTabs}
     * @description pipelineRBACViewSelectedTab is used to store the selected tab in the pipeline RBAC view
     * @default ViewIsPipelineRBACConfiguredRadioTabs.VIEW_PERMITTED_ENV
     */
    pipelineRBACViewSelectedTab?: ViewIsPipelineRBACConfiguredRadioTabs
    /**
     * @description resources object
     */
    resources?: GetUserPreferencesParsedDTO['resources']
}

export interface UpdatedUserPreferencesType extends UserPreferencesType, Pick<ThemeConfigType, 'appTheme'> {}

export interface RecentlyVisitedFetchConfigType extends UserPreferenceRecentlyVisitedAppsTypes {
    isDataAvailable?: boolean
}

export interface UseUserPreferencesProps {
    userPreferenceResourceKind?: PreferredResourceKindType
    migrateUserPreferences?: (userPreferencesResponse: UserPreferencesType) => Promise<UserPreferencesType>
    recentlyVisitedFetchConfig?: RecentlyVisitedFetchConfigType
}

export type UserPathValueMapType =
    | {
          path: 'themePreference'
          value: Required<Pick<UpdatedUserPreferencesType, 'themePreference' | 'appTheme'>>
          resourceKind?: never
          userPreferencesResponse?: never
      }
    | {
          path: 'pipelineRBACViewSelectedTab'
          value: Required<Pick<UserPreferencesType, 'pipelineRBACViewSelectedTab'>>
          resourceKind?: never
          userPreferencesResponse?: never
      }
    | {
          path: 'resources'
          value: Required<BaseRecentlyVisitedEntitiesTypes[]>
          resourceKind: PreferredResourceKindType
          userPreferencesResponse?: UserPreferencesType
      }

export type UserPreferenceResourceProps = UserPathValueMapType & {
    shouldThrowError?: boolean
    userPreferencesResponse?: UserPreferencesType
}

export interface UserPreferenceFilteredListTypes extends UserPreferenceRecentlyVisitedAppsTypes {
    userPreferencesResponse?: UserPreferencesType
}
