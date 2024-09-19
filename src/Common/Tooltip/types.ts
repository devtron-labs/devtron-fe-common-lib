import { TippyProps } from '@tippyjs/react'

const isMacOS = navigator.userAgent.toUpperCase().includes('MAC')

export const KEYBOARD_KEYS_MAP = {
    Control: isMacOS ? '⌘' : 'Ctrl',
    Shift: '⇧',
    F: 'F',
} as const

export type SupportedKeyboardKeysType = keyof typeof KEYBOARD_KEYS_MAP

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
           * @default false
           */
          shortcutKeyCombo?: never
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
          alwaysShowTippyOnHover?: boolean
          /**
           * If true, use the common styling for shortcuts
           * @default false
           */
          shortcutKeyCombo?: never
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
          alwaysShowTippyOnHover?: never
          /**
           * If true, use the common styling for shortcuts
           * @default true
           */
          shortcutKeyCombo?: {
              text: string
              combo: SupportedKeyboardKeysType[]
          }
      }

export type TooltipProps = BaseTooltipProps &
    TippyProps & {
        /**
         * If true, apply dc__word-break-all
         * @default true
         */
        wordBreak?: boolean
    }
