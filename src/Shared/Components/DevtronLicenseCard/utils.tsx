import { LicenseStatus } from '@Shared/index'
import moment from 'moment'

export const getLicenseColorsAccordingToStatus = (
    licenseStatus: LicenseStatus,
): { bgColor: string; textColor: string } => {
    switch (licenseStatus) {
        case LicenseStatus.ACTIVE:
            return { bgColor: 'var(--G100)', textColor: 'var(--G500)' }
        case LicenseStatus.REMINDER_THRESHOLD_REACHED:
            return { bgColor: 'var(--Y100)', textColor: 'var(--Y700)' }
        default:
            return { bgColor: 'var(--R100)', textColor: 'var(--R500)' }
    }
}

export const getTTLInHumanReadableFormat = (ttl: number): string =>
    moment.duration(Math.abs(ttl), 'seconds').humanize(false)
