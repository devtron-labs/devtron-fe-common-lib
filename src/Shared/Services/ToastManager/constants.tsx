import { ReactElement } from 'react'
import { ToastOptions } from 'react-toastify'
import { ReactComponent as ICInfoFilled } from '@Icons/ic-info-filled.svg'
import { ReactComponent as ICSuccess } from '@Icons/ic-success.svg'
import { ReactComponent as ICError } from '@Icons/ic-error.svg'
import { ReactComponent as ICWarning } from '@Icons/ic-warning.svg'
import { ReactComponent as ICLocked } from '@Icons/ic-locked.svg'
import { ReactComponent as ICSparkles } from '@Icons/ic-sparkles.svg'
import { ToastVariantType } from './types'

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
        type: 'info',
    },
    [ToastVariantType.updateAvailable]: {
        icon: <ICSparkles />,
        type: 'info',
    },
}
