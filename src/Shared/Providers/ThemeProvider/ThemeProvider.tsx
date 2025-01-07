import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getCurrentTheme, updateTheme } from './utils'
import { ThemeType } from './constants'
import { ThemeContextType, ThemeProviderProps } from './types'

const themeContext = createContext<ThemeContextType>(null)

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [currentTheme, setCurrentTheme] = useState<ThemeType>(getCurrentTheme)

    const handleThemeChange: ThemeContextType['handleThemeChange'] = () => {
        setCurrentTheme((prevTheme) => {
            const updatedTheme = prevTheme === ThemeType.light ? ThemeType.dark : ThemeType.light
            updateTheme(updatedTheme)

            return updatedTheme
        })
    }

    useEffect(() => {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleThemeChange)

        return () => {
            window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', handleThemeChange)
        }
    }, [])

    const value = useMemo(
        () => ({
            currentTheme,
            handleThemeChange,
        }),
        [currentTheme],
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
