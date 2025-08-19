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

import { useEffect, useRef } from 'react'
import { animate, motion, useMotionTemplate, useMotionValue, useTransform } from 'framer-motion'

import { ReactComponent as ICChatSupport } from '@IconsV2/ic-chat-circle-dots.svg'
import { ReactComponent as TexturedBG } from '@Images/licenseCardBG.svg'
import { ClipboardButton, getTTLInHumanReadableFormat } from '@Common/index'
import { CONTACT_SUPPORT_LINK, ENTERPRISE_SUPPORT_LINK } from '@Shared/constants'
import { AppThemeType } from '@Shared/Providers'
import { getThemeOppositeThemeClass } from '@Shared/Providers/ThemeProvider/utils'
import { LicensingErrorCodes } from '@Shared/types'

import { Button, ButtonComponentType, ButtonVariantType } from '../Button'
import { Icon } from '../Icon'
import { DevtronLicenseCardProps, LicenseStatus } from './types'
import { getLicenseColorsAccordingToStatus } from './utils'

import './licenseCard.scss'

const DAMPEN_FACTOR = 50

const ContactSupportButton = () => (
    <Button
        dataTestId="contact-support"
        startIcon={<ICChatSupport />}
        text="Contact support"
        variant={ButtonVariantType.text}
        component={ButtonComponentType.anchor}
        anchorProps={{ href: CONTACT_SUPPORT_LINK }}
    />
)

const LicenseCardSubText = ({
    isFreemium,
    licenseStatus,
    licenseStatusError,
}: Pick<DevtronLicenseCardProps, 'isFreemium' | 'licenseStatus' | 'licenseStatusError'>) => {
    if (isFreemium) {
        const freemiumLimitReached = licenseStatusError?.code === LicensingErrorCodes.ClusterLimitExceeded

        return (
            <div className="p-16 fs-13 lh-1-5 flexbox-col dc__gap-8">
                <div className="flexbox dc__gap-8 dc__content-space fs-13 fw-4 lh-20 cn-9">
                    {freemiumLimitReached ? (
                        <div className="flexbox-col dc__gap-4">
                            <span className="fw-6">Multiple Clusters Detected</span>
                            <span>
                                Your account is connected to multiple clusters, which isn’t allowed on the freemium
                                plan. Upgrade to an Enterprise license or contact us.
                            </span>
                        </div>
                    ) : (
                        <span className="fw-6">Unlimited single cluster usage</span>
                    )}
                    <Icon
                        name={freemiumLimitReached ? 'ic-error' : 'ic-success'}
                        color={freemiumLimitReached ? 'R500' : 'G500'}
                        size={20}
                    />
                </div>
                {freemiumLimitReached && (
                    <>
                        <div className="mail-support">
                            <Button
                                dataTestId="mail-support"
                                startIcon={<Icon name="ic-email" color={null} />}
                                text={ENTERPRISE_SUPPORT_LINK}
                                variant={ButtonVariantType.text}
                                component={ButtonComponentType.anchor}
                                anchorProps={{ href: `mailto:${ENTERPRISE_SUPPORT_LINK}` }}
                            />
                        </div>
                        <ContactSupportButton />
                    </>
                )}
            </div>
        )
    }

    // Cases when not freemium

    if (licenseStatus === LicenseStatus.ACTIVE) {
        return null
    }

    const isLicenseExpired = licenseStatus === LicenseStatus.EXPIRED

    return (
        <div className="p-16 fs-13 lh-1-5 flexbox-col dc__gap-8">
            <div className="flexbox dc__gap-8 dc__content-space">
                <span>
                    To renew your license mail us at&nbsp;
                    <a href={`mailto:${ENTERPRISE_SUPPORT_LINK}`}>{ENTERPRISE_SUPPORT_LINK}</a> or contact your Devtron
                    representative.
                </span>
                <Icon
                    name={isLicenseExpired ? 'ic-error' : 'ic-timer'}
                    color={isLicenseExpired ? 'R500' : 'Y500'}
                    size={16}
                />
            </div>
            <ContactSupportButton />
        </div>
    )
}

export const DevtronLicenseCard = ({
    enterpriseName,
    licenseKey,
    licenseSuffix,
    expiryDate,
    licenseStatus,
    isTrial,
    isFreemium,
    ttl,
    appTheme,
    handleCopySuccess,
    licenseStatusError,
}: DevtronLicenseCardProps) => {
    const { bgColor, textColor } = getLicenseColorsAccordingToStatus({ isFreemium, licenseStatus, licenseStatusError })
    const remainingTime = getTTLInHumanReadableFormat(ttl)
    const remainingTimeString = ttl < 0 ? `Expired ${remainingTime} ago` : `${remainingTime} remaining`
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
        <div className="license-card-wrapper flexbox-col p-8 br-16" style={{ backgroundColor: bgColor }}>
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
                                <span className="font-ibm-plex-mono cn-9">
                                    {isFreemium ? 'VALID FOREVER' : expiryDate}
                                </span>
                                {!isFreemium && (
                                    <>
                                        <span className="cn-9">·</span>
                                        <span style={{ color: textColor }}>{remainingTimeString}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    {(isTrial || isFreemium) && (
                        <span className="trial-license-badge flexbox dc__align-items-center px-20 py-6 cn-9 fs-11 fw-5 lh-1-5 dc__zi-2">
                            {isFreemium ? 'FREEMIUM' : 'TRIAL'} LICENSE
                        </span>
                    )}
                </motion.div>
            </div>
            <LicenseCardSubText
                isFreemium={isFreemium}
                licenseStatusError={licenseStatusError}
                licenseStatus={licenseStatus}
            />
        </div>
    )
}

export default DevtronLicenseCard
