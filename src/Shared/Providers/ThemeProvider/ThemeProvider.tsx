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

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
    getAppThemeForAutoPreference,
    getThemeConfigFromLocalStorage,
    logThemeToAnalytics,
    setThemePreferenceInLocalStorage,
} from './utils'
import { THEME_PREFERENCE_MAP, ThemeConfigType, ThemeContextType, ThemeProviderProps } from './types'
import { DARK_COLOR_SCHEME_MATCH_QUERY } from './constants'

const themeContext = createContext<ThemeContextType>(null)

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [themeConfig, setThemeConfig] = useState<ThemeConfigType>(getThemeConfigFromLocalStorage)

    const handleThemePreferenceChange: ThemeContextType['handleThemePreferenceChange'] = (updatedThemePreference) => {
        const updatedThemeConfig: ThemeConfigType = {
            appTheme:
                updatedThemePreference === THEME_PREFERENCE_MAP.auto
                    ? getAppThemeForAutoPreference()
                    : updatedThemePreference,
            themePreference: updatedThemePreference,
        }
        setThemeConfig(updatedThemeConfig)
        setThemePreferenceInLocalStorage(updatedThemePreference)
        logThemeToAnalytics(updatedThemeConfig)
    }

    const handleColorSchemeChange = () => {
        handleThemePreferenceChange(THEME_PREFERENCE_MAP.auto)
    }

    useEffect(() => {
        // Need to update the html element since there are elements outside of the #root div as well
        const html = document.querySelector('html')
        if (html) {
            html.setAttribute('class', `theme__${themeConfig.appTheme}`)
        }
    }, [themeConfig.appTheme])

    useEffect(() => {
        // It is important to create the matchQuery inside the useEffect
        // to ensure the removeEventListener is called on the same instance
        const matchQuery = window.matchMedia(DARK_COLOR_SCHEME_MATCH_QUERY)

        if (themeConfig.themePreference === THEME_PREFERENCE_MAP.auto) {
            matchQuery.addEventListener('change', handleColorSchemeChange)
        }

        return () => {
            matchQuery.removeEventListener('change', handleColorSchemeChange)
        }
    }, [themeConfig.themePreference])

    const value = useMemo<ThemeContextType>(
        () => ({
            ...themeConfig,
            handleThemePreferenceChange,
        }),
        [themeConfig],
    )

    return <themeContext.Provider value={value}>{children}</themeContext.Provider>
}

export const useTheme = () => {
    const value = useContext(themeContext)

    if (!value) {
        throw new Error('useTheme must be used within ThemeProvider')
    }

    return value
}
