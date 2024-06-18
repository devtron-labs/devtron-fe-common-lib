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
    isSelected: boolean
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
