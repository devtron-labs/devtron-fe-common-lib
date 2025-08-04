import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import FocusTrap from 'focus-trap-react'

import { noop } from '@Common/Helper'
import { ALLOW_ACTION_OUTSIDE_FOCUS_TRAP } from '@Shared/constants'
import { preventBodyScroll } from '@Shared/Helpers'

import { DTFocusTrapType } from './types'

const FocusTrapControlContext = createContext<{
    disableFocusTrap: () => void
    resumeFocusTrap: () => void
}>(null)

export const useFocusTrapControl = () => {
    const context = useContext(FocusTrapControlContext)
    if (!context) {
        return {
            disableFocusTrap: noop,
            resumeFocusTrap: noop,
        }
    }
    return context
}

const DTFocusTrap = ({
    onEscape,
    deactivateFocusOnEscape = true,
    children,
    initialFocus = undefined,
}: DTFocusTrapType) => {
    const [isFocusEnabled, setIsFocusEnabled] = useState(true)

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

    const focusContextValue = useMemo(
        () => ({
            disableFocusTrap: () => setIsFocusEnabled(false),
            resumeFocusTrap: () => setIsFocusEnabled(true),
        }),
        [],
    )

    return (
        <FocusTrapControlContext.Provider value={focusContextValue}>
            <FocusTrap
                active={isFocusEnabled}
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
        </FocusTrapControlContext.Provider>
    )
}

export default DTFocusTrap
