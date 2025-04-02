import { get, patch } from '@Common/Api'
import { ROUTES } from '@Common/Constants'
import { getUrlWithSearchParams, showError } from '@Common/index'
import { ResourceKindType, BaseAppMetaData } from '@Shared/index'
import { THEME_PREFERENCE_MAP, ThemeConfigType, ThemePreferenceType } from '@Shared/Providers/ThemeProvider/types'
import { USER_PREFERENCES_ATTRIBUTE_KEY } from './constants'
import {
    UserPreferencesType,
    GetUserPreferencesQueryParamsType,
    GetUserPreferencesParsedDTO,
    ViewIsPipelineRBACConfiguredRadioTabs,
    UserPreferenceResourceType,
    UserPreferenceResourceActions,
    UpdatedUserPreferencesType,
    UserPreferencesPayloadValueType,
    UpdateUserPreferencesPayloadType,
} from './types'

/**
 * @returns UserPreferencesType
 * @description This function fetches the user preferences from the server. It uses the `get` method to make a request to the server and retrieves the user preferences based on the `USER_PREFERENCES_ATTRIBUTE_KEY`. The result is parsed and returned as a `UserPreferencesType` object.
 * @throws Will throw an error if the request fails or if the result is not in the expected format.
 */
export const getUserPreferences = async (): Promise<UserPreferencesType> => {
    const queryParamsPayload: Pick<GetUserPreferencesQueryParamsType, 'key'> = {
        key: USER_PREFERENCES_ATTRIBUTE_KEY,
    }

    const { result } = await get<{ value: string }>(
        getUrlWithSearchParams(`${ROUTES.ATTRIBUTES_USER}/${ROUTES.GET}`, queryParamsPayload),
    )

    if (!result?.value) {
        return null
    }

    const parsedResult: GetUserPreferencesParsedDTO = JSON.parse(result.value)

    const pipelineRBACViewSelectedTab = parsedResult.viewPermittedEnvOnly
        ? ViewIsPipelineRBACConfiguredRadioTabs.ACCESS_ONLY
        : ViewIsPipelineRBACConfiguredRadioTabs.ALL_ENVIRONMENTS

    return {
        pipelineRBACViewSelectedTab,
        themePreference:
            parsedResult.computedAppTheme === 'system-dark' || parsedResult.computedAppTheme === 'system-light'
                ? THEME_PREFERENCE_MAP.auto
                : parsedResult.computedAppTheme,
        resources: {
            [ResourceKindType.devtronApplication]: {
                [UserPreferenceResourceActions.RECENTLY_VISITED]:
                    parsedResult.resources?.[ResourceKindType.devtronApplication]?.[
                        UserPreferenceResourceActions.RECENTLY_VISITED
                    ] || ([] as BaseAppMetaData[]),
            },
        },
    }
}

export const resourceTypes: ResourceKindType[] = [ResourceKindType.devtronApplication]

const resourcesObj = (recentlyVisited: BaseAppMetaData[]): UserPreferenceResourceType =>
    resourceTypes.reduce((acc, resource) => {
        acc[resource] = {
            [UserPreferenceResourceActions.RECENTLY_VISITED]: recentlyVisited,
        }
        return acc
    }, {} as UserPreferenceResourceType)

/**
 * @description This function updates the user preferences in the server. It constructs a payload with the updated user preferences and sends a PATCH request to the server. If the request is successful, it returns true. If an error occurs, it shows an error message and returns false.
 * @param updatedUserPreferences - The updated user preferences to be sent to the server.
 * @param recentlyVisitedDevtronApps - The recently visited Devtron apps to be sent to the server.
 * @param shouldThrowError - A boolean indicating whether to throw an error if the request fails. Default is false.
 * @returns A promise that resolves to true if the request is successful, or false if an error occurs.
 * @throws Will throw an error if `shouldThrowError` is true and the request fails.
 */

export type UpdateUserPreferencesProps =
    | { type: 'updateTheme'; value: ThemePreferenceType | null; appTheme: ThemeConfigType['appTheme'] }
    | { type: 'updatePipelineRBACView'; value: ViewIsPipelineRBACConfiguredRadioTabs }
    | { type: 'updateRecentlyVisitedApps'; value: BaseAppMetaData[] }

export const updateUserPreferences = async (
    updatedUserPreferences?: UpdatedUserPreferencesType,
    recentlyVisitedDevtronApps?: BaseAppMetaData[],
    shouldThrowError: boolean = false,
): Promise<boolean> => {
    try {
        let data: UserPreferencesPayloadValueType = null
        if (updatedUserPreferences) {
            const { themePreference, appTheme, pipelineRBACViewSelectedTab } = updatedUserPreferences

            data = {
                viewPermittedEnvOnly: pipelineRBACViewSelectedTab === ViewIsPipelineRBACConfiguredRadioTabs.ACCESS_ONLY,
                computedAppTheme: themePreference === THEME_PREFERENCE_MAP.auto ? `system-${appTheme}` : appTheme,
            }
        }

        if (recentlyVisitedDevtronApps?.length) {
            data = {
                resources: resourcesObj(recentlyVisitedDevtronApps),
            }
        }

        const payload: UpdateUserPreferencesPayloadType = {
            key: USER_PREFERENCES_ATTRIBUTE_KEY,
            value: JSON.stringify(data),
        }

        await patch(`${ROUTES.ATTRIBUTES_USER}/${ROUTES.PATCH}`, payload)
        return true
    } catch (error) {
        if (shouldThrowError) {
            throw error
        }

        showError(error)
        return false
    }
}
