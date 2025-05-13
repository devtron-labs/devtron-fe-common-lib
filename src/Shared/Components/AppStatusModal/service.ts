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
import { GetAppDetailsParamsType, GetDeploymentStatusWithTimelineParamsType } from './types'

export const getAppDetails = async ({
    appId,
    envId,
    abortControllerRef,
}: GetAppDetailsParamsType): Promise<AppDetails> => {
    try {
        const queryParams = getUrlWithSearchParams('', {
            'app-id': appId,
            'env-id': envId,
        })

        const [appDetails, resourceTree] = await Promise.all([
            get<Omit<AppDetails, 'resourceTree'>>(`${ROUTES.APP_DETAIL}/v2${queryParams}`, {
                abortControllerRef,
            }),
            get<AppDetails['resourceTree']>(`${ROUTES.APP_DETAIL}/resource-tree${queryParams}`, {
                abortControllerRef,
            }),
        ])

        return {
            ...(appDetails.result || ({} as AppDetails)),
            resourceTree: resourceTree.result,
            appType: AppType.DEVTRON_APP,
        }
    } catch (error) {
        if (!getIsRequestAborted(error)) {
            showError(error)
        }
        throw error
    }
}

export const getDeploymentStatusWithTimeline = async ({
    abortControllerRef,
    appId,
    envId,
    showTimeline,
    virtualEnvironmentConfig,
    isHelmApp,
}: GetDeploymentStatusWithTimelineParamsType): Promise<DeploymentStatusDetailsBreakdownDataType> => {
    try {
        const baseURL = isHelmApp ? ROUTES.HELM_DEPLOYMENT_STATUS_TIMELINE_INSTALLED_APP : ROUTES.DEPLOYMENT_STATUS

        const deploymentStatusDetailsResponse = await get<DeploymentStatusDetailsType>(
            getUrlWithSearchParams(`${baseURL}/${appId}/${envId}`, {
                showTimeline,
                ...(virtualEnvironmentConfig && {
                    wfrId: virtualEnvironmentConfig.wfrId,
                }),
            }),
            {
                abortControllerRef,
            },
        )

        return virtualEnvironmentConfig
            ? virtualEnvironmentConfig.processVirtualEnvironmentDeploymentData(deploymentStatusDetailsResponse.result)
            : processDeploymentStatusDetailsData(deploymentStatusDetailsResponse.result)
    } catch (error) {
        if (!getIsRequestAborted(error)) {
            showError(error)
        }
        throw error
    }
}
