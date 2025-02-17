import { TIMELINE_STATUS } from '@Shared/constants'
import { WorkflowStatusEnum } from '@Shared/types'

import { IconName, IconsProps } from '../Icon'
import { StatusType } from './types'

export const getIconName = (status: string, showAnimatedIcon: boolean): IconName => {
    switch (status) {
        case 'queued':
        case 'pending':
            return 'ic-clock'
        case 'failed':
            return 'ic-failure'
        case 'error':
        case 'not-ready':
            return 'ic-error'
        case 'cancelled':
            return 'ic-cancelled'
        case 'aborted':
            return 'ic-aborted'
        case 'healthy':
            return 'ic-heart-green'
        case 'ready':
        case 'synced':
        case 'sync.ok':
        case 'succeeded':
            return 'ic-success'
        case 'drifted':
            return 'ic-out-of-sync'
        case 'missing':
            return 'ic-missing'
        case 'unknown':
            return 'ic-unknown'
        case 'not-triggered':
        case 'not-deployed':
        case 'notdeployed':
        case 'not-available':
            return 'ic-close-small'
        case 'suspended':
            return 'ic-suspended'
        case 'degraded':
            return showAnimatedIcon ? 'ic-heart-red-animated' : 'ic-heart-red'
        case 'initiating':
        case 'progressing':
        case 'running':
        case 'request_accepted':
        case 'starting':
        case 'waiting-to-start':
            return 'ic-circle-loader'
        case 'inprogress':
            return 'ic-in-progress'
        case 'hibernating':
        case 'hibernated':
            return 'ic-hibernate'
        case 'timedout':
        case 'timed_out':
            return 'ic-timeout-two-dash'
        default:
            return null
    }
}

export const getIconColor = (status: string): IconsProps['color'] => {
    switch (status) {
        case 'not-triggered':
        case 'not-deployed':
        case 'notdeployed':
        case 'not-available':
        case 'queued':
        case 'pending':
            return 'N600'
        case 'initiating':
        case 'progressing':
        case 'running':
        case 'request_accepted':
        case 'starting':
            return 'O500'
        case 'timedout':
        case 'timed_out':
            return 'R500'
        default:
            return null
    }
}

export const getDeploymentStatusFromStatus = (status: string): string => {
    const deploymentStatus = status?.toUpperCase()

    switch (deploymentStatus) {
        case TIMELINE_STATUS.ABORTED:
            return StatusType.ABORTED
        case TIMELINE_STATUS.DEGRADED:
            return StatusType.FAILED
        case TIMELINE_STATUS.HEALTHY:
            return StatusType.SUCCEEDED
        case TIMELINE_STATUS.INPROGRESS:
            return StatusType.INPROGRESS
        default:
            return status
    }
}

export const getJobStatusFromStatus = (status: string): string => {
    if (status === WorkflowStatusEnum.WAITING_TO_START) {
        return 'Waiting to start'
    }

    return status
}
