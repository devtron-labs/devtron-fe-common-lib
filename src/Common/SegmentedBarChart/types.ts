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

export type Entity = {
    color: string
    label: string
    value: number
}

type EntityPropType =
    | {
          hideLegend?: false
          entities: NonNullable<Entity[]>
      }
    | {
          hideLegend: true
          entities: NonNullable<Omit<Entity, 'label'> & { label?: never }>[]
      }

export type SegmentedBarChartProps = {
    rootClassName?: string
    countClassName?: string
    labelClassName?: string
    isProportional?: boolean
    swapLegendAndBar?: boolean
    showAnimationOnBar?: boolean
    isLoading?: boolean
    size?: ComponentSizeType
} & EntityPropType
