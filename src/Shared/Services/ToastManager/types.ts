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

import { ReactElement } from 'react'

import { SupportedKeyboardKeysType } from '@Common/Hooks'
import { ButtonComponentType, ButtonProps } from '@Shared/Components'

export enum ToastVariantType {
    info = 'info',
    success = 'success',
    error = 'error',
    warn = 'warn',
    notAuthorized = 'notAuthorized',
    shortcut = 'shortcut',
}

export interface ShortcutToastProps {
    variant: ToastVariantType.shortcut
    /**
     * Text to display along the shortcuts in the toast
     * Example: "Press [S] to switch context"
     */
    text: string
    /**
     * The shortcuts to be displayed in the toast
     * Note: The shortcuts should be in the format of `['Ctrl', 'A']
     */
    shortcuts: SupportedKeyboardKeysType[]
}

export interface BaseToastProps {
    /**
     * Title for the toast
     * If not provided, defaults to a value based on the selected variant
     */
    title?: string
    /**
     * Description for the toast
     */
    description: string
    /**
     * Custom icon for the toast to override the icon based on variant
     */
    icon?: ReactElement
    /**
     * Variant for the toast
     *
     * @default ToastVariantType.info
     */
    variant?: Exclude<ToastVariantType, ToastVariantType.shortcut>
    /**
     * Props for the action button to be displayed in the toast
     *
     * Note: Size, variant and style are hard-coded and cannot be overridden
     */
    buttonProps?: ButtonProps<ButtonComponentType>
    /**
     * Custom progress bar color
     */
    progressBarBg?: string
}

export type ToastProps =
    | (BaseToastProps & Partial<Record<Exclude<keyof ShortcutToastProps, 'variant'>, never>>)
    | (ShortcutToastProps & Partial<Record<Exclude<keyof BaseToastProps, 'variant'>, never>>)

export interface ShortcutToastContentProps {
    text: string
    shortcuts: SupportedKeyboardKeysType[]
}
