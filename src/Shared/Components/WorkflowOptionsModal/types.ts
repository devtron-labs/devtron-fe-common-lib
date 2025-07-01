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

import { WorkflowNodeType } from '@Common/Types'
import { ChangeCIPayloadType, CIPipelineNodeType, WorkflowType } from '@Shared/types'
import { AppConfigProps } from '@Pages/index'

import { GenericModalProps } from '../GenericModal'
import { IconsProps } from '../Icon'

export interface SourceTypeCardProps {
    title: string
    subtitle: string
    dataTestId: string
    type: CIPipelineNodeType | WorkflowNodeType.WEBHOOK
    disabled?: boolean
    disableInfo: string
    icons: Pick<IconsProps, 'name' | 'color'>[]
    onCardAction: (e: React.MouseEvent | React.KeyboardEvent) => void
}

export interface WorkflowOptionsModalProps
    extends Required<Pick<AppConfigProps, 'isTemplateView'>>,
        Pick<GenericModalProps, 'open' | 'onClose'> {
    addCIPipeline: (type: CIPipelineNodeType, workflowId?: number | string) => void
    addWebhookCD: (workflowId?: number | string) => void
    addLinkedCD: (changeCIPayload?: ChangeCIPayloadType) => void
    showLinkedCDSource: boolean
    resetChangeCIPayload: () => void
    // ------------------ Optional types ------------------
    changeCIPayload?: ChangeCIPayloadType
    workflows?: WorkflowType[]
    getWorkflows?: () => void
    linkedCDSourceVariant?: Pick<SourceTypeCardProps, 'title' | 'subtitle' | 'type' | 'icons' | 'dataTestId'>
    isAppGroup?: boolean
}
