import unauthorized from '../Assets/Img/ic-bad-request.png'
import { ERROR_EMPTY_SCREEN } from './Constants'
import GenericEmptyState from './EmptyState/GenericEmptyState'
import { ImageType } from './Types'

const ErrorBadGateway = () => {
    const reload = () => {
        window.location.reload()
    }
    const renderGenerateButton = () => (
        <button type="button" className="flex cta h-32" onClick={reload} data-testid="empty-screen-take-me-home">
            {ERROR_EMPTY_SCREEN.TRY_AGAIN}
        </button>
    )

    return (
        <GenericEmptyState
            image={unauthorized}
            title={ERROR_EMPTY_SCREEN.BAD_GATEWAY}
            subTitle={ERROR_EMPTY_SCREEN.BAD_GATEWAY_MESSAGE}
            isButtonAvailable
            renderButton={renderGenerateButton}
            imageType={ImageType.Large}
        />
    )
}

export default ErrorBadGateway
