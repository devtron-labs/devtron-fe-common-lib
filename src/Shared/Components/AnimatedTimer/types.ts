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

import { animate } from 'framer-motion'

import { TooltipProps } from '@Common/Tooltip'
import { IconBaseSizeType } from '@Shared/index'

export interface AnimatedTimerProps extends Pick<Parameters<typeof animate>[2], 'onComplete'> {
    /**
     * The time in seconds for the timer to animate.
     */
    duration: number
    onComplete?: () => void
    /**
     * @default 24
     */
    size?: IconBaseSizeType
    tooltipContent?: TooltipProps['content']
}
