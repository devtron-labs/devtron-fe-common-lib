import { AppThemeType } from '@Shared/Providers'

import { ChartColorKey } from './types'

export const CHART_COLORS: Record<AppThemeType, Record<ChartColorKey, string>> = {
    [AppThemeType.light]: {
        // Sky Blue
        SkyBlue50: 'rgba(238, 248, 255, 1)',
        SkyBlue100: 'rgba(217, 239, 255, 1)',
        SkyBlue200: 'rgba(188, 228, 255, 1)',
        SkyBlue300: 'rgba(142, 212, 255, 1)',
        SkyBlue400: 'rgba(89, 187, 255, 1)',
        SkyBlue500: 'rgba(45, 153, 254, 1)',
        SkyBlue600: 'rgba(28, 126, 244, 1)',
        SkyBlue700: 'rgba(21, 102, 224, 1)',
        SkyBlue800: 'rgba(24, 83, 181, 1)',
        SkyBlue900: 'rgba(25, 72, 143, 1)',
        SkyBlue950: 'rgba(20, 45, 87, 1)',

        // Aqua Teal
        AquaTeal50: '#f0fdfa',
        AquaTeal100: '#ccfbf1',
        AquaTeal200: '#99f6e4',
        AquaTeal300: '#5eead4',
        AquaTeal400: '#2dd4bf',
        AquaTeal500: '#14b8a6',
        AquaTeal600: '#0d9488',
        AquaTeal700: '#0f766e',
        AquaTeal800: '#115e59',
        AquaTeal900: '#134e4a',
        AquaTeal950: '#042f2e',

        // Lavender Purple
        Lavender50: '#faf5ff',
        Lavender100: '#f3e8ff',
        Lavender200: '#e9d5ff',
        Lavender300: '#d8b4fe',
        Lavender400: '#c084fc',
        Lavender500: '#a855f7',
        Lavender600: '#9333ea',
        Lavender700: '#7c3aed',
        Lavender800: '#6b21c8',
        Lavender900: '#581c87',
        Lavender950: '#3b0764',

        // Slate
        Slate50: '#f8fafc',
        Slate100: '#f1f5f9',
        Slate200: '#e2e8f0',
        Slate300: '#cbd5e1',
        Slate400: '#94a3b8',
        Slate500: '#64748b',
        Slate600: '#475569',
        Slate700: '#334155',
        Slate800: '#1e293b',
        Slate900: '#0f172a',
        Slate950: '#020617',

        // Deep Plum
        DeepPlum50: '#fdf2f8',
        DeepPlum100: '#fdf2f8',
        DeepPlum200: '#fce7f3',
        DeepPlum300: '#f9a8d4',
        DeepPlum400: '#f472b6',
        DeepPlum500: '#ec4899',
        DeepPlum600: '#db2777',
        DeepPlum700: '#be185d',
        DeepPlum800: '#9d174d',
        DeepPlum900: '#831843',
        DeepPlum950: '#500724',

        // Magenta
        Magenta50: '#fdf2f8',
        Magenta100: '#fdf2f8',
        Magenta200: '#fce7f3',
        Magenta300: '#f9a8d4',
        Magenta400: '#f472b6',
        Magenta500: '#ec4899',
        Magenta600: '#db2777',
        Magenta700: '#be185d',
        Magenta800: '#9d174d',
        Magenta900: '#831843',
        Magenta950: '#500724',

        // Lime Green
        LimeGreen50: 'rgba(245, 252, 233, 1)',
        LimeGreen100: 'rgba(233, 247, 208, 1)',
        LimeGreen200: 'rgba(212, 239, 167, 1)',
        LimeGreen300: 'rgba(191, 231, 130, 1)',
        LimeGreen400: 'rgba(168, 227, 74, 1)',
        LimeGreen500: 'rgba(148, 209, 61, 1)',
        LimeGreen600: 'rgba(114, 178, 36, 1)',
        LimeGreen700: 'rgba(74, 132, 26, 1)',
        LimeGreen800: 'rgba(65, 99, 29, 1)',
        LimeGreen900: 'rgba(51, 76, 27, 1)',
        LimeGreen950: 'rgba(25, 42, 9, 1)',

        // Coral Red
        CoralRed50: 'rgba(254, 242, 243, 1)',
        CoralRed100: 'rgba(254, 226, 228, 1)',
        CoralRed200: 'rgba(255, 201, 205, 1)',
        CoralRed300: 'rgba(247, 171, 182, 1)',
        CoralRed400: 'rgba(244, 134, 147, 1)',
        CoralRed500: 'rgba(249, 93, 106, 1)',
        CoralRed600: 'rgba(207, 48, 59, 1)',
        CoralRed700: 'rgba(183, 26, 39, 1)',
        CoralRed800: 'rgba(154, 24, 35, 1)',
        CoralRed900: 'rgba(121, 27, 35, 1)',
        CoralRed950: 'rgba(70, 9, 14, 1)',

        // Golden Yellow
        GoldenYellow50: 'rgba(255, 254, 234, 1)',
        GoldenYellow100: 'rgba(255, 248, 197, 1)',
        GoldenYellow200: 'rgba(255, 242, 133, 1)',
        GoldenYellow300: 'rgba(255, 229, 70, 1)',
        GoldenYellow400: 'rgba(255, 212, 26, 1)',
        GoldenYellow500: 'rgba(255, 179, 0, 1)',
        GoldenYellow600: 'rgba(226, 137, 0, 1)',
        GoldenYellow700: 'rgba(187, 96, 2, 1)',
        GoldenYellow800: 'rgba(152, 74, 7, 1)',
        GoldenYellow900: 'rgba(124, 59, 11, 1)',
        GoldenYellow950: 'rgba(72, 30, 0, 1)',

        // Charcoal Gray
        CharcoalGray50: 'rgba(246, 246, 246, 1)',
        CharcoalGray100: 'rgba(231, 231, 231, 1)',
        CharcoalGray200: 'rgba(209, 209, 209, 1)',
        CharcoalGray300: 'rgba(176, 176, 176, 1)',
        CharcoalGray400: 'rgba(136, 136, 136, 1)',
        CharcoalGray500: 'rgba(109, 109, 109, 1)',
        CharcoalGray600: 'rgba(93, 93, 93, 1)',
        CharcoalGray700: 'rgba(76, 76, 76, 1)',
        CharcoalGray800: '#334155',
        CharcoalGray900: '#1e293b',
        CharcoalGray950: '#0f172a',

        // Gray
        Gray50: '#f9fafb',
        Gray100: '#f7f8f9',
        Gray200: '#f1f3f4',
        Gray300: '#e8eaed',
        Gray400: '#dadce0',
        Gray500: '#9aa0a6',
        Gray600: '#5f6368',
        Gray700: '#3c4043',
        Gray800: '#202124',
        Gray900: '#1a1a1a',
        Gray950: '#0d0d0d',
    },
    [AppThemeType.dark]: {
        // Sky Blue - Adjusted for dark theme
        SkyBlue50: '#0c1420',
        SkyBlue100: '#0f2027',
        SkyBlue200: '#164e63',
        SkyBlue300: '#0369a1',
        SkyBlue400: '#0284c7',
        SkyBlue500: '#0ea5e9',
        SkyBlue600: '#38bdf8',
        SkyBlue700: '#7dd3fc',
        SkyBlue800: '#bae6fd',
        SkyBlue900: '#e0f2fe',
        SkyBlue950: '#f0f9ff',

        // Aqua Teal - Adjusted for dark theme
        AquaTeal50: '#042f2e',
        AquaTeal100: '#134e4a',
        AquaTeal200: '#115e59',
        AquaTeal300: '#0f766e',
        AquaTeal400: '#0d9488',
        AquaTeal500: '#14b8a6',
        AquaTeal600: '#2dd4bf',
        AquaTeal700: '#5eead4',
        AquaTeal800: '#99f6e4',
        AquaTeal900: '#ccfbf1',
        AquaTeal950: '#f0fdfa',

        // Lavender Purple - Adjusted for dark theme
        Lavender50: '#3b0764',
        Lavender100: '#581c87',
        Lavender200: '#6b21c8',
        Lavender300: '#7c3aed',
        Lavender400: '#9333ea',
        Lavender500: '#a855f7',
        Lavender600: '#c084fc',
        Lavender700: '#d8b4fe',
        Lavender800: '#e9d5ff',
        Lavender900: '#f3e8ff',
        Lavender950: '#faf5ff',

        // Slate - Adjusted for dark theme
        Slate50: '#020617',
        Slate100: '#0f172a',
        Slate200: '#1e293b',
        Slate300: '#334155',
        Slate400: '#475569',
        Slate500: '#64748b',
        Slate600: '#94a3b8',
        Slate700: '#cbd5e1',
        Slate800: '#e2e8f0',
        Slate900: '#f1f5f9',
        Slate950: '#f8fafc',

        // Deep Plum - Adjusted for dark theme
        DeepPlum50: '#500724',
        DeepPlum100: '#831843',
        DeepPlum200: '#9d174d',
        DeepPlum300: '#be185d',
        DeepPlum400: '#db2777',
        DeepPlum500: '#ec4899',
        DeepPlum600: '#f472b6',
        DeepPlum700: '#f9a8d4',
        DeepPlum800: '#fce7f3',
        DeepPlum900: '#fdf2f8',
        DeepPlum950: '#fdf2f8',

        // Magenta - Adjusted for dark theme
        Magenta50: '#500724',
        Magenta100: '#831843',
        Magenta200: '#9d174d',
        Magenta300: '#be185d',
        Magenta400: '#db2777',
        Magenta500: '#ec4899',
        Magenta600: '#f472b6',
        Magenta700: '#f9a8d4',
        Magenta800: '#fce7f3',
        Magenta900: '#fdf2f8',
        Magenta950: '#fdf2f8',

        // Lime Green - Adjusted for dark theme
        LimeGreen50: '#1a2e05',
        LimeGreen100: '#365314',
        LimeGreen200: '#4d7c0f',
        LimeGreen300: '#65a30d',
        LimeGreen400: '#84cc16',
        LimeGreen500: '#a3e635',
        LimeGreen600: '#bef264',
        LimeGreen700: '#d9f99d',
        LimeGreen800: '#ecfccb',
        LimeGreen900: '#f7fee7',
        LimeGreen950: '#f7fee7',

        // Coral Red - Adjusted for dark theme
        CoralRed50: '#450a0a',
        CoralRed100: '#7f1d1d',
        CoralRed200: '#991b1b',
        CoralRed300: '#b91c1c',
        CoralRed400: '#dc2626',
        CoralRed500: '#ef4444',
        CoralRed600: '#f87171',
        CoralRed700: '#fca5a5',
        CoralRed800: '#fecaca',
        CoralRed900: '#fef2f2',
        CoralRed950: '#fef2f2',

        // Golden Yellow - Adjusted for dark theme
        GoldenYellow50: '#422006',
        GoldenYellow100: '#713f12',
        GoldenYellow200: '#854d0e',
        GoldenYellow300: '#a16207',
        GoldenYellow400: '#ca8a04',
        GoldenYellow500: '#eab308',
        GoldenYellow600: '#facc15',
        GoldenYellow700: '#fde047',
        GoldenYellow800: '#fef3c7',
        GoldenYellow900: '#fefce8',
        GoldenYellow950: '#fefce8',

        // Charcoal Gray - Adjusted for dark theme
        CharcoalGray50: '#0f172a',
        CharcoalGray100: '#1e293b',
        CharcoalGray200: '#334155',
        CharcoalGray300: '#475569',
        CharcoalGray400: '#64748b',
        CharcoalGray500: '#94a3b8',
        CharcoalGray600: '#cbd5e1',
        CharcoalGray700: '#e2e8f0',
        CharcoalGray800: '#f1f5f9',
        CharcoalGray900: '#f8fafc',
        CharcoalGray950: '#f8fafc',

        // Gray - Adjusted for dark theme
        Gray50: '#0d0d0d',
        Gray100: '#1a1a1a',
        Gray200: '#202124',
        Gray300: '#3c4043',
        Gray400: '#5f6368',
        Gray500: '#9aa0a6',
        Gray600: '#dadce0',
        Gray700: '#e8eaed',
        Gray800: '#f1f3f4',
        Gray900: '#f7f8f9',
        Gray950: '#f9fafb',
    },
} as const

export const CHART_GRID_LINES_COLORS: Record<AppThemeType, string> = {
    [AppThemeType.light]: '#f1f5f9',
    [AppThemeType.dark]: '#1e293b',
}

export const CHART_AXIS_LABELS_COLOR: Record<AppThemeType, string> = {
    [AppThemeType.dark]: '#ffffff',
    [AppThemeType.light]: '#1e293b',
}

export const CHART_AXIS_TICKS_TITLE_COLOR: Record<AppThemeType, string> = {
    [AppThemeType.dark]: 'rgb(59, 68, 76)',
    [AppThemeType.light]: 'rgb(200, 203, 206)',
}

export const CHART_CANVAS_BACKGROUND_COLORS: Record<AppThemeType, string> = {
    [AppThemeType.light]: '#ffffff',
    [AppThemeType.dark]: '#1e293b',
}

export const LINE_DASH = [6, 6]
