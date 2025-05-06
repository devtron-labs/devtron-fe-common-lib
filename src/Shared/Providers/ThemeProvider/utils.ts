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

import ReactGA from 'react-ga4'

import { DARK_COLOR_SCHEME_MATCH_QUERY, THEME_PREFERENCE_STORAGE_KEY } from './constants'
import { AppThemeType, THEME_PREFERENCE_MAP, ThemeConfigType, ThemePreferenceType } from './types'

export const getAppThemeForAutoPreference = (): AppThemeType =>
    window.matchMedia && window.matchMedia(DARK_COLOR_SCHEME_MATCH_QUERY).matches
        ? AppThemeType.dark
        : AppThemeType.light

export const setThemePreferenceInLocalStorage = (themePreference: ThemePreferenceType) => {
    localStorage.setItem(THEME_PREFERENCE_STORAGE_KEY, themePreference)
}

export const logThemeToAnalytics = ({ appTheme, themePreference }: ThemeConfigType) => {
    const action = themePreference === THEME_PREFERENCE_MAP.auto ? `system-${appTheme}` : appTheme

    if ('gtag' in window && window.gtag && typeof window.gtag === 'function') {
        window.gtag('set', 'user_properties', {
            appTheme,
            themePreference,
        })
        ReactGA.send('pageview')
    }

    ReactGA.event({
        category: 'application-theme',
        action: `theme-changed-to-${action}`,
    })
}

export const getThemeConfigFromLocalStorage = (): ThemeConfigType => {
    const selectedTheme = localStorage.getItem(THEME_PREFERENCE_STORAGE_KEY) as ThemePreferenceType

    if (!selectedTheme || selectedTheme === THEME_PREFERENCE_MAP.auto) {
        const themeConfig: ThemeConfigType = {
            appTheme: getAppThemeForAutoPreference(),
            themePreference: THEME_PREFERENCE_MAP.auto,
        }

        return themeConfig
    }

    return {
        appTheme: selectedTheme,
        themePreference: selectedTheme,
    }
}

export const getComponentSpecificThemeClass = (appTheme: AppThemeType) => `component-specific-theme__${appTheme}`

export const getThemeOppositeThemeClass = (appTheme: AppThemeType) =>
    appTheme === AppThemeType.dark
        ? `component-specific-theme__${AppThemeType.light}`
        : `component-specific-theme__${AppThemeType.dark}`

export const getThemePreferenceText = (themePreference: ThemePreferenceType): string => {
    switch (themePreference) {
        case 'auto':
            return `System (${getAppThemeForAutoPreference() === AppThemeType.dark ? 'Dark' : 'Light'})`
        case AppThemeType.dark:
            return 'Dark'
        case AppThemeType.light:
            return 'Light'
        default:
            return null
    }
}
