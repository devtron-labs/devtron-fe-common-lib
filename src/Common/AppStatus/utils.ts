import { TIMELINE_STATUS } from './constants'
export const triggerStatus = (triggerDetailStatus: string): string => {
    const triggerStatus = triggerDetailStatus?.toUpperCase()
    if (triggerStatus === TIMELINE_STATUS.ABORTED || triggerStatus === TIMELINE_STATUS.DEGRADED) {
        return 'Failed'
    }
    if (triggerStatus === TIMELINE_STATUS.HEALTHY) {
        return 'Succeeded'
    }
    if (triggerStatus === TIMELINE_STATUS.INPROGRESS) {
        return 'Inprogress'
    }
    return triggerDetailStatus
}
