import React, { Component } from 'react'
import notAuthorized from '../Assets/Img/ic-not-authorized.svg'
import ErrorScreenNotFound from './ErrorScreenNotFound'
import ErrorBadRequest from './ErrorBadRequest'
import { ERROR_EMPTY_SCREEN } from './Constants'
import GenericEmptyState from './EmptyState/GenericEmptyState'
import Reload from './Reload'
import ErrorUnauthorized from './ErrorUnauthorized'
import ErrorForbidden from './ErrorForbidden'
import ErrorInternalServer from './ErrorInternalServer'
import ErrorBadGateway from './ErrorBadGateway'
import ErrorServiceTemporaryUnavailable from './ErrorServiceTemporaryUnavailable'

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
                return <ErrorBadRequest />
            case 401:
                return <ErrorUnauthorized />
            case 403:
                return <ErrorForbidden />
            case 404:
                return <ErrorScreenNotFound />
            case 500:
                return <ErrorInternalServer />
            case 502:
                return <ErrorBadGateway />
            case 503:
                return <ErrorServiceTemporaryUnavailable />
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
