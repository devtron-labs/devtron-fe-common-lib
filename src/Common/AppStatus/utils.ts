import { TIMELINE_STATUS } from './constants'

export const triggerStatus = (triggerDetailStatus: string): string => {
    let triggerStatus = triggerDetailStatus?.toUpperCase()
    if (triggerStatus === TIMELINE_STATUS.ABORTED || triggerStatus === TIMELINE_STATUS.DEGRADED) {
        return 'Failed'
    } else if (triggerStatus === TIMELINE_STATUS.HEALTHY) {
        return 'Succeeded'
    } else if (triggerStatus === TIMELINE_STATUS.INPROGRESS) {
        return 'Inprogress'
    } else {
        return triggerDetailStatus
    }
}
