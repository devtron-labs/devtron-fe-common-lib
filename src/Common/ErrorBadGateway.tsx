import { useHistory } from 'react-router-dom'
import notFound from '../Assets/Img/ic-not-found.png'
import { ERROR_EMPTY_SCREEN } from './Constants'
import GenericEmptyState from './EmptyState/GenericEmptyState'

const ErrorBadGateway = () => {
    const { push } = useHistory()
    // Change this to Try again
    const redirectToHome = () => {
        push('/app/list')
    }
    const renderGenerateButton = () => (
        <button
            type="button"
            className="flex cta h-32"
            onClick={redirectToHome}
            data-testid="empty-screen-take-me-home"
        >
            {ERROR_EMPTY_SCREEN.TRY_AGAIN}
        </button>
    )

    return (
        <GenericEmptyState
            image={notFound}
            title={ERROR_EMPTY_SCREEN.BAD_GATEWAY}
            subTitle={ERROR_EMPTY_SCREEN.BAD_GATEWAY_MESSAGE}
            isButtonAvailable
            renderButton={renderGenerateButton}
        />
    )
}

export default ErrorBadGateway
