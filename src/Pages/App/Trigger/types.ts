import { DeploymentNodeType } from '@Common/Types'
import { RuntimeParamsTriggerPayloadType } from '@Shared/types'
import { MutableRefObject } from 'react'

export interface TriggerCDNodeServiceProps {
    pipelineId: number
    ciArtifactId: number
    appId: number
    stageType: DeploymentNodeType
    deploymentWithConfig?: string
    wfrId?: number
    abortControllerRef?: MutableRefObject<AbortController>
    /**
     * Would be available only case of PRE/POST CD
     */
    runtimeParamsPayload?: RuntimeParamsTriggerPayloadType
}

export interface TriggerCDPipelinePayloadType
    extends Pick<
        TriggerCDNodeServiceProps,
        'pipelineId' | 'appId' | 'ciArtifactId' | 'runtimeParamsPayload' | 'deploymentWithConfig'
    > {
    cdWorkflowType: string
    wfrIdForDeploymentWithSpecificTrigger?: number
}
