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
    returnFocusOnDeactivate = true,
    avoidFocusTrap = false,
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
            active={!avoidFocusTrap}
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
    )
}

export default DTFocusTrap
