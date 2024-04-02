import { useHistory } from 'react-router-dom'
import notFound from '../Assets/Img/ic-not-found.png'
import { ERROR_EMPTY_SCREEN } from './Constants'
import GenericEmptyState from './EmptyState/GenericEmptyState'
import { ImageType } from './Types'

const ErrorScreenNotFound = () => {
    const { push } = useHistory()
    const redirectToHome = () => {
        push('/app/list')
    }
    const renderGenerateButton = () => (
        <button className="flex cta h-32" onClick={redirectToHome} data-testid="empty-screen-take-me-home">
            {ERROR_EMPTY_SCREEN.TAKE_BACK_HOME}
        </button>
    )

    return (
        <GenericEmptyState
            image={notFound}
            title={ERROR_EMPTY_SCREEN.PAGE_NOT_FOUND}
            subTitle={ERROR_EMPTY_SCREEN.PAGE_NOT_EXIST}
            isButtonAvailable
            renderButton={renderGenerateButton}
            imageType={ImageType.Large}
        />
    )
}

export default ErrorScreenNotFound
