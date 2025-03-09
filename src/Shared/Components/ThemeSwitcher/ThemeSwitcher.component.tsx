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
import { ThemeSwitcherProps } from './types'

const ThemeSwitcher = ({ onChange }: ThemeSwitcherProps) => {
    const { handleThemeSwitcherDialogVisibilityChange } = useTheme()

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
            className="dc__transparent fs-13 fw-4 lh-20 cn-9 dc__hover-n50 w-100"
            onClick={handleShowThemeSwitcherDialog}
        >
            Theme
        </button>
    )
}

export default ThemeSwitcher
