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

import { useEffect, useMemo, useState } from 'react'

import { ReactComponent as ImgWorkflowOptionsModalHeader } from '@Images/workflow-options-modal-header.svg'
import { noop, showError } from '@Common/Helper'
import { PipelineType, WorkflowNodeType } from '@Common/Types'
import { ComponentSizeType } from '@Shared/constants'
import { saveCDPipeline, ToastManager, ToastVariantType } from '@Shared/Services'
import { CIPipelineNodeType } from '@Shared/types'

import { Button, ButtonStyleType, ButtonVariantType } from '../Button'
import { GenericModal } from '../GenericModal'
import { Icon } from '../Icon'
import { NO_ENV_FOUND, REQUEST_IN_PROGRESS, TOAST_MESSAGES } from './constants'
import SourceTypeCard from './SourceTypeCard'
import { SourceTypeCardProps, WorkflowOptionsModalProps } from './types'
import {
    getBuildWorkflowCardsConfig,
    getCurrentPipelineType,
    getJobWorkflowCardsConfig,
    getReceiveWorkflowCardsConfig,
    getSwitchToWebhookPayload,
} from './utils'

import './styles.scss'

const WorkflowOptionsModal = ({
    open,
    addCIPipeline,
    addWebhookCD,
    addLinkedCD,
    showLinkedCDSource,
    changeCIPayload,
    workflows,
    getWorkflows,
    resetChangeCIPayload,
    linkedCDSourceVariant,
    isAppGroup = false,
    isTemplateView,
    onClose,
}: Readonly<WorkflowOptionsModalProps>) => {
    // STATES
    const [loadingWebhook, setLoadingWebhook] = useState<boolean>(false)

    // CONSTANTS
    const currentPipelineType = useMemo(
        () => getCurrentPipelineType({ workflows, changeCIPayload }),
        // Expecting modal to be closed in case of workflows or changeCIPayload change
        [],
    )

    const buildWorkflowCards = useMemo(
        () => getBuildWorkflowCardsConfig({ currentPipelineType, changeCIPayload, isAppGroup }),
        [currentPipelineType, isAppGroup],
    )

    const receiveWorkflowCards = useMemo(
        () => getReceiveWorkflowCardsConfig({ currentPipelineType, linkedCDSourceVariant, isAppGroup }),
        [currentPipelineType, linkedCDSourceVariant, isAppGroup],
    )

    const jobWorkflowCards = useMemo(
        () => getJobWorkflowCardsConfig({ currentPipelineType, isAppGroup }),
        [currentPipelineType, isAppGroup],
    )

    // HANDLERS
    /**
     * Would be called in case user flow is completed like closing modal, changing CI to webhook with some cd pipelines
     * In other cases this would be done via closePipeline method in workflowEditor
     */
    const handleFlowCompletion = () => {
        onClose()
        resetChangeCIPayload()
    }

    const handleChangeToWebhook = () => {
        if (changeCIPayload) {
            const currentWorkflow = workflows.find((workflow) => +workflow.id === changeCIPayload.appWorkflowId)
            // This is in case when we already have deployments in workflow in the current workflow
            const containsCDPipeline = currentWorkflow.nodes.some((node) => node.type === WorkflowNodeType.CD)
            if (containsCDPipeline) {
                // Only need to disable it in case of error
                setLoadingWebhook(true)
                saveCDPipeline(getSwitchToWebhookPayload(changeCIPayload), {
                    isTemplateView,
                })
                    .then((response) => {
                        if (response.result) {
                            ToastManager.showToast({
                                variant: ToastVariantType.success,
                                description: TOAST_MESSAGES.SUCCESS_CHANGE_TO_WEBHOOK,
                            })
                            getWorkflows()
                            handleFlowCompletion()
                        }
                    })
                    .catch((error) => {
                        showError(error)
                        setLoadingWebhook(false)
                    })
                return
            }
        }
        addWebhookCD(changeCIPayload?.appWorkflowId || 0)
        onClose()
    }

    const handleCardAction: SourceTypeCardProps['onCardAction'] = (e) => {
        if (!(e.currentTarget instanceof HTMLDivElement)) {
            return
        }

        if ('key' in e && e.key !== 'Enter') {
            return
        }

        e.stopPropagation()
        const { pipelineType } = e.currentTarget.dataset

        if (pipelineType === PipelineType.WEBHOOK) {
            handleChangeToWebhook()
            return
        }

        if (linkedCDSourceVariant && pipelineType === linkedCDSourceVariant.type) {
            addLinkedCD(changeCIPayload)
            onClose()
            return
        }

        addCIPipeline(pipelineType as CIPipelineNodeType, changeCIPayload?.appWorkflowId ?? 0)
        onClose()
    }

    const getDisabledInfo = (requiredCIPipelineType: typeof currentPipelineType) => {
        if (!showLinkedCDSource && requiredCIPipelineType === CIPipelineNodeType.LINKED_CD) {
            return NO_ENV_FOUND
        }

        if (loadingWebhook) {
            return REQUEST_IN_PROGRESS
        }

        return null
    }

    // USE-EFFECTS
    useEffect(() => {
        if (changeCIPayload && workflows) {
            const currentWorkflow = workflows.find((workflow) => +workflow.id === changeCIPayload.appWorkflowId)
            if (!currentWorkflow) {
                handleFlowCompletion()
                ToastManager.showToast({
                    variant: ToastVariantType.error,
                    description: TOAST_MESSAGES.WORKFLOW_NOT_AVAILABLE,
                })
            }
        }
    }, [workflows, changeCIPayload])

    const resetStateToDefault = () => {
        setLoadingWebhook(false)
    }

    useEffect(() => {
        if (!open) {
            resetStateToDefault()
        }
    }, [open])

    // RENDERERS
    const renderSourceTypeCards = (title: string, cardsConfig: typeof buildWorkflowCards) =>
        !!cardsConfig.length && (
            <div className="flexbox-col dc__gap-8">
                <h4 className="m-0 fs-13 lh-16 fw-6 cn-7">{title}</h4>
                <div className="workflow-options-modal__cards-container dc__grid dc__gap-12">
                    {cardsConfig.map((props) => (
                        <SourceTypeCard
                            {...props}
                            onCardAction={handleCardAction}
                            disableInfo={getDisabledInfo(props.type)}
                        />
                    ))}
                </div>
            </div>
        )

    return (
        <GenericModal
            name="workflow-options-modal"
            open={open}
            onClose={loadingWebhook ? noop : handleFlowCompletion}
            onEscape={loadingWebhook ? noop : handleFlowCompletion}
            width={800}
            closeOnBackdropClick
        >
            <GenericModal.Body>
                <div className="flexbox-col h-500">
                    {/* HEADER */}
                    <div className="workflow-options-modal__header flex top dc__content-space dc__no-shrink p-24 dc__position-rel dc__overflow-hidden">
                        <ImgWorkflowOptionsModalHeader className="workflow-options-modal__img dc__position-abs dc__right-0" />
                        <div>
                            <h2 className="m-0 fs-20 lh-1-5 fw-6 cn-9">
                                {changeCIPayload ? 'Change image source' : 'Workflow templates'}
                            </h2>
                            <h3 className="m-0 fs-14 lh-1-5 fw-4 cn-7">
                                {changeCIPayload
                                    ? 'Deploy to environments in the workflow from another image source'
                                    : 'Select a template to create a workflow'}
                            </h3>
                        </div>
                        <Button
                            dataTestId="workflow-options-modal-close-button"
                            ariaLabel="workflow-options-modal-close-button"
                            icon={<Icon name="ic-close-large" color={null} />}
                            variant={ButtonVariantType.secondary}
                            style={ButtonStyleType.negativeGrey}
                            size={ComponentSizeType.medium}
                            onClick={onClose}
                            showAriaLabelInTippy={false}
                        />
                    </div>

                    {/* BODY */}
                    <div className="flex-grow-1 flexbox-col dc__gap-24 px-20 py-16 dc__overflow-auto">
                        {renderSourceTypeCards('Build Container Image', buildWorkflowCards)}
                        {renderSourceTypeCards('Receive Container Image', receiveWorkflowCards)}
                        {renderSourceTypeCards('Create Job', jobWorkflowCards)}
                    </div>
                </div>
            </GenericModal.Body>
        </GenericModal>
    )
}

export default WorkflowOptionsModal
