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

import { ReactElement } from 'react'

import { OmitNever } from '@Shared/types'

import { ActionMenuProps } from '../ActionMenu'
import { ButtonProps } from '../Button'
import { IconsProps } from '../Icon'
import { NumbersCountProps } from '../NumbersCount'
import { DTSwitchProps } from '../Switch'

export type ActionMenuItemIconType = Pick<IconsProps, 'name'> & {
    /** @default 'N800' */
    color?: IconsProps['color']
}

export type TrailingItemType =
    | {
          type: 'icon'
          config: ActionMenuItemIconType
      }
    | {
          type: 'text'
          config: {
              value: string
              icon?: ActionMenuItemIconType
          }
      }
    | {
          type: 'counter'
          config: {
              value: NumbersCountProps['count']
          } & Pick<NumbersCountProps, 'isSelected'>
      }
    | {
          type: 'switch'
          config: Pick<
              DTSwitchProps,
              | 'ariaLabel'
              | 'isChecked'
              | 'indeterminate'
              | 'isDisabled'
              | 'isLoading'
              | 'name'
              | 'onChange'
              | 'tooltipContent'
          >
      }
    | {
          type: 'button'
          config: OmitNever<Omit<Extract<ButtonProps, { icon: ReactElement }>, 'size' | 'variant'>>
      }
    | {
          type: 'action-menu'
          config: ActionMenuProps
      }

export type TrailingItemProps = TrailingItemType & {
    /**
     * @default 'neutral'
     */
    variant?: 'neutral' | 'negative'
}
