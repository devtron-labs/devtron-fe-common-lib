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

import { DEPLOYMENT_STATUS } from '@Shared/constants'
import { DeploymentPhaseType, DeploymentStatusTimelineType, TIMELINE_STATUS } from '@Shared/types'

import { WorkflowRunnerStatusDTO } from './types'

export const DEPLOYMENT_STATUS_TEXT_MAP: Readonly<
    Record<(typeof DEPLOYMENT_STATUS)[keyof typeof DEPLOYMENT_STATUS], string>
> = {
    [DEPLOYMENT_STATUS.SUCCEEDED]: 'Succeeded',
    [DEPLOYMENT_STATUS.HEALTHY]: 'Healthy',
    [DEPLOYMENT_STATUS.FAILED]: 'Failed',
    [DEPLOYMENT_STATUS.TIMED_OUT]: 'Timed out',
    [DEPLOYMENT_STATUS.UNABLE_TO_FETCH]: 'Unable to fetch status',
    [DEPLOYMENT_STATUS.INPROGRESS]: 'In progress',
    [DEPLOYMENT_STATUS.PROGRESSING]: 'Progressing',
    [DEPLOYMENT_STATUS.STARTING]: 'Progressing',
    [DEPLOYMENT_STATUS.INITIATING]: 'Progressing',
    [DEPLOYMENT_STATUS.SUPERSEDED]: 'Superseded',
    [DEPLOYMENT_STATUS.QUEUED]: 'Queued',
    [DEPLOYMENT_STATUS.UNKNOWN]: 'Unknown',
    [DEPLOYMENT_STATUS.CHECKING]: 'Checking Status',
}

// Might be more but as per BE its only these for now
export const WFR_STATUS_DTO_TO_DEPLOYMENT_STATUS_MAP: Readonly<
    Record<WorkflowRunnerStatusDTO, (typeof DEPLOYMENT_STATUS)[keyof typeof DEPLOYMENT_STATUS]>
> = {
    [WorkflowRunnerStatusDTO.ABORTED]: DEPLOYMENT_STATUS.FAILED,
    [WorkflowRunnerStatusDTO.FAILED]: DEPLOYMENT_STATUS.FAILED,

    [WorkflowRunnerStatusDTO.TIMED_OUT]: DEPLOYMENT_STATUS.TIMED_OUT,
    [WorkflowRunnerStatusDTO.UNABLE_TO_FETCH]: DEPLOYMENT_STATUS.UNABLE_TO_FETCH,

    // Degraded means successful deployment
    [WorkflowRunnerStatusDTO.DEGRADED]: DEPLOYMENT_STATUS.SUCCEEDED,
    [WorkflowRunnerStatusDTO.HEALTHY]: DEPLOYMENT_STATUS.SUCCEEDED,
    [WorkflowRunnerStatusDTO.SUCCEEDED]: DEPLOYMENT_STATUS.SUCCEEDED,

    [WorkflowRunnerStatusDTO.INITIATING]: DEPLOYMENT_STATUS.INITIATING,
    [WorkflowRunnerStatusDTO.STARTING]: DEPLOYMENT_STATUS.STARTING,
    [WorkflowRunnerStatusDTO.PROGRESSING]: DEPLOYMENT_STATUS.INPROGRESS,
    [WorkflowRunnerStatusDTO.SUSPENDED]: DEPLOYMENT_STATUS.INPROGRESS,

    [WorkflowRunnerStatusDTO.QUEUED]: DEPLOYMENT_STATUS.QUEUED,

    [WorkflowRunnerStatusDTO.UNKNOWN]: DEPLOYMENT_STATUS.UNABLE_TO_FETCH,
    [WorkflowRunnerStatusDTO.MISSING]: DEPLOYMENT_STATUS.UNABLE_TO_FETCH,
}

export const PROGRESSING_DEPLOYMENT_STATUS: Readonly<(typeof DEPLOYMENT_STATUS)[keyof typeof DEPLOYMENT_STATUS][]> = [
    DEPLOYMENT_STATUS.INPROGRESS,
    DEPLOYMENT_STATUS.PROGRESSING,
    DEPLOYMENT_STATUS.STARTING,
    DEPLOYMENT_STATUS.INITIATING,
    DEPLOYMENT_STATUS.CHECKING,
]

export const SUCCESSFUL_DEPLOYMENT_STATUS: typeof PROGRESSING_DEPLOYMENT_STATUS = [
    DEPLOYMENT_STATUS.SUCCEEDED,
    DEPLOYMENT_STATUS.HEALTHY,
]

export const FAILED_DEPLOYMENT_STATUS: typeof PROGRESSING_DEPLOYMENT_STATUS = [
    DEPLOYMENT_STATUS.FAILED,
    DEPLOYMENT_STATUS.TIMED_OUT,
    DEPLOYMENT_STATUS.UNABLE_TO_FETCH,
]

export const PHYSICAL_ENV_DEPLOYMENT_TIMELINE_ORDER_ARGO: Readonly<DeploymentStatusTimelineType[]> = [
    TIMELINE_STATUS.DEPLOYMENT_INITIATED,
    TIMELINE_STATUS.GIT_COMMIT,
    TIMELINE_STATUS.ARGOCD_SYNC,
    TIMELINE_STATUS.KUBECTL_APPLY,
    TIMELINE_STATUS.APP_HEALTH,
]

export const PHYSICAL_ENV_DEPLOYMENT_TIMELINE_ORDER_FLUX: Readonly<DeploymentStatusTimelineType[]> = [
    TIMELINE_STATUS.DEPLOYMENT_INITIATED,
    TIMELINE_STATUS.GIT_COMMIT,
    TIMELINE_STATUS.APP_HEALTH,
]

export const DEPLOYMENT_PHASES: Readonly<DeploymentPhaseType[]> = [
    DeploymentPhaseType.PRE_SYNC,
    DeploymentPhaseType.SYNC,
    DeploymentPhaseType.POST_SYNC,
    DeploymentPhaseType.SKIP,
    DeploymentPhaseType.SYNC_FAIL,
]
