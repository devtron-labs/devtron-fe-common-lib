import ConfirmationModal from './ConfirmationModal'
import { ConfirmationModalVariantType, CannotDeleteModalProps } from './types'

export const CannotDeleteModal = ({ title, component, subtitle, closeConfirmationModal }: CannotDeleteModalProps) => (
    <ConfirmationModal
        variant={ConfirmationModalVariantType.info}
        title={`Cannot delete ${component} '${title}'`}
        subtitle={subtitle}
        buttonConfig={{
            primaryButtonConfig: {
                text: 'Okay',
                onClick: closeConfirmationModal,
            },
        }}
        handleClose={closeConfirmationModal}
    />
)
