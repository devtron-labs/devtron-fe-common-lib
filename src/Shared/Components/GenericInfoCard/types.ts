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

import { MouseEventHandler, ReactElement } from 'react'
import { LinkProps } from 'react-router-dom'

type BaseGenericInfoCardProps = {
    title: string
    description: string
    author: string
    Icon: ReactElement
} & (
    | {
          onClick?: never
          linkProps?: Pick<LinkProps, 'to' | 'target' | 'rel'>
      }
    | {
          onClick?: MouseEventHandler<HTMLDivElement>
          linkProps?: never
      }
)

export enum GenericInfoCardBorderVariant {
    ROUNDED = 'rounded',
    NONE = 'none',
}

export type GenericInfoCardProps = { borderVariant: GenericInfoCardBorderVariant } & (
    | ({
          isLoading: true
      } & Partial<Record<keyof BaseGenericInfoCardProps, never>>)
    | ({
          isLoading?: boolean
      } & BaseGenericInfoCardProps)
)
