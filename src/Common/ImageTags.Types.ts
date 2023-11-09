export interface ReleaseTag {
    id: number
    tagName: string
    appId: number
    deleted: boolean
    artifactId: number
    duplicateTag: boolean
}

export interface ImageComment {
    id: number
    comment: string
    artifactId: number
}


export interface ImageTaggingContainerType {
    ciPipelineId?: number
    artifactId?: number
    imageComment?: ImageComment
    imageReleaseTags?: ReleaseTag[]
    updateCurrentAppMaterial? : (matId:number, releaseTags?:ReleaseTag[], imageComment?:ImageComment) => void
    appReleaseTagNames?: string[]
    tagsEditable?: boolean
    forceReInit?: boolean
    setAppReleaseTagNames?: (appReleaseTags: string[]) => void
    setTagsEditable?: (tagsEditable: boolean) => void
    toggleCardMode?: (id: number) => void
    hideHardDelete?: boolean
    isSuperAdmin?: boolean
}

export interface ImageButtonType {
    text: string
    isSoftDeleted: boolean
    isEditing: boolean
    onSoftDeleteClick?: any
    onHardDeleteClick?: any
    tagId: number
    softDeleteTags: any
    isSuperAdmin: any
    duplicateTag?: boolean
    hideHardDelete?: boolean
}