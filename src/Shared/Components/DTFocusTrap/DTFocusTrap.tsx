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
                allowOutsideClick: (event) =>
                    (event.target as Element).classList.contains(ALLOW_ACTION_OUTSIDE_FOCUS_TRAP),
            }}
        >
            {children}
        </FocusTrap>
    )
}

export default DTFocusTrap
