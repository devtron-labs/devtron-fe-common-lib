import { useHistory } from 'react-router'
import { API_STATUS_CODES, DISCORD_LINK, ERROR_EMPTY_SCREEN, ROUTES } from './Constants'
import GenericEmptyState from './EmptyState/GenericEmptyState'
import { ErrorPageType } from './Types'
import { noop } from './Helper'

const ErrorPage = ({ code, image, title, subTitle, imageType }: ErrorPageType) => {
    const { push } = useHistory()
    const redirectToHome = () => {
        push(`/${ROUTES.APP_LIST}`)
    }
    const refresh = () => {
        window.location.reload()
    }
    const reportIssue = () => {
        window.open(DISCORD_LINK)
    }
    const getErrorPageProps = (
        statusCode: API_STATUS_CODES,
    ): { onClick: () => void; renderButtonText: string; isButtonAvailable: boolean } => {
        switch (statusCode) {
            case API_STATUS_CODES.BAD_REQUEST:
                return { onClick: refresh, renderButtonText: ERROR_EMPTY_SCREEN.TRY_AGAIN, isButtonAvailable: true }
            case API_STATUS_CODES.UNAUTHORIZED:
                return { onClick: noop, renderButtonText: '', isButtonAvailable: false }
            case API_STATUS_CODES.PERMISSION_DENIED:
                return { onClick: noop, renderButtonText: '', isButtonAvailable: false }
            case API_STATUS_CODES.NOT_FOUND:
                return {
                    onClick: redirectToHome,
                    renderButtonText: ERROR_EMPTY_SCREEN.TAKE_BACK_HOME,
                    isButtonAvailable: true,
                }
            case API_STATUS_CODES.INTERNAL_SERVER_ERROR:
                return {
                    onClick: reportIssue,
                    renderButtonText: ERROR_EMPTY_SCREEN.REPORT_ISSUE,
                    isButtonAvailable: true,
                }
            case API_STATUS_CODES.BAD_GATEWAY:
                return { onClick: refresh, renderButtonText: ERROR_EMPTY_SCREEN.TRY_AGAIN, isButtonAvailable: true }
            case API_STATUS_CODES.SERVICE_TEMPORARY_UNAVAILABLE:
                return { onClick: refresh, renderButtonText: ERROR_EMPTY_SCREEN.TRY_AGAIN, isButtonAvailable: true }
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
            subtitleClassName="mb-0-imp"
        />
    )
}

export default ErrorPage
