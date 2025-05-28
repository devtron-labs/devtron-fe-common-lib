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

import { getThemePreferenceText, useTheme } from '@Shared/Providers'

import { Icon } from '../Icon'
import { ThemeSwitcherProps } from './types'

const ThemeSwitcher = ({ onClick }: ThemeSwitcherProps) => {
    const { handleThemeSwitcherDialogVisibilityChange, themePreference } = useTheme()

    const handleShowThemeSwitcherDialog = () => {
        handleThemeSwitcherDialogVisibilityChange(true)
        onClick?.()
    }

    return (
        <button
            type="button"
            data-testid="open-theme-switcher-dialog"
            className="dc__transparent w-100 flex dc__content-space dc__gap-8 px-8 py-6 br-4 dc__tab-focus dc__hover-n50"
            onClick={handleShowThemeSwitcherDialog}
        >
            <span className="flex-grow-1 fs-13 lh-1-5 fw-4 cn-9 dc__text-justify">Theme</span>
            <span className="flex dc__gap-2">
                <span className="fs-12 lh-1-5 fw-4 cn-7">{getThemePreferenceText(themePreference)}</span>
                <Icon name="ic-caret-right" color="N700" />
            </span>
        </button>
    )
}

export default ThemeSwitcher
