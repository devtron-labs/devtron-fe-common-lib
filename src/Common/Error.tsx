import { Component } from 'react'
import * as React from 'react'
import EmptyState from './EmptyState/EmptyState'
import notAuthorized from '../Assets/Img/ic-not-authorized.svg'
import ErrorScreenNotFound from './ErrorScreenNotFound'
import { ERROR_EMPTY_SCREEN } from './Constants'
import GenericEmptyState from './EmptyState/GenericEmptyState'
import Reload from './Reload'

export class ErrorScreenManager extends Component<{
    code?: number
    reload?: (...args) => any
    subtitle?: React.ReactChild
    subtitleClass?: string
    reloadClass?: string
}> {
    getMessage() {
        switch (this.props.code) {
            case 400:
                return 'Bad Request'
            case 401:
                return 'Unauthorized'
            case 403:
                return <ErrorScreenNotAuthorized subtitle={this.props.subtitle} />
            case 404:
                return <ErrorScreenNotFound />
            case 500:
                return 'Internal Server Error'
            case 502:
                return 'Bad Gateway'
            case 503:
                return 'Service Temporarily Unavailable'
            default:
                return <Reload className={this.props.reloadClass} />
        }
    }

    render() {
        const msg = this.getMessage()
        return (
            <div>
                <h1>{msg}</h1>
            </div>
        )
    }
}

export class ErrorScreenNotAuthorized extends Component<{
    subtitle?: React.ReactChild
    title?: string
}> {
    render() {
        return (
            <GenericEmptyState
                image={notAuthorized}
                title={this.props.title ?? ERROR_EMPTY_SCREEN.NOT_AUTHORIZED}
                subTitle={this.props.subtitle ?? ERROR_EMPTY_SCREEN.ONLY_FOR_SUPERADMIN}
            />
        )
    }
}
