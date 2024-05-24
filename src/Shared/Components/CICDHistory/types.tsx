import { CSSProperties } from 'react'
import {
    OptionType,
    UserApprovalMetadataType,
    ReleaseTag,
    ImageComment,
    PromotionApprovalMetadataType,
    FilterConditionsListType,
    DeploymentAppTypes,
    ResponseType,
    PaginationProps,
} from '../../../Common'
import { DeploymentStageType } from '../../constants'
import { GitTriggers, Node, NodeType, ResourceKindType, ResourceVersionType } from '../../types'
import { TERMINAL_STATUS_MAP } from './constants'

export enum HistoryComponentType {
    CI = 'CI',
    CD = 'CD',
    GROUP_CI = 'GROUP_CI',
    GROUP_CD = 'GROUP_CD',
}

export enum FetchIdDataStatus {
    SUCCESS = 'SUCCESS',
    FETCHING = 'FETCHING',
    SUSPEND = 'SUSPEND',
}

export interface LogResizeButtonType {
    fullScreenView: boolean
    setFullScreenView: React.Dispatch<React.SetStateAction<boolean>>
}

export interface RunSource {
    id: number
    identifier: string
    kind: ResourceKindType
    name: string
    releaseTrackName: string
    releaseVersion: string
    version: ResourceVersionType
}

interface CiMaterial {
    id: number
    gitMaterialId: number
    gitMaterialUrl: string
    gitMaterialName: string
    type: string
    value: string
    active: boolean
    lastFetchTime: string
    isRepoError: boolean
    repoErrorMsg: string
    isBranchError: boolean
    branchErrorMsg: string
    url: string
}

export interface CICDSidebarFilterOptionType extends OptionType {
    pipelineId: number
    pipelineType?: string
    deploymentAppDeleteRequest?: boolean
}

export interface History {
    id: number
    name: string
    status: string
    podStatus: string
    podName: string
    message: string
    startedOn: string
    finishedOn: string
    ciPipelineId: number
    namespace: string
    logLocation: string
    gitTriggers: Map<number, GitTriggers>
    ciMaterials: CiMaterial[]
    triggeredBy: number
    artifact: string
    artifactId: number
    triggeredByEmail: string
    stage?: DeploymentStageType
    blobStorageEnabled?: boolean
    isArtifactUploaded?: boolean
    userApprovalMetadata?: UserApprovalMetadataType
    IsVirtualEnvironment?: boolean
    helmPackageName?: string
    environmentName?: string
    imageComment?: ImageComment
    imageReleaseTags?: ReleaseTag[]
    appReleaseTagNames?: string[]
    tagsEditable?: boolean
    appliedFilters?: FilterConditionsListType[]
    appliedFiltersTimestamp?: string
    promotionApprovalMetadata?: PromotionApprovalMetadataType
    triggerMetadata?: string
    runSource?: RunSource
}

export interface DeploymentHistoryResultObject {
    cdWorkflows: History[]
    appReleaseTagNames: string[]
    tagsEditable: boolean
    hideImageTaggingHardDelete: boolean
}

export interface DeploymentHistoryResult extends ResponseType {
    result?: DeploymentHistoryResultObject
}

export interface renderRunSourceType {
    renderRunSource?: (runSource: RunSource) => JSX.Element
}

export interface SidebarType extends renderRunSourceType {
    type: HistoryComponentType
    filterOptions: CICDSidebarFilterOptionType[]
    triggerHistory: Map<number, History>
    hasMore: boolean
    setPagination: React.Dispatch<React.SetStateAction<{ offset: number; size: number }>>
    fetchIdData?: FetchIdDataStatus
    handleViewAllHistory?: () => void
    children?: React.ReactNode
}

export interface HistorySummaryCardType extends renderRunSourceType {
    id: number
    status: string
    startedOn: string
    triggeredBy: number
    triggeredByEmail: string
    ciMaterials: CiMaterial[]
    gitTriggers: Map<number, GitTriggers>
    artifact: string
    type: HistoryComponentType
    stage: DeploymentStageType
    dataTestId?: string
    runSource?: RunSource
}

export interface SummaryTooltipCardType {
    status: string
    startedOn: string
    triggeredBy: number
    triggeredByEmail: string
    ciMaterials: CiMaterial[]
    gitTriggers: Map<number, GitTriggers>
}

export interface DeploymentTemplateList {
    id: number
    name: string
    childList?: string[]
}

export interface CurrentStatusType {
    status: string
    finishedOn: string
    artifact: string
    message: string
    podStatus: string
    stage: DeploymentStageType
    type: HistoryComponentType
    isJobView?: boolean
    workerPodName?: string
}

export interface StartDetailsType {
    startedOn: string
    triggeredBy: number
    triggeredByEmail: string
    ciMaterials: CiMaterial[]
    gitTriggers: Map<number, GitTriggers>
    artifact: string
    type: HistoryComponentType
    environmentName?: string
    isJobView?: boolean
    triggerMetadata?: string
    renderDeploymentHistoryTriggerMetaText: (triggerMetaData: string) => JSX.Element
}

export interface TriggerDetailsType {
    status: string
    startedOn: string
    finishedOn: string
    triggeredBy: number
    triggeredByEmail: string
    ciMaterials: CiMaterial[]
    gitTriggers: Map<number, GitTriggers>
    message: string
    podStatus: string
    type: HistoryComponentType
    stage: DeploymentStageType
    artifact?: string
    environmentName?: string
    isJobView?: boolean
    workerPodName?: string
    triggerMetadata?: string
    renderDeploymentHistoryTriggerMetaText: (triggerMetaData: string) => JSX.Element
}

export interface ProgressingStatusType {
    status: string
    message: string
    podStatus: string
    stage: DeploymentStageType
    type: HistoryComponentType
    finishedOn?: string
    workerPodName?: string
}

export interface WorkerStatusType {
    message: string
    podStatus: string
    stage: DeploymentStageType
    finishedOn?: string
    workerPodName?: string
}

export interface FinishedType {
    status: string
    finishedOn: string
    artifact: string
    type: HistoryComponentType
}

export interface TriggerDetailsStatusIconType {
    status: string
    isDeploymentWindowInfo?: boolean
}

export interface LogsRendererType {
    triggerDetails: History
    isBlobStorageConfigured: boolean
    parentType: HistoryComponentType
}
export interface SyncStageResourceDetail {
    id: number
    cdWorkflowRunnerId: number
    resourceGroup: string
    resourceKind: string
    resourceName: string
    resourcePhase: string
    resourceStatus: string
    statusMessage: string
}

export interface DeploymentStatusDetailsTimelineType {
    id: number
    cdWorkflowRunnerId: number
    status: string
    statusDetail: string
    statusTime: string
    resourceDetails?: SyncStageResourceDetail[]
}
export interface DeploymentStatusDetailsType {
    deploymentFinishedOn: string
    deploymentStartedOn: string
    triggeredBy: string
    statusFetchCount: number
    statusLastFetchedAt: string
    timelines: DeploymentStatusDetailsTimelineType[]
    wfrStatus?: string
}

export interface DeploymentStatusDetailsResponse extends ResponseType {
    result?: DeploymentStatusDetailsType
}

export const TERMINAL_STATUS_COLOR_CLASS_MAP = {
    [TERMINAL_STATUS_MAP.SUCCEEDED]: 'cg-5',
    [TERMINAL_STATUS_MAP.HEALTHY]: 'cg-5',
    [TERMINAL_STATUS_MAP.FAILED]: 'cr-5',
    [TERMINAL_STATUS_MAP.ERROR]: 'cr-5',
}

export const PROGRESSING_STATUS = {
    [TERMINAL_STATUS_MAP.RUNNING]: 'running',
    [TERMINAL_STATUS_MAP.PROGRESSING]: 'progressing',
    [TERMINAL_STATUS_MAP.STARTING]: 'starting',
    [TERMINAL_STATUS_MAP.INITIATING]: 'initiating',
    [TERMINAL_STATUS_MAP.QUEUED]: 'queued',
}

interface DeploymentStatusDetailRow {
    icon: string
    displayText: string
    displaySubText: string
    time: string
    resourceDetails?: any
    isCollapsed?: boolean
    kubeList?: { icon: any; message: string }[]
    timelineStatus?: string
}
export interface DeploymentStatusDetailsBreakdownDataType {
    deploymentStatus: string
    deploymentStatusText: string
    deploymentTriggerTime: string
    deploymentEndTime: string
    deploymentError: string
    triggeredBy: string
    nonDeploymentError: string
    deploymentStatusBreakdown: {
        DEPLOYMENT_INITIATED: DeploymentStatusDetailRow
        GIT_COMMIT?: DeploymentStatusDetailRow
        ARGOCD_SYNC?: DeploymentStatusDetailRow
        KUBECTL_APPLY?: DeploymentStatusDetailRow
        APP_HEALTH?: DeploymentStatusDetailRow
        HELM_PACKAGE_GENERATED?: DeploymentStatusDetailRow
    }
}

export interface DeploymentDetailStepsType {
    deploymentStatus?: string
    deploymentAppType?: DeploymentAppTypes
    isHelmApps?: boolean
    installedAppVersionHistoryId?: number
    isGitops?: boolean
    userApprovalMetadata?: UserApprovalMetadataType
    isVirtualEnvironment?: boolean
    processVirtualEnvironmentDeploymentData: (
        data?: DeploymentStatusDetailsType,
    ) => DeploymentStatusDetailsBreakdownDataType
    renderDeploymentApprovalInfo: (userApprovalMetadata: UserApprovalMetadataType) => JSX.Element
}

export interface RenderCIListHeaderProps {
    userApprovalMetadata: UserApprovalMetadataType
    triggeredBy: string
    appliedFilters: FilterConditionsListType[]
    appliedFiltersTimestamp: string
    promotionApprovalMetadata: PromotionApprovalMetadataType
    selectedEnvironmentName: string
}

export interface VirtualHistoryArtifactProps {
    status: string
    title: string
    params: {
        appId: number
        envId: number
        appName: string
        workflowId: number
    }
}
export interface TriggerOutputProps extends renderRunSourceType {
    fullScreenView: boolean
    syncState: (triggerId: number, triggerDetails: History, triggerDetailsError: any) => void
    triggerHistory: Map<number, History>
    setFullScreenView: React.Dispatch<React.SetStateAction<boolean>>
    deploymentHistoryList: DeploymentTemplateList[]
    setDeploymentHistoryList: React.Dispatch<React.SetStateAction<DeploymentTemplateList[]>>
    deploymentAppType: DeploymentAppTypes
    isBlobStorageConfigured: boolean
    appReleaseTags: string[]
    tagsEditable: boolean
    hideImageTaggingHardDelete: boolean
    fetchIdData: FetchIdDataStatus
    selectedEnvironmentName?: string
    renderCIListHeader?: (renderCIListHeaderProps: RenderCIListHeaderProps) => JSX.Element
    renderDeploymentApprovalInfo?: (userApprovalMetadata: UserApprovalMetadataType) => JSX.Element
    processVirtualEnvironmentDeploymentData?: (
        data?: DeploymentStatusDetailsType,
    ) => DeploymentStatusDetailsBreakdownDataType
    renderVirtualHistoryArtifacts?: (virtualHistoryArtifactProps: VirtualHistoryArtifactProps) => JSX.Element
    renderDeploymentHistoryTriggerMetaText?: (triggerMetaData: string) => JSX.Element
}

export interface DeploymentStatusDetailBreakdownType {
    deploymentStatusDetailsBreakdownData: DeploymentStatusDetailsBreakdownDataType
    isVirtualEnvironment?: boolean
}

export interface DeploymentStatusDetailRowType {
    type: string
    hideVerticalConnector?: boolean
    deploymentDetailedData: DeploymentStatusDetailsBreakdownDataType
}

export interface ErrorInfoStatusBarType {
    nonDeploymentError: string
    type: string
    errorMessage: string
    hideVerticalConnector?: boolean
    hideErrorIcon?: boolean
}

export interface DeploymentConfigurationsRes extends ResponseType {
    result?: DeploymentTemplateList[]
}

export interface DeploymentHistorySingleValue {
    displayName: string
    value: string
    variableSnapshot?: object
    resolvedValue?: string
}
export interface DeploymentHistoryDetail {
    componentName?: string
    values: Record<string, DeploymentHistorySingleValue>
    codeEditorValue: DeploymentHistorySingleValue
}

export interface DeploymentTemplateHistoryType {
    currentConfiguration: DeploymentHistoryDetail
    baseTemplateConfiguration: DeploymentHistoryDetail
    previousConfigAvailable: boolean
    isUnpublished?: boolean
    isDeleteDraft?: boolean
    rootClassName?: string
}
export interface DeploymentHistoryDetailRes extends ResponseType {
    result?: DeploymentHistoryDetail
}

export interface HistoryDiffSelectorList {
    id: number
    deployedOn: string
    deployedBy: string
    deploymentStatus: string
    wfrId?: number
    runSource?: RunSource
}

export interface HistoryDiffSelectorRes {
    result?: HistoryDiffSelectorList[]
}

export interface DeploymentHistorySidebarType {
    deploymentHistoryList: DeploymentTemplateList[]
    setDeploymentHistoryList: React.Dispatch<React.SetStateAction<DeploymentTemplateList[]>>
}

export interface AppStatusDetailsChartType {
    filterRemoveHealth?: boolean
    showFooter: boolean
}

export interface StatusFilterButtonType {
    nodes: Array<Node>
    handleFilterClick?: (selectedFilter: string) => void
}

export enum NodeStatus {
    Degraded = 'degraded',
    Healthy = 'healthy',
    Progressing = 'progressing',
    Missing = 'missing',
    Suspended = 'suspended',
    Unknown = 'unknown',
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

type NodesMap = {
    [key in NodeType]?: Map<string, any>
}

type Aggregation = {
    [key in AggregationKeys]: NodesMap
}

export interface AggregatedNodes {
    nodes: NodesMap
    aggregation: Aggregation
    statusCount: {
        [status: string]: number
    }
    nodeStatusCount: {
        [node in NodeType]?: {
            [status: string]: number
        }
    }
    aggregatorStatusCount: {
        [aggregator in AggregationKeys]?: {
            [status: string]: number
        }
    }
}

export interface PodMetadatum {
    name: string
    uid: string
    containers: string[]
    isNew: boolean
}

export const STATUS_SORTING_ORDER = {
    [NodeStatus.Missing]: 1,
    [NodeStatus.Degraded]: 2,
    [NodeStatus.Progressing]: 3,
    [NodeStatus.Healthy]: 4,
}

export interface TriggerDetailsResponseType extends ResponseType {
    result?: History
}

export interface ScrollerType {
    scrollToTop: (e: any) => void
    scrollToBottom: (e: any) => void
    style: CSSProperties
}

export interface GitChangesType extends Pick<History, 'promotionApprovalMetadata'> {
    gitTriggers: Map<number, GitTriggers>
    ciMaterials: CiMaterial[]
    artifact?: string
    userApprovalMetadata?: UserApprovalMetadataType
    triggeredByEmail?: string
    imageComment?: ImageComment
    imageReleaseTags?: ReleaseTag[]
    artifactId?: number
    ciPipelineId?: number
    appReleaseTagNames?: string[]
    tagsEditable?: boolean
    hideImageTaggingHardDelete?: boolean
    appliedFilters?: FilterConditionsListType[]
    appliedFiltersTimestamp?: string
    selectedEnvironmentName?: string
    renderCIListHeader: (renderCIListHeaderProps: RenderCIListHeaderProps) => JSX.Element
}

export interface ArtifactType {
    status: string
    artifact: string
    blobStorageEnabled: boolean
    isArtifactUploaded?: boolean
    getArtifactPromise?: () => Promise<any>
    isJobView?: boolean
    isJobCI?: boolean
    type: HistoryComponentType
    ciPipelineId?: number
    artifactId?: number
    imageComment?: ImageComment
    imageReleaseTags?: ReleaseTag[]
    appReleaseTagNames?: string[]
    tagsEditable?: boolean
    hideImageTaggingHardDelete?: boolean
    jobCIClass?: string
    renderCIListHeader: (renderCIListHeaderProps: RenderCIListHeaderProps) => JSX.Element
}

export interface CIListItemType extends Pick<GitChangesType, 'promotionApprovalMetadata' | 'selectedEnvironmentName'> {
    type: 'report' | 'artifact' | 'deployed-artifact'
    userApprovalMetadata?: UserApprovalMetadataType
    triggeredBy?: string
    children: any
    ciPipelineId?: number
    artifactId?: number
    imageComment?: ImageComment
    imageReleaseTags?: ReleaseTag[]
    appReleaseTagNames?: string[]
    tagsEditable?: boolean
    hideImageTaggingHardDelete?: boolean
    appliedFilters?: FilterConditionsListType[]
    appliedFiltersTimestamp?: string
    isSuperAdmin?: boolean
    renderCIListHeader: (renderCIListHeaderProps: RenderCIListHeaderProps) => JSX.Element
}

export interface DeploymentHistory {
    id: number
    cd_workflow_id: number
    name: string
    status: string
    pod_status: string
    message: string
    started_on: string
    finished_on: string
    pipeline_id: number
    namespace: string
    log_file_path: string
    triggered_by: number
    email_id?: string
    image: string
    workflow_type?: string
    imageComment?: ImageComment
    imageReleaseTags?: ReleaseTag[]
    ci_artifact_id?: number
    runSource?: RunSource
}

type DeploymentStrategyType = 'CANARY' | 'ROLLING' | 'RECREATE' | 'BLUE_GREEN'

interface DeploymentStrategy {
    deploymentTemplate: DeploymentStrategyType
    config: any
    default: boolean
}

interface PrePostStage {
    triggerType: 'AUTOMATIC' | 'MANUAL'
    name: string
    config: string
}

interface CDPipeline {
    id: number
    environmentId: number
    environmentName: string
    description: string
    ciPipelineId: number
    triggerType: string
    name: string
    strategies: DeploymentStrategy[]
    deploymentTemplate: string
    preStage: PrePostStage
    postStage: PrePostStage
    preStageConfigMapSecretNames: { configMaps: string[]; secrets: string[] }
    postStageConfigMapSecretNames: { configMaps: string[]; secrets: string[] }
    runPreStageInEnv: boolean
    runPostStageInEnv: boolean
    isClusterCdActive: boolean
    deploymentAppType?: DeploymentAppTypes
    isDeploymentBlocked?: boolean
}

export interface CDPipelines {
    pipelines: CDPipeline[]
}

export interface ModuleConfigResponse extends ResponseType {
    result?: {
        enabled: boolean
    }
}

export interface DeploymentHistoryBaseParamsType {
    appId: string
    envId: string
    pipelineId: string
}

export interface TriggerHistoryProps {
    appId: number
    envId: number
    pagination: Pick<PaginationProps, 'offset' | 'size'>
    releaseId?: number
    showCurrentReleaseDeployments?: boolean
}

export interface TriggerHistoryFilterCriteriaProps {
    appId: number
    envId: number
    releaseId: number
    showCurrentReleaseDeployments: boolean
}

export const terminalStatus = new Set(['error', 'healthy', 'succeeded', 'cancelled', 'failed', 'aborted'])
export const statusSet = new Set(['starting', 'running', 'pending'])
