import { ReactElement, MouseEventHandler } from 'react'
import { ToastOptions, ToastContainerProps } from 'react-toastify'
import { ReactComponent as ICInfoFilled } from '@Icons/ic-info-filled.svg'
import { ReactComponent as ICSuccess } from '@Icons/ic-success.svg'
import { ReactComponent as ICError } from '@Icons/ic-error.svg'
import { ReactComponent as ICWarning } from '@Icons/ic-warning.svg'
import { ReactComponent as ICLocked } from '@Icons/ic-locked.svg'
import { ReactComponent as ICClose } from '@Icons/ic-close.svg'
import { ToastVariantType } from './types'

export const TOAST_BASE_CONFIG: ToastContainerProps = {
    autoClose: 5000,
    hideProgressBar: false,
    pauseOnHover: true,
    pauseOnFocusLoss: true,
    closeOnClick: false,
    newestOnTop: true,
    toastClassName: 'custom-toast',
    bodyClassName: 'custom-toast__body',
    closeButton: ({ closeToast }) => (
        <ICClose className="icon-dim-24 p-4 flex dc__no-shrink fcn-0" onClick={closeToast as MouseEventHandler} />
    ),
}

export const TOAST_VARIANT_TO_CONFIG_MAP: Record<
    ToastVariantType,
    {
        icon: ReactElement
    } & Pick<ToastOptions, 'type'>
> = {
    [ToastVariantType.info]: {
        icon: <ICInfoFilled />,
        type: 'info',
    },
    [ToastVariantType.success]: {
        icon: <ICSuccess />,
        type: 'success',
    },
    [ToastVariantType.error]: {
        icon: <ICError />,
        type: 'error',
    },
    [ToastVariantType.warn]: {
        icon: <ICWarning className="warning-icon-y5-imp" />,
        type: 'warning',
    },
    [ToastVariantType.notAuthorized]: {
        icon: <ICLocked />,
        type: 'warning',
    },
}
