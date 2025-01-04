import { post } from '@Common/Api'
import { DeploymentNodeType } from '@Common/Types'
import { DeploymentWithConfigType } from '@Shared/constants'
import { ROUTES } from '@Common/Constants'
import { TriggerCDNodeServiceProps, TriggerCDPipelinePayloadType } from './types'
import { getAPIOptionsWithTriggerTimeout } from './utils'
import { STAGE_MAP } from './constants'

export const triggerCDNode = ({
    pipelineId,
    ciArtifactId,
    appId,
    stageType,
    deploymentWithConfig,
    wfrId,
    runtimeParamsPayload,
    abortControllerRef,
}: TriggerCDNodeServiceProps) => {
    const areRuntimeParamsConfigured =
        runtimeParamsPayload && (stageType === DeploymentNodeType.POSTCD || stageType === DeploymentNodeType.PRECD)

    const request: TriggerCDPipelinePayloadType = {
        pipelineId,
        appId,
        ciArtifactId,
        cdWorkflowType: STAGE_MAP[stageType],
        ...(areRuntimeParamsConfigured && runtimeParamsPayload),
    }

    if (deploymentWithConfig) {
        request.deploymentWithConfig =
            deploymentWithConfig === DeploymentWithConfigType.LAST_SAVED_CONFIG
                ? deploymentWithConfig
                : DeploymentWithConfigType.SPECIFIC_TRIGGER_CONFIG

        if (deploymentWithConfig !== DeploymentWithConfigType.LAST_SAVED_CONFIG) {
            request.wfrIdForDeploymentWithSpecificTrigger = wfrId
        }
    }

    return post(ROUTES.CD_TRIGGER_POST, request, { ...getAPIOptionsWithTriggerTimeout(), abortControllerRef })
}
