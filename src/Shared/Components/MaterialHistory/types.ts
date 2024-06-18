import { CIMaterialType } from '../../Services/app.types'

export interface MaterialHistoryProps {
    material: CIMaterialType
    pipelineName: string
    ciPipelineId?: string
    selectCommit?: (materialId: string, commit: string, ciPipelineId?: string) => void
}
