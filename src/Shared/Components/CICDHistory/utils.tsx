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
import { ReactElement } from 'react'
import moment from 'moment'
import { ALL_RESOURCE_KIND_FILTER } from '@Shared/constants'
import { ReactComponent as ICAborted } from '@Icons/ic-aborted.svg'
import { ReactComponent as Close } from '@Icons/ic-close.svg'
import { ReactComponent as Check } from '@Icons/ic-check-grey.svg'
import { ReactComponent as ICHelpOutline } from '@Icons/ic-help-outline.svg'
import { ReactComponent as Error } from '@Icons/ic-error-exclamation.svg'
import { ReactComponent as Timer } from '@Icons/ic-timer.svg'
import { ReactComponent as Disconnect } from '@Icons/ic-disconnected.svg'
import { ReactComponent as TimeOut } from '@Icons/ic-timeout-red.svg'
import { ReactComponent as ICCheck } from '@Icons/ic-check.svg'
import { ReactComponent as ICInProgress } from '@Icons/ic-in-progress.svg'
import { ReactComponent as ICHelpFilled } from '@Icons/ic-help-filled.svg'
import { ReactComponent as ICWarningY5 } from '@Icons/ic-warning-y5.svg'
import { ReactComponent as ICSuccess } from '@Icons/ic-success.svg'
import { isTimeStringAvailable } from '@Shared/Helpers'
import { DATE_TIME_FORMATS } from '@Common/Constants'
import {
    DEFAULT_CLUSTER_ID,
    DEFAULT_NAMESPACE,
    FAILED_WORKFLOW_STAGE_STATUS_MAP,
    TERMINAL_STATUS_MAP,
} from './constants'
import { Node, ResourceKindType, WorkflowStatusEnum } from '../../types'
import {
    TriggerHistoryFilterCriteriaProps,
    DeploymentHistoryResultObject,
    DeploymentHistory,
    TriggerHistoryFilterCriteriaType,
    StageStatusType,
    WorkflowExecutionStagesMapDTO,
    ExecutionInfoType,
    WorkflowExecutionStageType,
    PodExecutionStageDTO,
    WorkflowStageStatusType,
    WorkflowExecutionStageNameType,
    NodeStatus,
    NodeFilters,
} from './types'
import { Icon } from '../Icon'
import { AppStatus, StatusType } from '../StatusComponent'

export const getTriggerHistoryFilterCriteria = ({
    appId,
    envId,
    releaseId,
    showCurrentReleaseDeployments,
}: TriggerHistoryFilterCriteriaProps): TriggerHistoryFilterCriteriaType => {
    const filterCriteria: TriggerHistoryFilterCriteriaType = [
        `${ResourceKindType.devtronApplication}|id|${appId}`,
        `environment|id|${envId}`,
    ]
    if (showCurrentReleaseDeployments) {
        filterCriteria.push(`${ResourceKindType.release}|id|${releaseId}`)
    }

    return filterCriteria
}

export const getParsedTriggerHistory = (result): DeploymentHistoryResultObject => {
    const parsedResult = {
        cdWorkflows: (result.cdWorkflows || []).map((deploymentHistory: DeploymentHistory) => ({
            ...deploymentHistory,
            triggerId: deploymentHistory?.cd_workflow_id,
            podStatus: deploymentHistory?.pod_status,
            startedOn: deploymentHistory?.started_on,
            finishedOn: deploymentHistory?.finished_on,
            pipelineId: deploymentHistory?.pipeline_id,
            logLocation: deploymentHistory?.log_file_path,
            triggeredBy: deploymentHistory?.triggered_by,
            artifact: deploymentHistory?.image,
            triggeredByEmail: deploymentHistory?.email_id,
            stage: deploymentHistory?.workflow_type,
            image: deploymentHistory?.image,
            imageComment: deploymentHistory?.imageComment,
            imageReleaseTags: deploymentHistory?.imageReleaseTags,
            artifactId: deploymentHistory?.ci_artifact_id,
            runSource: deploymentHistory?.runSource,
        })),
        appReleaseTagNames: result.appReleaseTagNames,
        tagsEditable: result.tagsEditable,
        hideImageTaggingHardDelete: result.hideImageTaggingHardDelete,
    }
    return parsedResult
}

export const buildHoverHtmlForWebhook = (eventName, condition, selectors) => {
    const _conditions = []
    Object.keys(condition).forEach((_selectorId) => {
        // eslint-disable-next-line eqeqeq
        const _selector = selectors.find((i) => i.id == _selectorId)
        _conditions.push({ name: _selector ? _selector.name : '', value: condition[_selectorId] })
    })

    return (
        <>
            <span> {eventName} Filters </span>
            <br />
            <ul className="m-0">
                {_conditions.map((_condition, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <li key={index}>
                        {_condition.name} : {_condition.value}
                    </li>
                ))}
            </ul>
        </>
    )
}

export const renderIcon = (iconState: string): JSX.Element => {
    switch (iconState) {
        case 'success':
            return <Check className="icon-dim-20 green-tick" data-testid="success-green-tick" />
        case 'failed':
            return <Error className="icon-dim-20" />
        case 'unknown':
            return <ICHelpOutline className="icon-dim-20" />
        case 'inprogress':
            return (
                <div className="icon-dim-20">
                    <div className="pulse-highlight" />
                </div>
            )
        case 'unreachable':
            return <Close className="icon-dim-20" />
        case 'loading':
            return <Icon name="ic-circle-loader" color="O500" size={20} />
        case 'disconnect':
            return <Disconnect className="icon-dim-20" />
        case 'time_out':
            return <TimeOut className="icon-dim-20" />
        default:
            return <Timer className="icon-dim-20 timer-icon" />
    }
}

export const getStageStatusIcon = (status: StageStatusType): JSX.Element => {
    switch (status) {
        case StageStatusType.SUCCESS:
            return <ICCheck className="dc__no-shrink icon-dim-16 scg-5" />
        case StageStatusType.FAILURE:
            return <Close className="dc__no-shrink icon-dim-16 fcr-5" />
        default:
            return <ICInProgress className="dc__no-shrink icon-dim-16 ic-in-progress-orange" />
    }
}

export const getLogSearchIndex = ({
    stageIndex,
    lineNumberInsideStage,
}: Record<'stageIndex' | 'lineNumberInsideStage', number>) => `${stageIndex}-${lineNumberInsideStage}`

const getWorkerInfoFromExecutionStages = (
    workflowExecutionStages: WorkflowExecutionStagesMapDTO['workflowExecutionStages'],
): ExecutionInfoType['workerDetails'] => {
    const workerInfo: PodExecutionStageDTO = workflowExecutionStages?.[WorkflowExecutionStageType.POD]?.[0]
    const { status, message, endTime, metadata } = workerInfo || {}

    return {
        status: status || WorkflowStageStatusType.UNKNOWN,
        message: message || '',
        clusterId: metadata?.clusterId || DEFAULT_CLUSTER_ID,
        endTime: isTimeStringAvailable(endTime) ? endTime : '',
    }
}

export const sanitizeWorkflowExecutionStages = (
    workflowExecutionStages: WorkflowExecutionStagesMapDTO['workflowExecutionStages'],
): ExecutionInfoType | null => {
    if (!Object.keys(workflowExecutionStages || {}).length) {
        return null
    }

    const workflowExecutionSteps = workflowExecutionStages[WorkflowExecutionStageType.WORKFLOW] || []

    const preparationStage = workflowExecutionSteps.find(
        (stage) => stage?.stageName === WorkflowExecutionStageNameType.PREPARATION,
    )
    const executionStage = workflowExecutionSteps.find(
        (stage) => stage?.stageName === WorkflowExecutionStageNameType.EXECUTION,
    )

    const computedTriggeredOn = preparationStage?.startTime

    let lastStatus: WorkflowStageStatusType = WorkflowStageStatusType.UNKNOWN
    workflowExecutionSteps.forEach(({ status }) => {
        if (status !== WorkflowStageStatusType.NOT_STARTED) {
            lastStatus = status
        }
    })

    let finishedOn: string = ''
    workflowExecutionSteps.forEach(({ status, endTime }, index) => {
        if (FAILED_WORKFLOW_STAGE_STATUS_MAP[status]) {
            finishedOn = endTime
        } else if (index === workflowExecutionSteps.length - 1 && status === WorkflowStageStatusType.SUCCEEDED) {
            finishedOn = endTime
        }
    })

    return {
        triggeredOn: isTimeStringAvailable(computedTriggeredOn) ? computedTriggeredOn : '',
        executionStartedOn: isTimeStringAvailable(executionStage?.startTime) ? executionStage?.startTime : '',
        finishedOn: isTimeStringAvailable(finishedOn) ? finishedOn : '',
        currentStatus: lastStatus,
        workerDetails: getWorkerInfoFromExecutionStages(workflowExecutionStages),
    }
}

export const getIconFromWorkflowStageStatusType = (
    status: WorkflowStageStatusType,
    baseClass: string = 'icon-dim-20 dc__no-shrink',
): ReactElement => {
    switch (status) {
        case WorkflowStageStatusType.TIMEOUT:
            return <TimeOut className={baseClass} />

        case WorkflowStageStatusType.ABORTED:
            return <ICAborted className={baseClass} />

        case WorkflowStageStatusType.FAILED:
            return <Icon name="ic-failure" size={20} color={null} />

        case WorkflowStageStatusType.SUCCEEDED:
            return <ICSuccess className={baseClass} />

        case WorkflowStageStatusType.NOT_STARTED:
        case WorkflowStageStatusType.RUNNING:
            return <Icon name="ic-in-progress" size={20} color={null} />

        default:
            return <ICHelpFilled className={baseClass} />
    }
}

export const getHistoryItemStatusIconFromWorkflowStages = (
    workflowExecutionStages: WorkflowExecutionStagesMapDTO['workflowExecutionStages'],
): ReactElement => {
    const executionInfo = sanitizeWorkflowExecutionStages(workflowExecutionStages)
    const baseClass = 'icon-dim-20 dc__no-shrink'

    if (!executionInfo) {
        return <ICHelpFilled className={baseClass} />
    }

    if (!executionInfo.finishedOn) {
        return <Icon name="ic-in-progress" size={20} color={null} />
    }

    if (
        !FAILED_WORKFLOW_STAGE_STATUS_MAP[executionInfo.currentStatus] &&
        FAILED_WORKFLOW_STAGE_STATUS_MAP[executionInfo.workerDetails.status]
    ) {
        return <ICWarningY5 className={baseClass} />
    }

    return getIconFromWorkflowStageStatusType(executionInfo.workerDetails.status, baseClass)
}

export const getWorkerPodBaseUrl = (clusterId: number = DEFAULT_CLUSTER_ID, podNamespace: string = DEFAULT_NAMESPACE) =>
    `/resource-browser/${clusterId}/${podNamespace}/pod/k8sEmptyGroup`

export const getWorkflowNodeStatusTitle = (status: string) => {
    if (!status) {
        return null
    }

    if (status.toLowerCase() === 'cancelled') {
        return 'Aborted'
    }

    if (status === WorkflowStatusEnum.WAITING_TO_START) {
        return 'Waiting to start'
    }

    return status
}

export const getFormattedTriggerTime = (time: string): string =>
    isTimeStringAvailable(time)
        ? moment(time, 'YYYY-MM-DDTHH:mm:ssZ').format(DATE_TIME_FORMATS.TWELVE_HOURS_FORMAT)
        : ''

export const getNodesCount = (nodes: Node[]) =>
    (nodes || []).reduce(
        (acc, node) => {
            const nodeHealthStatus = node.health?.status?.toLowerCase() ?? ''

            if (node.hasDrift) {
                acc.driftedNodeCount += 1
            }

            switch (nodeHealthStatus) {
                case NodeStatus.Healthy:
                    acc.healthyNodeCount += 1
                    break
                case NodeStatus.Degraded:
                    acc.failedNodeCount += 1
                    break
                case NodeStatus.Progressing:
                    acc.progressingNodeCount += 1
                    break
                case NodeStatus.Missing:
                    acc.missingNodeCount += 1
                    break
                default:
            }

            acc.allNodeCount += 1

            return acc
        },
        {
            allNodeCount: 0,
            healthyNodeCount: 0,
            progressingNodeCount: 0,
            failedNodeCount: 0,
            missingNodeCount: 0,
            driftedNodeCount: 0,
        },
    )

export const getStatusFilters = ({
    allNodeCount,
    missingNodeCount,
    failedNodeCount,
    progressingNodeCount,
    healthyNodeCount,
    driftedNodeCount,
}: ReturnType<typeof getNodesCount>) => {
    const allResourceKindFilter = { status: ALL_RESOURCE_KIND_FILTER, count: allNodeCount }
    const statusFilters = [
        { status: NodeStatus.Missing, count: missingNodeCount },
        { status: NodeStatus.Degraded, count: failedNodeCount },
        {
            status: NodeStatus.Progressing,
            count: progressingNodeCount,
        },
        { status: NodeStatus.Healthy, count: healthyNodeCount },
        ...(window._env_.FEATURE_CONFIG_DRIFT_ENABLE
            ? [
                  {
                      status: NodeFilters.drifted,
                      count: driftedNodeCount,
                  },
              ]
            : []),
    ]

    return { allResourceKindFilter, statusFilters: statusFilters.filter(({ count }) => count > 0) }
}

export const getAppStatusIcon = (status: NodeStatus | NodeFilters, hideMessage = false) => (
    <AppStatus status={status} hideMessage={hideMessage} hideIconTooltip />
)

export const getTriggerStatusIcon = (status: string) => {
    const triggerStatus = status?.toLowerCase()

    switch (triggerStatus) {
        case TERMINAL_STATUS_MAP.RUNNING:
        case TERMINAL_STATUS_MAP.PROGRESSING:
        case TERMINAL_STATUS_MAP.STARTING:
        case TERMINAL_STATUS_MAP.INITIATING:
        case TERMINAL_STATUS_MAP.WAITING_TO_START:
            return StatusType.INPROGRESS
        case TERMINAL_STATUS_MAP.TIMED_OUT:
            return StatusType.FAILED
        default:
            return status
    }
}
