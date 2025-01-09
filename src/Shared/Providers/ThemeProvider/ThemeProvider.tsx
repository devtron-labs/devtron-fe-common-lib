import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getAppThemeForAutoPreference, getThemeConfig, updateSelectedTheme } from './utils'
import { THEME_PREFERENCE_MAP, ThemeConfigType, ThemeContextType, ThemeProviderProps } from './types'

const themeContext = createContext<ThemeContextType>(null)

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [themeConfig, setThemeConfig] = useState<ThemeConfigType>(getThemeConfig)

    const handleSelectedThemeChange: ThemeContextType['handleSelectedThemeChange'] = (updatedThemePreference) => {
        setThemeConfig({
            appTheme:
                updatedThemePreference === THEME_PREFERENCE_MAP.auto
                    ? getAppThemeForAutoPreference()
                    : updatedThemePreference,
            themePreference: updatedThemePreference,
        })
        updateSelectedTheme(updatedThemePreference)
    }

    const handleSystemPreferenceChange = () => {
        handleSelectedThemeChange(THEME_PREFERENCE_MAP.auto)
    }

    useEffect(() => {
        // Need to update the html element since there are elements outside of the #root div as well
        const html = document.querySelector('html')
        if (html) {
            html.setAttribute('class', `theme__${themeConfig.appTheme}`)
        }
    }, [themeConfig.appTheme])

    useEffect(() => {
        if (themeConfig.themePreference === THEME_PREFERENCE_MAP.auto) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleSystemPreferenceChange)
        }

        return () => {
            window
                .matchMedia('(prefers-color-scheme: dark)')
                .removeEventListener('change', handleSystemPreferenceChange)
        }
    }, [themeConfig.themePreference])

    const value = useMemo<ThemeContextType>(
        () => ({
            ...themeConfig,
            handleSelectedThemeChange,
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
