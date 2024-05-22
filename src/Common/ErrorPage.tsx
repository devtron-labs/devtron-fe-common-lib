import { useHistory } from 'react-router'
import { ERROR_STATUS_CODE, ERROR_EMPTY_SCREEN, ROUTES } from './Constants'
import GenericEmptyState from './EmptyState/GenericEmptyState'
import { ErrorPageType } from './Types'
import { noop, refresh, reportIssue } from './Helper'

const ErrorPage = ({ code, image, title, subTitle, imageType, heightToDeduct, redirectURL, reload }: ErrorPageType) => {
    const { push } = useHistory()
    const redirectToHome = () => {
        push(redirectURL || `/${ROUTES.APP_LIST}`)
    }

    const getErrorPageProps = (
        statusCode: ERROR_STATUS_CODE,
    ): { onClick: () => void; renderButtonText: string; isButtonAvailable: boolean } => {
        switch (statusCode) {
            case ERROR_STATUS_CODE.NOT_FOUND:
                return {
                    onClick: redirectToHome,
                    renderButtonText: ERROR_EMPTY_SCREEN.TAKE_BACK_HOME,
                    isButtonAvailable: true,
                }
            case ERROR_STATUS_CODE.INTERNAL_SERVER_ERROR:
                return {
                    onClick: reportIssue,
                    renderButtonText: ERROR_EMPTY_SCREEN.REPORT_ISSUE,
                    isButtonAvailable: true,
                }
            case ERROR_STATUS_CODE.BAD_REQUEST:
            case ERROR_STATUS_CODE.BAD_GATEWAY:
            case ERROR_STATUS_CODE.SERVICE_TEMPORARY_UNAVAILABLE:
                return {
                    onClick: reload ?? refresh,
                    renderButtonText: ERROR_EMPTY_SCREEN.TRY_AGAIN,
                    isButtonAvailable: true,
                }
            default:
                return { onClick: noop, renderButtonText: '', isButtonAvailable: false }
        }
    }

    const {
        onClick,
        renderButtonText,
        isButtonAvailable,
    }: { onClick: () => void; renderButtonText: string; isButtonAvailable: boolean } = getErrorPageProps(code)

    const renderGenerateButton = () => (
        <button type="button" className="flex cta h-36" onClick={onClick} data-testid="empty-screen-take-me-home">
            {renderButtonText}
        </button>
    )

    return (
        <GenericEmptyState
            image={image}
            title={title}
            subTitle={subTitle}
            isButtonAvailable={isButtonAvailable}
            renderButton={renderGenerateButton}
            imageType={imageType}
            heightToDeduct={heightToDeduct}
        />
    )
}

export default ErrorPage
