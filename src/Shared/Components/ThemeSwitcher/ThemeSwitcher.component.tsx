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

import { useTheme } from '@Shared/Providers'
import { THEME_PREFERENCE_MAP, ThemePreferenceType } from '@Shared/Providers/ThemeProvider/types'
import { SegmentedControl, SegmentedControlProps, SegmentedControlVariant } from '@Common/SegmentedControl'
import { ChangeEvent, useMemo } from 'react'
import { stopPropagation } from '@Common/Helper'
import { ComponentSizeType } from '@Shared/constants'
import { THEME_PREFERENCE_TO_ICON_MAP } from './constants'
import { ThemeSwitcherProps } from './types'

const ThemeSwitcher = ({ onChange }: ThemeSwitcherProps) => {
    const { themePreference, handleThemePreferenceChange } = useTheme()

    const { tabs, tooltips } = useMemo<Required<Pick<SegmentedControlProps, 'tabs' | 'tooltips'>>>(() => {
        const availableThemePreferences = Object.values(THEME_PREFERENCE_MAP)

        return {
            tabs: availableThemePreferences.map((value) => ({
                label: (
                    <span className="dc__no-shrink icon-dim-20 flex dc__fill-available-space">
                        {THEME_PREFERENCE_TO_ICON_MAP[value].icon}
                    </span>
                ),
                value,
            })),
            tooltips: availableThemePreferences.map((value) => THEME_PREFERENCE_TO_ICON_MAP[value].tippyContent),
        }
    }, [])

    if (!window._env_.FEATURE_EXPERIMENTAL_THEMING_ENABLE) {
        return null
    }

    const handleThemeSwitch = (e: ChangeEvent<HTMLInputElement>) => {
        const updatedThemePreference = e.target.value as ThemePreferenceType
        handleThemePreferenceChange(updatedThemePreference)
        onChange()
    }

    return (
        <div className="flex dc__content-space dc__gap-8 px-8 py-6" onClick={stopPropagation}>
            <p className="m-0 fs-13 fw-4 lh-20 cn-9">Theme</p>
            <SegmentedControl
                initialTab={themePreference}
                name="theme-preference-selector"
                onChange={handleThemeSwitch}
                tabs={tabs}
                tooltips={tooltips}
                size={ComponentSizeType.large}
                variant={SegmentedControlVariant.GRAY_ON_WHITE}
            />
        </div>
    )
}

export default ThemeSwitcher
