import moment from 'moment'

import { DATE_TIME_FORMATS } from '@Common/Constants'
import { getUrlWithSearchParams } from '@Common/index'
import { DevtronLicenseDTO } from '@Shared/types'

import { DevtronLicenseCardProps, DevtronLicenseInfo, LicenseStatus } from './types'

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

const parseDevtronLicenseDTOIntoLicenseCardData = <isCentralDashboard extends boolean = false>(
    licenseDTO: DevtronLicenseDTO<isCentralDashboard>,
    currentUserEmail?: isCentralDashboard extends true ? string : never,
): Omit<DevtronLicenseCardProps, 'appTheme'> => {
    const { isTrial, expiry, ttl, reminderThreshold, organisationMetadata, license, claimedByUserDetails } =
        licenseDTO || {}

    return {
        enterpriseName: organisationMetadata?.name || 'Devtron Enterprise',
        expiryDate: expiry ? moment(expiry).format(DATE_TIME_FORMATS['DD/MM/YYYY']) : '',
        ttl,
        licenseStatus: getDevtronLicenseStatus({ ttl, reminderThreshold }),
        isTrial,
        ...(currentUserEmail && currentUserEmail === claimedByUserDetails?.email
            ? { licenseKey: license }
            : { licenseSuffix: license }),
    }
}

export const parseDevtronLicenseData = (result: DevtronLicenseDTO): DevtronLicenseInfo => {
    const parsedResponse = parseDevtronLicenseDTOIntoLicenseCardData(result)
    return {
        ...parsedResponse,
        fingerprint: result?.fingerprint || '',
        showLicenseData: result?.showLicenseData,
        licenseStatusError: result?.licenseStatusError,
    }
}

export const getGateKeeperUrl = (fingerprint: string) =>
    getUrlWithSearchParams(window._env_.GATEKEEPER_URL, { fingerprint })
