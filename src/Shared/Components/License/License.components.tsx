import { useEffect, useRef, useState } from 'react'

import { ReactComponent as ICCheck } from '@Icons/ic-check.svg'
import { ReactComponent as ICClipboard } from '@Icons/ic-copy.svg'
import { ClipboardButton, copyToClipboard, showError } from '@Common/index'

import { Backdrop, Button, ButtonStyleType, ButtonVariantType, Icon, InfoIconTippy, QRCode } from '..'
import { CopyButtonProps, GatekeeperQRDialogProps, InstallFingerprintInfoProps } from './types'
import { getGateKeeperUrl } from './utils'

const CopyButton = ({ copyContent }: CopyButtonProps) => {
    const [clicked, setClicked] = useState<boolean>(false)
    const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null)

    const handleCopy = async () => {
        try {
            await copyToClipboard(copyContent)
            setClicked(true)
            timeoutId.current = setTimeout(() => {
                setClicked(false)
            }, 1000)
        } catch (err) {
            showError(err)
        }
    }

    useEffect(
        () => () => {
            clearTimeout(timeoutId.current)
        },
        [],
    )

    return (
        <Button
            dataTestId="copy-button"
            text="Copy link"
            startIcon={clicked ? <ICCheck /> : <ICClipboard />}
            style={ButtonStyleType.neutral}
            variant={ButtonVariantType.borderLess}
            onClick={handleCopy}
        />
    )
}

export const GatekeeperQRDialog = ({ handleClose, fingerprint }: GatekeeperQRDialogProps) => {
    const gateKeeperURL = getGateKeeperUrl(fingerprint)

    return (
        <Backdrop onEscape={handleClose}>
            <div className="dc__m-auto bg__menu--primary br-12 w-400 border__primary mt-40">
                <div className="p-24 flexbox-col dc__gap-20">
                    <div className="flexbox-col cn-9 lh-1-5 dc__gap-4">
                        <div className="fs-16 fw-6">Get Devtron Enterprise License</div>
                        <div className="fs-13 fw-4">
                            Scan the below QR to visit the license dashboard and generate a license key for your Devtron
                            installation.
                        </div>
                    </div>
                    <div className="flex">
                        <div className="p-20 br-12 border-secondary bg__modal--secondary">
                            <QRCode value={gateKeeperURL} size={310} bgColor="N50" fgColor="N900" />
                        </div>
                    </div>
                </div>
                <div className="px-24 py-20 flexbox dc__align-items-center dc__content-space">
                    <CopyButton copyContent={gateKeeperURL} />
                    <Button dataTestId="qr-dialog-got-it" text="Got it" onClick={handleClose} />
                </div>
            </div>
        </Backdrop>
    )
}

export const ICDevtronWithBorder = () => (
    <div className="flex p-6 border__primary br-8 dc__w-fit-content">
        <Icon name="ic-devtron" color="B500" size={40} />
    </div>
)

const InstallationFingerprintInfo = ({ fingerprint, showHelpTooltip = false }: InstallFingerprintInfoProps) => (
    <div className="flexbox-col dc__gap-6">
        <div className="flexbox dc__align-items-center dc__gap-4">
            <span className="fs-13 lh-20 cn-7 fw-4">Installation Fingerprint</span>
            {showHelpTooltip && (
                <InfoIconTippy
                    heading="Installation Fingerprint"
                    infoText="A unique fingerprint to identify your Devtron Installation. An enterprise license is generated against an installation fingerprint."
                    documentationLinkText="Documentation"
                    iconClassName="icon-dim-20 fcn-6"
                    placement="right"
                    documentationLink="ENTERPRISE_LICENSE"
                    openInNewTab
                />
            )}
        </div>
        <div className="flex dc__gap-8">
            <span className="cn-9 fs-13 lh-1-5 fw-4 dc__truncate">{fingerprint}</span>
            <ClipboardButton content={fingerprint} />
        </div>
    </div>
)

export default InstallationFingerprintInfo
