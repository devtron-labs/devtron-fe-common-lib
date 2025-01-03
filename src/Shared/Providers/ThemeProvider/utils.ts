import { THEME_STORAGE_KEY, ThemeType } from './constants'

export const getCurrentTheme = (): ThemeType => {
    // Handling the case if the theming is turned off at a later stage
    if (!window._env_.FEATURE_EXPERIMENTAL_THEMING_ENABLE) {
        return ThemeType.light
    }

    const theme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeType

    return Object.values(ThemeType).includes(theme as ThemeType) ? theme : ThemeType.light
}

export const updateTheme = (theme: ThemeType) => {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
}