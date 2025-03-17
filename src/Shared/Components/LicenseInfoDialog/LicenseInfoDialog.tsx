import { ChangeEvent, useState } from 'react'
import { SegmentedControl } from '@Common/index'
import { ComponentSizeType } from '@Shared/constants'
import { AboutDevtron, LicenseInfo } from './LicenseInfoDialog.components'
import { Button } from '../Button'
import { LicenseInfoDialogType } from './types'
import { ABOUT_DEVTRON_TABS } from './constants'
import ActivateLicenseDialog from './UpdateLicenseDialog'
import './licenseInfoDialog.scss'

const LicenseInfoDialog = () => {
    const [dialogType, setDialogType] = useState<LicenseInfoDialogType>(LicenseInfoDialogType.ABOUT)

    const handleChangeDialogType = (e: ChangeEvent<HTMLInputElement>) => {
        setDialogType(e.target.value as LicenseInfoDialogType)
    }

    const handleUpdateLicenseClick = () => {
        setDialogType(LicenseInfoDialogType.UPDATE)
    }

    return dialogType === LicenseInfoDialogType.UPDATE ? (
        <ActivateLicenseDialog />
    ) : (
        <div className="license-info-dialog w-400 br-12 bg__modal--primary border__primary">
            {/* Header */}
            <div className="px-24 pt-24 pb-8">
                <SegmentedControl
                    name="about-devtron-segmented-control"
                    tabs={ABOUT_DEVTRON_TABS}
                    initialTab={dialogType}
                    onChange={handleChangeDialogType}
                    rootClassName="h-32 w-100"
                />
            </div>
            {/* Body */}
            <div className="p-24 mxh-500 overflow-auto">
                {dialogType === LicenseInfoDialogType.ABOUT ? (
                    <AboutDevtron />
                ) : (
                    <LicenseInfo handleUpdateLicenseClick={handleUpdateLicenseClick} />
                )}
            </div>
            {/* Footer */}
            <div className="flex px-24 py-20 dc__content-end">
                <Button dataTestId="license-info-okay" text="Okay" size={ComponentSizeType.medium} />
            </div>
        </div>
    )
}

export default LicenseInfoDialog
