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

/**
 * Props for the ConfirmationModal component.
 * Supports optional configuration mode with conditional properties.
 *
 * @template isConfig - Boolean flag to determine if configuration mode is enabled.
 *                      When `false`, `handleClose` and `showConfirmationModal` are required.
 */
export type ConfirmationModalProps<isConfig extends boolean = false> = PropsWithChildren<{
    /**
     * Title of the confirmation modal.
     */
    title: string
    /**
     * Optional subtitle or additional description.
     * Accepts ReactNode to support text or custom elements.
     */
    subtitle?: ReactNode
    /**
     * Determines if the modal should close when the Escape key is pressed.
     * @default true
     */
    shouldCloseOnEscape?: boolean
    /**
     * Configuration object for confirmation behavior.
     */
    confirmationConfig?: ConfirmationConfigType
}> &
    ButtonConfigAndVariantType<isConfig> &
    (isConfig extends false
        ? {
              /**
               * Function to handle modal close action.
               * Accepts an optional SyntheticEvent.
               */
              handleClose: (e?: SyntheticEvent) => void
              /**
               * Boolean flag to control the visibility of the confirmation modal.
               */
              showConfirmationModal: boolean
          }
        : {})

export type ConfirmationModalBodyProps = Omit<ConfirmationModalProps, 'showConfirmationModal'>

/**
 * Props for the DeleteComponentModal component.
 * This interface extends a subset of `ConfirmationModalProps` to configure
 * the confirmation modal behavior and allows additional customization options.
 */
export interface DeleteComponentModalProps
    extends Partial<
        Pick<ConfirmationModalProps, 'title' | 'subtitle' | 'showConfirmationModal' | 'children' | 'confirmationConfig'>
    > {
    // Required Props
    /**
     * Function to close the confirmation modal.
     */
    closeConfirmationModal: () => void
    /**
     * Function to handle the delete action.
     */
    onDelete: () => void

    // Optional Customization
    /**
     * Custom text for the primary action button. Default is "Delete".
     */
    primaryButtonText?: string
    /**
     * Name of the component being deleted.
     */
    component?: string
    /**
     * Custom success message displayed upon successful deletion.
     */
    successToastMessage?: string
    /**
     * Boolean indicating if the delete action is in progress.
     */
    isLoading?: boolean
    /**
     * Custom ReactNode to render a subtitle when the component cannot be deleted.
     */
    renderCannotDeleteConfirmationSubTitle?: ReactNode
    /**
     * Error code that triggers the "Cannot Delete" dialog.
     */
    errorCodeToShowCannotDeleteDialog?: number
    /**
     *
     * Function to handle error
     */
    handleError?: (error) => void
    // Additional Configuration
    /**
     * Boolean to determine if event propagation should be stopped.
     */
    shouldStopPropagation?: boolean
    /**
     * Boolean to disable the delete action.
     */
    disabled?: boolean
}

/**
 * Props for the CannotDeleteModal component.
 * This interface extends selected properties from `DeleteComponentModalProps`
 * and `ConfirmationModalProps` to configure the "Cannot Delete" modal.
 */
export interface CannotDeleteModalProps
    extends Partial<Pick<DeleteComponentModalProps, 'component' | 'closeConfirmationModal'>>,
        Partial<Pick<ConfirmationModalProps, 'title' | 'subtitle'>> {
    showCannotDeleteDialogModal: boolean
}

/**
 * Props for the ForceDeleteConfirmation component.
 * This interface extends selected properties from `DeleteComponentModalProps`
 * and `ConfirmationModalProps` to configure the force delete confirmation modal.
 */
export interface ForceDeleteConfirmationProps
    extends Partial<Pick<DeleteComponentModalProps, 'onDelete' | 'showConfirmationModal' | 'closeConfirmationModal'>>,
        Partial<Pick<ConfirmationModalProps, 'title' | 'subtitle'>> {}
