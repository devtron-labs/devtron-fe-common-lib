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
    appTheme: AppThemeType
    themePreference: ThemePreferenceType
}

export interface ThemeContextType extends ThemeConfigType {
    handleSelectedThemeChange: (updatedThemePreference: ThemePreferenceType) => void
}

export interface ThemeProviderProps {
    children: ReactNode
}
