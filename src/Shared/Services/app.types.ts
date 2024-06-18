import { ReleaseTag, SourceTypeMap } from '../../Common'

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
    type: (typeof SourceTypeMap)[keyof typeof SourceTypeMap]
    value: string
    active: boolean
    history: MaterialHistoryDTO[]
    lastFetchTime: string
    url: string
}

export interface CIMaterialType
    extends Pick<
        CIMaterialDTO,
        'id' | 'gitMaterialId' | 'gitMaterialName' | 'type' | 'value' | 'active' | 'lastFetchTime'
    > {
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
