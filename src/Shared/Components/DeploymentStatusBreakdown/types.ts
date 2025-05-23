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
