import { useEffect } from 'react'
import { animate, useMotionValue, useTransform } from 'framer-motion'

export const useTypewriter = (text: string) => {
    const progress = useMotionValue(0)

    const visibleText = useTransform(progress, (latest) => text.slice(0, Math.floor(latest)))

    useEffect(() => {
        const controls = animate(progress, text.length, {
            type: 'tween',
            duration: 4,
            ease: 'linear',
        })

        return controls.stop
    }, [text])

    return visibleText
}
