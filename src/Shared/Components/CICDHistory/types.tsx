import {
    OptionType,
    UserApprovalMetadataType,
    ReleaseTag,
    ImageComment,
    PromotionApprovalMetadataType,
    FilterConditionsListType,
} from '../../../Common'
import { DeploymentStageType } from '../../constants'
import { GitTriggers } from '../../types'

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

export interface CiMaterial {
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
}
export interface SidebarType {
    type: HistoryComponentType
    filterOptions: CICDSidebarFilterOptionType[]
    triggerHistory: Map<number, History>
    hasMore: boolean
    setPagination: React.Dispatch<React.SetStateAction<{ offset: number; size: number }>>
    fetchIdData?: FetchIdDataStatus
    handleViewAllHistory?: () => void
}

export interface HistorySummaryCardType {
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
}

export interface SummaryTooltipCardType {
    status: string
    startedOn: string
    triggeredBy: number
    triggeredByEmail: string
    ciMaterials: CiMaterial[]
    gitTriggers: Map<number, GitTriggers>
}
