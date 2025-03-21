import { DevtronLicenseBaseDTO, LicenseStatus } from '@Shared/index'

export interface InstallFingerprintInfoProps extends Pick<DevtronLicenseBaseDTO, 'fingerprint'> {
    showHelpTooltip?: boolean
}

export type DevtronLicenseCardProps = {
    enterpriseName: string
    expiryDate: string
    ttl: number
    licenseStatus: LicenseStatus
    isTrial: boolean
} & (
    | {
          licenseKey: string
          licenseSuffix?: never
      }
    | {
          licenseKey?: never
          licenseSuffix: string
      }
)
