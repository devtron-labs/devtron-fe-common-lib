import { ReactElement } from 'react'
import { AppThemeType, THEME_PREFERENCE_MAP, ThemePreferenceType } from '@Shared/Providers/ThemeProvider/types'
import { ReactComponent as ICSun } from '@Icons/ic-sun.svg'
import { ReactComponent as ICMoon } from '@Icons/ic-moon.svg'

export const THEME_PREFERENCE_TO_ICON_MAP: Record<ThemePreferenceType, ReactElement> = {
    [AppThemeType.light]: <ICSun className="scn-9" />,
    [AppThemeType.dark]: <ICMoon className="scn-9" />,
    [THEME_PREFERENCE_MAP.auto]: <span className="bcn-1" />,
} as const
