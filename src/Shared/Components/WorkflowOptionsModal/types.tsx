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
