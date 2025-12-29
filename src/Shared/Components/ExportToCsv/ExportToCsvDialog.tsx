import { DetailsProgressing, VisibleModal } from '@Common/index'
import { ComponentSizeType } from '@Shared/constants'

import { Button, ButtonStyleType, ButtonVariantType } from '../Button'
import { GenericSectionErrorState } from '../GenericSectionErrorState'
import { Icon } from '../Icon'
import { ExportToCsvDialogProps } from './types'

const ExportToCsvDialog = ({
    exportDataError,
    isLoading,
    initiateDownload,
    handleCancelRequest,
}: ExportToCsvDialogProps) => {
    const renderExportStatus = () => {
        if (exportDataError) {
            return (
                <GenericSectionErrorState
                    title="Unable to export data"
                    description="Encountered an error while trying to export. Please try again. If error persists then try after
                        some time."
                    buttonText=""
                    subTitle=""
                />
            )
        }

        if (isLoading) {
            return (
                <DetailsProgressing size={32} loadingText="Preparing export..." fullHeight>
                    <span className="fs-13 fw-4">Please do not reload or press the browser back button.</span>
                </DetailsProgressing>
            )
        }

        return (
            <div className="export-success bg__primary flex column cn-9 h-100 lh-20">
                <Icon name="ic-success" color={null} size={32} />
                <span className="fs-14 fw-6 mt-8">Your export is ready</span>
                <span className="fs-13 fw-4"> If download does not start automatically,</span>
                <Button
                    text="click here to download manually."
                    onClick={initiateDownload}
                    dataTestId="manual-download"
                    variant={ButtonVariantType.text}
                    size={ComponentSizeType.medium}
                />
            </div>
        )
    }

    const renderModalCTA = () => (
        <>
            <Button
                variant={ButtonVariantType.secondary}
                size={ComponentSizeType.medium}
                style={ButtonStyleType.neutral}
                onClick={handleCancelRequest}
                text={isLoading ? 'Cancel' : 'Close'}
                dataTestId="close-export-csv-button"
            />
            {!isLoading && exportDataError && (
                <Button
                    size={ComponentSizeType.medium}
                    onClick={initiateDownload}
                    text="Retry"
                    dataTestId="retry-export-csv-button"
                />
            )}
        </>
    )

    return (
        <VisibleModal className="export-to-csv-modal" data-testid="export-to-csv-modal">
            <div className="modal__body mt-40 p-0">
                <h2 className="cn-9 fw-6 fs-16 m-0 dc__border-bottom px-20 py-12">Export to CSV</h2>
                <div className="py-16 flex px-20">{renderExportStatus()}</div>
                <div className="flex right dc__gap-12 dc__border-top py-16 px-20">{renderModalCTA()}</div>
            </div>
        </VisibleModal>
    )
}

export default ExportToCsvDialog
