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

import { AppThemeType } from '@Shared/Providers'
import { DevtronLicenseBaseDTO, DevtronLicenseDTO, LicenseErrorStruct } from '@Shared/types'

export enum LicenseStatus {
    ACTIVE = 'ACTIVE',
    EXPIRED = 'EXPIRED',
    REMINDER_THRESHOLD_REACHED = 'REMINDER_THRESHOLD_REACHED',
}

export type DevtronLicenseCardProps = {
    enterpriseName: string
    expiryDate: string
    ttl: number
    licenseStatus: LicenseStatus
    isTrial: boolean
    isFreemium: boolean
    appTheme: AppThemeType
    licenseStatusError: LicenseErrorStruct
    isSaasInstance: boolean
} & (
    | {
          licenseKey: string
          handleCopySuccess?: () => void
          licenseSuffix?: never
      }
    | {
          licenseKey?: never
          handleCopySuccess?: never
          licenseSuffix: string
      }
)

export interface LicenseCardSubTextProps extends Pick<
    DevtronLicenseCardProps,
    'isFreemium' | 'licenseStatus' | 'licenseStatusError'
> {
    isFreeForever: boolean
}

export type DevtronLicenseInfo = Omit<DevtronLicenseCardProps, 'appTheme'> &
    Pick<DevtronLicenseDTO, 'fingerprint' | 'showLicenseData' | 'licenseStatusError' | 'moduleLimits'>

export interface ActivateLicenseDialogProps extends Pick<DevtronLicenseBaseDTO, 'fingerprint'> {
    enterpriseName: string
    handleClose?: () => void
    handleLicenseActivateSuccess: () => void
}

export interface InstallFingerprintInfoProps extends Pick<DevtronLicenseBaseDTO, 'fingerprint'> {
    showHelpTooltip?: boolean
}

export interface GatekeeperQRDialogProps {
    fingerprint: string
    handleClose: () => void
}

export interface CopyButtonProps {
    copyContent: string
}
