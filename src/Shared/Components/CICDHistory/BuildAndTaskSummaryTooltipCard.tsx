import { memo } from 'react'
import { Tooltip } from '@Common/Tooltip'
import { ReactComponent as ICCalendar } from '@Icons/ic-calendar.svg'
import { ReactComponent as ICUserCircle } from '@Icons/ic-user-circle.svg'
import GitTriggerList from './GitTriggerList'
import { WorkerStatus } from './TriggerOutput'
import { DEFAULT_CLUSTER_ID } from './constants'
import { getFormattedTriggerTime, sanitizeWorkflowExecutionStages } from './utils'
import { BuildAndTaskSummaryTooltipCardProps } from './types'

const BuildAndTaskSummaryTooltipCard = memo(
    ({
        workflowExecutionStages,
        triggeredByEmail,
        namespace,
        podName,
        stage,
        gitTriggers,
        ciMaterials,
    }: BuildAndTaskSummaryTooltipCardProps): JSX.Element => {
        const executionInfo = sanitizeWorkflowExecutionStages(workflowExecutionStages)

        return (
            <div className="shadow__overlay p-16 br-4 w-350 bg__primary mxh-300 dc__overflow-auto flexbox-col dc__gap-16">
                {/* Info section */}
                <div className="dc__icon-text-layout">
                    <ICCalendar className="fcn-7 icon-dim-20 dc__no-shrink" />
                    <time className="cn-9 fs-12 cn-9 fw-4 lh-20">
                        {executionInfo?.triggeredOn ? getFormattedTriggerTime(executionInfo.triggeredOn) : '--'}
                    </time>

                    <ICUserCircle className="fcn-7 icon-dim-20 dc__no-shrink" />
                    <Tooltip content={triggeredByEmail}>
                        <span className="cn-9 fs-12 fw-4 lh-20 dc__truncate">{triggeredByEmail}</span>
                    </Tooltip>

                    <WorkerStatus
                        message={executionInfo?.workerDetails?.message}
                        podStatus={executionInfo?.workerDetails?.status}
                        stage={stage}
                        finishedOn={executionInfo?.workerDetails?.endTime}
                        clusterId={executionInfo?.workerDetails?.clusterId || DEFAULT_CLUSTER_ID}
                        workerPodName={podName}
                        namespace={namespace}
                        workerMessageContainerClassName="cn-7 fs-12 fw-4 lh-18"
                        titleClassName="cn-9 fs-12 fw-4 lh-20"
                        viewWorkerPodClassName="fs-12"
                        hideShowMoreMessageButton
                    />
                </div>

                {Object.keys(gitTriggers ?? {}).length > 0 && ciMaterials?.length > 0 && (
                    <div className="dc__border-bottom-n1" />
                )}

                <GitTriggerList gitTriggers={gitTriggers} ciMaterials={ciMaterials} />
            </div>
        )
    },
)

export default BuildAndTaskSummaryTooltipCard
