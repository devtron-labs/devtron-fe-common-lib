import { useEffect } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'framer-motion'

import { CX, CY, END_ANGLE, RADIUS, START_ANGLE } from './constants'
import { AnimatedTimerProps } from './types'

const polarToCartesian = (cx: number, cy: number, r: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
    return {
        x: cx + r * Math.cos(angleInRadians),
        y: cy + r * Math.sin(angleInRadians),
    }
}

const describeArcPath = (cx: number, cy: number, r: number, endAngle: number) => {
    const startAngle = 0
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'
    const start = polarToCartesian(cx, cy, r, endAngle)
    const end = polarToCartesian(cx, cy, r, startAngle)

    return `
      M ${cx} ${cy}
      L ${start.x} ${start.y}
      A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}
      Z
    `
}

const AnimatedTimer = ({ duration, onComplete, size = 24 }: AnimatedTimerProps) => {
    const angle = useMotionValue<number>(START_ANGLE)
    const d = useTransform(angle, (currentAngle) => describeArcPath(CX, CY, RADIUS, currentAngle))
    useEffect(() => {
        const controls = animate(angle, END_ANGLE, {
            duration,
            ease: 'easeInOut',
            onComplete,
        })
        return controls.stop
    }, [duration])

    return (
        <svg
            width={CX * 2}
            height={CY * 2}
            viewBox={`0 0 ${CX * 2} ${CY * 2}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`icon-dim-${size}`}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12Z"
                fill="var(--O500)"
            />

            <motion.path fill="var(--O200)" d={d} />
        </svg>
    )
}

export default AnimatedTimer
