import { useHistory } from 'react-router-dom'
import badRequest from '../Assets/Img/ic-bad-request.png'
import { ERROR_EMPTY_SCREEN } from './Constants'
import GenericEmptyState from './EmptyState/GenericEmptyState'

const ErrorServiceTemporaryUnavailable = () => {
    const { push } = useHistory()
    // Change this to try again
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
            image={badRequest}
            title={ERROR_EMPTY_SCREEN.SERVICE_TEMPORARY_UNAVAILABLE}
            subTitle={ERROR_EMPTY_SCREEN.SERVICE_TEMPORARY_UNAVAILABLE_MESSAGE}
            isButtonAvailable
            renderButton={renderGenerateButton}
        />
    )
}

export default ErrorServiceTemporaryUnavailable
