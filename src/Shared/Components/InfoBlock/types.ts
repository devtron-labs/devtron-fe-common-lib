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
import { BorderConfigType, ComponentLayoutType } from '@Shared/types'
import { ReactElement, ReactNode } from 'react'
import { ButtonComponentType, ButtonProps } from '../Button'

export type InfoBlockProps = {
    /**
     * @default 'row'
     */
    layout?: ComponentLayoutType
    /**
     * @default 'information'
     */
    variant?: 'error' | 'help' | 'information' | 'success' | 'warning' | 'neutral'
    /**
     * @default ComponentSizeType.large
     */
    size?: Extract<ComponentSizeType, ComponentSizeType.large | ComponentSizeType.medium>
    /**
     * If given would override the default icon derived from type
     */
    customIcon?: ReactElement
    buttonProps?: ButtonProps<ButtonComponentType>
    borderConfig?: BorderConfigType
    borderRadiusConfig?: BorderConfigType
} & (
    | {
          /**
           * If string, would apply h tag with necessary classes
           */
          heading: ReactNode
          /**
           * If string, would apply p tag with necessary classes
           */
          description: ReactNode
      }
    | {
          heading?: never
          description: ReactNode
      }
    | {
          heading: ReactNode
          description?: never
      }
)
