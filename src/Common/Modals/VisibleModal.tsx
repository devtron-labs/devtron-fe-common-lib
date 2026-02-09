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

import { Component, PropsWithChildren, SyntheticEvent } from 'react'

import { DTFocusTrapType } from '@Shared/Components/DTFocusTrap'

import { Backdrop, POP_UP_MENU_MODAL_ID } from '../../Shared'

export class VisibleModal extends Component<PropsWithChildren<{
    className?: string
    parentClassName?: string
    noBackground?: boolean
    close?: (e?) => void
    onEscape?: (e?) => void
    initialFocus?: DTFocusTrapType['initialFocus']
    avoidFocusTrap?: boolean
}>> {
    constructor(props) {
        super(props)
        this.escFunction = this.escFunction.bind(this)
    }

    escFunction() {
        if (this.props.onEscape) {
            this.props.onEscape()
        } else if (this.props.close) {
            this.props.close()
        }
    }

    handleBodyClick = (e: SyntheticEvent) => {
        const isPopupMenuPresent = document.getElementById(POP_UP_MENU_MODAL_ID)
        if (isPopupMenuPresent) {
            return
        }
        e.stopPropagation()
        this.props.close?.(e)
    }

    render() {
        return (
            <Backdrop
                onEscape={this.escFunction}
                onClick={this.handleBodyClick}
                initialFocus={this.props.initialFocus ?? undefined}
                avoidFocusTrap={this.props.avoidFocusTrap}
            >
                <div className={this.props.parentClassName}>
                    <div className={`visible-modal__body ${this.props.className || ''}`}>{this.props.children}</div>
                </div>
            </Backdrop>
        )
    }
}
