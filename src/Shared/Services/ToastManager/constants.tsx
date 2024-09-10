import { MouseEventHandler } from 'react'
import { ToastOptions, ToastContainerProps } from 'react-toastify'
import { ReactComponent as ICInfoFilled } from '@Icons/ic-info-filled.svg'
import { ReactComponent as ICSuccess } from '@Icons/ic-success.svg'
import { ReactComponent as ICError } from '@Icons/ic-error.svg'
import { ReactComponent as ICWarning } from '@Icons/ic-warning.svg'
import { ReactComponent as ICLocked } from '@Icons/ic-locked.svg'
import { ReactComponent as ICClose } from '@Icons/ic-close.svg'
import { ToastProps, ToastVariantType } from './types'

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
        <ICClose
            className="icon-dim-24 p-4 flex dc__no-shrink fcn-0 cursor"
            onClick={closeToast as MouseEventHandler}
        />
    ),
}

export const TOAST_VARIANT_TO_CONFIG_MAP: Record<
    ToastVariantType,
    Required<Pick<ToastProps, 'icon' | 'title' | 'progressBarBg'>> & Pick<ToastOptions, 'type'>
> = {
    [ToastVariantType.info]: {
        icon: <ICInfoFilled />,
        type: 'info',
        title: 'Information',
        progressBarBg: 'var(--B500)',
    },
    [ToastVariantType.success]: {
        icon: <ICSuccess />,
        type: 'success',
        title: 'Success',
        progressBarBg: 'var(--G500)',
    },
    [ToastVariantType.error]: {
        icon: <ICError />,
        type: 'error',
        title: 'Error',
        progressBarBg: 'var(--R500)',
    },
    [ToastVariantType.warn]: {
        icon: <ICWarning className="warning-icon-y5-imp" />,
        type: 'warning',
        title: 'Warning',
        progressBarBg: 'var(--Y500)',
    },
    [ToastVariantType.notAuthorized]: {
        icon: <ICLocked />,
        type: 'warning',
        title: 'Not authorized',
        progressBarBg: 'var(--Y500)',
    },
}
