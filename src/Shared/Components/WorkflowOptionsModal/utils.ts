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

import { PipelineType, WorkflowNodeType } from '@Common/Types'
import { ChangeCIPayloadType, CIPipelineNodeType, TriggerType } from '@Shared/types'

import { SOURCE_TYPE_CARD_VARIANTS } from './constants'
import { SourceTypeCardProps, WorkflowOptionsModalProps } from './types'

export const getSwitchToWebhookPayload = (changeCIPayload: ChangeCIPayloadType) => ({
    appId: changeCIPayload.appId,
    pipelines: [
        {
            // name and triggerType are useless to backend for this case
            name: 'change-webhook-ci',
            triggertype: TriggerType.Manual,
            appWorkflowId: changeCIPayload.appWorkflowId,
            environmentId: -1,
            id: 0,
            parentPipelineType: PipelineType.WEBHOOK,
            switchFromCiPipelineId: changeCIPayload.switchFromCiPipelineId,
        },
    ],
})

export const getCurrentPipelineType = ({
    workflows,
    changeCIPayload,
}: Required<Pick<WorkflowOptionsModalProps, 'workflows' | 'changeCIPayload'>>): SourceTypeCardProps['type'] => {
    if (!workflows || !changeCIPayload) {
        return null
    }

    const currentWorkflow = workflows.find((workflow) => +workflow.id === changeCIPayload.appWorkflowId)
    const currentCIPipeline = currentWorkflow.nodes.find((node) => node.type === WorkflowNodeType.CI)
    const isWebhook = currentWorkflow.nodes.some((node) => node.type === WorkflowNodeType.WEBHOOK)

    if (isWebhook) {
        return WorkflowNodeType.WEBHOOK
    }

    if (currentCIPipeline) {
        if (currentCIPipeline.isJobCI) {
            return CIPipelineNodeType.JOB_CI
        }

        if (currentCIPipeline.isLinkedCI) {
            return CIPipelineNodeType.LINKED_CI
        }

        if (currentCIPipeline.isExternalCI) {
            return CIPipelineNodeType.EXTERNAL_CI
        }

        if (currentCIPipeline.isLinkedCD) {
            return CIPipelineNodeType.LINKED_CD
        }
    }

    return CIPipelineNodeType.CI
}

export const getBuildWorkflowCardsConfig = ({
    currentPipelineType,
    changeCIPayload,
    isAppGroup,
}: {
    currentPipelineType: CIPipelineNodeType | WorkflowNodeType.WEBHOOK
} & Required<Pick<WorkflowOptionsModalProps, 'changeCIPayload' | 'isAppGroup'>>) =>
    Object.values(SOURCE_TYPE_CARD_VARIANTS.BUILD)
        .map<Pick<SourceTypeCardProps, 'title' | 'subtitle' | 'type' | 'icons' | 'dataTestId' | 'disabled'>>(
            ({ type, ...restKeys }) => {
                const hideCard =
                    currentPipelineType === type ||
                    (type === CIPipelineNodeType.JOB_CI && !window._env_.ENABLE_CI_JOB) ||
                    (type === CIPipelineNodeType.CI_CD && (isAppGroup || !!changeCIPayload))

                return !hideCard
                    ? {
                          ...restKeys,
                          type,
                          disabled: type === CIPipelineNodeType.JOB_CI && isAppGroup,
                      }
                    : null
            },
        )
        .filter(Boolean)

export const getReceiveWorkflowCardsConfig = ({
    currentPipelineType,
    linkedCDSourceVariant,
    isAppGroup,
}: {
    currentPipelineType: CIPipelineNodeType | WorkflowNodeType.WEBHOOK
} & Required<Pick<WorkflowOptionsModalProps, 'linkedCDSourceVariant' | 'isAppGroup'>>) => {
    const config = Object.values(SOURCE_TYPE_CARD_VARIANTS.RECEIVE)
        .map<Pick<SourceTypeCardProps, 'title' | 'subtitle' | 'type' | 'icons' | 'dataTestId' | 'disabled'>>(
            ({ type, ...restKeys }) => {
                const hideCard = currentPipelineType === type

                return !hideCard
                    ? {
                          ...restKeys,
                          type,
                          disabled: isAppGroup,
                      }
                    : null
            },
        )
        .filter(Boolean)

    if (currentPipelineType !== CIPipelineNodeType.LINKED_CD) {
        config.push(linkedCDSourceVariant)
    }

    return config
}

export const getJobWorkflowCardsConfig = ({
    currentPipelineType,
    isAppGroup,
}: {
    currentPipelineType: CIPipelineNodeType | WorkflowNodeType.WEBHOOK
} & Required<Pick<WorkflowOptionsModalProps, 'isAppGroup'>>) =>
    Object.values(SOURCE_TYPE_CARD_VARIANTS.JOB)
        .map<Pick<SourceTypeCardProps, 'title' | 'subtitle' | 'type' | 'icons' | 'dataTestId' | 'disabled'>>(
            ({ type, ...restKeys }) => {
                const hideCard =
                    currentPipelineType === type || (type === CIPipelineNodeType.JOB_CI && !window._env_.ENABLE_CI_JOB)

                return !hideCard
                    ? {
                          ...restKeys,
                          type,
                          disabled: type === CIPipelineNodeType.JOB_CI && isAppGroup,
                      }
                    : null
            },
        )
        .filter(Boolean)
