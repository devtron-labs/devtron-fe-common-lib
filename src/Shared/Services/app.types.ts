import { ReleaseTag } from '../../Common'

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

interface MaterialHistoryType {
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

export interface CIMaterialInfoDTO {
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
        >,
        ImageTaggingDataType {
    materials: CIMaterialType[]
}

export interface GetCITriggerInfoParamsType {
    envId: number | string
    ciArtifactId: number | string
}
