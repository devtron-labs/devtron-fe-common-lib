import { AnimatePresence, motion } from 'framer-motion'

import { CollapseProps } from './types'

/**
 * Collapse component for smoothly expanding or collapsing its content.
 * It also supports a callback when the transition ends.
 */
export const Collapse = ({ expand, onTransitionEnd, children }: CollapseProps) => (
    <AnimatePresence>
        {expand && (
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, easings: ['easeOut'] }}
                onTransitionEnd={onTransitionEnd}
                style={{ overflow: 'hidden' }}
            >
                {children}
            </motion.div>
        )}
    </AnimatePresence>
)
