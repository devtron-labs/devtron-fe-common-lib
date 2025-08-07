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
import {
    DeploymentStatusBreakdownItemType,
    DeploymentStatusDetailsType,
    DeploymentStatusTimelineType,
} from '@Shared/types'

export enum WorkflowRunnerStatusDTO {
    PROGRESSING = 'Progressing',
    ABORTED = 'Aborted',
    FAILED = 'Failed',
    SUCCEEDED = 'Succeeded',
    TIMED_OUT = 'TimedOut',
    UNABLE_TO_FETCH = 'UnableToFetch',
    STARTING = 'Starting',
    QUEUED = 'Queued',
    INITIATING = 'Initiating',
    // Coming in specific cases of helm apps
    HEALTHY = 'Healthy',
    DEGRADED = 'Degraded',
    MISSING = 'Missing',
    UNKNOWN = 'Unknown',
    SUSPENDED = 'Suspended',
}

export interface ProcessUnableToFetchOrTimedOutStatusType {
    timelineData: DeploymentStatusBreakdownItemType
    timelineStatusType: DeploymentStatusTimelineType
    deploymentStatus: typeof DEPLOYMENT_STATUS.UNABLE_TO_FETCH | typeof DEPLOYMENT_STATUS.TIMED_OUT
    statusLastFetchedAt: DeploymentStatusDetailsType['statusLastFetchedAt'] | null
    statusFetchCount: DeploymentStatusDetailsType['statusFetchCount'] | null
}
