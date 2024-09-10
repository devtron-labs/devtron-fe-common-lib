import { toast, ToastContainer, ToastOptions } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ToastProps, ToastVariantType } from './types'
import { TOAST_BASE_CONFIG, TOAST_VARIANT_TO_CONFIG_MAP } from './constants'
import { ToastContent } from './ToastContent'
import './toastManager.scss'

class ToastManager {
    // eslint-disable-next-line no-use-before-define
    static #instance: ToastManager

    public static get instance(): ToastManager {
        if (!ToastManager.#instance) {
            ToastManager.#instance = new ToastManager()
        }

        return ToastManager.#instance
    }

    // eslint-disable-next-line class-methods-use-this
    showToast = (
        {
            variant = ToastVariantType.info,
            icon: customIcon,
            title,
            description,
            buttonProps,
            progressBarBg: customProgressBarBg,
        }: ToastProps,
        options: Pick<ToastOptions, 'autoClose'> = {},
    ) => {
        const { icon, type, title: defaultTitle, progressBarBg } = TOAST_VARIANT_TO_CONFIG_MAP[variant]

        return toast(
            <ToastContent title={title || defaultTitle} description={description} buttonProps={buttonProps} />,
            {
                ...options,
                icon: () => (
                    <div className="dc__no-shrink flex dc__fill-available-space icon-dim-20">{customIcon ?? icon}</div>
                ),
                type,
                // Show the progress bar if the auto close is disabled
                ...(options.autoClose === false
                    ? {
                          progress: 1,
                          progressStyle: {
                              background: customProgressBarBg || progressBarBg,
                          },
                      }
                    : {}),
            },
        )
    }
}

export const ToastManagerContainer = () => <ToastContainer {...TOAST_BASE_CONFIG} />

export default ToastManager.instance
