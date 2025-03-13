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
     * Note: This shouldn't be consumed other than in ThemeSwitcherDialog component
     */
    themePreference: ThemePreferenceType
}

export interface ThemeContextType extends ThemeConfigType {
    showSwitchThemeLocationTippy: boolean
    handleShowSwitchThemeLocationTippyChange: (isVisible: boolean) => void
    showThemeSwitcherDialog: boolean
    handleThemeSwitcherDialogVisibilityChange: (isVisible: boolean) => void
    handleThemePreferenceChange: (
        updatedThemePreference: ThemePreferenceType,
        /**
         * @description If update is local we won't update local storage and analytics
         * */
        isLocalUpdate?: boolean,
    ) => void
}

export interface ThemeProviderProps {
    children: ReactNode
}
