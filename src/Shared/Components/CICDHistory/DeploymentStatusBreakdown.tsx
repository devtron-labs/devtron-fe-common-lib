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

import { DeploymentAppTypes } from '@Common/Types'
import { TIMELINE_STATUS } from '@Shared/types'

import { InfoBlock } from '../InfoBlock'
import { DeploymentStatusDetailRow } from './DeploymentStatusDetailRow'
import { DeploymentStatusDetailBreakdownType, DeploymentStatusDetailRowType } from './types'

import './DeploymentStatusBreakdown.scss'

const DeploymentStatusDetailBreakdown = ({
    deploymentStatusDetailsBreakdownData,
    isVirtualEnvironment,
    appDetails,
    rootClassName = '',
}: DeploymentStatusDetailBreakdownType) => {
    const isHelmManifestPushed =
        deploymentStatusDetailsBreakdownData.deploymentStatusBreakdown[
            TIMELINE_STATUS.HELM_MANIFEST_PUSHED_TO_HELM_REPO
        ]?.showHelmManifest

    const deploymentStatusDetailRowProps: Pick<DeploymentStatusDetailRowType, 'appDetails' | 'deploymentDetailedData'> =
        {
            appDetails,
            deploymentDetailedData: deploymentStatusDetailsBreakdownData,
        }

    return (
        <div
            className={`deployment-status-breakdown-container ${rootClassName}`}
            data-testid="deployment-history-steps-status"
        >
            <DeploymentStatusDetailRow
                type={TIMELINE_STATUS.DEPLOYMENT_INITIATED}
                {...deploymentStatusDetailRowProps}
            />
            {!(
                isVirtualEnvironment &&
                deploymentStatusDetailsBreakdownData.deploymentStatusBreakdown[TIMELINE_STATUS.HELM_PACKAGE_GENERATED]
            ) ? (
                <>
                    {(
                        [
                            TIMELINE_STATUS.GIT_COMMIT,
                            ...(deploymentStatusDetailRowProps.appDetails.deploymentAppType === DeploymentAppTypes.FLUX
                                ? []
                                : [TIMELINE_STATUS.ARGOCD_SYNC, TIMELINE_STATUS.KUBECTL_APPLY]),
                        ] as DeploymentStatusDetailRowType['type'][]
                    ).map((timelineStatus) => (
                        <Fragment key={timelineStatus}>
                            {deploymentStatusDetailsBreakdownData.errorBarConfig?.nextTimelineToProcess ===
                                timelineStatus && (
                                <>
                                    <InfoBlock
                                        variant="error"
                                        description={
                                            deploymentStatusDetailsBreakdownData.errorBarConfig.deploymentErrorMessage
                                        }
                                    />
                                    <div className="vertical-connector" />
                                </>
                            )}
                            <DeploymentStatusDetailRow type={timelineStatus} {...deploymentStatusDetailRowProps} />
                        </Fragment>
                    ))}

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
    )
}

export default DeploymentStatusDetailBreakdown
