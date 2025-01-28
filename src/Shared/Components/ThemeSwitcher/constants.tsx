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
