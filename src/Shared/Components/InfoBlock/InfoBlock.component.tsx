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

import { ComponentSizeType } from '@Shared/constants'
import { deriveBorderRadiusAndBorderClassFromConfig } from '@Shared/Helpers'

import { Button } from '../Button'
import {
    CONTAINER_SIZE_TO_BUTTON_SIZE,
    CONTAINER_SIZE_TO_CLASS_MAP,
    SIZE_TO_ICON_CLASS_MAP,
    VARIANT_TO_BG_MAP,
    VARIANT_TO_ICON_MAP,
} from './constants'
import { InfoBlockProps } from './types'

const InfoBlock = ({
    layout = 'row',
    variant = 'information',
    size = ComponentSizeType.large,
    customIcon,
    buttonProps,
    heading,
    description,
    borderRadiusConfig,
    borderConfig,
}: InfoBlockProps) => {
    const baseContainerClass = `${CONTAINER_SIZE_TO_CLASS_MAP[size]} ${VARIANT_TO_BG_MAP[variant]} ${deriveBorderRadiusAndBorderClassFromConfig({ borderConfig, borderRadiusConfig })} w-100 py-8 br-4 bw-1`
    const iconClass = `dc__no-shrink flex dc__fill-available-space ${SIZE_TO_ICON_CLASS_MAP[size]}`
    const icon = customIcon ?? VARIANT_TO_ICON_MAP[variant]

    const renderIcon = () => <span className={iconClass}>{icon}</span>

    const renderHeading = () => {
        if (!heading) {
            return null
        }

        if (typeof heading === 'string') {
            return (
                <h6
                    className={`cn-9 ${size === ComponentSizeType.large ? 'fs-13 lh-20' : 'fs-12 lh-18'} fw-6 m-0 dc__truncate--clamp-3 dc__word-break`}
                >
                    {heading}
                </h6>
            )
        }

        return heading
    }

    const renderDescription = () => {
        if (!description) {
            return null
        }

        if (typeof description === 'string') {
            return (
                <p
                    className={`m-0 cn-9 fw-4 ${size === ComponentSizeType.large ? 'fs-13 lh-20' : 'fs-12 lh-18'} dc__truncate--clamp-6 dc__word-break`}
                >
                    {description}
                </p>
            )
        }

        return description
    }

    const renderContent = () => {
        const shouldAddGap = layout === 'column'
        const columnLayoutGapClass = size === ComponentSizeType.medium ? 'dc__gap-2' : 'dc__gap-4'

        return (
            <div className={`flexbox-col flex-grow-1 ${shouldAddGap ? columnLayoutGapClass : ''}`}>
                {renderHeading()}
                {renderDescription()}
            </div>
        )
    }

    if (layout === 'row') {
        return (
            <div className={`${baseContainerClass} flexbox dc__gap-16`}>
                <div className="flexbox dc__gap-8 flex-grow-1">
                    {renderIcon()}
                    {renderContent()}
                </div>

                {buttonProps && <Button {...buttonProps} size={CONTAINER_SIZE_TO_BUTTON_SIZE[size]} />}
            </div>
        )
    }

    if (layout === 'column') {
        return (
            <div className={`${baseContainerClass} flexbox-col dc__gap-8`}>
                <div className="flexbox dc__gap-8">
                    {renderContent()}
                    {renderIcon()}
                </div>

                {buttonProps && <Button {...buttonProps} size={CONTAINER_SIZE_TO_BUTTON_SIZE[size]} />}
            </div>
        )
    }

    return null
}

export default InfoBlock
