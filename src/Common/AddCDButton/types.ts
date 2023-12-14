import { AddCDPositions, AddPipelineType, EdgeEndNodeType, EdgeNodeType, Point } from '../Types'

export interface AddCDButtonProps {
    position: AddCDPositions
    addCDButtons: AddCDPositions[]
    endNode: Point & EdgeEndNodeType
    startNode: Point & EdgeNodeType
    handleAddCD: (position: AddCDPositions) => void
}

export interface HandleAddCD {
    position: AddCDPositions
    handleCDSelect: (
        workflowId: number | string,
        ciPipelineId: number | string,
        parentPipelineType: string,
        parentPipelineId: number | string,
        isWebhookCD?: boolean,
        childPipelineId?: number | string,
        addType?: AddPipelineType,
    ) => void
    startNode: EdgeNodeType
    endNode: EdgeEndNodeType
    workflowId: number | string
    ciPipelineId: number | string
    isWebhookCD: boolean
    isParallelEdge: boolean
}

export interface GetPipelineType {
    isWebhookCD: boolean
    startNode: EdgeNodeType
}
