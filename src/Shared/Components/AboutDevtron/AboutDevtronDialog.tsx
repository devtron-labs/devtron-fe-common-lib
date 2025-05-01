import { ComponentSizeType } from '@Shared/constants'

import { Backdrop } from '../Backdrop'
import { Button } from '../Button'
import AboutDevtronBody from './AboutDevtronBody'

const AboutDevtronDialog = ({
    handleCloseLicenseInfoDialog,
    isFELibAvailable,
}: {
    handleCloseLicenseInfoDialog: () => void
    isFELibAvailable: boolean
}) => (
    <Backdrop onEscape={handleCloseLicenseInfoDialog}>
        <div className="flexbox-col w-400 br-12 bg__primary border__primary dc__m-auto mt-40">
            <div className="p-24">
                <AboutDevtronBody isFELibAvailable={isFELibAvailable} />
            </div>
            <div className="flex px-24 py-20 dc__content-end">
                <Button
                    dataTestId="license-info-okay"
                    text="Okay"
                    size={ComponentSizeType.medium}
                    onClick={handleCloseLicenseInfoDialog}
                />
            </div>
        </div>
    </Backdrop>
)

export default AboutDevtronDialog
