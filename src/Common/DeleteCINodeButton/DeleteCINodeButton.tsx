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

import { useState } from 'react'
import { ERROR_STATUS_CODE } from '@Common/Constants'
import { Button, ButtonStyleType, ButtonVariantType, DeleteConfirmationModal, Icon } from '@Shared/Components'
import { ComponentSizeType, DeleteComponentsName } from '@Shared/constants'
import { ToastManager, ToastVariantType } from '@Shared/index'
import { deleteWorkflow, savePipeline } from './utils'
import { DeleteCINodeButtonProps } from './types'
import { preventDefault, showError, stopPropagation } from '..'

export const DeleteCINodeButton = ({
    testId,
    showIconOnly = true,
    disabled = false,
    title,
    isJobView,
    deletePayloadConfig,
    onDelete,
    getWorkflows,
}: DeleteCINodeButtonProps) => {
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)

    const closeCIDeleteModal = (): void => {
        setShowDeleteModal(false)
    }

    const onClickDeleteShowModal = (e) => {
        stopPropagation(e)
        preventDefault(e)
        setShowDeleteModal(true)
    }

    const onDeleteWorkflow = async () => {
        try {
            const response = await deleteWorkflow(
                String(deletePayloadConfig.appId),
                Number(deletePayloadConfig.appWorkflowId),
            )
            if (response.errors) {
                const { errors } = response
                const { userMessage } = errors[0]
                ToastManager.showToast({
                    variant: ToastVariantType.error,
                    description: userMessage,
                })
                return
            }

            if (response.status.toLowerCase() === 'ok') {
                ToastManager.showToast({
                    variant: ToastVariantType.success,
                    description: 'Workflow Deleted',
                })
                getWorkflows()
            }
        } catch (error) {
            showError(error)
        }
    }

    const onClickDelete = async () => {
        const deletePayload = {
            action: 2, // To delete the pipeline
            appId: Number(deletePayloadConfig.appId),
            appWorkflowId: Number(deletePayloadConfig.appWorkflowId),
            ciPipeline: {
                id: Number(deletePayloadConfig.pipelineId),
                name: deletePayloadConfig.pipelineName,
            },
        }
        await savePipeline(deletePayload)
        if (typeof onDelete === 'function') {
            onDelete()
        }
        await onDeleteWorkflow()
    }

    const renderDeleteButton = () =>
        showIconOnly ? (
            <Button
                ariaLabel="Delete pipeline"
                variant={ButtonVariantType.borderLess}
                dataTestId={testId}
                size={ComponentSizeType.xxs_small_icon}
                showAriaLabelInTippy
                onClick={onClickDeleteShowModal}
                style={ButtonStyleType.negativeGrey}
                icon={<Icon name="ic-delete" color={null} strokeWidth={1} size={12} />}
                disabled={disabled}
                showTooltip
                tooltipProps={{
                    placement: 'right',
                    content: 'Delete Pipeline',
                }}
            />
        ) : (
            <Button
                dataTestId={testId}
                disabled={disabled}
                onClick={onClickDeleteShowModal}
                text="Delete Pipeline"
                style={ButtonStyleType.negative}
            />
        )

    const renderDeleteCIModal = () =>
        showDeleteModal && (
            <DeleteConfirmationModal
                title={title}
                component={isJobView ? DeleteComponentsName.Job : DeleteComponentsName.BuildPipeline}
                subtitle={`Are you sure you want to delete this pipeline from '${title}' ?`}
                closeConfirmationModal={closeCIDeleteModal}
                onDelete={onClickDelete}
                errorCodeToShowCannotDeleteDialog={ERROR_STATUS_CODE.BAD_REQUEST}
                renderCannotDeleteConfirmationSubTitle="Please delete deployment pipelines for this workflow first and try again."
                successToastMessage="Pipeline Deleted Successfully"
            />
        )

    return (
        <>
            {renderDeleteButton()}
            {renderDeleteCIModal()}
        </>
    )
}
