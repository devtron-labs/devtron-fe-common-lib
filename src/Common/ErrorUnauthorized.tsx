import unauthorized from '../Assets/Img/ic-unauthorized.png'
import { ERROR_EMPTY_SCREEN } from './Constants'
import GenericEmptyState from './EmptyState/GenericEmptyState'
import { ImageType } from './Types'

const ErrorUnauthorized = () => (
    <GenericEmptyState
        image={unauthorized}
        title={ERROR_EMPTY_SCREEN.UNAUTHORIZED}
        subTitle={ERROR_EMPTY_SCREEN.UNAUTHORIZED_MESSAGE}
        imageType={ImageType.Large}
    />
)

export default ErrorUnauthorized
