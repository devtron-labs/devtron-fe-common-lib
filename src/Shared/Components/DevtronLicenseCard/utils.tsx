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

export const getTTLInHumanReadableFormat = (ttl: number): string => {
    const duration = moment.duration(ttl, 'seconds')

    if (duration.asYears() >= 1) {
        const years = Math.floor(duration.asYears())
        const months = duration.months()
        if (months > 0) {
            return `${years} ${years > 1 ? 'years' : 'year'}, ${months} ${months > 1 ? 'months' : 'month'}`
        }
        return `${years} ${years > 1 ? 'years' : 'year'}`
    }

    if (duration.asMonths() >= 1) {
        const months = Math.floor(duration.asMonths())
        return `${months} ${months > 1 ? 'months' : 'month'}`
    }

    if (duration.asDays() >= 1) {
        const days = Math.floor(duration.asDays())
        return `${days} ${days > 1 ? 'days' : 'day'}`
    }

    if (duration.asHours() >= 1) {
        const hours = Math.floor(duration.asHours())
        return `${hours} ${hours > 1 ? 'hours' : 'hour'}`
    }

    const minutes = Math.floor(duration.asMinutes())
    return `${minutes} ${minutes > 1 ? 'minutes' : 'minute'}`
}
