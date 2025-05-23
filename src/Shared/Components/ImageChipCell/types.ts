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
import { ComponentProps, SyntheticEvent } from 'react'
import Tippy from '@tippyjs/react'

import { RegistryType } from '../../types'

type ImageChipCellButtonActionProps =
    | {
          handleClick: (e: SyntheticEvent) => void
          isExpanded: boolean
      }
    | {
          handleClick?: never
          isExpanded?: never
      }

export type ImageChipCellProps = {
    imagePath: string
    registryType?: RegistryType
    placement?: ComponentProps<typeof Tippy>['placement']
} & ImageChipCellButtonActionProps
