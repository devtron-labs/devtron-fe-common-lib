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
}

export interface TriggerCDPipelinePayloadType
    extends Pick<
        TriggerCDNodeServiceProps,
        'pipelineId' | 'appId' | 'ciArtifactId' | 'runtimeParamsPayload' | 'deploymentWithConfig'
    > {
    cdWorkflowType: (typeof STAGE_MAP)[keyof typeof STAGE_MAP]
    wfrIdForDeploymentWithSpecificTrigger?: number
}
