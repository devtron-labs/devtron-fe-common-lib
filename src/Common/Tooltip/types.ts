import { XORProps } from '@Common/Types'
import { TippyProps } from '@tippyjs/react'

type BaseTooltipProps = {
    /**
     * If true, show tippy on truncate
     * @default true
     */
    showOnTruncate: boolean
    /**
     * If showOnTruncate is defined this prop doesn't work
     * @default false
     */
    alwaysShowTippyOnHover: boolean
}

export type TooltipProps = XORProps<'showOnTruncate', 'alwaysShowTippyOnHover', BaseTooltipProps> &
    TippyProps & {
        /**
         * If true, apply dc__word-break-all
         * @default true
         */
        wordBreak?: boolean
    }
