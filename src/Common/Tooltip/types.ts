import { TippyProps } from '@tippyjs/react'

export interface TooltipProps extends TippyProps {
    /**
     * If true, show tippy on truncate
     * @default false
     */
    showOnTruncate?: boolean
    /**
     * If true, wrap with tippy irrespective of other options
     * @default false
     */
    alwaysShowTippyOnHover?: boolean
}
