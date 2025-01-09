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

import React from 'react'
import { useHistory } from 'react-router-dom'
import { useTheme } from '@Shared/Providers'
import { THEME_PREFERENCE_MAP, ThemePreferenceType } from '@Shared/Providers/ThemeProvider/types'
import { getRandomColor, SegmentedControl, stopPropagation } from '../../Common'

interface LogoutCardType {
    className: string
    userFirstLetter: string
    setShowLogOutCard: React.Dispatch<React.SetStateAction<boolean>>
    showLogOutCard: boolean
}

const LogoutCard = ({ className, userFirstLetter, setShowLogOutCard, showLogOutCard }: LogoutCardType) => {
    const history = useHistory()
    const { themePreference, handleSelectedThemeChange } = useTheme()

    const onLogout = () => {
        document.cookie = `argocd.token=; expires=Thu, 01-Jan-1970 00:00:01 GMT;path=/`
        history.push('/login')
    }

    const handleThemeSwitch = (e) => {
        handleSelectedThemeChange(e.target.value as ThemePreferenceType)
    }

    return (
        <div className="dc__transparent-div" onClick={() => setShowLogOutCard(!showLogOutCard)}>
            <div className={`logout-card ${className}`}>
                <div className="flexbox flex-justify p-16">
                    <div className="logout-card-user ">
                        <p className="logout-card__name dc__ellipsis-right">{userFirstLetter}</p>
                        <p className="logout-card__email dc__ellipsis-right">{userFirstLetter}</p>
                    </div>
                    <p
                        className="logout-card__initial fs-16 icon-dim-32 mb-0"
                        style={{ backgroundColor: getRandomColor(userFirstLetter) }}
                    >
                        {userFirstLetter[0]}
                    </p>
                </div>
                {window._env_.FEATURE_EXPERIMENTAL_THEMING_ENABLE && (
                    <div className="dc__border-top-n1" onClick={stopPropagation}>
                        <SegmentedControl
                            initialTab={themePreference}
                            name="theme-preference-selector"
                            onChange={handleThemeSwitch}
                            tabs={Object.values(THEME_PREFERENCE_MAP).map((value) => ({
                                label: value,
                                value,
                            }))}
                        />
                    </div>
                )}
                <div className="logout-card__logout cursor" data-testid="logout-button" onClick={onLogout}>
                    Logout
                </div>
            </div>
        </div>
    )
}

export default LogoutCard
