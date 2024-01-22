import { AddCDPositions, AddPipelineType, PipelineType, WorkflowNodeType } from '../Types'
import { HandleAddCD, GetPipelineType } from './types'

const getPipelineType = ({ isWebhookCD, startNode }: GetPipelineType) => {
    if (isWebhookCD) {
        return PipelineType.WEBHOOK
    }

    if (startNode.type === WorkflowNodeType.CI) {
        return PipelineType.CI_PIPELINE
    }

    return PipelineType.CD_PIPELINE
}

export const handleAddCD = ({
    position,
    handleCDSelect,
    startNode,
    endNode,
    workflowId,
    ciPipelineId,
    isWebhookCD,
    isParallelEdge,
}: HandleAddCD) => {
    if (!handleCDSelect) {
        return
    }
    const pipelineType = getPipelineType({ isWebhookCD, startNode })
    const addPipelineType =
        isParallelEdge && position === AddCDPositions.RIGHT ? AddPipelineType.PARALLEL : AddPipelineType.SEQUENTIAL
    const endNodeId = !isParallelEdge && position === AddCDPositions.RIGHT ? endNode.id : null

    handleCDSelect(workflowId, ciPipelineId, pipelineType, startNode.id, isWebhookCD, endNodeId, addPipelineType)
}
