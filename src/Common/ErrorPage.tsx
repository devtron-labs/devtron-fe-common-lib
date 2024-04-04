import { useHistory } from 'react-router'
import { DISCORD_LINK, ERROR_EMPTY_SCREEN } from './Constants'
import GenericEmptyState from './EmptyState/GenericEmptyState'
import { ErrorPageType } from './Types'
import { noop } from './Helper'

const ErrorPage = ({ code, image, title, subTitle, imageType }: ErrorPageType) => {
    const { push } = useHistory()
    const redirectToHome = () => {
        push('/app/list')
    }
    const refresh = () => {
        window.location.reload()
    }
    const reportIssue = () => {
        window.open(DISCORD_LINK)
    }
    const getErrorPageProps = (statusCode: number): [() => void, string, boolean] => {
        switch (statusCode) {
            case 400:
                return [refresh, ERROR_EMPTY_SCREEN.TRY_AGAIN, true]
            case 401:
                return [noop, '', false]
            case 403:
                return [noop, '', false]
            case 404:
                return [redirectToHome, ERROR_EMPTY_SCREEN.TAKE_BACK_HOME, true]
            case 500:
                return [reportIssue, ERROR_EMPTY_SCREEN.REPORT_ISSUE, true]
            case 502:
                return [refresh, ERROR_EMPTY_SCREEN.TRY_AGAIN, true]
            case 503:
                return [refresh, ERROR_EMPTY_SCREEN.TRY_AGAIN, true]
            default:
                return [noop, '', false]
        }
    }
    const [onClick, renderButtonText, isButtonAvailable]: [() => void, string, boolean] = getErrorPageProps(code)

    const renderGenerateButton = () => (
        <button type="button" className="flex cta h-32" onClick={onClick} data-testid="empty-screen-take-me-home">
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
        />
    )
}

export default ErrorPage
