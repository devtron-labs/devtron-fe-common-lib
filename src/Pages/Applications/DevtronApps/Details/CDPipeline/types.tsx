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

import { BuildStageType, FormType } from '@Common/CIPipeline.Types'
import { APIOptions, DeploymentAppTypes, DeploymentNodeType } from '@Common/Types'
import { STAGE_MAP } from '@Pages/index'
import { DeploymentStrategy } from '@Shared/Components'
import { EnvListMinDTO, RuntimeParamsTriggerPayloadType } from '@Shared/types'

interface ConfigSecretType {
    label: string
    value: string
    type: string
}

export interface Environment
    extends Pick<EnvListMinDTO, 'id' | 'active' | 'namespace' | 'isClusterCdActive'>,
        Partial<
            Pick<
                EnvListMinDTO,
                'isVirtualEnvironment' | 'allowedDeploymentTypes' | 'description' | 'isDigestEnforcedForEnv'
            >
        > {
    name: string
    clusterName: string
    clusterId: string
}

export interface PipelineBuildStageType extends BuildStageType {
    triggerType?: string
}

export interface SavedDeploymentStrategy extends DeploymentStrategy {
    isCollapsed?: boolean
    defaultConfig?: any
    yamlStr?: any
    jsonStr?: any
}

export interface CustomTagType {
    tagPattern: string
    counterX: string
}

export enum ReleaseMode {
    NEW_DEPLOYMENT = 'create',
    MIGRATE_HELM = 'link',
}

export interface CDFormType {
    name: string
    ciPipelineId: number
    environmentId: number
    environmentName: string
    namespace: string
    environments: Environment[]
    deploymentAppType: string
    deploymentAppName?: string
    releaseMode: ReleaseMode
    triggerType: string
    preBuildStage?: PipelineBuildStageType
    postBuildStage?: PipelineBuildStageType
    strategies: DeploymentStrategy[]
    savedStrategies: SavedDeploymentStrategy[]
    preStageConfigMapSecretNames: { configMaps: ConfigSecretType[]; secrets: ConfigSecretType[] }
    postStageConfigMapSecretNames: { configMaps: ConfigSecretType[]; secrets: ConfigSecretType[] }
    requiredApprovals: string
    isClusterCdActive: boolean
    deploymentAppCreated: boolean
    clusterId: string
    clusterName: string
    runPreStageInEnv: boolean
    runPostStageInEnv: boolean
    allowedDeploymentTypes: DeploymentAppTypes[]
    containerRegistryName: string
    repoName: string
    selectedRegistry: any
    generatedHelmPushAction: string
}

export interface PipelineFormType extends Partial<FormType>, Partial<CDFormType> {
    name: string
    triggerType: string
    preBuildStage?: PipelineBuildStageType
    postBuildStage?: PipelineBuildStageType
    defaultTag?: string[]
    customTag?: CustomTagType
    enableCustomTag?: boolean
    customTagStage?: string
    isDigestEnforcedForPipeline?: boolean
    isDigestEnforcedForEnv?: boolean
}

export interface OptionsBase {
    name: string
    isInitContainer?: boolean
    isEphemeralContainer?: boolean
    isExternal?: boolean
}

export interface SelectedResourceType {
    clusterId: number
    group: string
    version: string
    kind: string
    namespace: string
    name: string
    containers: OptionsBase[]
    selectedContainer?: string
    clusterName?: string
}

export interface TriggerCDNodeServiceProps extends Pick<APIOptions, 'abortControllerRef'> {
    pipelineId: number
    ciArtifactId: number
    appId: number
    stageType: DeploymentNodeType
    deploymentWithConfig?: string
    wfrId?: number
    /**
     * Would be available only case of PRE/POST CD
     */
    runtimeParamsPayload?: RuntimeParamsTriggerPayloadType
    isRollbackTrigger?: boolean
}

export interface TriggerCDPipelinePayloadType
    extends Pick<
        TriggerCDNodeServiceProps,
        'pipelineId' | 'appId' | 'ciArtifactId' | 'runtimeParamsPayload' | 'deploymentWithConfig'
    > {
    cdWorkflowType: (typeof STAGE_MAP)[keyof typeof STAGE_MAP]
    isRollbackDeployment: boolean
    wfrIdForDeploymentWithSpecificTrigger?: number
}
