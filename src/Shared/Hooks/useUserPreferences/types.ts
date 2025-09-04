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

export type NavigationItemID =
    | 'application-management-overview'
    | 'application-management-applications'
    | 'application-management-application-groups'
    | 'application-management-chart-store'
    | 'application-management-bulk-edit'
    | 'application-management-application-templates'
    | 'application-management-projects'
    | 'application-management-configurations'
    | 'application-management-policies'
    | 'infrastructure-management-overview'
    | 'infrastructure-management-resource-browser'
    | 'infrastructure-management-resource-watcher'
    | 'infrastructure-management-catalog-framework'
    | 'software-release-management-overview'
    | 'software-release-management-release-hub'
    | 'software-release-management-tenants'
    | 'cost-visibility-overview'
    | 'cost-visibility-cost-breakdown'
    | 'cost-visibility-configurations'
    | 'security-center-overview'
    | 'security-center-security-scans'
    | 'security-center-security-policy'
    | 'automation-and-enablement-jobs'
    | 'automation-and-enablement-alerting'
    | 'automation-and-enablement-incident-response'
    | 'automation-and-enablement-api-portal'
    | 'automation-and-enablement-runbook-automation'
    | 'global-configuration-sso-login-services'
    | 'global-configuration-host-urls'
    | 'global-configuration-cluster-and-environments'
    | 'global-configuration-container-oci-registry'
    | 'global-configuration-authorization'
    | 'backup-and-restore-overview'
    | 'backup-and-restore-item'
    | 'backup-and-restore-backup-repositories'
    | 'backup-and-restore-backup-locations'
    | 'backup-and-restore-history-and-logs'
    | 'ai-recommendations-overview'

export type NavigationSubMenuItemID =
    | 'application-management-configurations-gitops'
    | 'application-management-configurations-git-accounts'
    | 'application-management-configurations-external-links'
    | 'application-management-configurations-chart-repository'
    | 'application-management-configurations-deployment-charts'
    | 'application-management-configurations-notifications'
    | 'application-management-configurations-catalog-frameworks'
    | 'application-management-configurations-scoped-variables'
    | 'application-management-configurations-build-infra'
    | 'application-management-policies-deployment-window'
    | 'application-management-policies-approval-policy'
    | 'application-management-policies-plugin-policy'
    | 'application-management-policies-pull-image-digest'
    | 'application-management-policies-tag-policy'
    | 'application-management-policies-filter-conditions'
    | 'application-management-policies-image-promotion'
    | 'application-management-policies-lock-deployment-configuration'
    | 'cost-visibility-cost-breakdown-clusters'
    | 'cost-visibility-cost-breakdown-environments'
    | 'cost-visibility-cost-breakdown-projects'
    | 'cost-visibility-cost-breakdown-applications'
    | 'global-configuration-authorization-user-permissions'
    | 'global-configuration-authorization-permission-groups'
    | 'global-configuration-authorization-api-tokens'

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

export type CommandBarAdditionalItemsId =
    | 'app-management-devtron-app-list'
    | 'app-management-helm-app-list'
    | 'app-management-flux-app-list'
    | 'app-management-argo-app-list'
    | `app-management-devtron-app-list-${number}`

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
    commandBar: {
        recentNavigationActions: { id: NavigationItemID | NavigationSubMenuItemID | CommandBarAdditionalItemsId }[]
    }
}
export interface UserPreferencesPayloadValueType extends GetUserPreferencesParsedDTO {}
export interface UpdateUserPreferencesPayloadType extends Pick<GetUserPreferencesQueryParamsType, 'key'> {
    value: string
}

export interface UserPreferencesType extends Pick<GetUserPreferencesParsedDTO, 'commandBar'> {
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

type UserPathValueMapType =
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
    | {
          path: 'commandBar.recentNavigationActions'
          value: UserPreferencesType['commandBar']['recentNavigationActions']
          resourceKind?: never
          userPreferencesResponse?: never
      }

export type GetUserPreferencePayloadParams = {
    userPreferencesResponse: UserPreferencesType
    resourceKind?: PreferredResourceKindType
} & (
    | {
          path: 'themePreference'
          value: Required<Pick<UpdatedUserPreferencesType, 'themePreference' | 'appTheme'>>
      }
    | {
          path: 'pipelineRBACViewSelectedTab'
          value: Required<Pick<UserPreferencesType, 'pipelineRBACViewSelectedTab'>>
      }
    | {
          path: 'resources'
          value: Required<BaseRecentlyVisitedEntitiesTypes[]>
      }
    | {
          path: 'commandBar.recentNavigationActions'
          value: UserPreferencesType['commandBar']['recentNavigationActions']
      }
)

export type UserPreferenceResourceProps = UserPathValueMapType & {
    shouldThrowError?: boolean
    userPreferencesResponse?: UserPreferencesType
}

export interface UserPreferenceFilteredListTypes extends UserPreferenceRecentlyVisitedAppsTypes {
    userPreferencesResponse?: UserPreferencesType
}
