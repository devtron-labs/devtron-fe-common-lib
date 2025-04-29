import { get, getIsRequestAborted } from '@Common/API'
import { ROUTES } from '@Common/Constants'
import { getUrlWithSearchParams, showError } from '@Common/Helper'
import { APIOptions } from '@Common/Types'
import { AppDetails, AppType } from '@Shared/types'

export const getAppDetails = async (
    appId: number,
    envId: number,
    abortControllerRef: APIOptions['abortControllerRef'],
): Promise<AppDetails> => {
    try {
        const queryParams = getUrlWithSearchParams('', {
            'app-id': appId,
            'env-id': envId,
        })

        const [appDetails, resourceTree] = await Promise.all([
            get(`${ROUTES.APP_DETAIL}/v2${queryParams}`, {
                abortControllerRef,
            }),
            get(`${ROUTES.APP_DETAIL}/resource-tree${queryParams}`, {
                abortControllerRef,
            }),
        ])

        return {
            ...(appDetails.result || {}),
            resourceTree: resourceTree.result,
            appType: AppType.DEVTRON_APP,
        }
    } catch (error) {
        if (getIsRequestAborted(error)) {
            showError(error)
        }
        throw error
    }
}
