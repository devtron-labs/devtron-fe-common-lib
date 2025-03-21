import { DevtronLicenseBaseDTO } from '@Shared/index'

export interface InstallFingerprintInfoProps extends Pick<DevtronLicenseBaseDTO, 'fingerprint'> {
    showHelpTooltip?: boolean
}
