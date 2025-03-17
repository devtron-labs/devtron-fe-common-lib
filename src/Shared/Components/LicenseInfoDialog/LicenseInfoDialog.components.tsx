import { ClipboardButton, DOCUMENTATION_HOME_PAGE } from '@Common/index'
import { ReactComponent as ICChatSupport } from '@IconsV2/ic-chat-circle-dots.svg'
import { Icon } from '../Icon'
import { Button, ButtonStyleType, ButtonVariantType } from '../Button'
import { InfoIconTippy } from '../InfoIconTippy'
import './licenseInfoDialog.scss'

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

export const getColorAccordingToStatus = (licenseStatus: LicenseStatus) => {
    switch (licenseStatus) {
        case LicenseStatus.ACTIVE:
            return 'var(--G100)'
        case LicenseStatus.REMINDER_THRESHOLD_REACHED:
            return 'var(--Y100)'
        default:
            return 'var(--R100)'
    }
}

export const DevtronLicenseCard = ({
    enterpriseName,
    licenseKey,
    licenseSuffix,
    expiryDate,
    licenseStatus,
    isTrial,
    ttl,
}: DevtronLicenseCardProps) => {
    const colorValue = getColorAccordingToStatus(licenseStatus)

    return (
        <div className="flexbox-col p-8 br-16" style={{ backgroundColor: colorValue }}>
            <div className="license-card flexbox-col dc__content-space br-12 p-20 h-200 bg__tertiary">
                <div className="flexbox dc__align-items-center dc__content-space">
                    <span className="font-merriweather cn-9 fs-16 fw-7 lh-1-5">{enterpriseName}</span>
                    <Icon name="ic-devtron" color="N900" size={24} />
                </div>
                <div className="flexbox-col dc__gap-4">
                    <div className="flexbox dc__align-items-center dc__gap-6">
                        <Icon name="ic-key" color={null} size={20} />
                        <div className="flex dc__gap-4 cn-7 fs-16 fw-5 lh-1-5 font-ibm-plex-mono">
                            <span>••••</span>
                            <span>{licenseSuffix || licenseKey.slice(-8)}</span>
                        </div>
                        {licenseKey && <ClipboardButton content={licenseKey} />}
                    </div>
                    <div className="flexbox dc__align-items-center dc__gap-4">
                        <span>{expiryDate}</span>
                        <span>•</span>
                        <span style={{ color: colorValue }}>2 months remaining</span>
                    </div>
                </div>
                {isTrial && <div className="flexbox dc__align-items-center px-20 py-6">TRIAL LICENSE</div>}
            </div>
            {licenseStatus !== LicenseStatus.ACTIVE && (
                <div className="p-16 flexbox-col dc__gap-8">
                    <div className="flexbox dc__gap-8">
                        <span>
                            {/* TODO: Confirm with product team */}
                            To renew your license mail us at enterprise@devtron.ai or contact your Devtron
                            representative.
                        </span>
                        <Icon name="ic-timer" color="Y500" size={16} />
                    </div>
                    <Button
                        dataTestId="contact-support"
                        startIcon={<ICChatSupport />}
                        text="Contact support"
                        variant={ButtonVariantType.text}
                    />
                </div>
            )}
        </div>
    )
}

export const InstallationFingerprintInfo = ({
    installationFingerprint,
    showHelpTip = false,
}: {
    installationFingerprint: string
    showHelpTip?: boolean
}) => (
    <div className="flexbox-col dc__gap-6">
        <div className="flexbox dc__align-items-center dc__gap-4">
            <span className="fs-13 lh-20 cn-7 fw-4">Installation Fingerprint</span>
            {showHelpTip && (
                <InfoIconTippy
                    heading="Installation Fingerprint"
                    infoText="A unique fingerprint to identify your Devtron Installation. An enterprise license is generated against an installation fingerprint."
                    documentationLinkText="Documentation"
                    iconClassName="icon-dim-20 fcn-6"
                    placement="right"
                    documentationLink={DOCUMENTATION_HOME_PAGE}
                />
            )}
        </div>
        <div className="flex dc__content-space">
            <span className="cn-9 fs-13 lh-1-5 fw-4">{installationFingerprint}</span>
            <ClipboardButton content={installationFingerprint} />
        </div>
    </div>
)

export const LicenseInfo = ({ handleUpdateLicenseClick }: { handleUpdateLicenseClick: () => void }) => (
    <div className="flexbox-col dc__gap-20">
        <DevtronLicenseCard
            enterpriseName="BharatPe"
            licenseSuffix="4AF593V3"
            ttl={100}
            licenseStatus={LicenseStatus.ACTIVE}
            isTrial
            expiryDate="2025-05-17"
        />
        <InstallationFingerprintInfo installationFingerprint="3ff0d8be-e7f2-4bf4-9c3f-70ec904b51f4" showHelpTip />
        <div className="border__primary--bottom h-1" />
        <div className="flex dc__content-space">
            <span>Have a new license?</span>
            <Button
                dataTestId="update-license"
                text="Update license"
                variant={ButtonVariantType.text}
                onClick={handleUpdateLicenseClick}
            />
        </div>
    </div>
)

export const AboutDevtron = () => (
    <div className="flexbox-col dc__align-items-center dc__gap-20">
        <div className="flex p-6 border__primary br-8">
            <Icon name="ic-devtron" color="B500" size={40} />
        </div>
        <div className="text-center">
            <p className="fs-16 cn-9 fw-6 lh-1-5 m-0">Devtron</p>
            {/* TODO: add version */}
            <p className="fs-13 cn-7 fw-4 lh-20 m-0">Enterprise Version (1.3.1)</p>
        </div>
        <p className="fs-13 cn-5 fw-4 lh-20 m-0">Copyright © 2025 Devtron Inc. All rights reserved.</p>
        {/* TODO: add links for all button below */}
        <div className="flexbox dc__align-items-center dc__gap-6">
            <Button
                dataTestId="terms-of-service"
                text="Terms of service"
                variant={ButtonVariantType.text}
                style={ButtonStyleType.neutral}
            />
            <span>•</span>
            <Button
                dataTestId="privacy-policy"
                text="Privacy policy"
                variant={ButtonVariantType.text}
                style={ButtonStyleType.neutral}
            />
            <span>•</span>
            <Button
                dataTestId="license-agreement"
                text="License agreement"
                variant={ButtonVariantType.text}
                style={ButtonStyleType.neutral}
            />
        </div>
    </div>
)
