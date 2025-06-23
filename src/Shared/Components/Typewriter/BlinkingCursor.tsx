import { motion } from 'framer-motion'

export const BlinkingCursor = () => (
    <motion.span
        animate={{ opacity: [0, 0, 1, 1] }}
        transition={{
            duration: 1,
            repeat: Infinity,
            repeatDelay: 0,
            ease: 'linear',
            times: [0, 0.5, 0.5, 1],
        }}
        className="w-8 h-20 bcn-9 ml-2 dc__inline-block br-2"
    />
)
