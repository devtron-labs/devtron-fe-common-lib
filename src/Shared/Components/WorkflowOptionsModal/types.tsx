import { ChangeCIPayloadType, CIPipelineNodeType, WorkflowType } from '@Shared/types'

export interface SourceTypeCardProps {
    title: string
    subtitle: string
    image: string
    alt: string
    handleCardAction: (e: React.MouseEvent | React.KeyboardEvent) => void
    dataTestId: string
    type: string
    disableInfo: string
}

interface LinkedCDSourceVariant {
    title: string
    subtitle: string
    image: string
    alt: string
    dataTestId: string
    type: string
}

export interface WorkflowOptionsModalProps {
    handleCloseWorkflowOptionsModal: () => void
    addCIPipeline: (type: CIPipelineNodeType, workflowId?: number | string) => void
    addWebhookCD: (workflowId?: number | string) => void
    addLinkedCD: (changeCIPayload: ChangeCIPayloadType) => void
    showLinkedCDSource: boolean
    resetChangeCIPayload: () => void
    // ------------------ Optional types ------------------
    changeCIPayload?: ChangeCIPayloadType
    workflows?: WorkflowType[]
    getWorkflows?: () => void
    linkedCDSourceVariant?: LinkedCDSourceVariant
}
