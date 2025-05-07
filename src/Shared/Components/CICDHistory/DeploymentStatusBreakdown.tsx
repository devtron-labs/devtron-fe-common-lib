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

import { Fragment } from 'react'
import { useRouteMatch } from 'react-router-dom'

import { URLS } from '../../../Common'
import { TIMELINE_STATUS } from '../../constants'
import ErrorBar from '../Error/ErrorBar'
import { DeploymentStatusDetailRow } from './DeploymentStatusDetailRow'
import { ErrorInfoStatusBar } from './ErrorInfoStatusBar'
import { DeploymentStatusDetailBreakdownType, DeploymentStatusDetailRowType, ErrorInfoStatusBarType } from './types'

import './DeploymentStatusBreakdown.scss'

const DeploymentStatusDetailBreakdown = ({
    deploymentStatusDetailsBreakdownData,
    isVirtualEnvironment,
    appDetails,
}: DeploymentStatusDetailBreakdownType) => {
    const { url } = useRouteMatch()
    const isHelmManifestPushed =
        deploymentStatusDetailsBreakdownData.deploymentStatusBreakdown[
            TIMELINE_STATUS.HELM_MANIFEST_PUSHED_TO_HELM_REPO
        ]?.showHelmManifest

    const deploymentStatusDetailRowProps: Pick<DeploymentStatusDetailRowType, 'appDetails' | 'deploymentDetailedData'> =
        {
            appDetails,
            deploymentDetailedData: deploymentStatusDetailsBreakdownData,
        }

    const errorInfoStatusBarProps: Pick<ErrorInfoStatusBarType, 'lastFailedStatusType' | 'errorMessage'> = {
        lastFailedStatusType: deploymentStatusDetailsBreakdownData.nonDeploymentError,
        errorMessage: deploymentStatusDetailsBreakdownData.deploymentError,
    }

    return (
        <>
            {!url.includes(`/${URLS.CD_DETAILS}`) && <ErrorBar appDetails={appDetails} />}
            <div className="deployment-status-breakdown-container" data-testid="deployment-history-steps-status">
                <DeploymentStatusDetailRow
                    type={TIMELINE_STATUS.DEPLOYMENT_INITIATED}
                    {...deploymentStatusDetailRowProps}
                />
                {!(
                    isVirtualEnvironment &&
                    deploymentStatusDetailsBreakdownData.deploymentStatusBreakdown[
                        TIMELINE_STATUS.HELM_PACKAGE_GENERATED
                    ]
                ) ? (
                    <>
                        {[TIMELINE_STATUS.GIT_COMMIT, TIMELINE_STATUS.ARGOCD_SYNC, TIMELINE_STATUS.KUBECTL_APPLY].map(
                            (timelineStatus) => (
                                <Fragment key={timelineStatus}>
                                    <ErrorInfoStatusBar type={timelineStatus} {...errorInfoStatusBarProps} />
                                    <DeploymentStatusDetailRow
                                        type={timelineStatus}
                                        {...deploymentStatusDetailRowProps}
                                    />
                                </Fragment>
                            ),
                        )}

                        <DeploymentStatusDetailRow
                            type={TIMELINE_STATUS.APP_HEALTH}
                            hideVerticalConnector
                            {...deploymentStatusDetailRowProps}
                        />
                    </>
                ) : (
                    <>
                        <DeploymentStatusDetailRow
                            type={TIMELINE_STATUS.HELM_PACKAGE_GENERATED}
                            hideVerticalConnector={!isHelmManifestPushed}
                            {...deploymentStatusDetailRowProps}
                        />
                        {isHelmManifestPushed && (
                            <DeploymentStatusDetailRow
                                type={TIMELINE_STATUS.HELM_MANIFEST_PUSHED_TO_HELM_REPO}
                                hideVerticalConnector
                                {...deploymentStatusDetailRowProps}
                            />
                        )}
                    </>
                )}
            </div>
        </>
    )
}

export default DeploymentStatusDetailBreakdown
