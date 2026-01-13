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
import { Backdrop } from '@Shared/Components'
import { DTFocusTrapType } from '@Shared/Components/DTFocusTrap'
import { noop } from '@Common/Helper'

export class VisibleModal2 extends Component<PropsWithChildren<{
    className?: string
    close?: (e?) => void
    initialFocus?: DTFocusTrapType['initialFocus']
}>> {
    constructor(props) {
        super(props)
    }

    handleBodyClick = (e: SyntheticEvent) => {
        e.stopPropagation()
        this.props.close?.(e)
    }

    render() {
        return (
            <Backdrop
                onEscape={this.props.close ?? noop}
                onClick={this.handleBodyClick}
                initialFocus={this.props.initialFocus ?? undefined}
            >
                <div className={`visible-modal__body ${this.props.className || ''}`}>{this.props.children}</div>
            </Backdrop>
        )
    }
}
