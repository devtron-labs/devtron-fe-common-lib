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

import { PropsWithChildren, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { getUniqueId } from '@Shared/Helpers'

export const PortalContainer = ({
    condition = true,
    portalParentId,
    children,
}: PropsWithChildren<{ condition?: boolean; portalParentId: string }>) => {
    // STATES
    const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)

    // REFS
    const portalContainerIdRef = useRef(`portal-container-${getUniqueId()}`)

    useLayoutEffect(() => {
        const portalParent = document.getElementById(portalParentId)
        let element = document.getElementById(portalContainerIdRef.current)
        let systemCreated = false

        if (condition && portalParent) {
            // If the portal container doesn't exist, create and append it to the DOM
            if (!element) {
                systemCreated = true

                const portalContainer = document.createElement('div')
                portalContainer.setAttribute('id', portalContainerIdRef.current)
                portalParent.appendChild(portalContainer)

                element = portalContainer
            }

            // Set the container element as the portal's render target
            setTargetElement(element)
        }

        return () => {
            // Clean up only if we created the element
            if (systemCreated && portalParent) {
                portalParent.removeChild(element)
            }
        }
    }, [condition, portalParentId])

    return targetElement ? createPortal(children, targetElement) : null
}
