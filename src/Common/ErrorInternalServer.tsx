import { useHistory } from 'react-router-dom'
import unauthorized from '../Assets/Img/ic-unauthorized.png'
import { ERROR_EMPTY_SCREEN } from './Constants'
import GenericEmptyState from './EmptyState/GenericEmptyState'

const ErrorInternalServer = () => {
    const { push } = useHistory()
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
            {ERROR_EMPTY_SCREEN.REPORT_ISSUE}
        </button>
    )

    return (
        <GenericEmptyState
            image={unauthorized}
            title={ERROR_EMPTY_SCREEN.INTERNAL_SERVER_ERROR}
            subTitle={ERROR_EMPTY_SCREEN.INTERNAL_SERVER_ERROR_MESSAGE}
            isButtonAvailable
            renderButton={renderGenerateButton}
        />
    )
}

export default ErrorInternalServer
