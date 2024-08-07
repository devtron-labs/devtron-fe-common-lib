import { FormType, StepType } from '@Common/CIPipeline.Types'
import { DeploymentAppTypes } from '@Common/Types'
import { DeploymentStrategy } from '@Shared/Components'

interface ConfigSecretType {
    label: string
    value: string
    type: string
}

export interface Environment {
    description?: string
    id: number
    name: string
    namespace: string
    active: boolean
    clusterName: string
    clusterId: string
    isClusterCdActive: boolean
    isVirtualEnvironment?: boolean
    allowedDeploymentTypes?: DeploymentAppTypes[]
    isDigestEnforcedForEnv?: boolean
}

export interface PipelineBuildStageType {
    id: number
    triggerType?: string
    steps: StepType[]
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
    CREATE = 'create',
    LINK = 'link',
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
    userApprovalConfig?: {
        requiredCount: number
    }
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
