import moment from 'moment'
import { DATE_TIME_FORMATS } from '@Common/Constants'
import { DevtronLicenseCardProps, DevtronLicenseDTO, LicenseStatus } from '@Shared/index'

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

const getDevtronLicenseStatus = ({
    ttl,
    reminderThreshold,
}: Pick<DevtronLicenseDTO, 'ttl' | 'reminderThreshold'>): LicenseStatus => {
    if (ttl <= 0) {
        return LicenseStatus.EXPIRED
    }

    if (ttl < reminderThreshold * 24 * 60 * 60) {
        return LicenseStatus.REMINDER_THRESHOLD_REACHED
    }

    return LicenseStatus.ACTIVE
}

export const parseDevtronLicenseDTOIntoLicenseCardData = <isCentralDashboard extends boolean = false>(
    licenseDTO: DevtronLicenseDTO<isCentralDashboard>,
    currentUserEmail?: isCentralDashboard extends true ? string : never,
): Omit<DevtronLicenseCardProps, 'appTheme'> => {
    const { isTrial, expiry, ttl, reminderThreshold, organisationMetadata, license, claimedByUserDetails } =
        licenseDTO || {}

    return {
        enterpriseName: organisationMetadata?.name || '',
        expiryDate: expiry ? moment(expiry).format(DATE_TIME_FORMATS['DD/MM/YYYY']) : '',
        ttl,
        licenseStatus: getDevtronLicenseStatus({ ttl, reminderThreshold }),
        isTrial,
        ...(currentUserEmail && currentUserEmail === claimedByUserDetails?.email
            ? { licenseKey: license }
            : { licenseSuffix: license }),
    }
}
