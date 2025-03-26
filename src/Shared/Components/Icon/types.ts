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

import { FC, SVGProps } from 'react'

import { TooltipProps } from '@Common/Tooltip/types'

type IconMap = Record<string, FC<SVGProps<SVGSVGElement>>>

export interface IconBaseProps {
    /** The name of the icon to render. */
    name: keyof IconMap
    /** The map containing all available icons. */
    iconMap: IconMap
    /**
     * The size of the icon in pixels.
     * @default 16
     */
    size?: 6 | 8 | 10 | 12 | 14 | 16 | 18 | 20 | 22 | 24 | 28 | 30 | 32 | 34 | 36 | 40 | 42 | 44 | 48 | 72 | 80
    /** Props to configure the tooltip when hovering over the icon. */
    tooltipProps?: TooltipProps
    /**
     * The color of the icon (color tokens). \
     * If `null`, the default color present in icon is used.
     * @example `'B500'`, `'N200'`, `'G50'`, `'R700'`
     */
    color:
        | `${'B' | 'N' | 'G' | 'Y' | 'R' | 'V' | 'O'}${`${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}00` | '50'}`
        | 'white'
        | 'black'
        | null
}
