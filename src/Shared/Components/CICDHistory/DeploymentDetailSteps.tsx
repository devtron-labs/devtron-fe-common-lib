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

import { useEffect, useRef, useState } from 'react'
import { useHistory, useParams, useRouteMatch } from 'react-router-dom'

import { IndexStore } from '@Shared/Store'
import { DeploymentStatusDetailsBreakdownDataType, DeploymentStatusDetailsType, TIMELINE_STATUS } from '@Shared/types'

import { ReactComponent as Arrow } from '../../../Assets/Icon/ic-arrow-forward.svg'
import mechanicalOperation from '../../../Assets/Icon/ic-mechanical-operation.svg'
import { DeploymentAppTypes, GenericEmptyState, Progressing, URLS } from '../../../Common'
import { DEPLOYMENT_STATUS, EMPTY_STATE_STATUS } from '../../constants'
import { getHandleOpenURL, getIsApprovalPolicyConfigured } from '../../Helpers'
import { processDeploymentStatusDetailsData } from '../DeploymentStatusBreakdown'
import CDEmptyState from './CDEmptyState'
import { DEPLOYMENT_STATUS_QUERY_PARAM } from './constants'
import DeploymentStatusDetailBreakdown from './DeploymentStatusBreakdown'
import { getDeploymentStatusDetail } from './service'
import { DeploymentDetailStepsType } from './types'

let deploymentStatusTimer = null
const DeploymentDetailSteps = ({
    deploymentStatus,
    deploymentAppType,
    isHelmApps = false,
    installedAppVersionHistoryId,
    isGitops,
    userApprovalMetadata,
    isVirtualEnvironment,
    processVirtualEnvironmentDeploymentData,
    renderDeploymentApprovalInfo,
    isDeploymentWithoutApproval,
}: DeploymentDetailStepsType) => {
    const history = useHistory()
    const { url } = useRouteMatch()
    const { appId, envId, triggerId } = useParams<{ appId: string; envId?: string; triggerId?: string }>()
    const [deploymentListLoader, setDeploymentListLoader] = useState<boolean>(
        deploymentStatus?.toUpperCase() !== TIMELINE_STATUS.ABORTED,
    )
    /**
     * Only present for helm apps history
     */
    const appDetails = IndexStore.getAppDetails()
    const isVirtualEnv = useRef(isVirtualEnvironment)
    const isDeploymentWithoutApprovalRef = useRef(isDeploymentWithoutApproval)

    const processedData =
        isVirtualEnv.current && processVirtualEnvironmentDeploymentData
            ? processVirtualEnvironmentDeploymentData()
            : processDeploymentStatusDetailsData(deploymentAppType ?? appDetails?.deploymentAppType)
    const [deploymentStatusDetailsBreakdownData, setDeploymentStatusDetailsBreakdownData] =
        useState<DeploymentStatusDetailsBreakdownDataType>(processedData)

    const clearDeploymentStatusTimer = (): void => {
        if (deploymentStatusTimer) {
            clearTimeout(deploymentStatusTimer)
        }
    }

    const getDeploymentDetailStepsData = (): void => {
        getDeploymentStatusDetail(appId, envId, true, triggerId, isHelmApps, installedAppVersionHistoryId)
            .then((deploymentStatusDetailRes) => {
                if (deploymentStatus !== 'Aborted') {
                    // eslint-disable-next-line no-use-before-define
                    processDeploymentStatusData({
                        ...deploymentStatusDetailRes.result,
                        isDeploymentWithoutApproval: isDeploymentWithoutApprovalRef.current,
                    })
                }
            })
            .catch(() => {
                setDeploymentListLoader(false)
            })
            .finally(() => {
                setDeploymentListLoader(false)
            })
    }

    useEffect(() => {
        if (deploymentAppType === DeploymentAppTypes.HELM) {
            history.replace(`${url.replace('deployment-steps', 'source-code')}`)
        }
        if (isGitops) {
            getDeploymentDetailStepsData()
        }

        return (): void => {
            clearDeploymentStatusTimer()
        }
    }, [installedAppVersionHistoryId])

    useEffect(() => {
        isVirtualEnv.current = isVirtualEnvironment
    }, [isVirtualEnvironment])

    useEffect(() => {
        isDeploymentWithoutApprovalRef.current = isDeploymentWithoutApproval
    }, [isDeploymentWithoutApproval])

    const processDeploymentStatusData = (deploymentStatusDetailRes: DeploymentStatusDetailsType): void => {
        const processedDeploymentStatusDetailsData =
            isVirtualEnv.current && processVirtualEnvironmentDeploymentData
                ? processVirtualEnvironmentDeploymentData(deploymentStatusDetailRes)
                : processDeploymentStatusDetailsData(
                      deploymentStatusDetailRes.deploymentAppType,
                      deploymentStatusDetailRes,
                  )
        clearDeploymentStatusTimer()
        // If deployment status is in progress then fetch data in every 10 seconds

        // eslint-disable-next-line dot-notation
        if (processedDeploymentStatusDetailsData['deploymentStatus'] === DEPLOYMENT_STATUS.INPROGRESS) {
            deploymentStatusTimer = setTimeout(() => {
                getDeploymentDetailStepsData()
            }, 10000)
        } else {
            deploymentStatusTimer = setTimeout(() => {
                getDeploymentDetailStepsData()
            }, 30000)
        }
        setDeploymentStatusDetailsBreakdownData(processedDeploymentStatusDetailsData)
    }

    const redirectToDeploymentStatus = () => {
        if (isHelmApps) {
            getHandleOpenURL(
                `${window.__BASE_URL__}${URLS.APP}/${URLS.DEVTRON_CHARTS}/${URLS.APP_DEPLOYMNENT_HISTORY}/${appId}/env/${envId}/${URLS.DETAILS}/${URLS.APP_DETAILS_K8}?${DEPLOYMENT_STATUS_QUERY_PARAM}`,
            )()
            return
        }

        getHandleOpenURL(
            `${window.__BASE_URL__}${URLS.APP}/${appId}/${URLS.APP_DETAILS}/${envId}/${URLS.APP_DETAILS_K8}?${DEPLOYMENT_STATUS_QUERY_PARAM}`,
        )()
    }

    const getDeploymentStatusDetails = () =>
        !isVirtualEnv.current &&
        !deploymentStatusDetailsBreakdownData?.deploymentStatusBreakdown?.APP_HEALTH?.isCollapsed ? (
            <div className="h-100 flex">
                <CDEmptyState
                    title={EMPTY_STATE_STATUS.DEPLOYMENT_DETAILS_SETPS_PROGRESSING.TITLE}
                    imgSource={mechanicalOperation}
                    actionButtonClass="bcb-5 cn-0"
                    ActionButtonIcon={Arrow}
                    actionHandler={redirectToDeploymentStatus}
                    subtitle={EMPTY_STATE_STATUS.DEPLOYMENT_DETAILS_SETPS_PROGRESSING.SUBTITLE}
                    actionButtonText="Check live status"
                    actionButtonIconRight
                    dataTestId="deployment-progress"
                />
            </div>
        ) : (
            <div className="dc__mxw-1000 min-w-800">
                {renderDeploymentApprovalInfo &&
                    getIsApprovalPolicyConfigured(userApprovalMetadata?.approvalConfigData) &&
                    renderDeploymentApprovalInfo(userApprovalMetadata)}
                <DeploymentStatusDetailBreakdown
                    deploymentStatusDetailsBreakdownData={deploymentStatusDetailsBreakdownData}
                    isVirtualEnvironment={isVirtualEnv.current}
                    appDetails={appDetails}
                    rootClassName="p-20"
                    deploymentAppType={deploymentStatusDetailsBreakdownData.deploymentAppType}
                />
            </div>
        )

    if (
        deploymentStatus?.toUpperCase() === TIMELINE_STATUS.ABORTED ||
        deploymentStatusDetailsBreakdownData.deploymentStatus === DEPLOYMENT_STATUS.SUPERSEDED
    ) {
        return (
            <div
                className="flexbox flex-grow-1 dc__content-center"
                data-testid="deployment-history-steps-failed-message"
            >
                <GenericEmptyState
                    title={EMPTY_STATE_STATUS.DEPLOYMENT_DETAILS_SETPS_FAILED.TITLE}
                    subTitle={EMPTY_STATE_STATUS.DEPLOYMENT_DETAILS_SETPS_FAILED.SUBTITLE}
                />
            </div>
        )
    }

    return deploymentListLoader ? <Progressing pageLoader /> : getDeploymentStatusDetails()
}

export default DeploymentDetailSteps
