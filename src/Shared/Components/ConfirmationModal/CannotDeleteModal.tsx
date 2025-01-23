import ConfirmationModal from './ConfirmationModal'
import { ConfirmationModalVariantType, CannotDeleteModalProps } from './types'

export const CannotDeleteModal = ({
    title,
    component,
    description,
    onClickOkay,
    showCannotDeleteDialogModal,
}: CannotDeleteModalProps) => (
    <ConfirmationModal
        variant={ConfirmationModalVariantType.info}
        title={`Cannot delete ${component} '${title}'`}
        subtitle={description}
        buttonConfig={{
            primaryButtonConfig: {
                text: 'Okay',
                onClick: onClickOkay,
            },
        }}
        showConfirmationModal={showCannotDeleteDialogModal}
        handleClose={onClickOkay}
    />
)
