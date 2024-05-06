import { multiSelectStyles } from '../../../Common'

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
        backgroundColor: 'var(--N50)',
        cursor: 'pointer',
    }),
    dropdownIndicator: (base) => ({
        ...base,
        padding: '0 8px',
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
}

export const statusColor = {
    suspended: '#ffaa00',
    unknown: 'var(--N700)',
    queued: 'var(--N700)',
    degraded: 'var(--R500)',
    healthy: 'var(--G500)',
    notdeployed: 'var(--N500)',
    missing: 'var(--N700)',
    progressing: 'var(--orange)',
    initiating: 'var(--orange)',
    starting: '#FF7E5B',
    succeeded: '#1dad70',
    running: '#FF7E5B',
    failed: '#f33e3e',
    error: '#f33e3e',
    cancelled: '#767d84',
    aborted: '#767d84',
    timedout: '#f33e3e',
    unabletofetch: '#f33e3e',
    hibernating: 'var(--N700)',
}

export const GIT_BRANCH_NOT_CONFIGURED = 'Not Configured'
export const DEFAULT_GIT_BRANCH_VALUE = '--'
