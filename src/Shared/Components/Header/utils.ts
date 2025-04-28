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

import { ReactComponent as Discord } from '@Icons/ic-discord-fill.svg'
import { ReactComponent as File } from '@Icons/ic-file-text.svg'

import { DISCORD_LINK, DOCUMENTATION_HOME_PAGE, LOGIN_COUNT } from '../../../Common'
import { DevtronLicenseInfo, LicenseStatus } from '../License'
import { EnterpriseHelpOptions, OSSHelpOptions, TrialHelpOptions } from './constants'
import { updatePostHogEvent } from './service'

const millisecondsInDay = 86400000
export const getDateInMilliseconds = (days) => 1 + new Date().valueOf() + (days ?? 0) * millisecondsInDay

export const handlePostHogEventUpdate = async (eventName: string): Promise<void> => {
    const payload = {
        eventType: eventName,
        key: LOGIN_COUNT,
        value: '',
        active: true,
    }
    await updatePostHogEvent(payload)
}

export const setActionWithExpiry = (key: string, days: number): void => {
    localStorage.setItem(key, `${getDateInMilliseconds(days)}`)
}

export const getIsShowingLicenseData = (licenseData: DevtronLicenseInfo) =>
    licenseData && (licenseData.licenseStatus !== LicenseStatus.ACTIVE || licenseData.isTrial)

const getInstallationSpecificHelpOptions = (isEnterprise: boolean, isTrial: boolean) => {
    if (isEnterprise) {
        return isTrial ? TrialHelpOptions : EnterpriseHelpOptions
    }
    return OSSHelpOptions
}

export const getHelpOptions = (isEnterprise: boolean, isTrial: boolean) => {
    const HelpOptions = getInstallationSpecificHelpOptions(isEnterprise, isTrial)
    return [
        {
            name: 'View documentation',
            link: DOCUMENTATION_HOME_PAGE,
            icon: File,
        },

        {
            name: 'Join discord community',
            link: DISCORD_LINK,
            icon: Discord,
        },
        ...HelpOptions,
    ]
}
