/*
 * Copyright (c) 2024. Devtron Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
                    <div
                        className="dc__position-abs"
                        style={{ left: bounds.left, top: bounds.top }}
                        onClick={triggerProps.onClick}
                    >
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
