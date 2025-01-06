import { MutableRefObject } from 'react'
import { getIsRequestAborted, post } from '@Common/Api'
import { ROUTES } from '@Common/Constants'
import { getUrlWithSearchParams, showError } from '@Common/Helper'
import { UploadFileDTO, UploadFileProps } from '@Shared/types'
import { DeploymentNodeType } from '@Common/Types'
import { DeploymentWithConfigType } from '@Shared/constants'
import { TriggerCDNodeServiceProps, TriggerCDPipelinePayloadType } from './types'
import { getAPIOptionsWithTriggerTimeout } from './utils'
import { STAGE_MAP } from './constants'

export const uploadCDPipelineFile = async ({
    file,
    appId,
    envId,
    allowedExtensions,
    maxUploadSize,
    abortControllerRef,
}: UploadFileProps & {
    appId: number
    envId: number
    abortControllerRef?: MutableRefObject<AbortController>
}): Promise<UploadFileDTO> => {
    const formData = new FormData()
    formData.append('file', file[0])

    try {
        const { result } = await post(
            getUrlWithSearchParams(`${ROUTES.CD_CONFIG}/${appId}/${envId}/${ROUTES.FILE_UPLOAD}`, {
                allowedExtensions,
                maxUploadSize,
            }),
            formData,
            { abortControllerRef },
            true,
        )

        return result
    } catch (err) {
        if (!getIsRequestAborted(err)) {
            showError(err)
        }
        throw err
    }
}

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
