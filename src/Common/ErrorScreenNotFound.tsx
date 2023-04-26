import React from 'react'
import notFound from '../Assets/Img/ic-empty-error@2x.png'
import { useHistory } from 'react-router'
import { ERROR_EMPTY_SCREEN } from './Constants'
import GenericEmptyState from './EmptyState/GenericEmptyState'

function ErrorScreenNotFound() {
    const history = useHistory()
    const redirectToHome = () => {
        history.push('app/list')
    }
    const renderGenerateButton = () => {
        return (
            <button className="flex cta h-32" onClick={redirectToHome} data-testid="empty-screen-take-me-home">
                {ERROR_EMPTY_SCREEN.TAKE_BACK_HOME}
            </button>
        )
    }

    return (
        <GenericEmptyState
            image={notFound}
            title={ERROR_EMPTY_SCREEN.PAGE_NOT_FOUND}
            subTitle={ERROR_EMPTY_SCREEN.PAGE_NOT_EXIST}
            isButtonAvailable={true}
            renderButton={renderGenerateButton}
        />
    )
}

export default ErrorScreenNotFound
