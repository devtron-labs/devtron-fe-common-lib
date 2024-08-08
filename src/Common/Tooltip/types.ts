import { TippyProps } from '@tippyjs/react'

type BaseTooltipProps =
    | {
          showOnTruncate?: boolean
          alwaysShowTippyOnHover?: never
      }
    | {
          /**
           * If true, show tippy on truncate
           * @default true
           */
          showOnTruncate?: never
          /**
           * If true, wrap with tippy irrespective of other options
           * @default false
           */
          alwaysShowTippyOnHover?: boolean
      }

export type TooltipProps = BaseTooltipProps &
    TippyProps & {
        /**
         * If true, apply dc__word-break-all
         * @default true
         */
        wordBreak?: boolean
    }
