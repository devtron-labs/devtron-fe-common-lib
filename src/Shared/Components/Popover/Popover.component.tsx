import { AnimatePresence, motion } from 'framer-motion'

import { Backdrop } from '../Backdrop'
import { Button } from '../Button'
import { PopoverProps } from './types'

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
    triggerProps: { bounds, ...triggerProps },
    buttonProps,
    triggerElement,
    children,
}: PopoverProps) => (
    <>
        <div {...triggerProps}>{triggerElement || <Button {...buttonProps} />}</div>

        <AnimatePresence>
            {open && (
                <Backdrop {...overlayProps}>
                    <div className="dc__position-abs" style={{ left: bounds.left, top: bounds.top }}>
                        <div className="dc__visibility-hidden" style={{ width: bounds.width, height: bounds.height }} />
                        <motion.div {...popoverProps} data-testid={popoverProps.id}>
                            {children}
                        </motion.div>
                    </div>
                </Backdrop>
            )}
        </AnimatePresence>
    </>
)
