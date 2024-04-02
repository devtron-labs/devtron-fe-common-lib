import badRequest from '../Assets/Img/ic-bad-request.png'
import { ERROR_EMPTY_SCREEN } from './Constants'
import GenericEmptyState from './EmptyState/GenericEmptyState'
import { ImageType } from './Types'

const ErrorBadRequest = () => {
    const refresh = () => {
        window.location.reload()
    }
    const renderGenerateButton = () => (
        <button type="button" className="flex cta h-32" onClick={refresh} data-testid="empty-screen-take-me-home">
            {ERROR_EMPTY_SCREEN.TRY_AGAIN}
        </button>
    )

    return (
        <GenericEmptyState
            image={badRequest}
            title={ERROR_EMPTY_SCREEN.BAD_REQUEST}
            subTitle={ERROR_EMPTY_SCREEN.BAD_REQUEST_MESSAGE}
            isButtonAvailable
            renderButton={renderGenerateButton}
            imageType={ImageType.Large}
        />
    )
}

export default ErrorBadRequest
