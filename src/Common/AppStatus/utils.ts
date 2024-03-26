import { TIMELINE_STATUS } from './constants'
import { TIPPY_ICON_DIM } from '../Constants'
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

export const getInfoIconTippyClass = (variant: string): string => {
    let className: string
    switch (variant) {
        case TIPPY_ICON_DIM.SMALL:
            className = TIPPY_ICON_DIM.SMALL
            break
        case TIPPY_ICON_DIM.MEDIUM:
            className = TIPPY_ICON_DIM.MEDIUM
            break
        case TIPPY_ICON_DIM.LARGE:
            className = TIPPY_ICON_DIM.LARGE
            break
        default:
            className = TIPPY_ICON_DIM.MEDIUM
    }

    return className
}
