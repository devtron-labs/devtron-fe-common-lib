import { ReactElement } from 'react'
import { AppThemeType, THEME_PREFERENCE_MAP, ThemePreferenceType } from '@Shared/Providers/ThemeProvider/types'
import { ReactComponent as ICSun } from '@Icons/ic-sun.svg'
import { ReactComponent as ICMoon } from '@Icons/ic-moon.svg'
import { ReactComponent as ICLaptop } from '@Icons/ic-laptop.svg'

export const THEME_PREFERENCE_TO_ICON_MAP: Record<
    ThemePreferenceType,
    {
        tippyContent: string
        icon: ReactElement
    }
> = {
    [AppThemeType.light]: {
        tippyContent: 'Light',
        icon: <ICSun className="scn-9" />,
    },
    [AppThemeType.dark]: {
        tippyContent: 'Dark',
        icon: <ICMoon className="scn-9" />,
    },
    [THEME_PREFERENCE_MAP.auto]: {
        tippyContent: 'System',
        icon: <ICLaptop className="scn-9" />,
    },
} as const
