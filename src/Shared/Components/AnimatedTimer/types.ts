import { animate } from 'framer-motion'

import { TooltipProps } from '@Common/Tooltip'
import { IconBaseSizeType } from '@Shared/index'

export interface AnimatedTimerProps extends Pick<Parameters<typeof animate>[2], 'onComplete'> {
    /**
     * The time in seconds for the timer to animate.
     */
    duration: number
    onComplete?: () => void
    /**
     * @default 24
     */
    size?: IconBaseSizeType
    tooltipContent?: TooltipProps['content']
}
