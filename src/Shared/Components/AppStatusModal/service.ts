/*
 * Copyright (c) 2024. Devtron Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { get } from '@Common/API'
import { ROUTES } from '@Common/Constants'
import { getUrlWithSearchParams } from '@Common/Helper'
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
    const queryParams = getUrlWithSearchParams('', {
        'app-id': appId,
        'env-id': envId,
    })

    const [appDetailsResponse, resourceTreeResponse] = await Promise.allSettled([
        get<Omit<AppDetails, 'resourceTree'>>(`${ROUTES.APP_DETAIL}/v2${queryParams}`, {
            abortControllerRef,
        }),
        get<AppDetails['resourceTree']>(`${ROUTES.APP_DETAIL}/resource-tree${queryParams}`, {
            abortControllerRef,
        }),
    ])

    if (appDetailsResponse.status === 'rejected') {
        throw appDetailsResponse.reason
    }

    const appDetails = appDetailsResponse.value
    const resourceTree = resourceTreeResponse.status === 'fulfilled' ? resourceTreeResponse.value : null

    return {
        ...(appDetails.result || ({} as AppDetails)),
        resourceTree: resourceTree?.result,
        appType: AppType.DEVTRON_APP,
    }
}

export const getDeploymentStatusWithTimeline = async ({
    abortControllerRef,
    appId,
    envId,
    showTimeline,
    virtualEnvironmentConfig,
    isHelmApp,
    deploymentAppType,
}: GetDeploymentStatusWithTimelineParamsType): Promise<DeploymentStatusDetailsBreakdownDataType> => {
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
        : processDeploymentStatusDetailsData(
              deploymentStatusDetailsResponse.result.deploymentAppType ?? deploymentAppType,
              deploymentStatusDetailsResponse.result,
          )
}
