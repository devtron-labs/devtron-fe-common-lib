import { get, getIsRequestAborted } from '@Common/API'
import { ROUTES } from '@Common/Constants'
import { showError } from '@Common/Helper'
import { APIOptions } from '@Common/Types'

export const getAppDetails = async (
    appId: number,
    envId: number,
    abortControllerRef: APIOptions['abortControllerRef'],
) => {
    try {
        const [appDetails, resourceTree] = await Promise.all([
            get(`${ROUTES.APP_DETAIL}/v2?app-id=${appId}&env-id=${envId}`, {
                abortControllerRef,
            }),
            get(`${ROUTES.APP_DETAIL}/resource-tree?app-id=${appId}&env-id=${envId}`, {
                abortControllerRef,
            }),
        ])

        return {
            ...(appDetails.result || {}),
            resourceTree: resourceTree.result,
        }
    } catch (error) {
        if (getIsRequestAborted(error)) {
            showError(error)
        }
        throw error
    }
}
