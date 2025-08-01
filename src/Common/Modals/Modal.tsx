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

import React, { useEffect } from 'react'
import { ModalType } from '../Types'
import { POP_UP_MENU_MODAL_ID } from '@Shared/constants'
import { Backdrop } from '@Shared/Components'
import { noop } from '@Common/Helper'

/**
 * @deprecated Use VisibleModal instead
 */
export const Modal = ({
    style = {},
    children,
    rootClassName = '',
    onClick = null,
    callbackRef = null,
    preventWheelDisable = false,
    noBackDrop,
}: ModalType) => {
    const innerRef = React.useRef(null)
    function handleClick(e) {
        e.stopPropagation()
        if (typeof onClick !== 'function') return
        if (innerRef && innerRef.current?.contains(e.target)) {
            onClick(e, 'in')
        } else {
            onClick(e, 'out')
        }
    }

    function disableWheel(e) {
        if (!preventWheelDisable) {
            if (innerRef.current?.contains(e.target)) {
                if (innerRef.current.clientHeight === innerRef.current.scrollHeight) {
                    e.preventDefault()
                }
            } else {
                e.preventDefault()
            }
        }
    }
    useEffect(() => {
        if (!preventWheelDisable) document.body.addEventListener('wheel', disableWheel, { passive: false })
        return () => {
            if (!preventWheelDisable) document.body.removeEventListener('wheel', disableWheel)
        }
    }, [])

    return (
        <Backdrop onEscape={noop} onClick={handleClick} hasClearBackground={noBackDrop}>
            <div
                tabIndex={0}
                onClick={handleClick}
                data-testid="common-modal"
                ref={(el) => {
                    if (typeof callbackRef === 'function') {
                        callbackRef(el)
                    }
                    innerRef.current = el
                }}
                id="popup"
                className={`${rootClassName} ${POP_UP_MENU_MODAL_ID}`}
                style={{ ...style }}
            >
                {children}
            </div>
        </Backdrop>
    )
}
