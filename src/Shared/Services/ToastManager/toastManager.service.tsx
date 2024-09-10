import { toast, ToastOptions } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { ReactComponent as ICClose } from '@Icons/ic-close.svg'
import { Button, ButtonStyleType, ButtonVariantType } from '@Shared/Components'
import { ComponentSizeType } from '@Shared/constants'
import { ToastProps, ToastVariantType } from './types'
import './toastManager.scss'
import { TOAST_VARIANT_TO_CONFIG_MAP } from './constants'

export const ToastContent = ({ title, description, buttonProps }: Omit<ToastProps, 'variant'>) => (
    <div className="flexbox-col dc__gap-8">
        <div className="flexbox-col dc__gap-4">
            <h3 className="m-0 fs-13 fw-6 lh-20 cn-0 dc__truncate">{title}</h3>
            {description && <p className="fs-12 fw-4 lh-18 m-0 dc__truncate--clamp-6">{description}</p>}
        </div>
        {buttonProps && (
            <Button
                {...buttonProps}
                variant={ButtonVariantType.text}
                size={ComponentSizeType.small}
                style={ButtonStyleType.neutral}
            />
        )}
    </div>
)

class ToastManager {
    // eslint-disable-next-line no-use-before-define
    static #instance: ToastManager

    constructor() {
        toast.configure({
            autoClose: 5000,
            hideProgressBar: false,
            pauseOnHover: true,
            pauseOnFocusLoss: true,
            closeOnClick: false,
            newestOnTop: true,
            toastClassName: 'custom-toast',
            bodyClassName: 'custom-toast__body',
            closeButton: ({ closeToast }) => (
                <ICClose className="icon-dim-24 p-4 flex dc__no-shrink fcn-0" onClick={closeToast} />
            ),
        })
    }

    public static get instance(): ToastManager {
        if (!ToastManager.#instance) {
            ToastManager.#instance = new ToastManager()
        }

        return ToastManager.#instance
    }

    // eslint-disable-next-line class-methods-use-this
    showToast = (
        { variant = ToastVariantType.info, ...toastProps }: ToastProps,
        options: Pick<ToastOptions, 'autoClose'> = {},
    ) => {
        const { icon, type } = TOAST_VARIANT_TO_CONFIG_MAP[variant]

        return toast(<ToastContent {...toastProps} />, {
            ...options,
            icon: () => <div className="dc__no-shrink flex dc__fill-available-space icon-dim-20">{icon}</div>,
            type,
        })
    }
}

export default ToastManager.instance
