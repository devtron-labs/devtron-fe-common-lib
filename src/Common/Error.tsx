import React, { Component } from 'react'
import notFound from '../Assets/Img/ic-not-found.svg'
import badRequest from '../Assets/Img/ic-page-not-found.svg'
import unauthorized from '../Assets/Img/ic-not-authorized.svg'
import { ERROR_STATUS_CODE, ERROR_EMPTY_SCREEN } from './Constants'
import GenericEmptyState from './EmptyState/GenericEmptyState'
import Reload from './Reload'
import ErrorPage from './ErrorPage'
import { ErrorScreenManagerType, ImageType } from './Types'

export const ErrorScreenManager = ({ code, reload, subtitle, reloadClass }: ErrorScreenManagerType) => {
    const getMessage = () => {
        switch (code) {
            case ERROR_STATUS_CODE.BAD_REQUEST:
                return (
                    <ErrorPage
                        code={ERROR_STATUS_CODE.BAD_REQUEST}
                        title={ERROR_EMPTY_SCREEN.BAD_REQUEST}
                        subTitle={subtitle ? subtitle : ERROR_EMPTY_SCREEN.BAD_REQUEST_MESSAGE}
                        image={badRequest}
                        imageType={ImageType.Large}
                    />
                )
            case ERROR_STATUS_CODE.UNAUTHORIZED:
                return (
                    <ErrorPage
                        code={ERROR_STATUS_CODE.UNAUTHORIZED}
                        title={ERROR_EMPTY_SCREEN.UNAUTHORIZED}
                        subTitle={subtitle ? subtitle : ERROR_EMPTY_SCREEN.UNAUTHORIZED_MESSAGE}
                        image={unauthorized}
                        imageType={ImageType.Large}
                    />
                )
            case ERROR_STATUS_CODE.PERMISSION_DENIED:
                return (
                    <ErrorPage
                        code={ERROR_STATUS_CODE.PERMISSION_DENIED}
                        title={ERROR_EMPTY_SCREEN.FORBIDDEN}
                        subTitle={subtitle ? subtitle : ERROR_EMPTY_SCREEN.FORBIDDEN_MESSAGE}
                        image={unauthorized}
                        imageType={ImageType.Large}
                    />
                )
            case ERROR_STATUS_CODE.NOT_FOUND:
                return (
                    <ErrorPage
                        code={ERROR_STATUS_CODE.NOT_FOUND}
                        title={ERROR_EMPTY_SCREEN.PAGE_NOT_FOUND}
                        subTitle={subtitle ? subtitle : ERROR_EMPTY_SCREEN.PAGE_NOT_EXIST}
                        image={notFound}
                        imageType={ImageType.Large}
                    />
                )
            case ERROR_STATUS_CODE.INTERNAL_SERVER_ERROR:
                return (
                    <ErrorPage
                        code={ERROR_STATUS_CODE.INTERNAL_SERVER_ERROR}
                        title={ERROR_EMPTY_SCREEN.INTERNAL_SERVER_ERROR}
                        subTitle={subtitle ? subtitle : ERROR_EMPTY_SCREEN.INTERNAL_SERVER_ERROR_MESSAGE}
                        image={badRequest}
                        imageType={ImageType.Large}
                    />
                )
            case ERROR_STATUS_CODE.BAD_GATEWAY:
                return (
                    <ErrorPage
                        code={ERROR_STATUS_CODE.BAD_GATEWAY}
                        title={ERROR_EMPTY_SCREEN.BAD_GATEWAY}
                        subTitle={subtitle ? subtitle : ERROR_EMPTY_SCREEN.BAD_GATEWAY_MESSAGE}
                        image={badRequest}
                        imageType={ImageType.Large}
                    />
                )
            case ERROR_STATUS_CODE.SERVICE_TEMPORARY_UNAVAILABLE:
                return (
                    <ErrorPage
                        code={ERROR_STATUS_CODE.SERVICE_TEMPORARY_UNAVAILABLE}
                        title={ERROR_EMPTY_SCREEN.SERVICE_TEMPORARY_UNAVAILABLE}
                        subTitle={subtitle ? subtitle : ERROR_EMPTY_SCREEN.SERVICE_TEMPORARY_UNAVAILABLE_MESSAGE}
                        image={badRequest}
                        imageType={ImageType.Large}
                    />
                )
            default:
                return <Reload className={reloadClass} />
        }
    }
    return getMessage()
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
