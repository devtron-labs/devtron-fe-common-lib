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

import { SupportedKeyboardKeysType } from '@Common/Hooks/UseRegisterShortcut/types'
import { TippyProps } from '@tippyjs/react'

type BaseTooltipProps =
    | {
          /**
           * If true, show tippy on truncate
           * @default true
           */
          showOnTruncate?: boolean
          /**
           * If showOnTruncate is defined this prop doesn't work
           * @default false
           */
          alwaysShowTippyOnHover?: never
          /**
           * If true, use the common styling for shortcuts
           * @default undefined
           */
          shortcutKeyCombo?: never
          content: TippyProps['content']
      }
    | {
          /**
           * If alwaysShowTippyOnHover is defined this prop doesn't work
           * @default false
           */
          showOnTruncate?: never
          /**
           * If true, wrap with tippy irrespective of other options
           * @default true
           */
          alwaysShowTippyOnHover: boolean
          /**
           * If true, use the common styling for shortcuts
           * @default undefined
           */
          shortcutKeyCombo?: never
          content: TippyProps['content']
      }
    | {
          /**
           * If true, show tippy on truncate
           * @default false
           */
          showOnTruncate?: never
          /**
           * If showOnTruncate is defined this prop doesn't work
           * @default false
           */
          alwaysShowTippyOnHover?: boolean
          /**
           * If true, use the common styling for shortcuts
           * @default undefined
           */
          shortcutKeyCombo: {
              text: string
              combo: SupportedKeyboardKeysType[]
          }
          content?: never
      }

export type TooltipProps = BaseTooltipProps &
    TippyProps & {
        /**
         * If true, apply dc__word-break-all
         * @default true
         */
        wordBreak?: boolean
    }
