import React, { Component } from 'react'
import notAuthorized from '../Assets/Img/ic-not-authorized.svg'
import notFound from '../Assets/Img/ic-not-found.png'
import badRequest from '../Assets/Img/ic-bad-request.png'
import unauthorized from '../Assets/Img/ic-unauthorized.png'
import { ERROR_EMPTY_SCREEN } from './Constants'
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
            case 400:
                return (
                    <ErrorPage
                        code={400}
                        title={ERROR_EMPTY_SCREEN.BAD_REQUEST}
                        subTitle={ERROR_EMPTY_SCREEN.BAD_REQUEST_MESSAGE}
                        image={badRequest}
                        imageType={ImageType.Large}
                    />
                )
            case 401:
                return (
                    <ErrorPage
                        code={401}
                        title={ERROR_EMPTY_SCREEN.UNAUTHORIZED}
                        subTitle={ERROR_EMPTY_SCREEN.UNAUTHORIZED_MESSAGE}
                        image={unauthorized}
                        imageType={ImageType.Large}
                    />
                )
            case 403:
                return (
                    <ErrorPage
                        code={403}
                        title={ERROR_EMPTY_SCREEN.FORBIDDEN}
                        subTitle={ERROR_EMPTY_SCREEN.FORBIDDEN_MESSAGE}
                        image={unauthorized}
                        imageType={ImageType.Large}
                    />
                )
            case 404:
                return (
                    <ErrorPage
                        code={404}
                        title={ERROR_EMPTY_SCREEN.PAGE_NOT_FOUND}
                        subTitle={ERROR_EMPTY_SCREEN.PAGE_NOT_EXIST}
                        image={notFound}
                        imageType={ImageType.Large}
                    />
                )
            case 500:
                return (
                    <ErrorPage
                        code={500}
                        title={ERROR_EMPTY_SCREEN.INTERNAL_SERVER_ERROR}
                        subTitle={ERROR_EMPTY_SCREEN.INTERNAL_SERVER_ERROR_MESSAGE}
                        image={badRequest}
                        imageType={ImageType.Large}
                    />
                )
            case 502:
                return (
                    <ErrorPage
                        code={502}
                        title={ERROR_EMPTY_SCREEN.BAD_GATEWAY}
                        subTitle={ERROR_EMPTY_SCREEN.BAD_GATEWAY_MESSAGE}
                        image={badRequest}
                        imageType={ImageType.Large}
                    />
                )
            case 503:
                return (
                    <ErrorPage
                        code={503}
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
                image={notAuthorized}
                title={this.props.title ?? ERROR_EMPTY_SCREEN.NOT_AUTHORIZED}
                subTitle={this.props.subtitle ?? ERROR_EMPTY_SCREEN.ONLY_FOR_SUPERADMIN}
            />
        )
    }
}
