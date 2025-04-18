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

import { ReactNode } from 'react'

import { IconsProps } from '../Icon'

export type GenericSectionErrorStateProps = {
    /**
     * Handler for reloading the section
     */
    reload?: () => void
    /**
     * If true, border is added to the section
     *
     * @default false
     */
    withBorder?: boolean
    /**
     * @default 'Failed to load'
     */
    title?: string
    /**
     * @default 'We could not load the information on this page.'
     */
    subTitle?: ReactNode
    /**
     * @default 'Please reload or try again later'
     */
    description?: ReactNode
    /**
     * @default 'Reload'
     */
    buttonText?: string
    /**
     * to be applied on parent div
     */
    rootClassName?: string
} & (
    | {
          /**
           * If provided, Icon with ic-circle-loader
           */
          progressingProps: Omit<IconsProps, 'name'>
          useInfoIcon?: false
      }
    | {
          progressingProps?: never
          /**
           * If true, info icon would be used instead of error
           *
           * @default false
           */
          useInfoIcon: true
      }
    | {
          progressingProps?: never
          useInfoIcon?: never
      }
)
