import { ReactNode } from 'react'
import { ThemeType } from './constants'

export interface ThemeContextType {
    currentTheme: ThemeType
    handleThemeChange: () => void
}

export interface ThemeProviderProps {
    children: ReactNode
}
