import { BackdropProps } from '../Backdrop'
import { ButtonProps } from '../Button'

export interface GenericModalProps extends Partial<Pick<BackdropProps, 'onEscape'>> {
    /** Unique identifier for the modal */
    name: string
    /** Controls whether the modal is visible or hidden */
    open: boolean
    /** Callback function triggered when the modal is closed */
    onClose: () => void
    /**
     * Width of the modal (in pixels).
     * @default 600
     */
    width?: 500 | 600 | 800
    /**
     * Determines if the modal should close when the user clicks outside of it (on the backdrop).
     * @default false
     */
    closeOnBackdropClick?: boolean
}

export interface GenericModalContextType extends Pick<GenericModalProps, 'name' | 'onClose'> {}

export interface GenericModalHeaderProps {
    title: string
}

export interface GenericModalFooterProps {
    buttonConfig?: {
        primaryButton?: ButtonProps
        secondaryButton?: ButtonProps
    }
    leftSideElement?: React.ReactNode
}
