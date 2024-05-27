import React, { SyntheticEvent } from 'react'
import ReactDOM from 'react-dom'
import { preventBodyScroll } from '../../Shared'
import { stopPropagation } from '../Helper'

export class VisibleModal extends React.Component<{
    className: string
    parentClassName?: string
    noBackground?: boolean
    close?: (e) => void
    onEscape?: (e) => void
}> {
    modalRef = document.getElementById('visible-modal')

    constructor(props) {
        super(props)
        this.escFunction = this.escFunction.bind(this)
    }

    escFunction(event) {
        stopPropagation(event)
        if (event.keyCode === 27 || event.key === 'Escape') {
            if (this.props.onEscape) {
                this.props.onEscape(event)
            } else if (this.props.close) {
                this.props.close(event)
            }
        }
    }

    componentDidMount() {
        document.addEventListener('keydown', this.escFunction)
        this.modalRef.classList.add(this.props.noBackground ? 'show' : 'show-with-bg')
        preventBodyScroll(true)

        if (this.props.parentClassName) {
            this.modalRef.classList.add(this.props.parentClassName)
        }
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.escFunction)
        this.modalRef.classList.remove('show')
        this.modalRef.classList.remove('show-with-bg')
        preventBodyScroll(false)

        if (this.props.parentClassName) {
            this.modalRef.classList.remove(this.props.parentClassName)
        }
    }

    render() {
        const handleBodyClick = (e: SyntheticEvent) => {
            // Adding both to ensure that nested click as well as href work as expected
            e.stopPropagation()
            e.preventDefault()

            this.props?.close?.(e)
        }

        return ReactDOM.createPortal(
            <div
                className={`visible-modal__body ${this.props.className}`}
                onClick={handleBodyClick}
                data-testid="visible-modal-close"
            >
                {this.props.children}
            </div>,
            document.getElementById('visible-modal'),
        )
    }
}
