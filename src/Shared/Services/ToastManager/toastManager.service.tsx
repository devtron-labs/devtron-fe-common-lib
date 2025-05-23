/*
 * Copyright (c) 2024. Devtron Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// eslint-disable-next-line no-restricted-imports
import { toast, ToastContainer, ToastOptions } from 'react-toastify'

import { TOAST_BASE_CONFIG, TOAST_VARIANT_TO_CONFIG_MAP } from './constants'
import { ToastContent } from './ToastContent'
import { ToastProps, ToastVariantType } from './types'

import './toastManager.scss'

/**
 * Service for handling toast across the application
 *
 * Note: The application needs to have `ToastManagerContainer` at the root
 * level for the toast to work
 *
 * @example Default Usage
 * ```ts
 * ToastManager.showToast({
 *   description: 'Lorem ipsum'
 * })
 * ```
 *
 * @example Custom Title
 * ```ts
 * ToastManager.showToast({
 *   description: 'Lorem ipsum',
 *   title: 'Toast title'
 * })
 * ```
 *
 * @example With Button
 * ```ts
 * ToastManager.showToast({
 *   description: 'Lorem ipsum',
 *   buttonProps: {
 *     dataTestId: 'toast-btn',
 *     text: 'Reload',
 *     startIcon: <ICArrowClockwise />
 *   }
 * })
 * ```
 *
 * @example Auto close disabled
 * ```ts
 * ToastManager.showToast({
 *   description: 'Lorem ipsum',
 *   toastOptions: {
 *     autoClose: false,
 *   },
 * })
 * ```
 *
 * @example Custom progress bar color
 * ```ts
 * ToastManager.showToast({
 *   description: 'Lorem ipsum',
 *   progressBarBg: 'var(--N700)',
 * })
 * ```
 *
 * @example Custom icon
 * ```ts
 * ToastManager.showToast({
 *   description: 'Lorem ipsum',
 *   icon: <ICCube />,
 * })
 * ```
 */
class ToastManager {
    // eslint-disable-next-line no-use-before-define
    static #instance: ToastManager

    public static get instance(): ToastManager {
        if (!ToastManager.#instance) {
            ToastManager.#instance = new ToastManager()
        }

        return ToastManager.#instance
    }

    /**
     * Handler for showing the toast
     */
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
                progressStyle: {
                    background: customProgressBarBg || progressBarBg,
                },
                // Show the progress bar if the auto close is disabled
                ...(options.autoClose === false
                    ? {
                          progress: 1,
                      }
                    : {}),
            },
        )
    }

    /**
     * Handler for dismissing an existing toast
     */
    dismissToast = toast.dismiss

    /**
     * Handler for checking if the toast is active
     */
    isToastActive = toast.isActive
}

export const ToastManagerContainer = () => <ToastContainer {...TOAST_BASE_CONFIG} />

export default ToastManager.instance
