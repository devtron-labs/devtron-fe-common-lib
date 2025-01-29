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

import { PropsWithChildren, ReactElement, ReactNode, SyntheticEvent } from 'react'
import { ButtonProps } from '../Button'

export enum ConfirmationModalVariantType {
    info = 'info',
    delete = 'delete',
    warning = 'warning',
    custom = 'custom',
}

type CommonButtonProps<isConfig extends boolean, isCustomVariant extends boolean> = Pick<ButtonProps, 'text'> &
    Partial<Pick<ButtonProps, 'startIcon' | 'endIcon' | 'disabled'>> &
    (isConfig extends false ? { onClick: (...args: Partial<Parameters<ButtonProps['onClick']>>) => void } : {}) &
    (isCustomVariant extends true ? Pick<ButtonProps, 'style'> : {})

interface ConfirmationConfigType {
    identifier: string
    confirmationKeyword: string
}

type ButtonConfig<isConfig extends boolean, isCustomVariant extends boolean> =
    | {
          primaryButtonConfig: Pick<ButtonProps, 'isLoading'> & CommonButtonProps<isConfig, isCustomVariant>
          secondaryButtonConfig: CommonButtonProps<isConfig, isCustomVariant>
      }
    | {
          primaryButtonConfig: Pick<ButtonProps, 'isLoading'> & CommonButtonProps<isConfig, isCustomVariant>
          secondaryButtonConfig?: never
      }
    | {
          primaryButtonConfig?: never
          secondaryButtonConfig?: CommonButtonProps<isConfig, isCustomVariant>
      }

type ButtonConfigAndVariantType<isConfig extends boolean> =
    | {
          variant: Exclude<ConfirmationModalVariantType, ConfirmationModalVariantType.custom>
          Icon?: never
          buttonConfig: ButtonConfig<isConfig, false>
      }
    | {
          variant: ConfirmationModalVariantType.custom
          Icon: ReactElement
          buttonConfig: ButtonConfig<isConfig, true>
      }

export type ConfirmationModalProps<isConfig extends boolean = false> = PropsWithChildren<{
    title: string
    subtitle?: ReactNode
    /**
     * @default true
     */
    shouldCloseOnEscape?: boolean
    confirmationConfig?: ConfirmationConfigType
}> &
    ButtonConfigAndVariantType<isConfig> &
    (isConfig extends false
        ? {
              handleClose: (e?: SyntheticEvent) => void
              showConfirmationModal: boolean
          }
        : {})

export type ConfirmationModalBodyProps = Omit<ConfirmationModalProps, 'showConfirmationModal'>

export interface DeleteComponentModalProps
    extends Partial<
        Pick<ConfirmationModalProps, 'title' | 'subtitle' | 'showConfirmationModal' | 'children' | 'confirmationConfig'>
    > {
    // Required Props
    closeConfirmationModal: () => void
    onDelete: () => void

    // Optional Customization
    primaryButtonText?: string
    component?: string
    successToastMessage?: string
    isLoading?: boolean
    renderCannotDeleteConfirmationSubTitle?: ReactNode
    errorCodeToShowCannotDeleteDialog?: number
    reload?: () => void

    // Additional Configuration
    shouldStopPropagation?: boolean
    disabled?: boolean
    url?: string
}

export interface CannotDeleteModalProps
    extends Partial<Pick<DeleteComponentModalProps, 'component' | 'closeConfirmationModal'>>,
        Partial<Pick<ConfirmationModalProps, 'title' | 'subtitle'>> {
    showCannotDeleteDialogModal: boolean
}

export interface ForceDeleteConfirmationProps
    extends Partial<Pick<DeleteComponentModalProps, 'onDelete' | 'showConfirmationModal' | 'closeConfirmationModal'>>,
        Partial<Pick<ConfirmationModalProps, 'title' | 'subtitle'>> {}
