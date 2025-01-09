import { useTheme } from '@Shared/Providers'
import { THEME_PREFERENCE_MAP, ThemePreferenceType } from '@Shared/Providers/ThemeProvider/types'
import { SegmentedControl, SegmentedControlVariant } from '@Common/SegmentedControl'
import { ChangeEvent } from 'react'
import { stopPropagation } from '@Common/Helper'
import { ComponentSizeType } from '@Shared/constants'
import { THEME_PREFERENCE_TO_ICON_MAP } from './constants'
import { ThemeSwitcherProps } from './types'

const ThemeSwitcher = ({ onChange }: ThemeSwitcherProps) => {
    const { themePreference, handleSelectedThemeChange } = useTheme()

    if (!window._env_.FEATURE_EXPERIMENTAL_THEMING_ENABLE) {
        return null
    }

    const tabs = Object.values(THEME_PREFERENCE_MAP).map((value) => ({
        label: (
            <span className="dc__no-shrink icon-dim-20 flex dc__fill-available-space">
                {THEME_PREFERENCE_TO_ICON_MAP[value]}
            </span>
        ),
        value,
    }))

    const handleThemeSwitch = (e: ChangeEvent<HTMLInputElement>) => {
        handleSelectedThemeChange(e.target.value as ThemePreferenceType)
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
                size={ComponentSizeType.large}
                variant={SegmentedControlVariant.GRAY_ON_WHITE}
            />
        </div>
    )
}

export default ThemeSwitcher
