import unauthorized from '../Assets/Img/ic-bad-request.png'
import { ERROR_EMPTY_SCREEN } from './Constants'
import GenericEmptyState from './EmptyState/GenericEmptyState'
import { ImageType } from './Types'

const ErrorInternalServer = () => {
    const ReportIssue = () => {
        window.open('https://discord.devtron.ai/')
    }
    const renderGenerateButton = () => (
        <button
            type="button"
            className="flex cta h-32"
            onClick={ReportIssue}
            formTarget="_blank"
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
            imageType={ImageType.Large}
        />
    )
}

export default ErrorInternalServer
