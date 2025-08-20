import { AppThemeType } from '@Shared/Providers'

import { ChartColorKey } from './types'

export const LEGENDS_LABEL_CONFIG = {
    usePointStyle: true,
    pointStyle: 'rectRounded',
    pointStyleWidth: 0,
    font: {
        family: "'IBM Plex Sans', 'Open Sans', 'Roboto'",
        size: 13,
        lineHeight: '150%',
        weight: 400,
    },
} as const

export const CHART_COLORS: Record<AppThemeType, Record<ChartColorKey, string>> = {
    [AppThemeType.light]: {
        // Sky Blue
        SkyBlue100: '#e0f2fe',
        SkyBlue200: '#bae6fd',
        SkyBlue300: '#7dd3fc',
        SkyBlue400: '#38bdf8',
        SkyBlue500: '#0ea5e9',
        SkyBlue600: '#0284c7',
        SkyBlue700: '#0369a1',
        SkyBlue800: '#075985',

        // Aqua Teal
        AquaTeal100: '#ccfbf1',
        AquaTeal200: '#99f6e4',
        AquaTeal300: '#5eead4',
        AquaTeal400: '#2dd4bf',
        AquaTeal500: '#14b8a6',
        AquaTeal600: '#0d9488',
        AquaTeal700: '#0f766e',
        AquaTeal800: '#115e59',

        // Lavender Purple
        LavenderPurple100: '#f3e8ff',
        LavenderPurple200: '#e9d5ff',
        LavenderPurple300: '#d8b4fe',
        LavenderPurple400: '#c084fc',
        LavenderPurple500: '#a855f7',
        LavenderPurple600: '#9333ea',
        LavenderPurple700: '#7c3aed',
        LavenderPurple800: '#6b21c8',

        // Slate
        Slate100: '#f1f5f9',
        Slate200: '#e2e8f0',
        Slate300: '#cbd5e1',
        Slate400: '#94a3b8',
        Slate500: '#64748b',
        Slate600: '#475569',
        Slate700: '#334155',
        Slate800: '#1e293b',

        // Deep Plum
        DeepPlum100: '#fdf2f8',
        DeepPlum200: '#fce7f3',
        DeepPlum300: '#f9a8d4',
        DeepPlum400: '#f472b6',
        DeepPlum500: '#ec4899',
        DeepPlum600: '#db2777',
        DeepPlum700: '#be185d',
        DeepPlum800: '#9d174d',

        // Magenta (with M prefix)
        Magenta100: '#fdf2f8',
        Magenta200: '#fce7f3',
        Magenta300: '#f9a8d4',
        Magenta400: '#f472b6',
        Magenta500: '#ec4899',
        Magenta600: '#db2777',
        Magenta700: '#be185d',
        Magenta800: '#9d174d',
    },
    [AppThemeType.dark]: {
        // Sky Blue
        SkyBlue100: '#e0f2fe',
        SkyBlue200: '#bae6fd',
        SkyBlue300: '#7dd3fc',
        SkyBlue400: '#38bdf8',
        SkyBlue500: '#0ea5e9',
        SkyBlue600: '#0284c7',
        SkyBlue700: '#0369a1',
        SkyBlue800: '#075985',

        // Aqua Teal
        AquaTeal100: '#ccfbf1',
        AquaTeal200: '#99f6e4',
        AquaTeal300: '#5eead4',
        AquaTeal400: '#2dd4bf',
        AquaTeal500: '#14b8a6',
        AquaTeal600: '#0d9488',
        AquaTeal700: '#0f766e',
        AquaTeal800: '#115e59',

        // Lavender Purple
        LavenderPurple100: '#f3e8ff',
        LavenderPurple200: '#e9d5ff',
        LavenderPurple300: '#d8b4fe',
        LavenderPurple400: '#c084fc',
        LavenderPurple500: '#a855f7',
        LavenderPurple600: '#9333ea',
        LavenderPurple700: '#7c3aed',
        LavenderPurple800: '#6b21c8',

        // Slate
        Slate100: '#f1f5f9',
        Slate200: '#e2e8f0',
        Slate300: '#cbd5e1',
        Slate400: '#94a3b8',
        Slate500: '#64748b',
        Slate600: '#475569',
        Slate700: '#334155',
        Slate800: '#1e293b',

        // Deep Plum
        DeepPlum100: '#fdf2f8',
        DeepPlum200: '#fce7f3',
        DeepPlum300: '#f9a8d4',
        DeepPlum400: '#f472b6',
        DeepPlum500: '#ec4899',
        DeepPlum600: '#db2777',
        DeepPlum700: '#be185d',
        DeepPlum800: '#9d174d',

        // Magenta (with M prefix)
        Magenta100: '#fdf2f8',
        Magenta200: '#fce7f3',
        Magenta300: '#f9a8d4',
        Magenta400: '#f472b6',
        Magenta500: '#ec4899',
        Magenta600: '#db2777',
        Magenta700: '#be185d',
        Magenta800: '#9d174d',
    },
} as const

export const CHART_GRID_COLORS: Record<AppThemeType, string> = {
    [AppThemeType.light]: '#f1f5f9',
    [AppThemeType.dark]: '#1e293b',
}
