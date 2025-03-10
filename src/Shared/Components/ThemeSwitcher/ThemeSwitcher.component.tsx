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
import { ReactComponent as ICCaretLeftSmall } from '@Icons/ic-caret-left-small.svg'
import { ThemeSwitcherProps } from './types'
import { LOGOUT_CARD_BASE_BUTTON_CLASS } from '../LogoutCard'

const ThemeSwitcher = ({ onChange }: ThemeSwitcherProps) => {
    const { handleThemeSwitcherDialogVisibilityChange, themePreference } = useTheme()

    if (!window._env_.FEATURE_EXPERIMENTAL_THEMING_ENABLE) {
        return null
    }

    const handleShowThemeSwitcherDialog = () => {
        handleThemeSwitcherDialogVisibilityChange(true)
        onChange()
    }

    return (
        <button
            type="button"
            data-testid="open-theme-switcher-dialog"
            className={`${LOGOUT_CARD_BASE_BUTTON_CLASS} dc__hover-n50`}
            onClick={handleShowThemeSwitcherDialog}
        >
            Theme
            <div className="flexbox dc__gap-4 dc__align-items-center">
                <span className="cn-7 fs-13 fw-4 lh-20">{getThemePreferenceText(themePreference)}</span>
                <ICCaretLeftSmall className="dc__flip-180 icon-16 dc__no-shrink scn-7" />
            </div>
        </button>
    )
}

export default ThemeSwitcher
