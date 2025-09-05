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
    returnFocusOnDeactivate = true,
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
                    returnFocusOnDeactivate,
                }}
            >
                {children}
            </FocusTrap>
        </FocusTrapControlContext.Provider>
    )
}

export default DTFocusTrap
