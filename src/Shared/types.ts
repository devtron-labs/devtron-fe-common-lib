import { OptionType, CommonNodeAttr, ResponseType, UserApprovalConfigType, VulnerabilityType } from '../Common'
import { PatchOperationType } from './constants'

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
}

/**
 * Versions support for the resources on BE
 */
export enum ResourceVersionType {
    v1 = 'v1',
    alpha1 = 'alpha1',
}

interface LastExecutionResultType {
    scanExecutionId: number
    lastExecution: string
    appId?: number
    appName?: string
    envId?: number
    envName?: string
    pod?: string
    replicaSet?: string
    image?: string
    objectType: 'app' | 'chart'
    scanned: boolean
    scanEnabled: boolean
    severityCount: {
        critical: number
        moderate: number
        low: number
    }
    vulnerabilities: VulnerabilityType[]
    scanToolId?: number
}

export interface LastExecutionResponseType extends ResponseType<LastExecutionResultType> {}

export interface MaterialSecurityInfoType {
    isScanned: boolean
    isScanEnabled: boolean
}
