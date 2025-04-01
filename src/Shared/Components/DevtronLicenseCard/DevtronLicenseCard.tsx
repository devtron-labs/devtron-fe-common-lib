import { useEffect, useRef } from 'react'
import { animate, motion, useMotionTemplate, useMotionValue, useTransform } from 'framer-motion'
import { ClipboardButton, getTTLInHumanReadableFormat } from '@Common/index'
import { ReactComponent as ICChatSupport } from '@IconsV2/ic-chat-circle-dots.svg'
import { getThemeOppositeThemeClass } from '@Shared/Providers/ThemeProvider/utils'
import {
    AppThemeType,
    CONTACT_SUPPORT_LINK,
    DevtronLicenseCardProps,
    ENTERPRISE_SUPPORT_LINK,
    getHandleOpenURL,
    LicenseStatus,
} from '@Shared/index'
import { ReactComponent as TexturedBG } from '@Images/licenseCardBG.svg'
import { Button, ButtonVariantType } from '../Button'
import { Icon } from '../Icon'
import { getLicenseColorsAccordingToStatus } from './utils'
import './licenseCard.scss'

const DAMPEN_FACTOR = 50

export const DevtronLicenseCard = ({
    enterpriseName,
    licenseKey,
    licenseSuffix,
    expiryDate,
    licenseStatus,
    isTrial,
    ttl,
    appTheme,
    handleCopySuccess,
}: DevtronLicenseCardProps) => {
    const { bgColor, textColor } = getLicenseColorsAccordingToStatus(licenseStatus)
    const remainingTime = getTTLInHumanReadableFormat(ttl)
    const remainingTimeString = ttl < 0 ? `Expired ${remainingTime} ago` : `${remainingTime} remaining`
    const isLicenseValid = licenseStatus !== LicenseStatus.EXPIRED
    const isThemeDark = appTheme === AppThemeType.dark

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

    const sheenOpacity = useTransform(sheenPosition, [-100, 50, 200], [0, isThemeDark ? 0.25 : 0.1, 0])
    const sheenGradient = isThemeDark
        ? useMotionTemplate`linear-gradient(55deg, transparent, rgba(122, 127, 131, ${sheenOpacity}) ${sheenPosition}%, transparent)`
        : useMotionTemplate`linear-gradient(55deg, transparent, rgba(255, 255, 255, ${sheenOpacity}) ${sheenPosition}%, transparent)`

    return (
        <div className="flexbox-col p-8 br-16" style={{ backgroundColor: bgColor }}>
            <div style={{ perspective: '1000px' }}>
                <motion.div
                    className={`license-card shadow__overlay border__secondary flexbox-col br-12 h-200 dc__overflow-hidden bg__tertiary ${getThemeOppositeThemeClass(appTheme)}`}
                    ref={cardRef}
                    style={{
                        rotateX,
                        rotateY,
                        backgroundImage: sheenGradient,
                        transformStyle: 'preserve-3d',
                        transform: 'translateZ(0)',
                    }}
                    whileHover={{ scale: 1.05 }}
                >
                    <TexturedBG className="dc__position-abs" />
                    <div className="p-20 flexbox-col dc__content-space flex-grow-1 textured-bg dc__zi-2">
                        <div className="flexbox dc__content-space dc__gap-72">
                            <span className="font-merriweather cn-9 fs-16 fw-7 lh-1-5 dc__ellipsis-right__2nd-line">
                                {enterpriseName}
                            </span>
                            <Icon name="ic-devtron" color="N900" size={24} />
                        </div>
                        <div className="flexbox-col dc__gap-2">
                            <div className="flexbox dc__align-items-center dc__gap-6">
                                <div className="flex dc__gap-2 cn-7 fs-16 fw-5 lh-1-5 cn-9 font-ibm-plex-mono">
                                    <span>&bull;&bull;&bull;&bull;</span>
                                    <span>{licenseSuffix || licenseKey?.slice(-8)}</span>
                                </div>
                                {licenseKey && (
                                    <ClipboardButton
                                        initialTippyText="Copy license key"
                                        content={licenseKey}
                                        handleSuccess={handleCopySuccess}
                                    />
                                )}
                            </div>
                            <div className="flexbox dc__align-items-center dc__gap-4 flex-wrap fs-12">
                                <span className="font-ibm-plex-mono cn-9">{expiryDate}</span>
                                <span className="cn-9">·</span>
                                <span style={{ color: textColor }}>{remainingTimeString}</span>
                            </div>
                        </div>
                    </div>
                    {isTrial && (
                        <span className="trial-license-badge flexbox dc__align-items-center px-20 py-6 cn-9 fs-11 fw-5 lh-1-5 dc__zi-2">
                            TRIAL LICENSE
                        </span>
                    )}
                </motion.div>
            </div>
            {licenseStatus !== LicenseStatus.ACTIVE && (
                <div className="p-16 fs-13 lh-1-5 flexbox-col dc__gap-8">
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
