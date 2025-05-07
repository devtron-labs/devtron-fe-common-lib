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

/* eslint-disable no-nested-ternary */
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import moment from 'moment'

import { ShowMoreText } from '@Shared/Components/ShowMoreText'
import { AppType } from '@Shared/types'

import { ReactComponent as DropDownIcon } from '../../../Assets/Icon/ic-chevron-down.svg'
import { DATE_TIME_FORMATS, showError } from '../../../Common'
import { DEPLOYMENT_STATUS, statusIcon, TIMELINE_STATUS } from '../../constants'
import { AppStatusContent } from '../AppStatusModal'
import { APP_HEALTH_DROP_DOWN_LIST, MANIFEST_STATUS_HEADERS, TERMINAL_STATUS_MAP } from './constants'
import { ErrorInfoStatusBar } from './ErrorInfoStatusBar'
import { getManualSync } from './service'
import { DeploymentStatusDetailRowType } from './types'
import { renderIcon } from './utils'

export const DeploymentStatusDetailRow = ({
    type,
    hideVerticalConnector,
    deploymentDetailedData,
    appDetails,
}: DeploymentStatusDetailRowType) => {
    // Won't be available in release, but appDetails will be available in the component in that case
    // Can't use appDetails directly as in case of deployment history, appDetails will be null
    const { appId: paramAppId, envId: paramEnvId } = useParams<{ appId: string; envId: string }>()

    const statusBreakDownType = deploymentDetailedData.deploymentStatusBreakdown[type]
    const [collapsed, toggleCollapsed] = useState<boolean>(statusBreakDownType.isCollapsed)

    const isHelmManifestPushFailed =
        type === TIMELINE_STATUS.HELM_MANIFEST_PUSHED_TO_HELM_REPO &&
        deploymentDetailedData.deploymentStatus === statusIcon.failed

    useEffect(() => {
        toggleCollapsed(statusBreakDownType.isCollapsed)
    }, [statusBreakDownType.isCollapsed])

    const manualSyncData = async () => {
        try {
            const { appId: appDetailsAppId, appType, environmentId: appDetailsEnvId, installedAppId } = appDetails || {}
            const parsedAppIdFromAppDetails = appType === AppType.DEVTRON_HELM_CHART ? installedAppId : appDetailsAppId

            const appId = paramAppId || String(parsedAppIdFromAppDetails)
            const envId = paramEnvId || String(appDetailsEnvId)

            await getManualSync({ appId, envId })
        } catch (error) {
            showError(error)
        }
    }
    const toggleDropdown = () => {
        toggleCollapsed(!collapsed)
    }

    const renderDetailedData = () => {
        if (type !== TIMELINE_STATUS.KUBECTL_APPLY) {
            return null
        }

        return (
            <div className="px-8 py-12">
                <div className="">
                    {deploymentDetailedData.deploymentStatusBreakdown[TIMELINE_STATUS.KUBECTL_APPLY].kubeList?.map(
                        (items, index) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <div className="flex left lh-20 mb-8" key={`item-${index}`}>
                                {renderIcon(items.icon)}
                                <span className="ml-12">{items.message}</span>
                            </div>
                        ),
                    )}
                </div>
                {statusBreakDownType.resourceDetails?.length ? (
                    <div className="pl-32">
                        <div className="app-status-row dc__border-bottom pt-8 pb-8">
                            {MANIFEST_STATUS_HEADERS.map((headerKey, index) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <div className="fs-13 fw-6 cn-7" key={`header_${index}`}>
                                    {headerKey}
                                </div>
                            ))}
                        </div>
                        <div className="resource-list fs-13">
                            {statusBreakDownType.resourceDetails.map((nodeDetails) => (
                                <div
                                    className="app-status-row pt-8 pb-8"
                                    key={`${nodeDetails.resourceKind}/${nodeDetails.resourceName}`}
                                >
                                    <div className="dc__break-word">{nodeDetails.resourceKind}</div>
                                    <div className="dc__break-word">{nodeDetails.resourceName}</div>
                                    <div
                                        className={`app-summary__status-name f-${
                                            nodeDetails.resourceStatus
                                                ? nodeDetails.resourceStatus.toLowerCase() ===
                                                  TERMINAL_STATUS_MAP.RUNNING
                                                    ? TERMINAL_STATUS_MAP.PROGRESSING
                                                    : nodeDetails.resourceStatus.toLowerCase()
                                                : ''
                                        }`}
                                    >
                                        {nodeDetails.resourceStatus}
                                    </div>
                                    <ShowMoreText text={nodeDetails.statusMessage} />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>
        )
    }

    const renderErrorInfoBar = () => (
        <ErrorInfoStatusBar
            type={TIMELINE_STATUS.HELM_MANIFEST_PUSHED_TO_HELM_REPO}
            lastFailedStatusType={deploymentDetailedData.nonDeploymentError}
            errorMessage={deploymentDetailedData.deploymentError}
            hideVerticalConnector
            hideErrorIcon
        />
    )

    const isAccordion =
        (type === TIMELINE_STATUS.KUBECTL_APPLY && statusBreakDownType.kubeList?.length) ||
        (type === TIMELINE_STATUS.APP_HEALTH && APP_HEALTH_DROP_DOWN_LIST.includes(statusBreakDownType.icon)) ||
        ((type === TIMELINE_STATUS.GIT_COMMIT || type === TIMELINE_STATUS.ARGOCD_SYNC) &&
            statusBreakDownType.icon === 'failed')

    const renderAccordionDetails = () => {
        if (!isAccordion || !collapsed) {
            return null
        }

        return (
            <div className="bg__primary en-2 detail-tab_border bw-1">
                {statusBreakDownType.timelineStatus && (
                    <div
                        className={`flex left pt-8 pl-12 pb-8 lh-20 ${
                            statusBreakDownType.icon !== 'inprogress' ? 'bcr-1' : 'bcy-2'
                        }`}
                    >
                        {type === TIMELINE_STATUS.APP_HEALTH
                            ? statusBreakDownType.timelineStatus
                            : deploymentDetailedData.deploymentStatusBreakdown[type].timelineStatus}

                        {(deploymentDetailedData.deploymentStatus === DEPLOYMENT_STATUS.TIMED_OUT ||
                            deploymentDetailedData.deploymentStatus === DEPLOYMENT_STATUS.UNABLE_TO_FETCH) && (
                            // TODO: Try to make to Button
                            <span className="cb-5 fw-6 ml-8 cursor" onClick={manualSyncData}>
                                Try now
                            </span>
                        )}
                    </div>
                )}

                {type === TIMELINE_STATUS.APP_HEALTH ? (
                    <div>
                        <AppStatusContent appDetails={appDetails} filterHealthyNodes isCardLayout={false} />
                    </div>
                ) : (
                    renderDetailedData()
                )}
            </div>
        )
    }

    return (
        <>
            <div className="bw-1 en-2">
                <div
                    className={`deployment-status-breakdown-row py-8 px-8 bg__primary ${collapsed ? (!isHelmManifestPushFailed ? 'br-4' : '') : 'border-collapse'}`}
                >
                    {renderIcon(statusBreakDownType.icon)}
                    <span className="ml-12 mr-12 fs-13">
                        <span data-testid="deployment-status-step-name" className="dc__truncate">
                            {statusBreakDownType.displayText}
                        </span>
                        {statusBreakDownType.displaySubText && (
                            <span
                                className={`ml-12 app-summary__status-name f-${statusBreakDownType.icon || 'waiting'}`}
                            >
                                {statusBreakDownType.displaySubText}
                            </span>
                        )}
                    </span>

                    {statusBreakDownType.time !== '' && statusBreakDownType.icon !== 'inprogress' && (
                        <span
                            data-testid="deployment-status-kubernetes-dropdown dc__no-shrink"
                            className={`px-8 py-4 br-12 ${
                                statusBreakDownType.icon === 'failed' ? 'bcr-1 cr-5' : 'bcg-1 cg-7'
                            }`}
                        >
                            {moment(statusBreakDownType.time, 'YYYY-MM-DDTHH:mm:ssZ').format(
                                DATE_TIME_FORMATS.TWELVE_HOURS_FORMAT,
                            )}
                        </span>
                    )}
                    {isAccordion && (
                        <DropDownIcon
                            style={{ marginLeft: 'auto', ['--rotateBy' as any]: `${180 * Number(!collapsed)}deg` }}
                            className="icon-dim-24 rotate pointer"
                            onClick={toggleDropdown}
                            data-testid="steps-deployment-history-dropdown"
                        />
                    )}
                </div>
                {isHelmManifestPushFailed && renderErrorInfoBar()}
            </div>

            {renderAccordionDetails()}
            {!hideVerticalConnector && <div className="vertical-connector" />}
        </>
    )
}
