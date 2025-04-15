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

import { ParsedCountry } from 'react-international-phone'
import { Dayjs } from 'dayjs'

import { APIOptions, ApprovalConfigDataType } from '@Common/Types'

import {
    CommonNodeAttr,
    DeploymentAppTypes,
    OptionType,
    PluginType,
    RefVariableType,
    SegmentedControlProps,
    ServerErrors,
    SortingParams,
    TriggerBlockType,
    ValueConstraintType,
    VariableType,
    VulnerabilityType,
} from '../Common'
import { SelectPickerOptionType } from './Components'
import { BASE_CONFIGURATION_ENV_ID, EnvironmentTypeEnum, PatchOperationType } from './constants'

export enum EnvType {
    CHART = 'helm_charts',
    APPLICATION = 'apps',
}

export interface EnvDetails {
    envType: EnvType
    envId: number
    appId: number
}

interface OtherEnvironment {
    environmentId: number
    environmentName: string
    appMetrics: boolean
    infraMetrics: boolean
    prod: boolean
}

export interface PodMetaData {
    containers: Array<string>
    initContainers: any
    ephemeralContainers: any
    isNew: boolean
    name: string
    uid: string
}

export interface Info {
    value: string
    name: string
}

export interface Health {
    status: string
    message?: string
}

export interface TargetLabel {
    'app.kubernetes.io/instance': string
    'app.kubernetes.io/name': string
}
export interface TargetLabels {
    targetLabel: TargetLabel
}
export interface NetworkingInfo {
    targetLabels: TargetLabels
}

export enum Nodes {
    Service = 'Service',
    Alertmanager = 'Alertmanager',
    PodSecurity = 'PodSecurityPolicy',
    ConfigMap = 'ConfigMap',
    ServiceAccount = 'ServiceAccount',
    ClusterRoleBinding = 'ClusterRoleBinding',
    RoleBinding = 'RoleBinding',
    ClusterRole = 'ClusterRole',
    Role = 'Role',
    Prometheus = 'Prometheus',
    ServiceMonitor = 'ServiceMonitor',
    Deployment = 'Deployment',
    MutatingWebhookConfiguration = 'MutatingWebhookConfiguration',
    DaemonSet = 'DaemonSet',
    Secret = 'Secret',
    ValidatingWebhookConfiguration = 'ValidatingWebhookConfiguration',
    Pod = 'Pod',
    Ingress = 'Ingress',
    ReplicaSet = 'ReplicaSet',
    Endpoints = 'Endpoints',
    Cluster = 'ClusterRoleBinding',
    PodSecurityPolicy = 'PodSecurityPolicy',
    CronJob = 'CronJob',
    Job = 'Job',
    ReplicationController = 'ReplicationController',
    StatefulSet = 'StatefulSet',
    Rollout = 'Rollout',
    PersistentVolumeClaim = 'PersistentVolumeClaim',
    PersistentVolume = 'PersistentVolume',
    Containers = 'Containers', // containers are being treated same way as nodes for nested table generation
    InitContainers = 'InitContainers',
    EndpointSlice = 'EndpointSlice',
    NetworkPolicy = 'NetworkPolicy',
    StorageClass = 'StorageClass',
    VolumeSnapshot = 'VolumeSnapshot',
    VolumeSnapshotContent = 'VolumeSnapshotContent',
    VolumeSnapshotClass = 'VolumeSnapshotClass',
    PodDisruptionBudget = 'PodDisruptionBudget',
    Event = 'Event',
    Namespace = 'Namespace',
    Node = 'Node',
    Overview = 'Overview',
    MonitoringDashboard = 'MonitoringDashboard',
    UpgradeCluster = 'UpgradeCluster',
}

// FIXME: This should be `typeof Nodes[keyof typeof Nodes]` instead since the key and values are not the same. Same to be removed from duplications in dashboard
export type NodeType = keyof typeof Nodes

export interface Node {
    createdAt: Date
    health: Health
    kind: NodeType
    name: string
    namespace: string
    networkingInfo: NetworkingInfo
    resourceVersion: string
    uid: string
    version: string
    parentRefs: Array<Node>
    group: string
    isSelected: boolean
    info: Info[]
    port: number
    canBeHibernated: boolean
    isHibernated: boolean
    hasDrift?: boolean
}

// eslint-disable-next-line no-use-before-define
export interface iNodes extends Array<iNode> {}

export interface iNode extends Node {
    childNodes: iNodes
    type: NodeType
    status: string
    pNode?: iNode
}
export interface ResourceTree {
    conditions: any
    newGenerationReplicaSet: string
    nodes: Array<Node>
    podMetadata: Array<PodMetaData>
    status: string
    resourcesSyncResult?: Record<string, string>
}

export enum AppType {
    DEVTRON_APP = 'devtron_app',
    DEVTRON_HELM_CHART = 'devtron_helm_chart',
    EXTERNAL_HELM_CHART = 'external_helm_chart',
    EXTERNAL_ARGO_APP = 'external_argo_app',
    EXTERNAL_FLUX_APP = 'external_flux_app',
}

export interface HelmReleaseStatus {
    status: string
    message: string
    description: string
}

interface MaterialInfo {
    author: string
    branch: string
    message: string
    modifiedTime: string
    revision: string
    url: string
    webhookData: string
}
export interface FluxAppStatusDetail {
    status: string
    message: string
    reason: string
}
export interface AppDetails {
    appId?: number
    appName: string
    appStoreAppName?: string
    appStoreAppVersion?: string
    appStoreChartId?: number
    appStoreChartName?: string
    appStoreInstalledAppVersionId?: number
    ciArtifactId?: number
    deprecated?: false
    environmentId?: number
    environmentName: string
    installedAppId?: number
    instanceDetail?: null
    k8sVersion?: string
    lastDeployedBy?: string
    lastDeployedTime: string
    namespace: string
    resourceTree: ResourceTree
    materialInfo?: MaterialInfo[]
    releaseVersion?: string
    dataSource?: string
    lastDeployedPipeline?: string
    otherEnvironment?: OtherEnvironment[]
    projectName?: string
    appType?: AppType
    helmReleaseStatus?: HelmReleaseStatus
    clusterId?: number
    notes?: string
    deploymentAppType?: DeploymentAppTypes
    ipsAccessProvided?: boolean
    externalCi?: boolean
    clusterName?: string
    dockerRegistryId?: string
    deploymentAppDeleteRequest?: boolean
    isApprovalPolicyApplicable?: boolean
    isVirtualEnvironment?: boolean
    imageTag?: string
    helmPackageName?: string
    appStatus?: string
    chartAvatar?: string
    fluxTemplateType?: string
    FluxAppStatusDetail?: FluxAppStatusDetail
}

export enum RegistryType {
    GIT = 'git',
    GITHUB = 'github',
    GITLAB = 'gitlab',
    BITBUCKET = 'bitbucket',
    DOCKER = 'docker',
    DOCKER_HUB = 'docker-hub',
    ACR = 'acr',
    QUAY = 'quay',
    ECR = 'ecr',
    ARTIFACT_REGISTRY = 'artifact-registry',
    GCR = 'gcr',
    OTHER = 'other',
}

export enum DefaultUserKey {
    system = 'system',
    admin = 'admin',
}

export enum Severity {
    CRITICAL = 'critical',
    HIGH = 'high',
    MEDIUM = 'medium',
    LOW = 'low',
    UNKNOWN = 'unknown',
}

export interface ArtifactPromotionMetadata {
    isConfigured: boolean
    isApprovalPendingForPromotion: boolean
}

export interface Material {
    gitMaterialId: number
    materialName: string
}

export interface WorkflowType {
    id: string
    name: string
    gitMaterials?: Material[]
    ciConfiguredGitMaterialId?: number
    startX: number
    startY: number
    width: number
    height: number
    nodes: CommonNodeAttr[]
    dag: any
    showTippy?: boolean
    appId?: number
    isSelected?: boolean
    isExceptionUser?: boolean
    approvalConfiguredIdsMap?: Record<number, ApprovalConfigDataType>
    imageReleaseTags: string[]
    appReleaseTags?: string[]
    tagsEditable?: boolean
    hideImageTaggingHardDelete?: boolean
    artifactPromotionMetadata?: ArtifactPromotionMetadata
}

export enum ModuleStatus {
    HEALTHY = 'healthy',
    NONE = 'none',
    UNKNOWN = 'unknown',
    UPGRADING = 'upgrading',
    UPGRADE_FAILED = 'upgradeFailed',
    // Module Status
    INSTALLED = 'installed',
    INSTALLING = 'installing',
    INSTALL_FAILED = 'installFailed',
    NOT_INSTALLED = 'notInstalled',
    TIMEOUT = 'timeout',
}

export interface WebHookData {
    Id: number
    EventActionType: string
    Data: any
}

export interface GitTriggers {
    Commit: string
    Author: string
    Date: Date | string
    Message: string
    Changes: string[]
    WebhookData: WebHookData
    GitRepoUrl: string
    GitRepoName: string
    CiConfigureSourceType: string
    CiConfigureSourceValue: string
}

export interface RuntimePluginVariables
    extends Pick<VariableType, 'name' | 'value' | 'defaultValue' | 'format' | 'fileReferenceId' | 'fileMountDir'> {
    variableStepScope: string
    valueConstraint: ValueConstraintType & { id: number }
    stepVariableId: number
    valueType: RefVariableType
    stepName: string
    stepType: PluginType
    isRequired: boolean
    pluginIcon?: string
    description?: string
}

export interface RuntimeParamsAPIResponseType {
    envVariables: Record<string, string>
    runtimePluginVariables: RuntimePluginVariables[]
}

export interface RuntimeParamsTriggerPayloadType {
    runtimeParams: {
        runtimePluginVariables: Pick<
            RuntimePluginVariables,
            'name' | 'fileMountDir' | 'fileReferenceId' | 'value' | 'format' | 'variableStepScope'
        >[]
    }
}

export enum CIMaterialSidebarType {
    CODE_SOURCE = 'Code Source',
    PARAMETERS = 'Parameters',
}

export enum CDMaterialSidebarType {
    IMAGE = 'Image',
    PARAMETERS = 'Parameters',
}

/**
 * @example Usage with specific enum for path & `unknown` type for value
 * ```ts
 * enum PatchKeys {
 *  name = 'name',
 *  description = 'description',
 * }
 *
 * const query: PatchQueryType<PatchKeys> = {
 *  op: PatchOperationType.replace,
 *  path: PatchKeys.name,
 *  value: '1'
 * }
 * ```
 *
 * @example Usage with specific enum for path & custom type for value
 * ```ts
 * enum PatchKeys {
 *  name = 'name',
 *  description = 'description',
 * }
 *
 * const query: PatchQueryType<PatchKeys, number> = {
 *  op: PatchOperationType.replace,
 *  path: PatchKeys.name,
 *  value: 1
 * }
 * ```
 *
 * @example Usage with `PatchOperationType.remove` without value
 *
 * ```ts
 * const query: PatchQueryType<string> = {
 *  op: PatchOperationType.remove,
 *  path: 'name'
 * }
 * ```
 *
 * @example Usage with `PatchOperationType.remove` with value
 *
 * ```ts
 * const query: PatchQueryType<string, number, true> = {
 *  op: PatchOperationType.remove,
 *  path: 'name'
 *  value: 1
 * }
 * ```
 */
export type PatchQueryType<T extends string, K = unknown, IsRemoveValueEnabled extends boolean = false> = {
    /**
     * The path of the json to be patched
     */
    path: T
} & (
    | {
          /**
           * Operation type for patch
           */
          op: PatchOperationType.replace
          /**
           * Corresponding value for the operation
           */
          value: K
      }
    | {
          /**
           * Operation type for patch
           */
          op: PatchOperationType.remove
          value?: IsRemoveValueEnabled extends true ? K : never
      }
    | {
          /**
           * Operation type for add
           */
          op: PatchOperationType.add
          value?: K
      }
)

export interface GroupedOptionsType {
    label: string
    options: OptionType[]
}

/**
 * Enum for devtron resources
 */
export enum ResourceKindType {
    devtronApplication = 'application/devtron-application',
    helmChart = 'application/helm-application',
    job = 'job',
    cluster = 'cluster',
    release = 'release',
    releaseTrack = 'release-track',
    releaseChannel = 'release-channel',
    tenant = 'tenant',
    installation = 'installation',
    environment = 'environment',
    cdPipeline = 'cd-pipeline',
    ciPipeline = 'ci-pipeline',
    project = 'project',
}

/**
 * Versions support for the resources on BE
 *
 * TODO: Rename to ApiVersionType
 */
export enum ResourceVersionType {
    v1 = 'v1',
    alpha1 = 'alpha1',
}

export interface SeverityCount {
    critical: number
    high: number
    medium: number
    low: number
    unknown: number
}
export enum PolicyKindType {
    lockConfiguration = 'lock-configuration',
    imagePromotion = 'image-promotion',
    plugins = 'plugin',
    approval = 'approval',
}

export interface LastExecutionResultType {
    lastExecution: string
    severityCount: SeverityCount
    vulnerabilities: VulnerabilityType[]
    scanExecutionId?: number
    appId?: number
    appName?: string
    envId?: number
    envName?: string
    pod?: string
    replicaSet?: string
    image?: string
    objectType?: 'app' | 'chart'
    scanned?: boolean
    scanEnabled?: boolean
    scanToolId?: number
    imageScanDeployInfoId?: number
}

export interface MaterialSecurityInfoType {
    isScanned: boolean
    isScanEnabled: boolean
}

export enum WebhookEventNameType {
    PULL_REQUEST = 'Pull Request',
    TAG_CREATION = 'Tag Creation',
}

export type IntersectionOptions = {
    root?: React.RefObject<Element>
    rootMargin?: string
    threshold?: number | number[]
    once?: boolean
    defaultIntersecting?: boolean
}

export type IntersectionChangeHandler = (entry: IntersectionObserverEntry) => void
// FIXME: This should be `typeof Nodes[keyof typeof Nodes]` instead since the key and values are not the same. Same to be removed from duplications in dashboard

export interface InputFieldState<T = string> {
    value: T
    error: string
}

export enum AggregationKeys {
    Workloads = 'Workloads',
    Networking = 'Networking',
    'Config & Storage' = 'Config & Storage',
    RBAC = 'RBAC',
    Administration = 'Administration',
    'Custom Resource' = 'Custom Resource',
    'Other Resources' = 'Other Resources',
    Events = 'Events',
    Namespaces = 'Namespaces',
    'Nodes' = 'Nodes',
}

export type AggregationKeysType = keyof typeof AggregationKeys

export enum GitOpsAuthModeType {
    SSH = 'SSH',
    PASSWORD = 'PASSWORD',
    SSH_AND_PASSWORD = 'PAT_AND_SSH',
}

export interface BaseGitOpsType {
    authMode: GitOpsAuthModeType
    sshKey: string
    sshHost: string
    username: string
    token: string
}

export type GitOpsFieldKeyType =
    | 'host'
    | 'username'
    | 'token'
    | 'gitHubOrgId'
    | 'azureProjectName'
    | 'gitLabGroupId'
    | 'bitBucketWorkspaceId'
    | 'bitBucketProjectKey'
    | 'sshHost'
    | 'sshKey'

export interface AppInfoListType {
    application: string
    appStatus: string
    deploymentStatus: string
    lastDeployed: string
    lastDeployedImage?: string
    lastDeployedBy?: string
    appId: number
    envId: number
    pipelineId?: number
    commits?: string[]
    ciArtifactId?: number
}

export interface EnvListMinDTO {
    id: number
    active: boolean
    allowedDeploymentTypes: DeploymentAppTypes[] | null
    appCount: number
    cluster_id: number
    cluster_name: string
    default: boolean
    description: string
    environmentIdentifier: string
    environment_name: string
    isClusterCdActive: boolean
    isDigestEnforcedForEnv: boolean
    isVirtualEnvironment: boolean
    namespace: string
}

export interface EnvironmentType {
    /**
     * Unique identifier for the environment
     */
    id: number
    /**
     * Name of the environment
     */
    name: string
    /**
     * Associated namespace for the environment
     */
    namespace: string
    /**
     * Type of the environment
     */
    environmentType: EnvironmentTypeEnum
    /**
     * Associated cluster for the environment
     */
    cluster: string
    /**
     * If true, denotes virtual environment
     */
    isVirtual: boolean
}

export interface CreatedByDTO {
    icon: boolean
    id: number
    name: string
}

export enum DependencyType {
    UPSTREAM = 'upstream',
    DOWNSTREAM = 'downstream',
    LEVEL = 'level',
}

export enum PromiseAllStatusType {
    FULFILLED = 'fulfilled',
    REJECTED = 'rejected',
}

export type ApiQueuingWithBatchResponseItem<T> =
    | {
          status: PromiseAllStatusType.FULFILLED
          value: T
      }
    | {
          status: PromiseAllStatusType.REJECTED
          reason: ServerErrors
      }

export interface BatchConfigType {
    lastIndex: number
    results: any[]
    concurrentCount: number
    completedCalls: number
}
export interface scrollableInterface {
    autoBottomScroll: boolean
}

export enum URLProtocolType {
    HTTP = 'http:',
    HTTPS = 'https:',
    SSH = 'ssh:',
    SMTP = 'smtp:',
    S3 = 's3:',
}

export type BaseFilterQueryParams<T> = {
    /**
     * Offset for the list result
     */
    offset?: number
    /**
     * Number of items required in the list
     */
    size?: number
    /**
     * Search string (if any)
     */
    searchKey?: string
    /**
     * If true, all items are returned with any search / filtering applied without pagination
     */
    showAll?: boolean
} & SortingParams<T>

export enum ConfigurationType {
    GUI = 'GUI',
    YAML = 'YAML',
}

export const CONFIGURATION_TYPE_OPTIONS: SegmentedControlProps['segments'] = [
    { label: ConfigurationType.GUI, value: ConfigurationType.GUI },
    { label: ConfigurationType.YAML, value: ConfigurationType.YAML },
] as const

export interface BaseURLParams {
    appId: string
    envId: string
    clusterId: string
}

export interface ConfigKeysWithLockType {
    config: string[]
    allowed: boolean
}

export type DataAttributes = Record<`data-${string}`, unknown>

export enum RuntimeParamsHeadingType {
    KEY = 'key',
    VALUE = 'value',
}

export enum ACCESS_TYPE_MAP {
    DEVTRON_APPS = 'devtron-app', // devtron app work flow
    HELM_APPS = 'helm-app', // helm app work flow
    JOBS = '', // Empty string is intentional since there is no bifurcation in jobs as of now
}

export enum EntityTypes {
    CHART_GROUP = 'chart-group',
    DIRECT = 'apps',
    JOB = 'jobs',
    DOCKER = 'docker',
    GIT = 'git',
    CLUSTER = 'cluster',
    NOTIFICATION = 'notification',
}

export interface CustomRoles {
    id: number
    roleName: string
    roleDisplayName: string
    roleDescription: string
    entity: EntityTypes
    accessType: ACCESS_TYPE_MAP.DEVTRON_APPS | ACCESS_TYPE_MAP.HELM_APPS
}

export type MetaPossibleRoles = Record<
    CustomRoles['roleName'],
    {
        value: CustomRoles['roleDisplayName']
        description: CustomRoles['roleDescription']
    }
>

export interface CustomRoleAndMeta {
    customRoles: CustomRoles[]
    possibleRolesMetaForDevtron: MetaPossibleRoles
    possibleJobRoles: SelectPickerOptionType<string>[]
    possibleRolesMetaForCluster: MetaPossibleRoles
}

export interface UserRoleConfig {
    // can be '' if access manager has no base access
    baseRole: string
    /**
     * Only for devtron apps
     */
    additionalRoles?: Set<string>
    /**
     * Only for devtron apps
     */
    accessManagerRoles?: Set<string>
}

export type RoleType = keyof UserRoleConfig

export type RoleSelectorOptionType = Pick<SelectPickerOptionType, 'label' | 'description'> & {
    value: string
    roleType: RoleType
}

interface CommonTabArgsType {
    /**
     * Name for the tab.
     *
     * Note: Used for the title
     */
    name: string
    kind?: string
    /**
     * URL for the tab
     */
    url: string
    /**
     * If true, the tab is selected
     */
    isSelected: boolean
    /**
     * Title for the tab
     */
    title?: string
    /**
     * Type for the tab
     *
     * Note: Fixed tabs are always places before dynamic tabs
     */
    type: 'fixed' | 'dynamic'
    /**
     * Dynamic title for the tab
     *
     * @default ''
     */
    dynamicTitle?: string
    /**
     * Whether to show the tab name when selected
     *
     * @default false
     */
    showNameOnSelect?: boolean
    /**
     * Would remove the title/name from tab heading, but that does not mean name is not required, since it is used in other calculations
     * @default false
     */
    hideName?: boolean
    /**
     * Indicates if showNameOnSelect tabs have been selected once
     *
     * @default false
     */
    isAlive?: boolean
    lastSyncMoment?: Dayjs
    componentKey?: string
    /**
     * Custom tippy config for the tab
     *
     * This overrides the tippy being computed from tab title
     */
    tippyConfig?: {
        title: string
        descriptions: {
            info: string
            value: string
        }[]
    }
    /**
     * If true, the fixed tab remains mounted on initial load of the component
     *
     * Note: Not for dynamic tabs atm
     *
     * @default false
     */
    shouldRemainMounted?: boolean
}

export type InitTabType = Omit<CommonTabArgsType, 'type'> &
    (
        | {
              type: 'fixed'
              /**
               * Unique identifier for the fixed tab
               *
               * Note: Shouldn't contain '-'
               */
              id: string
              idPrefix?: never
          }
        | {
              type: 'dynamic'
              id?: never
              idPrefix: string
          }
    )

export interface DynamicTabType extends CommonTabArgsType {
    id: string
    /**
     * Id of the last active tab before switching to current tab
     */
    lastActiveTabId: string | null
}

export interface ResourceApprovalPolicyConfigDTO {
    appId: number
    envId: number
    approvalConfigurations: ApprovalConfigDataType[]
}

export interface ResourceApprovalPolicyConfigType
    extends Omit<ResourceApprovalPolicyConfigDTO, 'state' | 'approvalConfigurations'> {
    isApprovalApplicable: boolean
    approvalConfigurationMap: Record<ApprovalConfigDataType['kind'], ApprovalConfigDataType>
}

export type ResourceIdToResourceApprovalPolicyConfigMapType = Record<
    ResourceApprovalPolicyConfigType['envId'] | typeof BASE_CONFIGURATION_ENV_ID,
    Pick<ResourceApprovalPolicyConfigType, 'isApprovalApplicable' | 'approvalConfigurationMap'>
>

export interface PreventOutsideFocusProps {
    identifier: string
    preventFocus: boolean
}

export interface PolicyBlockInfo {
    isBlocked: boolean
    blockedBy: TriggerBlockType
    reason: string
}

export interface PipelineStageBlockInfo {
    node: PolicyBlockInfo
    pre: PolicyBlockInfo
    post: PolicyBlockInfo
}

export interface PolicyConsequencesDTO {
    cd: PipelineStageBlockInfo
    ci: PipelineStageBlockInfo
}

export interface GetPolicyConsequencesProps extends Pick<APIOptions, 'abortControllerRef'> {
    appId: number
    envId: number
}
export interface UploadFileDTO {
    id: number
    name: string
    size: number
    mimeType: string
    extension: string
}

export interface UploadFileProps {
    file: File[]
    allowedExtensions?: string[]
    maxUploadSize?: number
}

/**
 * A utility type that transforms all properties of a given type `T` to be optional and of type `never`. \
 * This can be useful for scenarios where you want to explicitly mark that certain properties should not exist.
 * @template T - The type whose properties will be transformed.
 */
export type Never<T> = {
    [K in keyof T]?: never
}

export interface TargetPlatformItemDTO {
    name: string
}

export interface TargetPlatformsDTO {
    targetPlatforms: TargetPlatformItemDTO[]
}

/**
 * These status are expected to be present in workflow nodes like ci node, linked ci node, job overview, etc.
 */
export enum WorkflowStatusEnum {
    STARTING = 'Starting',
    RUNNING = 'Running',
    PROGRESSING = 'Progressing',
    WAITING_TO_START = 'WaitingToStart',
    TIMED_OUT = 'TimedOut',
    CANCELLED = 'CANCELLED',
}

export enum CIPipelineNodeType {
    EXTERNAL_CI = 'EXTERNAL-CI',
    CI = 'CI',
    LINKED_CI = 'LINKED-CI',
    JOB_CI = 'JOB-CI',
    LINKED_CD = 'LINKED_CD',
}

export interface ChangeCIPayloadType {
    appWorkflowId: number
    switchFromCiPipelineId?: number
    appId: number
    switchFromExternalCiPipelineId?: number
}

export const TriggerType = {
    Auto: 'AUTOMATIC',
    Manual: 'MANUAL',
} as const

export type ComponentLayoutType = 'row' | 'column'

export interface BorderConfigType {
    /**
     * If false, (border-radius/border)-top is not applied
     *
     * @default true
     */
    top?: boolean
    /**
     * If false, (border-radius/border)-right is not applied
     *
     * @default true
     */
    right?: boolean
    /**
     * If false, (border-radius/border)-bottom is not applied
     *
     * @default true
     */
    bottom?: boolean
    /**
     * If false, (border-radius/border)-left is not applied
     *
     * @default true
     */
    left?: boolean
}

export interface AppEnvIdType {
    appId: number
    envId: number
}

export enum LicenseInfoDialogType {
    ABOUT = 'about',
    LICENSE = 'license',
    UPDATE = 'update',
}

export enum LicensingErrorCodes {
    FingerPrintMisMatch = '11001',
    LicenseExpired = '11002',
    TamperedCertificate = '11003',
    NoPublicKey = '11004',
    InstallationModeMismatch = '11005',
    LicKeyMismatch = '11006',
    NoCertFound = '11007',
    LicKeyNotFound = '11008',
}

export interface LicenseErrorStruct {
    code: LicensingErrorCodes
    userMessage: string
}

export interface DevtronLicenseBaseDTO {
    fingerprint: string | null
    isTrial: boolean | null
    /**
     * In timestamp format
     */
    expiry: string | null
    /**
     * Can be negative, depicts time left in seconds for license to expire
     */
    ttl: number | null
    /**
     * Show a reminder after these many DAYS left for license to expire, i.e,
     * Show if `ttl` is less than `reminderThreshold` [converted to seconds]
     */
    reminderThreshold: number | null
    organisationMetadata: {
        name: string | null
        domain: string | null
    } | null
    license: string | null
}

export type DevtronLicenseDTO<isCentralDashboard extends boolean = false> = DevtronLicenseBaseDTO &
    (isCentralDashboard extends true
        ? {
              claimedByUserDetails: {
                  firstName: string | null
                  lastName: string | null
                  email: string | null
              } | null
              showLicenseData?: never
              licenseStatusError?: never
          }
        : {
              claimedByUserDetails?: never
              showLicenseData: boolean
              licenseStatusError?: LicenseErrorStruct
          })

export type CountryISO2Type = ParsedCountry['iso2']

export enum ResponseHeaders {
    LICENSE_STATUS = 'X-License-Status',
}

export type IconBaseSizeType =
    | 6
    | 8
    | 10
    | 12
    | 14
    | 16
    | 18
    | 20
    | 22
    | 24
    | 28
    | 30
    | 32
    | 34
    | 36
    | 40
    | 42
    | 44
    | 48
    | 72
    | 80

export type IconBaseColorType =
    | `${'B' | 'N' | 'G' | 'Y' | 'R' | 'V' | 'O'}${`${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}00` | '50' | '0'}`
    | 'white'
    | 'black'
    | null

export interface GetTimeDifferenceParamsType {
    startTime: string
    endTime: string
    /**
     * @default '-'
     */
    fallbackString?: string
}
