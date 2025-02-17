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

import React, { useState } from 'react'
import { ToastManager, ToastVariantType } from '@Shared/Services/ToastManager'
import { ServerErrors } from '@Common/ServerError'
import { showError, stopPropagation } from '@Common/Helper'
import { ConfirmationModalVariantType, DeleteConfirmationModalProps } from './types'
import ConfirmationModal from './ConfirmationModal'
import { CannotDeleteModal } from './CannotDeleteModal'
import { ForceDeleteConfirmationModal } from './ForceDeleteConfirmationModal'

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    title,
    subtitle = '',
    component = '',
    primaryButtonText = 'Delete',
    disabled,
    isDeleting,
    onDelete,
    onError,
    closeConfirmationModal,
    confirmationConfig,
    // Additional UI-related logic
    renderCannotDeleteConfirmationSubTitle,
    errorCodeToShowCannotDeleteDialog,
    successToastMessage,
    children,
}: DeleteConfirmationModalProps) => {
    const [showCannotDeleteDialogModal, setCannotDeleteDialogModal] = useState(false)
    const [showForceDeleteModal, setForceDeleteModal] = useState(false)
    const [cannotDeleteText, setCannotDeleteText] = useState(renderCannotDeleteConfirmationSubTitle)
    const [isLoading, setLoading] = useState(isDeleting)

    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (e) {
            stopPropagation(e)
        }

        setLoading(true)
        try {
            await onDelete()
            ToastManager.showToast({
                variant: ToastVariantType.success,
                description: successToastMessage || 'Successfully deleted',
            })
            setLoading(false)
            closeConfirmationModal()
        } catch (serverError) {
            if (serverError instanceof ServerErrors && serverError.code === errorCodeToShowCannotDeleteDialog) {
                setCannotDeleteDialogModal(true)
                if (
                    Array.isArray(serverError.errors) &&
                    serverError.errors.length > 0 &&
                    !renderCannotDeleteConfirmationSubTitle
                ) {
                    setCannotDeleteText(serverError.errors[0].userMessage as string)
                }
            } else if (typeof onError === 'function') {
                onError(serverError)
            } else {
                showError(serverError)
            }
            setLoading(false)
        }
    }

    const handleCloseCannotDeleteModal = () => {
        setCannotDeleteDialogModal(false)
        closeConfirmationModal()
    }

    const handleCloseForceDeleteModal = () => setForceDeleteModal(false)

    const renderCannotDeleteDialogModal = () => (
        <CannotDeleteModal
            title={title}
            subtitle={cannotDeleteText}
            closeConfirmationModal={handleCloseCannotDeleteModal}
            component={component}
        />
    )

    const renderForceDeleteModal = () => (
        <ForceDeleteConfirmationModal
            title={title}
            subtitle={subtitle}
            onDelete={onDelete}
            closeConfirmationModal={handleCloseForceDeleteModal}
        />
    )

    const renderDeleteModal = () => (
        <ConfirmationModal
            variant={ConfirmationModalVariantType.delete}
            title={`Delete ${component} '${title}'`}
            subtitle={subtitle || `Are you sure you want to delete this ${component} ?`}
            buttonConfig={{
                secondaryButtonConfig: {
                    text: 'Cancel',
                    onClick: closeConfirmationModal,
                    disabled: isDeleting || isLoading,
                },
                primaryButtonConfig: {
                    text: primaryButtonText,
                    onClick: handleDelete,
                    isLoading: isDeleting || isLoading,
                    disabled,
                },
            }}
            handleClose={closeConfirmationModal}
            confirmationConfig={confirmationConfig}
        >
            {children}
        </ConfirmationModal>
    )

    return (
        <>
            {!showCannotDeleteDialogModal && !showForceDeleteModal && renderDeleteModal()}
            {showCannotDeleteDialogModal && renderCannotDeleteDialogModal()}
            {showForceDeleteModal && renderForceDeleteModal()}
        </>
    )
}
