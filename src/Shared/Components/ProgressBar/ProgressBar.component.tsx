import { useEffect } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

import { ProgressBarProps } from './types'

export const ProgressBar = ({ isLoading, intervalTime = 50 }: ProgressBarProps) => {
    const progress = useMotionValue<number>(0)
    const smoothProgress = useSpring(progress, { stiffness: 50, damping: 20 })

    const width = useTransform(smoothProgress, (v) => `${v}%`)

    useEffect(() => {
        let interval = null

        if (isLoading) {
            interval = setInterval(() => {
                const next = progress.get() + Math.random() * 5
                progress.set(next < 95 ? next : 95)
            }, intervalTime)
        }

        return () => clearInterval(interval)
    }, [isLoading])

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="dc__position-abs dc__top-0 dc__left-0 dc__zi-10 h-2 w-100 bcn-2"
                >
                    <motion.div
                        className="h-100 bcb-5"
                        style={{
                            width,
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    )
}
