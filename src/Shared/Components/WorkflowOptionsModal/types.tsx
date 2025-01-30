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

import { ChangeCIPayloadType, CIPipelineNodeType, WorkflowType } from '@Shared/types'

interface LinkedCDSourceVariant {
    title: string
    subtitle: string
    image: string
    alt: string
    dataTestId: string
    type: string
}

export interface SourceTypeCardProps extends LinkedCDSourceVariant {
    handleCardAction: (e: React.MouseEvent | React.KeyboardEvent) => void
    disableInfo: string
    isDisabled?: boolean
}

export interface WorkflowOptionsModalProps {
    handleCloseWorkflowOptionsModal: () => void
    addCIPipeline: (type: CIPipelineNodeType, workflowId?: number | string) => void
    addWebhookCD: (workflowId?: number | string) => void
    addLinkedCD: (changeCIPayload?: ChangeCIPayloadType) => void
    showLinkedCDSource: boolean
    resetChangeCIPayload: () => void
    // ------------------ Optional types ------------------
    changeCIPayload?: ChangeCIPayloadType
    workflows?: WorkflowType[]
    getWorkflows?: () => void
    linkedCDSourceVariant?: LinkedCDSourceVariant
    isAppGroup?: boolean
}
