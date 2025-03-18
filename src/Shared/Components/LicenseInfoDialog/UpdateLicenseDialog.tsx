import { ChangeEvent, useEffect, useState } from 'react'
import { useRegisterShortcut } from '@Common/Hooks'
import { CustomInput } from '../CustomInput'
import { InstallationFingerprintInfo } from './LicenseInfoDialog.components'
import { Button, ButtonVariantType } from '../Button'

const ActivateLicenseDialog = () => {
    const { registerShortcut, unregisterShortcut } = useRegisterShortcut()
    const [licenseKey, setLicenseKey] = useState<string>('')
    const [error, setError] = useState<string>('')

    const validateForm = (updatedLicenseKey: string) => {
        if (!updatedLicenseKey) {
            setError('License key is required')
            return false
        }
        setError('')
        return true
    }

    const handleLicenseKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        setLicenseKey(value)
        validateForm(value)
    }

    const handleActivateLicense = () => {
        const isFormValid = validateForm(licenseKey)
        if (isFormValid) {
            // todo: call api
        }
    }

    useEffect(() => {
        registerShortcut({ keys: ['Enter'], callback: handleActivateLicense })
        return () => {
            unregisterShortcut(['Enter'])
        }
    }, [])

    return (
        <form className="flexbox-col p-36 dc__gap-32 w-400 br-12 bg__modal--primary border__primary">
            <div className="flexbox-col dc__gap-4">
                <div className="fs-20 lh-1-5 fw-7 cn-9 font-merriweather">BharatPe</div>
                <div className="fs-16 lh-1-5 cn-8 fw-4">Enter new enterprise license key</div>
            </div>
            <div className="flexbox-col dc__gap-16">
                <InstallationFingerprintInfo installationFingerprint="3ff0d8be-e7f2-4bf4-9c3f-70ec904b51f4" />
                <CustomInput
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
                <Button dataTestId="activate-license" text="Activate" fullWidth />
                <div className="flexbox dc__align-items-center dc__content-space">
                    <span className="fs-13 cn-9 lh-20 fw-4">Don’t have license key?</span>
                    <Button
                        dataTestId="get-license"
                        text="Get license"
                        variant={ButtonVariantType.text}
                        onClick={handleActivateLicense}
                    />
                </div>
            </div>
        </form>
    )
}

export default ActivateLicenseDialog
