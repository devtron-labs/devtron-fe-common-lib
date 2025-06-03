import { motion } from 'framer-motion'

import { BlinkingCursor } from './BlinkingCursor'
import { useTypewriter } from './useTypewriter'

interface TypewriterProps {
    text: string
}

export const Typewriter = ({ text }: TypewriterProps) => {
    const visibleText = useTypewriter(text)

    return (
        <motion.div>
            <motion.span>{visibleText}</motion.span>

            <BlinkingCursor />
        </motion.div>
    )
}
