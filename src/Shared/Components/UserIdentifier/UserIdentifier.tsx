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

import { getAlphabetIcon } from '@Common/Helper'
import { Tooltip } from '@Common/Tooltip'
import { API_TOKEN_PREFIX } from '@Shared/constants'
import { useUserEmail } from '@Shared/Providers'

import { Icon } from '../Icon'
import { UserIdentifierProps } from './types'

const UserIdentifierTooltip = ({
    children,
    tooltipContent,
}: Pick<UserIdentifierProps, 'children' | 'tooltipContent'>) => (
    <Tooltip alwaysShowTippyOnHover={!!tooltipContent} content={tooltipContent}>
        <div className="flexbox dc__gap-8 dc__align-items-center">{children}</div>
    </Tooltip>
)

export const UserIdentifier = ({
    identifier,
    children,
    rootClassName,
    tooltipContent,
    isUserGroup = false,
    displayYouLabelForCurrentUser = true,
}: UserIdentifierProps) => {
    // HOOKS
    const { email: currentUserEmail } = useUserEmail()

    if (!identifier) {
        return null
    }

    // CONSTANTS
    const isCurrentUser = identifier === currentUserEmail
    const isApiToken = identifier.startsWith(API_TOKEN_PREFIX)

    const renderIcon = () => {
        if (isApiToken) {
            return <Icon name="ic-key" color="N700" size={20} />
        }

        return isUserGroup ? (
            <Icon name="ic-users" color="N700" size={20} />
        ) : (
            getAlphabetIcon(identifier, 'dc__no-shrink m-0-imp')
        )
    }

    const renderText = () => {
        if (isCurrentUser && displayYouLabelForCurrentUser) {
            return 'You'
        }

        if (isApiToken) {
            return identifier.split(':')?.[1] || '-'
        }

        return identifier
    }

    return (
        <div className={`flexbox dc__gap-8 ${rootClassName || ''}`}>
            <UserIdentifierTooltip tooltipContent={tooltipContent}>
                {renderIcon()}
                <div className="flexbox dc__gap-2">
                    <Tooltip
                        {...(tooltipContent
                            ? { content: identifier, alwaysShowTippyOnHover: false }
                            : { content: identifier })}
                    >
                        <span className="cn-9 fs-13 fw-4 lh-20 dc__truncate">{renderText()}</span>
                    </Tooltip>
                    {children}
                </div>
            </UserIdentifierTooltip>
        </div>
    )
}
