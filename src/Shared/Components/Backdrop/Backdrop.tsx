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

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'

import { useRegisterShortcut } from '@Common/Hooks'
import { DEVTRON_BASE_MAIN_ID } from '@Shared/constants'
import { getUniqueId, preventBodyScroll, preventOutsideFocus } from '@Shared/Helpers'

import { BackdropProps } from './types'
import { createPortalContainerAndAppendToDOM } from './utils'

const Backdrop = ({ children, onEscape, onClick, hasClearBackground = false, onBackdropMount }: BackdropProps) => {
    // STATES
    const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)

    // HOOKS
    const { registerShortcut, unregisterShortcut } = useRegisterShortcut()

    // REFS
    const portalContainerIdRef = useRef(`backdrop-${getUniqueId()}`)

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
        preventOutsideFocus({ identifier: 'visible-modal', preventFocus: true })
        preventOutsideFocus({ identifier: 'visible-modal-2', preventFocus: true })

        return () => {
            preventBodyScroll(false)
            preventOutsideFocus({ identifier: DEVTRON_BASE_MAIN_ID, preventFocus: false })
            preventOutsideFocus({ identifier: 'visible-modal', preventFocus: false })
            preventOutsideFocus({ identifier: 'visible-modal-2', preventFocus: false })
        }
    }, [])

    useEffect(() => {
        onBackdropMount?.(!!portalContainer)
    }, [portalContainer])

    /**
     * Manages a dedicated DOM node for rendering a portal backdrop.
     *
     * On mount:
     * - Looks for an existing element with the specified `portalContainerId`
     * - If not found, creates and appends a new wrapper element to the DOM
     * - Sets the found or created element as the target for rendering the portal
     *
     * On unmount:
     * - Removes the portal container element from the DOM *only* if this component created it
     *
     * Why this is needed:
     * - Ensures each portal instance has an isolated container
     * - Avoids duplicate DOM nodes or conflicts with other portals
     * - Prevents memory leaks by cleaning up unused elements
     * - Allows rendering outside the parent DOM hierarchy to avoid layout/z-index issues
     */
    useLayoutEffect(() => {
        let element = document.getElementById(portalContainerIdRef.current)
        let systemCreated = false

        // If the portal container doesn't exist, create and append it to the DOM
        if (!element) {
            systemCreated = true
            element = createPortalContainerAndAppendToDOM(portalContainerIdRef.current)
        }

        // Set the container element as the portal's render target
        setPortalContainer(element)

        return () => {
            // Clean up only if we created the element
            if (systemCreated && element?.parentNode) {
                element.parentNode.removeChild(element)
            }
        }
    }, [])

    if (portalContainer === null) {
        return null
    }

    return createPortal(
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.35 } }}
            className={`backdrop ${hasClearBackground ? 'backdrop--transparent' : ''} dc__position-fixed dc__top-0 dc__left-0 full-height-width flexbox dc__content-center dc__align-items-center dc__overflow-hidden`}
            onClick={onClick}
        >
            {children}
        </motion.div>,
        portalContainer,
    )
}

export default Backdrop
