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

import React, { PropsWithChildren, SyntheticEvent } from 'react'
import ReactDOM from 'react-dom'
import { preventBodyScroll } from '../../Shared'
import { stopPropagation } from '../Helper'
import DelayComponentRender from '../DelayComponentRender';

interface VisibleModal2Props {
    className?: string;
    close?: (e) => void
}

export class VisibleModal2WithoutDelay extends React.Component<VisibleModal2Props> {
    modalRef = document.getElementById('visible-modal-2')
    previousActiveElement: HTMLElement | null = null

    constructor(props) {
        super(props)
        this.escFunction = this.escFunction.bind(this)
    }

    escFunction(event) {
        stopPropagation(event)
        if (event.keyCode === 27 && this.props.close) {
            this.props.close(event)
        }
    }

    componentDidMount() {
        document.addEventListener('keydown', this.escFunction)
        this.modalRef.classList.add('show-with-bg')
        preventBodyScroll(true)
        this.previousActiveElement = document.activeElement as HTMLElement
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.escFunction)
        this.modalRef.classList.remove('show-with-bg')
        preventBodyScroll(false)
        this.previousActiveElement?.focus({ preventScroll: true })
    }

    handleBodyClick = (e: SyntheticEvent) => {
        e.stopPropagation()

        this.props.close?.(e)
    }

    render() {
        return ReactDOM.createPortal(
            <div
                className={`visible-modal__body ${this.props.className || ''}`}
                onClick={this.handleBodyClick}
                data-testid="visible-modal2-close"
            >
                {this.props.children}
            </div>,
            document.getElementById('visible-modal-2'),
        )
    }
}


export const VisibleModal2 = (props: PropsWithChildren<VisibleModal2Props>) => {
    return (
        <DelayComponentRender>
            <VisibleModal2 {...props} />
        </DelayComponentRender>
    )
}