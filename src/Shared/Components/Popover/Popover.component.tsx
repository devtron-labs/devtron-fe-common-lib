import { AnimatePresence, motion } from 'framer-motion'

import { Button } from '../Button'
import { PopoverProps } from './types'

import './popover.scss'

/**
 * Popover Component \
 * This component serves as a base for creating popovers. It is not intended to be used directly.
 * @note Use this component in conjunction with the `usePopover` hook to create a custom popover component. \
 * For example, see the `ActionMenu` component for reference.
 */
export const Popover = ({
    open,
    popoverProps,
    overlayProps,
    triggerProps,
    buttonProps,
    triggerElement,
    children,
}: PopoverProps) => (
    <div className="dc__position-rel dc__inline-block">
        <div {...triggerProps}>{triggerElement || <Button {...buttonProps} />}</div>

        <AnimatePresence>
            {open && (
                <>
                    {/* Overlay to block interactions with the background */}
                    <div {...overlayProps} />
                    <motion.div {...popoverProps} data-testid={popoverProps.id}>
                        {children}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    </div>
)
