import { AppThemeType } from '@Shared/Providers'
import { DevtronLicenseBaseDTO, DevtronLicenseDTO } from '@Shared/types'

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
    appTheme: AppThemeType
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

export type DevtronLicenseInfo = Omit<DevtronLicenseCardProps, 'appTheme'> &
    Pick<DevtronLicenseDTO, 'fingerprint' | 'showLicenseData' | 'licenseStatusError'>

export interface InstallFingerprintInfoProps extends Pick<DevtronLicenseBaseDTO, 'fingerprint'> {
    showHelpTooltip?: boolean
}
