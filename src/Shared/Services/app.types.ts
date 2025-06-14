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

import { KeyValueTableData } from '@Shared/Components'
import { DeploymentStrategyType, TargetPlatformsDTO } from '@Shared/types'
import { OverrideMergeStrategyType } from '@Pages/Applications'

import { ReleaseTag, ResponseType, UserApprovalMetadataType } from '../../Common'

interface WebhookDataType {
    id: number
    eventActionType: string
    data: any
}

interface MaterialHistoryDTO {
    Commit: string
    Author: string
    Date: string
    Message: string
    Changes: unknown[]
    WebhookData: WebhookDataType
}

export interface MaterialHistoryType {
    commitURL: string
    commit: MaterialHistoryDTO['Commit']
    author: MaterialHistoryDTO['Author']
    date: MaterialHistoryDTO['Date']
    message: MaterialHistoryDTO['Message']
    changes: MaterialHistoryDTO['Changes']
    webhookData: MaterialHistoryDTO['WebhookData']
    showChanges: boolean
    isSelected: boolean
    excluded?: boolean
}

interface CIMaterialDTO {
    id: number
    gitMaterialId: number
    gitMaterialName: string
    type: string
    value: string
    active: boolean
    history: MaterialHistoryDTO[]
    lastFetchTime: string
    url: string
}

// FIXME: These are meta types not received from API. Added this for backward compatibility
interface CIMaterialMetaType {
    isRepoError?: boolean
    repoErrorMsg?: string
    isBranchError?: boolean
    branchErrorMsg?: string
    isMaterialLoading?: boolean
    regex?: string
    searchText?: string
    noSearchResultsMsg?: string
    noSearchResult?: boolean
    isRegex?: boolean
    isDockerFileError?: boolean
    dockerFileErrorMsg?: string
    showAllCommits?: boolean
    isMaterialSelectionError?: boolean
    materialSelectionErrorMsg?: string
}

export interface CIMaterialType
    extends Pick<
            CIMaterialDTO,
            'id' | 'gitMaterialId' | 'gitMaterialName' | 'type' | 'value' | 'active' | 'lastFetchTime'
        >,
        CIMaterialMetaType {
    gitURL: CIMaterialDTO['url']
    history: MaterialHistoryType[]
    isSelected: boolean
    gitMaterialUrl?: string
}

interface ImageCommentDTO {
    id: number
    comment: string
    artifactId: number
}

interface ImageCommentType extends ImageCommentDTO {}

interface ImageTaggingDataDTO {
    imageReleaseTags: ReleaseTag[]
    appReleaseTags: string[]
    imageComment: ImageCommentDTO
    tagsEditable: boolean
}

interface ImageTaggingDataType
    extends Pick<ImageTaggingDataDTO, 'imageReleaseTags' | 'appReleaseTags' | 'tagsEditable'> {
    imageComment: ImageCommentType
}

export interface CIMaterialInfoDTO extends Pick<TargetPlatformsDTO, 'targetPlatforms'> {
    ciPipelineId: number
    ciMaterials: CIMaterialDTO[]
    triggeredByEmail: string
    lastDeployedTime: string
    appId: number
    appName: string
    environmentId: number
    environmentName: string
    imageTaggingData: ImageTaggingDataDTO
    image: string
}

export interface CIMaterialInfoType
    extends Pick<
            CIMaterialInfoDTO,
            | 'triggeredByEmail'
            | 'lastDeployedTime'
            | 'appId'
            | 'appName'
            | 'environmentId'
            | 'environmentName'
            | 'image'
            | 'ciPipelineId'
        >,
        ImageTaggingDataType,
        Pick<TargetPlatformsDTO, 'targetPlatforms'> {
    materials: CIMaterialType[]
}

export interface GetCITriggerInfoParamsType {
    envId: number | string
    ciArtifactId: number | string
}

export enum AppEnvDeploymentConfigType {
    PUBLISHED_ONLY = 'PublishedOnly',
    DRAFT_ONLY = 'DraftOnly',
    PUBLISHED_WITH_DRAFT = 'PublishedWithDraft',
    PREVIOUS_DEPLOYMENTS = 'PreviousDeployments',
    DEFAULT_VERSION = 'DefaultVersion',
}

export enum DraftState {
    Init = 1,
    Discarded = 2,
    Published = 3,
    AwaitApproval = 4,
}

export enum DraftAction {
    Add = 1,
    Update = 2,
    Delete = 3,
}

export interface DraftMetadataDTO {
    appId: number
    envId: number
    resource: number
    resourceName: string
    action: DraftAction
    data: string
    userComment: string
    changeProposed: boolean
    protectNotificationConfig: { [key: string]: null }
    draftId: number
    draftVersionId: number
    draftState: DraftState
    draftResolvedValue: string
    approvers: string[]
    canApprove: boolean
    commentsCount: number
    dataEncrypted: boolean
    isAppAdmin: boolean
    userApprovalMetadata: UserApprovalMetadataType
    /**
     * User id of the user who has requested the data
     *
     * This would be the id of the user whose token is sent in the cookie
     */
    requestedUserId: number
}

export enum CMSecretExternalType {
    Internal = '',
    KubernetesConfigMap = 'KubernetesConfigMap',
    KubernetesSecret = 'KubernetesSecret',
    AWSSecretsManager = 'AWSSecretsManager',
    AWSSystemManager = 'AWSSystemManager',
    HashiCorpVault = 'HashiCorpVault',
    ESO_GoogleSecretsManager = 'ESO_GoogleSecretsManager',
    ESO_AWSSecretsManager = 'ESO_AWSSecretsManager',
    ESO_AzureSecretsManager = 'ESO_AzureSecretsManager',
    ESO_HashiCorpVault = 'ESO_HashiCorpVault',
}

export interface ConfigDatum {
    name: string
    mergeStrategy: OverrideMergeStrategyType
    type: string
    external: boolean
    data: Record<string, any>
    patchData: Record<string, any>
    defaultData: Record<string, any>
    global: boolean
    externalType: CMSecretExternalType
    esoSecretData: Record<string, any>
    defaultESOSecretData: Record<string, any>
    secretData: Record<string, any>[]
    defaultSecretData: Record<string, any>[]
    roleARN: string
    subPath: boolean
    filePermission: string
    overridden: boolean
    mountPath: string
    defaultMountPath: string
    esoSubPath: string[]
}

export interface ConfigMapSecretDataConfigDatumDTO extends ConfigDatum {
    draftMetadata: DraftMetadataDTO
}

export interface ConfigMapSecretDataType {
    id: number
    appId: number
    configData: ConfigMapSecretDataConfigDatumDTO[]
    isDeletable: boolean
}

export interface ConfigMapSecretUseFormProps {
    name: string
    isSecret: boolean
    external: boolean
    externalType: CMSecretExternalType
    selectedType: string
    isFilePermissionChecked: boolean
    isSubPathChecked: boolean
    externalSubpathValues: string
    filePermission: string
    volumeMountPath: string
    roleARN: string
    yamlMode: boolean
    yaml: string
    currentData: KeyValueTableData[]
    secretDataYaml: string
    esoSecretYaml: string
    hasCurrentDataErr: boolean
    isResolvedData: boolean
    mergeStrategy: OverrideMergeStrategyType
    skipValidation: boolean
}

export enum ConfigResourceType {
    ConfigMap = 'ConfigMap',
    Secret = 'Secret',
    DeploymentTemplate = 'Deployment Template',
    PipelineStrategy = 'Pipeline Strategy',
}

export interface DeploymentTemplateDTO {
    resourceType: ConfigResourceType.DeploymentTemplate
    data: Record<string, any>
    deploymentDraftData: ConfigMapSecretDataType | null
    variableSnapshot: {
        'Deployment Template': Record<string, string>
    }
    templateVersion: string
    isAppMetricsEnabled?: true
    resolvedValue: Record<string, any>
}

export interface ConfigMapSecretDataDTO {
    resourceType: Extract<ConfigResourceType, ConfigResourceType.ConfigMap | ConfigResourceType.Secret>
    data: ConfigMapSecretDataType
    variableSnapshot: Record<string, Record<string, string>>
    resolvedValue: string
}

export type JobCMSecretDataDTO = ResponseType<Omit<ConfigMapSecretDataDTO['data'], 'isDeletable'>>

export interface PipelineConfigDataDTO {
    resourceType: ConfigResourceType.PipelineStrategy
    data: Record<string, any>
    pipelineTriggerType: string
    Strategy: string
    updatedBy: string
    updatedOn: string
    selectedAtRuntime: boolean
}

export interface AppEnvDeploymentConfigDTO {
    deploymentTemplate: DeploymentTemplateDTO | null
    configMapData: ConfigMapSecretDataDTO | null
    secretsData: ConfigMapSecretDataDTO | null
    pipelineConfigData?: PipelineConfigDataDTO
    isAppAdmin: boolean
}

export type AppEnvDeploymentConfigPayloadType = {
    appName: string
    envName: string
    strategy?: DeploymentStrategyType
} & (
    | {
          configType: AppEnvDeploymentConfigType
          wfrId?: number
          pipelineId?: number
          resourceType?: ConfigResourceType
          resourceId?: number
          resourceName?: string
          configArea?: 'AppConfiguration'
      }
    | {
          appName: string
          envName: string
          pipelineId: number
          configArea: 'CdRollback' | 'DeploymentHistory'
          wfrId: number
      }
)

export enum TemplateListType {
    DefaultVersions = 1,
    PublishedOnEnvironments = 2,
    DeployedOnSelfEnvironment = 3,
    DeployedOnOtherEnvironment = 4,
}

export interface TemplateListDTO {
    chartRefId: number
    chartVersion?: string
    chartType?: string
    type: TemplateListType
    environmentId?: number
    environmentName?: string
    deploymentTemplateHistoryId?: number
    finishedOn?: string
    status?: string
    pipelineId?: number
    wfrId?: number
}

export enum EnvResourceType {
    ConfigMap = 'configmap',
    Secret = 'secrets',
    DeploymentTemplate = 'deployment-template',
    Manifest = 'manifest',
    PipelineStrategy = 'pipeline-strategy',
}

export enum CMSecretComponentType {
    ConfigMap = 1,
    Secret = 2,
}

export enum CM_SECRET_STATE {
    BASE = '',
    INHERITED = 'INHERITING',
    OVERRIDDEN = 'OVERRIDDEN',
    ENV = 'ENV',
    UNPUBLISHED = 'UNPUBLISHED',
}

export interface CMSecretConfigData extends ConfigDatum {
    unAuthorized: boolean
}

export interface ProcessCMCSCurrentDataParamsType {
    configMapSecretData: CMSecretConfigData
    cmSecretStateLabel: CM_SECRET_STATE
    isSecret: boolean
}

export interface GetConfigMapSecretFormInitialValuesParamsType {
    cmSecretStateLabel: CM_SECRET_STATE
    configMapSecretData: CMSecretConfigData
    fallbackMergeStrategy: OverrideMergeStrategyType
    /**
     * Leveraging the same in build infra as well
     */
    isJob?: boolean
    componentType?: CMSecretComponentType
    skipValidation?: boolean
}

export interface ESOSecretData {
    secretStore: Record<string, any>
    secretStoreRef: Record<string, any>
    refreshInterval: string
    esoData: Record<string, any>[]
    esoDataFrom: Record<string, any>[]
    template: Record<string, any>
}

export enum CODE_EDITOR_RADIO_STATE {
    DATA = 'data',
    SAMPLE = 'sample',
}

export type CMSecretPayloadType = Pick<
    CMSecretConfigData,
    | 'data'
    | 'name'
    | 'type'
    | 'externalType'
    | 'external'
    | 'roleARN'
    | 'mountPath'
    | 'subPath'
    | 'esoSecretData'
    | 'filePermission'
    | 'esoSubPath'
    | 'mergeStrategy'
>
