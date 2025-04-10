import { animate } from 'framer-motion'

export interface AnimatedTimerProps extends Pick<Parameters<typeof animate>[2], 'onComplete'> {
    /**
     * The time in seconds for the timer to animate.
     */
    duration: number
    onComplete?: () => void
}
