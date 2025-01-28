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
import { stopPropagation } from '@Common/Helper'
import { TargetPlatformListTooltipProps } from './types'

const TooltipContent = ({ targetPlatforms }: Pick<TargetPlatformListTooltipProps, 'targetPlatforms'>) => (
    <div className="flexbox-col dc__gap-4 cursor-text" onClick={stopPropagation}>
        <h6 className="m-0 fw-6 lh-18 fs-12">Target platforms</h6>

        <ul className="pl-12 m-0 dc__overflow-auto mxh-140">
            {targetPlatforms.map(({ name }) => (
                <li key={name} className="dc__word-break lh-18">
                    {name}
                </li>
            ))}
        </ul>
    </div>
)

const TargetPlatformListTooltip = ({ targetPlatforms, children }: TargetPlatformListTooltipProps) => (
    <Tooltip content={<TooltipContent targetPlatforms={targetPlatforms} />} alwaysShowTippyOnHover interactive>
        {children}
    </Tooltip>
)

export default TargetPlatformListTooltip
