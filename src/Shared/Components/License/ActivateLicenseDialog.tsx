import { ChangeEvent, SyntheticEvent, useState } from 'react'

import { ReactComponent as ICCross } from '@Icons/ic-cross.svg'
import { API_STATUS_CODES } from '@Common/Constants'
import { showError } from '@Common/index'
import {
    ActivateLicenseDialogProps,
    Button,
    ButtonStyleType,
    ButtonVariantType,
    getHandleOpenURL,
    handleSendAnalyticsEventToServer,
    InstallationFingerprintInfo,
    requiredField,
    ServerAnalyticsEventType,
    Textarea,
    ToastManager,
    ToastVariantType,
} from '@Shared/index'

import { GatekeeperQRDialog, ICDevtronWithBorder } from './License.components'
import { activateLicense } from './services'
import { getGateKeeperUrl } from './utils'

const ActivateLicenseDialog = ({
    fingerprint,
    enterpriseName,
    handleClose,
    handleLicenseActivateSuccess,
}: ActivateLicenseDialogProps) => {
    const [showQRDialog, setShowQRDialog] = useState<boolean>(false)
    const [licenseKey, setLicenseKey] = useState<string>('')
    const [activatingLicense, setActivatingLicense] = useState<boolean>(false)
    const [error, setError] = useState<string>('')

    const handleGetLicense = () => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        handleSendAnalyticsEventToServer(ServerAnalyticsEventType.GET_LICENSE_CLICKED, true)
        const gateKeeperURL = getGateKeeperUrl(fingerprint)

        getHandleOpenURL(gateKeeperURL)()
        setShowQRDialog(true)
    }

    const handleCloseQRDialog = () => {
        setShowQRDialog(false)
    }

    const validateForm = (updatedLicenseKey: string) => {
        const errorMessage = requiredField(updatedLicenseKey).message
        setError(errorMessage || '')
        return !errorMessage
    }

    const handleLicenseKeyChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.target
        setLicenseKey(value)
        validateForm(value)
    }

    const handleActivateLicense = async (e: SyntheticEvent) => {
        e.preventDefault()
        const isFormValid = validateForm(licenseKey)
        if (isFormValid) {
            setActivatingLicense(true)
            try {
                await activateLicense(licenseKey)
                ToastManager.showToast({
                    description: 'License activated successfully',
                    variant: ToastVariantType.success,
                })
                handleLicenseActivateSuccess()
            } catch (err) {
                if (err.code === API_STATUS_CODES.BAD_REQUEST) {
                    setError('Invalid license key')
                }
                showError(err)
            } finally {
                setActivatingLicense(false)
            }
        }
    }

    return (
        <div className="flexbox-col p-36 dc__gap-32 border__primary w-400 br-12 bg__primary mxh-600 dc__overflow-auto">
            <div className="flexbox-col dc__gap-20">
                <div className="flexbox dc__content-space">
                    <ICDevtronWithBorder />
                    {handleClose && (
                        <Button
                            dataTestId="close-dialog"
                            variant={ButtonVariantType.borderLess}
                            ariaLabel="close activate license dialog"
                            onClick={handleClose}
                            style={ButtonStyleType.negativeGrey}
                            icon={<ICCross />}
                            showAriaLabelInTippy={false}
                        />
                    )}
                </div>
                <div className="flexbox-col dc__gap-4">
                    <div className="fs-20 lh-1-5 fw-7 cn-9 font-merriweather dc__truncate">{enterpriseName}</div>
                    <div className="fs-16 lh-1-5 cn-8 fw-4">Enter new enterprise license key</div>
                </div>
            </div>
            <div className="flexbox-col dc__gap-16">
                <InstallationFingerprintInfo fingerprint={fingerprint} />
                <Textarea
                    placeholder="Enter license key"
                    name="license-key"
                    onChange={handleLicenseKeyChange}
                    value={licenseKey}
                    required
                    label="License Key"
                    error={error}
                />
            </div>
            <div className="flexbox-col dc__gap-16">
                <Button
                    dataTestId="activate-license"
                    text="Activate"
                    fullWidth
                    isLoading={activatingLicense}
                    onClick={handleActivateLicense}
                />
                <div className="flexbox dc__align-items-center dc__content-space">
                    <span className="fs-13 cn-9 lh-20 fw-4">Don’t have license key?</span>
                    <Button
                        dataTestId="get-license"
                        text="Get license"
                        variant={ButtonVariantType.text}
                        onClick={handleGetLicense}
                    />
                </div>
            </div>
            {showQRDialog && <GatekeeperQRDialog fingerprint={fingerprint} handleClose={handleCloseQRDialog} />}
        </div>
    )
}

export default ActivateLicenseDialog
