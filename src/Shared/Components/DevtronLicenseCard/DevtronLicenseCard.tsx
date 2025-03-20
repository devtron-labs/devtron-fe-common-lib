import { ClipboardButton } from '@Common/index'
import { ReactComponent as ICChatSupport } from '@IconsV2/ic-chat-circle-dots.svg'
import { DevtronLicenseCardProps, LicenseStatus } from '@Shared/index'
import { Button, ButtonVariantType } from '../Button'
import { Icon } from '../Icon'
import { getLicenseColorsAccordingToStatus, getTTLInHumanReadableFormat } from './utils'
import './licenseCard.scss'

export const DevtronLicenseCard = ({
    enterpriseName,
    licenseKey,
    licenseSuffix,
    expiryDate,
    licenseStatus,
    isTrial,
    ttl,
}: DevtronLicenseCardProps) => {
    const { bgColor, textColor } = getLicenseColorsAccordingToStatus(licenseStatus)
    const remainingTime = getTTLInHumanReadableFormat(Math.abs(ttl))
    const remainingTimeString = ttl < 0 ? `Expired ${remainingTime} ago` : `${remainingTime} remaining`

    return (
        <div className="flexbox-col p-8 br-16" style={{ backgroundColor: bgColor }}>
            <div className="license-card border__secondary-translucent flexbox-col br-12 h-200 bg__tertiary">
                <div className="p-20 flexbox-col dc__content-space flex-grow-1">
                    <div className="flexbox dc__align-items-center dc__content-space">
                        <span className="font-merriweather cn-9 fs-16 fw-7 lh-1-5">{enterpriseName}</span>
                        <Icon name="ic-devtron" color="N900" size={24} />
                    </div>
                    <div className="flexbox-col dc__gap-4">
                        <div className="flexbox dc__align-items-center dc__gap-6">
                            <Icon name="ic-key" color={null} size={20} />
                            <div className="flex dc__gap-4 cn-7 fs-16 fw-5 lh-1-5 font-ibm-plex-mono">
                                <span>••••</span>
                                <span>{licenseSuffix || licenseKey?.slice(-8)}</span>
                            </div>
                            {licenseKey && <ClipboardButton content={licenseKey} />}
                        </div>
                        <div className="flexbox dc__align-items-center dc__gap-4">
                            <span>{expiryDate}</span>
                            <span>•</span>
                            <span style={{ color: textColor }}>{remainingTimeString}</span>
                        </div>
                    </div>
                </div>
                {isTrial && (
                    <span className="trial-license-badge flexbox dc__align-items-center px-20 py-6 cn-9 fs-11 fw-5 lh-1-5 dc__bottom-radius-12">
                        TRIAL LICENSE
                    </span>
                )}
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

export default DevtronLicenseCard
