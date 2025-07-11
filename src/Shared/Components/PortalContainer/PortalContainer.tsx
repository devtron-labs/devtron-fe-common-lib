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
