import { ErrorScreenNotAuthorized, GenericEmptyState, Progressing, Reload } from '../../../Common'
import { APIResponseHandlerProps } from './types'

const APIResponseHandler = ({
    isLoading,
    progressingProps,
    error,
    notAuthorized,
    notFoundText,
    reloadProps,
    children,
}: APIResponseHandlerProps) => {
    // keeping it above loading since, not expected to send a call if not authorized
    if (notAuthorized) {
        return <ErrorScreenNotAuthorized />
    }

    if (isLoading) {
        return <Progressing {...progressingProps} />
    }

    if (error) {
        if (error?.code === 404) {
            return (
                <GenericEmptyState
                    title={notFoundText?.title ?? 'Data not found'}
                    subTitle={notFoundText?.subTitle ?? 'The data you are looking for does not exist'}
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
