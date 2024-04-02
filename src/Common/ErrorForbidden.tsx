import unauthorized from '../Assets/Img/ic-unauthorized.png'
import { ERROR_EMPTY_SCREEN } from './Constants'
import GenericEmptyState from './EmptyState/GenericEmptyState'
import { ImageType } from './Types'

const ErrorForbidden = () => (
    <GenericEmptyState
        image={unauthorized}
        title={ERROR_EMPTY_SCREEN.FORBIDDEN}
        subTitle={ERROR_EMPTY_SCREEN.FORBIDDEN_MESSAGE}
        imageType={ImageType.Large}
    />
)

export default ErrorForbidden
