import { memo } from 'react'
import { DeploymentStageType } from '@Shared/constants'
import { NavLink } from 'react-router-dom'
import moment from 'moment'
import { ReactComponent as ICLines } from '@Icons/ic-lines.svg'
import { ReactComponent as ICWarningY5 } from '@Icons/ic-warning-y5.svg'
import { isTimeStringAvailable } from '@Shared/Helpers'
import { ShowMoreText } from '../ShowMoreText'
import { FAILED_WORKFLOW_STAGE_STATUS_MAP, TIMEOUT_VALUE, WORKFLOW_STAGE_STATUS_TO_TEXT_MAP } from './constants'
import { getWorkerPodBaseUrl } from './utils'
import { WorkerStatusType } from './types'

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
                        <ICWarningY5 className="icon-dim-20 dc__no-shrink" />
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
                </div>
            </>
        )
    },
)

export default WorkerStatus
