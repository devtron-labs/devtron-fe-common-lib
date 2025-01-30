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

import { Tooltip } from '@Common/Tooltip'
import { ConditionalWrap } from '@Common/Helper'

import { Icon } from '../Icon'
import { StatusComponentProps } from './types'
import { getIconColor, getIconName } from './utils'

const statusWrapComponent = (children: JSX.Element) => (
    <div className="flexbox dc__align-items-center dc__gap-6">{children}</div>
)

export const StatusComponent = ({
    status,
    hideIcon = false,
    hideMessage = false,
    iconSize = 16,
    showAnimatedIcon = false,
    hideIconTooltip = false,
    message,
}: StatusComponentProps) => {
    const appStatusLowerCase = status.toLowerCase().replace(/ /g, '-')
    const textContent = message || status || '-'

    const renderIcon = () => {
        const iconName = getIconName(appStatusLowerCase, showAnimatedIcon)
        const iconColor = getIconColor(appStatusLowerCase)

        if (iconName) {
            return (
                <Icon
                    name={iconName}
                    size={iconSize}
                    color={iconColor}
                    tooltipProps={{
                        alwaysShowTippyOnHover: true,
                        placement: 'top',
                        content: hideMessage && !hideIconTooltip ? textContent : null,
                    }}
                />
            )
        }

        return (
            <Icon
                name="ic-info-outline"
                size={iconSize}
                tooltipProps={{
                    alwaysShowTippyOnHover: true,
                    placement: 'top',
                    content: 'To fetch app status for Helm based deployments open the app detail page',
                }}
                color="N600"
            />
        )
    }

    const renderMessage = () => (
        <Tooltip content={textContent}>
            <p
                data-testid={`${status}-status`}
                className="m-0 dc__ellipsis-right dc__first-letter-capitalize fs-13 lh-20 cn-6"
            >
                {textContent}
            </p>
        </Tooltip>
    )

    return (
        <ConditionalWrap condition={!hideIcon && !hideMessage} wrap={statusWrapComponent}>
            {!hideIcon && renderIcon()}
            {!hideMessage && renderMessage()}
        </ConditionalWrap>
    )
}
