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

import { Icon } from '../Icon'
import { BadgeProps } from './types'
import { getClassNameAccToSize, getClassNameAccToVariant } from './utils'

const Badge = ({
    label,
    bgColor,
    fontColor,
    endIconProps,
    startIconProps,
    variant = 'default',
    size = ComponentSizeType.xs,
}: BadgeProps) => {
    const { styles, iconColor } = getClassNameAccToVariant(variant)
    const iconSize = size === ComponentSizeType.xs ? 20 : 16

    return (
        <div
            className={`flex dc__gap-4 br-4 fw-5 dc__w-fit-content ${getClassNameAccToSize(size)} ${styles}`}
            {...(bgColor && fontColor
                ? {
                      style: {
                          backgroundColor: `var(--${bgColor})`,
                          color: `var(--${fontColor})`,
                      },
                  }
                : {})}
        >
            {startIconProps && <Icon {...startIconProps} size={iconSize} color={fontColor || iconColor} />}
            {label && <span className="dc__truncate">{label}</span>}
            {endIconProps && <Icon {...endIconProps} size={iconSize} color={fontColor || iconColor} />}
        </div>
    )
}

export default Badge
