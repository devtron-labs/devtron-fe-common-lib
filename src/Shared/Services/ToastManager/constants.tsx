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
import { ToastOptions, ToastContainerProps } from 'react-toastify'
import { ReactComponent as ICInfoFilled } from '@Icons/ic-info-filled.svg'
import { ReactComponent as ICSuccess } from '@Icons/ic-success.svg'
import { ReactComponent as ICError } from '@Icons/ic-error.svg'
import { ReactComponent as ICWarning } from '@Icons/ic-warning.svg'
import { ReactComponent as ICLocked } from '@Icons/ic-locked.svg'
import { ReactComponent as ICCross } from '@Icons/ic-cross.svg'
import { Button, ButtonStyleType, ButtonVariantType } from '@Shared/Components'
import { ComponentSizeType } from '@Shared/constants'
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
        <div className="custom-toast__close-btn">
            <Button
                icon={<ICCross className="fcn-0" />}
                onClick={closeToast}
                dataTestId="close-toast"
                ariaLabel="Close toast"
                size={ComponentSizeType.xs}
                variant={ButtonVariantType.borderLess}
                style={ButtonStyleType.neutral}
                showAriaLabelInTippy={false}
            />
        </div>
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
