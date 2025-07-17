import { useCallback, useEffect } from 'react'
import FocusTrap from 'focus-trap-react'

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
            }}
        >
            {children}
        </FocusTrap>
    )
}

export default DTFocusTrap
