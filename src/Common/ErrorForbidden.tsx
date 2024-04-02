import unauthorized from '../Assets/Img/ic-unauthorized.png'
import { ERROR_EMPTY_SCREEN } from './Constants'
import GenericEmptyState from './EmptyState/GenericEmptyState'

const ErrorForbidden = () => (
    <GenericEmptyState
        image={unauthorized}
        title={ERROR_EMPTY_SCREEN.FORBIDDEN}
        subTitle={ERROR_EMPTY_SCREEN.FORBIDDEN_MESSAGE}
    />
)

export default ErrorForbidden
