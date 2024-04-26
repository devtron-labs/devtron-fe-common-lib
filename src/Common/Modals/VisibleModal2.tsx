import React from 'react'
import ReactDOM from 'react-dom'
import { preventBodyScroll } from '../../Shared'

export class VisibleModal2 extends React.Component<{ className: string; close?: (e) => void }> {
    modalRef = document.getElementById('visible-modal-2')

    constructor(props) {
        super(props)
        this.escFunction = this.escFunction.bind(this)
    }

    escFunction(event) {
        if (event.keyCode === 27 && this.props.close) {
            this.props.close(event)
        }
    }

    componentDidMount() {
        document.addEventListener('keydown', this.escFunction)
        this.modalRef.classList.add('show-with-bg')
        preventBodyScroll(true)
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.escFunction)
        this.modalRef.classList.remove('show-with-bg')
        preventBodyScroll(false)
    }

    render() {
        return ReactDOM.createPortal(
            <div
                className={`visible-modal__body ${this.props.className}`}
                onClick={this.props?.close}
                data-testid="visible-modal2-close"
            >
                {this.props.children}
            </div>,
            document.getElementById('visible-modal-2'),
        )
    }
}
