import { ReactNode } from 'react'

export enum AppThemeType {
    light = 'light',
    dark = 'dark',
}

export const THEME_PREFERENCE_MAP = {
    ...AppThemeType,
    auto: 'auto',
} as const

export type ThemePreferenceType = (typeof THEME_PREFERENCE_MAP)[keyof typeof THEME_PREFERENCE_MAP]

export interface ThemeConfigType {
    /**
     * Current application theme
     *
     * @default AppThemeType.light
     */
    appTheme: AppThemeType
    /**
     * Preferred theme for the user (if any)
     *
     * @default THEME_PREFERENCE_MAP.auto
     *
     * Note: This shouldn't be consumed other than in ThemeSwitcher component
     */
    themePreference: ThemePreferenceType
}

export interface ThemeContextType extends ThemeConfigType {
    handleSelectedThemeChange: (updatedThemePreference: ThemePreferenceType) => void
}

export interface ThemeProviderProps {
    children: ReactNode
}
