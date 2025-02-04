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

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { useRegisterShortcut } from '@Common/Hooks'
import { preventBodyScroll, preventOutsideFocus } from '@Shared/Helpers'
import { DEVTRON_BASE_MAIN_ID } from '@Shared/constants'
import { BackdropProps } from './types'

const Backdrop = ({ children, onEscape }: BackdropProps) => {
    const { registerShortcut, unregisterShortcut } = useRegisterShortcut()

    // useEffect on onEscape since onEscape might change based on conditions
    useEffect(() => {
        registerShortcut({ keys: ['Escape'], callback: onEscape })

        return () => {
            unregisterShortcut(['Escape'])
        }
    }, [onEscape])

    useEffect(() => {
        preventBodyScroll(true)
        // Setting main as inert to that focus is trapped inside the new portal
        preventOutsideFocus({ identifier: DEVTRON_BASE_MAIN_ID, preventFocus: true })

        return () => {
            preventBodyScroll(false)
            preventOutsideFocus({ identifier: DEVTRON_BASE_MAIN_ID, preventFocus: false })
        }
    }, [])

    return createPortal(
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.35 } }}
            className="backdrop dc__position-fixed dc__top-0 dc__left-0 full-height-width flexbox dc__content-center dc__align-items-center dc__overflow-hidden"
        >
            {children}
        </motion.div>,
        document.getElementById('animated-dialog-backdrop'),
    )
}

export default Backdrop
