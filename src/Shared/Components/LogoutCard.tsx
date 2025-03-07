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
import { useMainContext } from '@Shared/Providers'
import { getRandomColor, stopPropagation } from '../../Common'
import { ThemeSwitcher } from './ThemeSwitcher'

interface LogoutCardType {
    className: string
    userFirstLetter: string
    setShowLogOutCard: React.Dispatch<React.SetStateAction<boolean>>
    showLogOutCard: boolean
}

const LogoutCard = ({ className, userFirstLetter, setShowLogOutCard, showLogOutCard }: LogoutCardType) => {
    const history = useHistory()
    const { viewIsPipelineRBACConfiguredNode } = useMainContext()

    const onLogout = () => {
        document.cookie = `argocd.token=; expires=Thu, 01-Jan-1970 00:00:01 GMT;path=/`
        history.push('/login')
    }

    const toggleLogoutCard = () => {
        setShowLogOutCard(!showLogOutCard)
    }

    return (
        <div className="dc__transparent-div" onClick={toggleLogoutCard}>
            <div className={`logout-card ${className}`} onClick={stopPropagation}>
                <div className="flexbox flex-justify py-16 px-12">
                    <div className="logout-card-user">
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
                <div className="dc__border-top-n1 py-4">
                    <ThemeSwitcher onChange={toggleLogoutCard} />

                    {viewIsPipelineRBACConfiguredNode}

                    <button
                        className="dc__unset-button-styles px-12 py-6 fs-13 fw-4 lh-20 cr-5 dc__hover-n50 cursor w-100 flex left"
                        data-testid="logout-button"
                        onClick={onLogout}
                        type="button"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LogoutCard
