import { DARK_COLOR_SCHEME_MATCH_QUERY, THEME_PREFERENCE_STORAGE_KEY } from './constants'
import { AppThemeType, THEME_PREFERENCE_MAP, ThemePreferenceType, ThemeConfigType } from './types'

export const getAppThemeForAutoPreference = (): AppThemeType =>
    window.matchMedia && window.matchMedia(DARK_COLOR_SCHEME_MATCH_QUERY).matches
        ? AppThemeType.dark
        : AppThemeType.light

export const getThemeConfigFromLocalStorage = (): ThemeConfigType => {
    // Handling the case if the theming is turned off at a later stage
    if (!window._env_.FEATURE_EXPERIMENTAL_THEMING_ENABLE) {
        return {
            appTheme: AppThemeType.light,
            themePreference: THEME_PREFERENCE_MAP.light,
        }
    }

    const selectedTheme = localStorage.getItem(THEME_PREFERENCE_STORAGE_KEY) as ThemePreferenceType

    if (!selectedTheme || selectedTheme === THEME_PREFERENCE_MAP.auto) {
        const fallbackAppTheme = getAppThemeForAutoPreference()

        return {
            appTheme: fallbackAppTheme,
            themePreference: THEME_PREFERENCE_MAP.auto,
        }
    }

    return {
        appTheme: selectedTheme,
        themePreference: selectedTheme,
    }
}

export const setThemePreferenceInLocalStorage = (themePreference: ThemePreferenceType) => {
    localStorage.setItem(THEME_PREFERENCE_STORAGE_KEY, themePreference)
}
