import { get, getIsRequestAborted } from '@Common/API'
import { ROUTES } from '@Common/Constants'
import { getUrlWithSearchParams, showError } from '@Common/Helper'
import {
    AppDetails,
    AppType,
    DeploymentStatusDetailsBreakdownDataType,
    DeploymentStatusDetailsType,
} from '@Shared/types'

import { processDeploymentStatusDetailsData } from '../DeploymentStatusBreakdown'
import { GetAppDetailsParamsType } from './types'

export const getAppDetails = async ({
    appId,
    envId,
    abortControllerRef,
    deploymentStatusConfig,
}: GetAppDetailsParamsType): Promise<{
    appDetails: AppDetails
    deploymentStatusDetailsBreakdownData: DeploymentStatusDetailsBreakdownDataType
}> => {
    try {
        const queryParams = getUrlWithSearchParams('', {
            'app-id': appId,
            'env-id': envId,
        })

        const [appDetails, resourceTree, deploymentStatusDetails] = await Promise.all([
            get<Omit<AppDetails, 'resourceTree'>>(`${ROUTES.APP_DETAIL}/v2${queryParams}`, {
                abortControllerRef,
            }),
            get<AppDetails['resourceTree']>(`${ROUTES.APP_DETAIL}/resource-tree${queryParams}`, {
                abortControllerRef,
            }),
            deploymentStatusConfig
                ? get<DeploymentStatusDetailsType>(
                      getUrlWithSearchParams(`${ROUTES.DEPLOYMENT_STATUS}/${appId}/${envId}`, {
                          showTimeline: deploymentStatusConfig.showTimeline,
                      }),
                  )
                : null,
        ])

        return {
            appDetails: {
                ...(appDetails.result || ({} as AppDetails)),
                resourceTree: resourceTree.result,
                appType: AppType.DEVTRON_APP,
            },
            deploymentStatusDetailsBreakdownData: appDetails.result?.isVirtualEnvironment
                ? deploymentStatusConfig.processVirtualEnvironmentDeploymentData(deploymentStatusDetails.result)
                : processDeploymentStatusDetailsData(deploymentStatusDetails.result),
        }
    } catch (error) {
        if (!getIsRequestAborted(error)) {
            showError(error)
        }
        throw error
    }
}
