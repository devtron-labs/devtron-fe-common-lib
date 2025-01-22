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

import { multiSelectStyles } from '../../../Common/MultiSelectCustomization'
import { WorkflowStageStatusType } from './types'

export const HISTORY_LABEL = {
    APPLICATION: 'Application',
    ENVIRONMENT: 'Environment',
    PIPELINE: 'Pipeline',
}

export const FILTER_STYLE = {
    ...multiSelectStyles,
    control: (base) => ({
        ...base,
        minHeight: '36px',
        fontWeight: '400',
        backgroundColor: 'var(--bg-secondary)',
        cursor: 'pointer',
    }),
    dropdownIndicator: (base) => ({
        ...base,
        padding: '0 8px',
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
}

export const GIT_BRANCH_NOT_CONFIGURED = 'Not Configured'
export const DEFAULT_GIT_BRANCH_VALUE = '--'

export const TERMINAL_STATUS_MAP = {
    SUCCEEDED: 'succeeded',
    HEALTHY: 'healthy',
    RUNNING: 'running',
    PROGRESSING: 'progressing',
    STARTING: 'starting',
    INITIATING: 'initiating',
    QUEUED: 'queued',
    FAILED: 'failed',
    ERROR: 'error',
    CANCELLED: 'cancelled',
    UNABLE_TO_FETCH: 'unabletofetch',
    TIMED_OUT: 'timedout',
}

export const EVENT_STREAM_EVENTS_MAP = {
    MESSAGE: 'message',
    START_OF_STREAM: 'START_OF_STREAM',
    END_OF_STREAM: 'END_OF_STREAM',
    ERROR: 'error',
}

export const POD_STATUS = {
    PENDING: 'Pending',
}

export const TIMEOUT_VALUE = '1' // in hours

export const DEFAULT_CLUSTER_ID = 1

export const DEFAULT_ENV = 'devtron-ci'

export const LOGS_RETRY_COUNT = 3

export const DEPLOYMENT_STATUS_QUERY_PARAM = 'deployment-status'

export const MANIFEST_STATUS_HEADERS = ['KIND', 'NAME', 'SYNC STATUS', 'MESSAGE']

export const LOGS_STAGE_IDENTIFIER = 'STAGE_INFO'

export const LOGS_STAGE_STREAM_SEPARATOR = '|'

export const statusColor = {
    suspended: 'var(--Y500)',
    unknown: 'var(--N700)',
    queued: 'var(--N700)',
    degraded: 'var(--R500)',
    healthy: 'var(--G500)',
    notdeployed: 'var(--N500)',
    missing: 'var(--N700)',
    progressing: 'var(--O500)',
    initiating: 'var(--O500)',
    starting: 'var(--O500)',
    succeeded: 'var(--G500)',
    running: 'var(--O500)',
    failed: 'var(--R500)',
    error: 'var(--R500)',
    cancelled: 'var(--R500)',
    aborted: 'var(--R500)',
    timedout: 'var(--R500)',
    unabletofetch: 'var(--R500)',
    hibernating: 'var(--N700)',
    [WorkflowStageStatusType.NOT_STARTED.toLowerCase()]: 'var(--N500)',
    [WorkflowStageStatusType.TIMEOUT.toLowerCase()]: 'var(--R500)',
}

export const PULSATING_STATUS_MAP: { [key in keyof typeof statusColor | WorkflowStageStatusType.RUNNING]?: boolean } = {
    progressing: true,
    initiating: true,
    starting: true,
    running: true,
    [WorkflowStageStatusType.RUNNING.toLowerCase()]: true,
}

export const WORKFLOW_STAGE_STATUS_TO_TEXT_MAP: Record<WorkflowStageStatusType, string> = {
    [WorkflowStageStatusType.NOT_STARTED]: 'Waiting to start',
    [WorkflowStageStatusType.RUNNING]: 'Running',
    [WorkflowStageStatusType.SUCCEEDED]: 'Succeeded',
    [WorkflowStageStatusType.FAILED]: 'Failed',
    [WorkflowStageStatusType.ABORTED]: 'Aborted',
    [WorkflowStageStatusType.TIMEOUT]: 'Timed out',
    [WorkflowStageStatusType.UNKNOWN]: 'Unknown',
}

export const TERMINAL_STATUS_COLOR_CLASS_MAP = {
    [TERMINAL_STATUS_MAP.SUCCEEDED]: 'cg-5',
    [TERMINAL_STATUS_MAP.HEALTHY]: 'cg-5',
    [TERMINAL_STATUS_MAP.FAILED]: 'cr-5',
    [TERMINAL_STATUS_MAP.CANCELLED]: 'cr-5',
    [TERMINAL_STATUS_MAP.ERROR]: 'cr-5',
}

export const PROGRESSING_STATUS = {
    [TERMINAL_STATUS_MAP.RUNNING]: 'running',
    [TERMINAL_STATUS_MAP.PROGRESSING]: 'progressing',
    [TERMINAL_STATUS_MAP.STARTING]: 'starting',
    [TERMINAL_STATUS_MAP.INITIATING]: 'initiating',
    [TERMINAL_STATUS_MAP.QUEUED]: 'queued',
}
