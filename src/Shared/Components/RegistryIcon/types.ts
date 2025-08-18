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

import { RegistryType } from '@Shared/types'

import { IconsProps } from '../Icon'

export type RegistryIconProps =
    | {
          registryType?: RegistryType
          /**
           * The size of the icon in pixels.
           * @default 20
           */
          size?: IconsProps['size']
          /**
           * The registry URL to determine the icon.
           */
          registryUrl?: never
      }
    | {
          registryType?: never
          /**
           * The size of the icon in pixels.
           * @default 20
           */
          size?: IconsProps['size']
          /**
           * The registry URL to determine the icon.
           */
          registryUrl: string
      }
