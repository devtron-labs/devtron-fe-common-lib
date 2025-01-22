import { ConfirmationModal, ConfirmationModalVariantType } from '../ConfirmationModal'
import { UnsavedChangesDialogProps } from './types'

const UnsavedChangesDialog = ({ showUnsavedChangesDialog, handleClose, handleProceed }: UnsavedChangesDialogProps) => (
    <ConfirmationModal
        showConfirmationModal={showUnsavedChangesDialog}
        handleClose={handleClose}
        variant={ConfirmationModalVariantType.warning}
        shouldCloseOnEscape={false}
        title="Unsaved changes available"
        subtitle="Unsaved changes will be lost, are you sure you want to close the window?"
        buttonConfig={{
            primaryButtonConfig: {
                onClick: handleProceed,
                text: 'Discard changes',
            },
            secondaryButtonConfig: {
                onClick: handleClose,
                text: 'Cancel',
            },
        }}
    />
)

export default UnsavedChangesDialog
