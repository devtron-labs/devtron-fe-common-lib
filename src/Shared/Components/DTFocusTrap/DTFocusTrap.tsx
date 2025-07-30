import { useCallback, useEffect } from 'react'
import FocusTrap from 'focus-trap-react'

import { ALLOW_ACTION_OUTSIDE_FOCUS_TRAP } from '@Shared/constants'
import { preventBodyScroll } from '@Shared/Helpers'

import { DTFocusTrapType } from './types'

const DTFocusTrap = ({
    onEscape,
    deactivateFocusOnEscape = true,
    children,
    initialFocus = undefined,
}: DTFocusTrapType) => {
    const handleEscape = useCallback(
        (e?: KeyboardEvent | MouseEvent) => {
            onEscape(e)
            return deactivateFocusOnEscape
        },
        [onEscape, deactivateFocusOnEscape],
    )

    useEffect(() => {
        preventBodyScroll(true)

        return () => {
            preventBodyScroll(false)
        }
    }, [])

    return (
        <FocusTrap
            focusTrapOptions={{
                escapeDeactivates: handleEscape,
                initialFocus,
                allowOutsideClick: (event) => {
                    // Allow up to 3 parent levels to check for the allowed class
                    let el = event.target as Element | null
                    let depth = 0
                    while (el && depth < 4) {
                        if (el.classList && el.classList.contains(ALLOW_ACTION_OUTSIDE_FOCUS_TRAP)) {
                            return true
                        }
                        el = el.parentElement
                        depth += 1
                    }
                    return false
                },
            }}
        >
            {children}
        </FocusTrap>
    )
}

export default DTFocusTrap
