import { useEffect, useRef } from 'react'
import { animate, motion, useMotionTemplate, useMotionValue, useTransform } from 'framer-motion'
import { ClipboardButton, getTTLInHumanReadableFormat } from '@Common/index'
import { ReactComponent as ICChatSupport } from '@IconsV2/ic-chat-circle-dots.svg'
import {
    CONTACT_SUPPORT_LINK,
    DevtronLicenseCardProps,
    ENTERPRISE_SUPPORT_LINK,
    getHandleOpenURL,
    LicenseStatus,
} from '@Shared/index'
import { Button, ButtonVariantType } from '../Button'
import { Icon } from '../Icon'
import { getLicenseColorsAccordingToStatus } from './utils'
import './licenseCard.scss'

const DAMPEN_FACTOR = 40

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
    const remainingTime = getTTLInHumanReadableFormat(ttl)
    const remainingTimeString = ttl < 0 ? `Expired ${remainingTime} ago` : `${remainingTime} remaining`
    const isLicenseValid = licenseStatus !== LicenseStatus.EXPIRED

    const cardRef = useRef<HTMLDivElement>(null)

    const mouseX = useMotionValue(window.innerWidth)
    const mouseY = useMotionValue(window.innerHeight)

    const rotateX = useTransform<number, number>(mouseY, (newMouseY) => {
        if (!cardRef.current) return 0
        const rect = cardRef.current.getBoundingClientRect()
        const newRotateX = newMouseY - rect.top - rect.height / 2
        return -newRotateX / DAMPEN_FACTOR
    })
    const rotateY = useTransform(mouseX, (newMouseX) => {
        if (!cardRef.current) return 0
        const rect = cardRef.current.getBoundingClientRect()
        const newRotateY = newMouseX - rect.left - rect.width / 2
        return newRotateY / DAMPEN_FACTOR
    })

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            animate(mouseX, e.clientX)
            animate(mouseY, e.clientY)
        }

        window.addEventListener('mousemove', handleMouseMove)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [])

    const diagonalMovement = useTransform<number, number>(
        [rotateX, rotateY],
        ([newRotateX, newRotateY]) => newRotateX + newRotateY,
    )
    const sheenPosition = useTransform(diagonalMovement, [-5, 5], [-100, 200])

    const sheenOpacity = useTransform(sheenPosition, [-100, 50, 200], [0, 0.05, 0])
    const sheenGradient = useMotionTemplate`linear-gradient(
    55deg,
    transparent,
    rgba(255 255 255 / ${sheenOpacity}) ${sheenPosition}%,
    transparent)`

    return (
        <div className="flexbox-col p-8 br-16" style={{ backgroundColor: bgColor }}>
            <motion.div
                className="license-card border__secondary-translucent flexbox-col br-12 h-200 bg__tertiary"
                ref={cardRef}
                style={{ rotateX, rotateY, backgroundImage: sheenGradient }}
            >
                <div className="p-20 flexbox-col dc__content-space flex-grow-1">
                    <div className="flexbox dc__align-items-center dc__content-space">
                        <span className="font-merriweather cn-9 fs-16 fw-7 lh-1-5 dc__truncate">{enterpriseName}</span>
                        <Icon name="ic-devtron" color="N900" size={24} />
                    </div>
                    <div className="flexbox-col dc__gap-4">
                        <div className="flexbox dc__align-items-center dc__gap-6">
                            <Icon name="ic-key" color={null} size={20} />
                            <div className="flex dc__gap-4 cn-7 fs-16 fw-5 lh-1-5 font-ibm-plex-mono">
                                <span>&bull;&bull;&bull;&bull;</span>
                                <span>{licenseSuffix || licenseKey?.slice(-8)}</span>
                            </div>
                            {licenseKey && <ClipboardButton content={licenseKey} />}
                        </div>
                        <div className="flexbox dc__align-items-center dc__gap-4 flex-wrap">
                            <span className="font-ibm-plex-mono">{expiryDate}</span>
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
            </motion.div>
            {licenseStatus !== LicenseStatus.ACTIVE && (
                <div className="p-16 flexbox-col dc__gap-8">
                    <div className="flexbox dc__gap-8">
                        <span>
                            To renew your license mail us at&nbsp;
                            <a href={`mailto:${ENTERPRISE_SUPPORT_LINK}`}>{ENTERPRISE_SUPPORT_LINK}</a> or contact your
                            Devtron representative.
                        </span>
                        <Icon
                            name={isLicenseValid ? 'ic-timer' : 'ic-error'}
                            color={isLicenseValid ? 'Y500' : 'R500'}
                            size={16}
                        />
                    </div>
                    <Button
                        dataTestId="contact-support"
                        startIcon={<ICChatSupport />}
                        text="Contact support"
                        variant={ButtonVariantType.text}
                        onClick={getHandleOpenURL(CONTACT_SUPPORT_LINK)}
                    />
                </div>
            )}
        </div>
    )
}

export default DevtronLicenseCard
