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
import { showError } from '@Common/Helper'
import { ConfirmationModalVariantType, DeleteConfirmationModalProps } from './types'
import ConfirmationModal from './ConfirmationModal'
import { CannotDeleteModal } from './CannotDeleteModal'
import { ForceDeleteConfirmationModal } from './ForceDeleteConfirmationModal'

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    title,
    subtitle = '',
    component = '',
    disabled,
    onDelete,
    showConfirmationModal,
    closeConfirmationModal,
    renderCannotDeleteConfirmationSubTitle,
    errorCodeToShowCannotDeleteDialog,
    successToastMessage,
    isLoading,
    shouldStopPropagation = false,
    primaryButtonText = 'Delete',
    confirmationConfig,
    onError,
    children,
}: DeleteConfirmationModalProps) => {
    const [isDeleting, setDeleting] = useState(isLoading)
    const [showCannotDeleteDialogModal, setCannotDeleteDialogModal] = useState(false)
    const [showForceDeleteModal, setForceDeleteModal] = useState(false)
    const [cannotDeleteText, setCannotDeleteText] = useState(renderCannotDeleteConfirmationSubTitle)

    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (shouldStopPropagation) e.stopPropagation()

        setDeleting(true)
        try {
            await onDelete()
            ToastManager.showToast({
                variant: ToastVariantType.success,
                description: successToastMessage || 'Successfully deleted',
            })
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
                closeConfirmationModal()
            } else if (typeof onError === 'function') {
                onError(serverError)
            } else {
                showError(serverError)
            }
        } finally {
            setDeleting(false)
        }
    }

    const handleCloseCannotDeleteModal = () => setCannotDeleteDialogModal(false)

    const handleCloseForceDeleteModal = () => setForceDeleteModal(false)

    const renderCannotDeleteDialogModal = () => (
        <CannotDeleteModal
            title={title}
            subtitle={cannotDeleteText}
            showCannotDeleteDialogModal={showCannotDeleteDialogModal}
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
            showConfirmationModal={showForceDeleteModal}
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
                },
                primaryButtonConfig: {
                    text: primaryButtonText,
                    onClick: handleDelete,
                    isLoading: isDeleting,
                    disabled: isLoading || disabled,
                },
            }}
            showConfirmationModal={showConfirmationModal}
            handleClose={closeConfirmationModal}
            confirmationConfig={confirmationConfig}
        >
            {children}
        </ConfirmationModal>
    )

    return (
        <>
            {renderDeleteModal()}
            {showCannotDeleteDialogModal && renderCannotDeleteDialogModal()}
            {showForceDeleteModal && renderForceDeleteModal()}
        </>
    )
}
