import { ReactNode, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRegisterShortcut } from '@Common/Hooks'
import { preventBodyScroll, toggleOutsideFocus } from '@Shared/Helpers'
import './backdrop.scss'
import { createPortal } from 'react-dom'
import { ToggleFocusType } from '@Shared/types'
import { DEVTRON_BASE_MAIN_ID } from '@Shared/constants'

const Backdrop = ({ children, onEscape }: { children: ReactNode; onEscape: () => void }) => {
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
        toggleOutsideFocus({ identifier: DEVTRON_BASE_MAIN_ID, toggleFocus: ToggleFocusType.Disable })

        return () => {
            preventBodyScroll(false)
            toggleOutsideFocus({ identifier: DEVTRON_BASE_MAIN_ID, toggleFocus: ToggleFocusType.Enable })
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
        document.getElementById('backdrop'),
    )
}

export default Backdrop
