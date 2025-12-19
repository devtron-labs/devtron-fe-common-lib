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

import { memo } from 'react'
import { NavLink } from 'react-router-dom'
import moment from 'moment'

import { ReactComponent as ICLines } from '@Icons/ic-lines.svg'
import { DeploymentStageType } from '@Shared/constants'
import { isTimeStringAvailable } from '@Shared/Helpers'

import { Icon } from '../Icon'
import { ShowMoreText } from '../ShowMoreText'
import { FAILED_WORKFLOW_STAGE_STATUS_MAP, TIMEOUT_VALUE, WORKFLOW_STAGE_STATUS_TO_TEXT_MAP } from './constants'
import { WorkerStatusType } from './types'
import { getWorkerPodBaseUrl } from './utils'

const WorkerStatus = memo(
    ({
        message,
        podStatus,
        stage,
        workerPodName,
        finishedOn,
        clusterId,
        namespace,
        workerMessageContainerClassName,
        titleClassName = 'cn-9 fs-13 fw-4 lh-20',
        viewWorkerPodClassName = 'fs-13',
        hideShowMoreMessageButton = false,
        children,
    }: WorkerStatusType): JSX.Element | null => {
        if (!message && !podStatus) {
            return null
        }

        // Logic is workerPodName should be available and, if finishedOn is available, it should be less than timeout value
        const showLink =
            workerPodName &&
            (!isTimeStringAvailable(finishedOn) ||
                !moment(finishedOn).isBefore(moment().subtract(TIMEOUT_VALUE, 'hours')))

        const getViewWorker = () =>
            showLink ? (
                <NavLink
                    to={`${getWorkerPodBaseUrl(clusterId, namespace)}/${workerPodName}/logs`}
                    target="_blank"
                    className="anchor"
                >
                    <span className={`mr-10 ${viewWorkerPodClassName}`}>View worker pod</span>
                </NavLink>
            ) : null

        return (
            <>
                <div className="flexbox dc__content-center">
                    {FAILED_WORKFLOW_STAGE_STATUS_MAP[podStatus] ? (
                        <Icon size={20} name="ic-warning" color={null} />
                    ) : (
                        <ICLines className="icon-dim-20 dc__no-shrink scn-7" />
                    )}
                </div>

                <div className="flexbox-col">
                    <div className="flexbox dc__gap-8">
                        <div className={`flexbox cn-9 ${titleClassName}`}>
                            <span>{stage === DeploymentStageType.DEPLOY && !podStatus ? 'Message' : 'Worker'}</span>
                            {podStatus && (
                                <span>
                                    :&nbsp;{WORKFLOW_STAGE_STATUS_TO_TEXT_MAP[podStatus] || podStatus.toLowerCase()}
                                    &nbsp;
                                </span>
                            )}
                        </div>

                        {stage !== DeploymentStageType.DEPLOY && getViewWorker()}
                    </div>

                    {/* Need key since using ref inside of this component as useEffect dependency, so there were issues while switching builds */}
                    {message && (
                        <ShowMoreText
                            text={message}
                            key={message}
                            textClass="cn-7"
                            containerClass={workerMessageContainerClassName}
                            hideShowMore={hideShowMoreMessageButton}
                        />
                    )}

                    {children}
                </div>
            </>
        )
    },
)

export default WorkerStatus
