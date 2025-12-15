/*
 * Copyright (c) 2024. Devtron Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import moment from 'moment'

import { DATE_TIME_FORMATS } from '@Common/Constants'
import { getUrlWithSearchParams } from '@Common/index'
import { DevtronLicenseDTO, LicensingErrorCodes } from '@Shared/types'

import { ALLOWED_CLUSTER_IN_FREEMIUM } from './constants'
import { DevtronLicenseCardProps, DevtronLicenseInfo, LicenseStatus } from './types'

export const getLicenseColorsAccordingToStatus = ({
    isFreemium,
    licenseStatus,
    licenseStatusError,
}: Pick<DevtronLicenseCardProps, 'licenseStatus' | 'isFreemium' | 'licenseStatusError'>): {
    bgColor: string
    textColor: string
} => {
    if (isFreemium) {
        const freemiumLimitReached = licenseStatusError?.code === LicensingErrorCodes.ClusterLimitExceeded
        return freemiumLimitReached
            ? { bgColor: 'var(--R100)', textColor: 'var(--R500)' }
            : { bgColor: 'var(--G100)', textColor: 'var(--G500)' }
    }
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
    const {
        isTrial,
        expiry,
        ttl,
        reminderThreshold,
        organisationMetadata,
        license,
        claimedByUserDetails,
        isFreemium,
        licenseStatusError,
    } = licenseDTO || {}

    return {
        enterpriseName: organisationMetadata?.name || 'Devtron Enterprise',
        expiryDate: expiry ? moment(expiry).format(DATE_TIME_FORMATS['DD/MM/YYYY']) : '',
        ttl,
        licenseStatus: getDevtronLicenseStatus({ ttl, reminderThreshold }),
        isTrial,
        isFreemium,
        licenseStatusError,
        // TODO: Move this check to key later
        isSaasInstance: !!licenseDTO?.instanceData?.devtronUrl,
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
        moduleLimits: {
            allAllowed: result?.moduleLimits?.allAllowed || false,
            maxAllowedClusters: result?.moduleLimits?.maxAllowedClusters || ALLOWED_CLUSTER_IN_FREEMIUM,
        },
    }
}

export const getGateKeeperUrl = (fingerprint: string) =>
    getUrlWithSearchParams(window._env_.GATEKEEPER_URL, { fingerprint })
