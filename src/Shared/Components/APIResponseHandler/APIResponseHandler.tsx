import { ErrorScreenManager, ErrorScreenNotAuthorized, GenericEmptyState, Progressing, Reload } from '../../../Common'
import { GenericSectionErrorState } from '../GenericSectionErrorState'
import { NOT_FOUND_DEFAULT_TEXT } from './constants'
import { APIResponseHandlerProps } from './types'

const APIResponseHandler = ({
    isLoading,
    progressingProps,
    customLoader,
    error,
    notAuthorized,
    notFoundText,
    reloadProps,
    genericSectionErrorProps,
    errorScreenManagerProps,
    children,
}: APIResponseHandlerProps) => {
    // keeping it above loading since, not expected to send a call if not authorized
    if (notAuthorized) {
        return <ErrorScreenNotAuthorized />
    }

    if (isLoading) {
        // eslint-disable-next-line react/jsx-no-useless-fragment
        return customLoader ? <>{customLoader}</> : <Progressing {...progressingProps} />
    }

    if (error) {
        // This will be used for handling error screen for small screen size
        if (genericSectionErrorProps) {
            return <GenericSectionErrorState {...genericSectionErrorProps} />
        }

        if (errorScreenManagerProps) {
            return <ErrorScreenManager {...errorScreenManagerProps} />
        }

        if (error?.code === 404) {
            return (
                <GenericEmptyState
                    title={notFoundText?.title ?? NOT_FOUND_DEFAULT_TEXT.title}
                    subTitle={notFoundText?.subTitle ?? NOT_FOUND_DEFAULT_TEXT.subTitle}
                />
            )
        }

        return <Reload {...reloadProps} />
    }

    // Had to add this since while using it is throwing ts error
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>
}

export default APIResponseHandler
