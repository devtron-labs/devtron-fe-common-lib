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
import { useHistory } from 'react-router-dom'
import { ServerErrors } from '@Common/ServerError'
import { showError } from '@Common/Helper'
import { ConfirmationModalVariantType, DeleteComponentModalProps } from './types'
import ConfirmationModal from './ConfirmationModal'

export const DeleteConfirmationModal: React.FC<DeleteComponentModalProps> = ({
    title,
    description,
    showConfirmationModal,
    disabled,
    onDelete,
    dataTestId,
    component = '',
    url = '',
    reload,
    closeConfirmationModal,
    renderCannotDeleteConfirmationSubTitle,
    errorCodeToShowCannotDeleteDialog,
    successToastMessage,
    isLoading,
    isForceDelete = false,
}: DeleteComponentModalProps) => {
    const history = useHistory()
    const [showCannotDeleteDialogModal, setCannotDeleteDialogModal] = useState(false)
    const [isDeleting, setDeleting] = useState(isLoading)

    const handleDelete = async () => {
        setDeleting(true)
        try {
            await onDelete()
            ToastManager.showToast({
                variant: ToastVariantType.success,
                description: successToastMessage ?? 'Successfully deleted',
            })
            if (url) {
                history.push(url)
            }
            reload()
            closeConfirmationModal()
        } catch (serverError) {
            if (serverError instanceof ServerErrors && serverError.code === errorCodeToShowCannotDeleteDialog) {
                setCannotDeleteDialogModal(true)
                closeConfirmationModal()
            } else {
                showError(serverError)
            }
        } finally {
            setDeleting(false)
        }
    }

    const handleConfirmation = () => setCannotDeleteDialogModal(false)

    const renderCannotDeleteDialogModal = () => (
        <ConfirmationModal
            variant={ConfirmationModalVariantType.info}
            title={`Cannot delete ${component} '${title}'`}
            subtitle={renderCannotDeleteConfirmationSubTitle}
            buttonConfig={{
                primaryButtonConfig: {
                    text: 'Okay',
                    onClick: handleConfirmation,
                },
            }}
            showConfirmationModal={showCannotDeleteDialogModal}
            handleClose={handleConfirmation}
        />
    )

    const renderSubtitle = () => {
        if (isForceDelete)
            return (
                <>
                    <p className="mt-12 mb-12 p-8 dc__break-word bg__tertiary">Error: {description}</p>
                    <p>Do you want to force delete?</p>
                </>
            )
        return description ?? `Are you sure you want to delete this ${component}?`
    }

    const renderDeleteModal = () => (
        <ConfirmationModal
            variant={ConfirmationModalVariantType.delete}
            title={isForceDelete ? title : `Delete ${component} '${title}'`}
            subtitle={renderSubtitle()}
            buttonConfig={{
                secondaryButtonConfig: {
                    text: 'Cancel',
                    onClick: closeConfirmationModal,
                },
                primaryButtonConfig: {
                    text: `${isForceDelete ? 'Force Delete' : 'Delete'}`,
                    onClick: handleDelete,
                    isLoading: isDeleting,
                    disabled: isLoading || disabled,
                },
            }}
            showConfirmationModal={showConfirmationModal}
            handleClose={closeConfirmationModal}
            dataTestId={dataTestId}
        />
    )

    return (
        <>
            {renderDeleteModal()}
            {renderCannotDeleteDialogModal()}
        </>
    )
}
