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

import React from 'react'
import ReactDOM from 'react-dom'
import closeIcon from '../../Assets/Icon/ic-cross.svg'

export interface OpaqueModalProps {
    className?: string
    onHide?: any
    noBackground?: boolean
}

/**
 * @deprecated Use VisibleModal instead
 */
export class OpaqueModal extends React.Component<OpaqueModalProps> {
    modalRef = document.getElementById('full-screen-modal')

    componentDidMount() {
        if (this.props.noBackground) this.modalRef.classList.add('show')
        else this.modalRef.classList.add('show-with-bg')
    }

    componentWillUnmount() {
        this.modalRef.classList.remove('show')
        this.modalRef.classList.remove('show-with-bg')
    }

    render() {
        const { className = '', onHide = null } = { ...this.props }

        return ReactDOM.createPortal(
            <div className={`full-screen-modal__body-container ${className}`}>
                {this.props.children}
                {typeof onHide === 'function' && (
                    <div
                        className="close-btn icon-dim-24"
                        onClick={(e) => onHide(false)}
                        data-testid="opaque-modal-close"
                    >
                        <img className="close-img" src={closeIcon} alt="close" />
                    </div>
                )}
            </div>,
            document.getElementById('full-screen-modal'),
        )
    }
}
