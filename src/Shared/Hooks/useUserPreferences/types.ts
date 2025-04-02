import { AppThemeType, BaseAppMetaData, ResourceKindType } from '@Shared/index'
import { ThemeConfigType, ThemePreferenceType } from '@Shared/Providers/ThemeProvider/types'
import { USER_PREFERENCES_ATTRIBUTE_KEY } from '@Shared/Hooks/useUserPreferences/constants'

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
export interface UserResourceKindActionType {
    [UserPreferenceResourceActions.RECENTLY_VISITED]: BaseAppMetaData[]
}
export interface UserPreferenceResourceType {
    [ResourceKindType.devtronApplication]: UserResourceKindActionType
}
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

export interface UseUserPreferencesProps {
    migrateUserPreferences?: (userPreferencesResponse: UserPreferencesType) => Promise<UserPreferencesType>
}
