import { OptionType, CommonNodeAttr, ResponseType, UserApprovalConfigType, VulnerabilityType } from '../Common'
import { EnvironmentTypeEnum, PatchOperationType } from './constants'

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
    MODERATE = 'moderate',
    LOW = 'low',
}

export enum ImagePromotionTabs {
    REQUEST = 'request',
    PENDING = 'pending',
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
    approvalConfiguredIdsMap?: Record<number, UserApprovalConfigType>
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

export interface RuntimeParamsAPIResponseType {
    envVariables: Record<string, string>
}

export interface RuntimeParamsTriggerPayloadType {
    runtimeParams: RuntimeParamsAPIResponseType
}

export enum CIMaterialSidebarType {
    CODE_SOURCE = 'Code Source',
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
 * @example Usage with `PatchOperationType.remove`
 * Note: Value is not allowed for remove operation
 *
 * ```ts
 * const query: PatchQueryType<string> = {
 *  op: PatchOperationType.remove,
 *  path: 'name'
 * }
 * ```
 */
export type PatchQueryType<T extends string, K = unknown> = {
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
          value?: never
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
    tenant = 'tenant',
    installation = 'installation',
    environment = 'environment',
}

/**
 * Versions support for the resources on BE
 */
export enum ResourceVersionType {
    v1 = 'v1',
    alpha1 = 'alpha1',
}

export interface LastExecutionResultType {
    lastExecution: string
    severityCount: {
        critical: number
        moderate: number
        low: number
    }
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
}

export interface LastExecutionResponseType extends ResponseType<LastExecutionResultType> {}

export interface MaterialSecurityInfoType {
    isScanned: boolean
    isScanEnabled: boolean
}

export enum WebhookEventNameType {
    PULL_REQUEST = 'Pull Request',
    TAG_CREATION = 'Tag Creation',
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
    Overview = 'Overview',
}

// FIXME: This should be `typeof Nodes[keyof typeof Nodes]` instead since the key and values are not the same. Same to be removed from duplications in dashboard
export type NodeType = keyof typeof Nodes

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
}

export type AggregationKeysType = keyof typeof AggregationKeys

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
