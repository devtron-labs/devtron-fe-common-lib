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

import { MutableRefObject } from 'react'

import { getIsRequestAborted, post } from '@Common/API'
import { ROUTES } from '@Common/Constants'
import { getUrlWithSearchParams, showError } from '@Common/Helper'
import { DeploymentNodeType } from '@Common/Types'
import { DeploymentWithConfigType } from '@Shared/constants'
import { UploadFileDTO, UploadFileProps } from '@Shared/types'

import { STAGE_MAP } from './constants'
import { TriggerCDNodeServiceProps, TriggerCDPipelinePayloadType } from './types'
import { getAPIOptionsWithTriggerTimeout } from './utils'

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
    isRollbackTrigger = false,
}: TriggerCDNodeServiceProps) => {
    const areRuntimeParamsConfigured =
        runtimeParamsPayload && (stageType === DeploymentNodeType.POSTCD || stageType === DeploymentNodeType.PRECD)

    const request: TriggerCDPipelinePayloadType = {
        pipelineId,
        appId,
        ciArtifactId,
        cdWorkflowType: STAGE_MAP[stageType],
        isRollbackDeployment: isRollbackTrigger,
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
