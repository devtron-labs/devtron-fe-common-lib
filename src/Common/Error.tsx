import React, { Component } from 'react'
import notFound from '../Assets/Img/ic-not-found.png'
import badRequest from '../Assets/Img/ic-bad-request.png'
import unauthorized from '../Assets/Img/ic-unauthorized.png'
import { API_STATUS_CODES, ERROR_EMPTY_SCREEN } from './Constants'
import GenericEmptyState from './EmptyState/GenericEmptyState'
import Reload from './Reload'
import ErrorPage from './ErrorPage'
import { ImageType } from './Types'

export class ErrorScreenManager extends Component<{
    code?: number
    reload?: (...args) => any
    subtitle?: React.ReactChild
    subtitleClass?: string
    reloadClass?: string
}> {
    getMessage() {
        switch (this.props.code) {
            case API_STATUS_CODES.BAD_REQUEST:
                return (
                    <ErrorPage
                        code={API_STATUS_CODES.BAD_REQUEST}
                        title={ERROR_EMPTY_SCREEN.BAD_REQUEST}
                        subTitle={ERROR_EMPTY_SCREEN.BAD_REQUEST_MESSAGE}
                        image={badRequest}
                        imageType={ImageType.Large}
                    />
                )
            case API_STATUS_CODES.UNAUTHORIZED:
                return (
                    <ErrorPage
                        code={API_STATUS_CODES.UNAUTHORIZED}
                        title={ERROR_EMPTY_SCREEN.UNAUTHORIZED}
                        subTitle={ERROR_EMPTY_SCREEN.UNAUTHORIZED_MESSAGE}
                        image={unauthorized}
                        imageType={ImageType.Large}
                    />
                )
            case API_STATUS_CODES.PERMISSION_DENIED:
                return (
                    <ErrorPage
                        code={API_STATUS_CODES.PERMISSION_DENIED}
                        title={ERROR_EMPTY_SCREEN.FORBIDDEN}
                        subTitle={ERROR_EMPTY_SCREEN.FORBIDDEN_MESSAGE}
                        image={unauthorized}
                        imageType={ImageType.Large}
                    />
                )
            case API_STATUS_CODES.NOT_FOUND:
                return (
                    <ErrorPage
                        code={API_STATUS_CODES.NOT_FOUND}
                        title={ERROR_EMPTY_SCREEN.PAGE_NOT_FOUND}
                        subTitle={ERROR_EMPTY_SCREEN.PAGE_NOT_EXIST}
                        image={notFound}
                        imageType={ImageType.Large}
                    />
                )
            case API_STATUS_CODES.INTERNAL_SERVER_ERROR:
                return (
                    <ErrorPage
                        code={API_STATUS_CODES.INTERNAL_SERVER_ERROR}
                        title={ERROR_EMPTY_SCREEN.INTERNAL_SERVER_ERROR}
                        subTitle={ERROR_EMPTY_SCREEN.INTERNAL_SERVER_ERROR_MESSAGE}
                        image={badRequest}
                        imageType={ImageType.Large}
                    />
                )
            case API_STATUS_CODES.BAD_GATEWAY:
                return (
                    <ErrorPage
                        code={API_STATUS_CODES.BAD_GATEWAY}
                        title={ERROR_EMPTY_SCREEN.BAD_GATEWAY}
                        subTitle={ERROR_EMPTY_SCREEN.BAD_GATEWAY_MESSAGE}
                        image={badRequest}
                        imageType={ImageType.Large}
                    />
                )
            case API_STATUS_CODES.SERVICE_TEMPORARY_UNAVAILABLE:
                return (
                    <ErrorPage
                        code={API_STATUS_CODES.SERVICE_TEMPORARY_UNAVAILABLE}
                        title={ERROR_EMPTY_SCREEN.SERVICE_TEMPORARY_UNAVAILABLE}
                        subTitle={ERROR_EMPTY_SCREEN.SERVICE_TEMPORARY_UNAVAILABLE_MESSAGE}
                        image={badRequest}
                        imageType={ImageType.Large}
                    />
                )
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
                image={unauthorized}
                title={this.props.title ?? ERROR_EMPTY_SCREEN.NOT_AUTHORIZED}
                subTitle={this.props.subtitle ?? ERROR_EMPTY_SCREEN.ONLY_FOR_SUPERADMIN}
            />
        )
    }
}
