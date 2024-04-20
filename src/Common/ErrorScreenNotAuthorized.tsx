import unauthorized from '../Assets/Img/ic-not-authorized.svg'
import { ERROR_EMPTY_SCREEN } from './Constants'
import GenericEmptyState from './EmptyState/GenericEmptyState'
import { ErrorScreenNotAuthorizedProps } from './Types'

const ErrorScreenNotAuthorized = ({ subtitle, title }: ErrorScreenNotAuthorizedProps) => (
    <GenericEmptyState
        image={unauthorized}
        title={title ?? ERROR_EMPTY_SCREEN.NOT_AUTHORIZED}
        subTitle={subtitle ?? ERROR_EMPTY_SCREEN.ONLY_FOR_SUPERADMIN}
    />
)

export default ErrorScreenNotAuthorized
