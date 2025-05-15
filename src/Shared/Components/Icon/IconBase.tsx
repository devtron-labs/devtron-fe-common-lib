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

import { ConditionalWrap } from '@Common/Helper'
import { Tooltip } from '@Common/Tooltip'

import { ICON_STROKE_WIDTH_MAP } from './constants'
import { IconBaseProps } from './types'

import './styles.scss'

const conditionalWrap = (tooltipProps: IconBaseProps['tooltipProps']) => (children: JSX.Element) => (
    <Tooltip {...tooltipProps}>
        <div className="flex">{children}</div>
    </Tooltip>
)

export const IconBase = ({ name, iconMap, size = 16, tooltipProps, color }: IconBaseProps) => {
    const IconComponent = iconMap[name]

    if (!IconComponent) {
        throw new Error(`Icon with name "${name}" does not exist.`)
    }

    return (
        <ConditionalWrap condition={!!tooltipProps?.content} wrap={conditionalWrap(tooltipProps)}>
            <IconComponent
                className={`${size ? `icon-dim-${size}` : ''} ${color ? 'icon-component-color' : ''} ${ICON_STROKE_WIDTH_MAP[size] ? 'icon-component-stroke-width' : ''} dc__no-shrink`}
                style={{
                    ...(color ? { ['--iconColor' as string]: `var(--${color})` } : {}),
                    ...(ICON_STROKE_WIDTH_MAP[size]
                        ? { ['--strokeWidth' as string]: ICON_STROKE_WIDTH_MAP[size] }
                        : {}),
                }}
            />
        </ConditionalWrap>
    )
}
