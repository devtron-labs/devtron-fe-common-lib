import { ResponseType } from '..'

export interface GenericDescriptionProps {
    descriptionText?: string
    descriptionUpdatedBy?: string
    descriptionUpdatedOn?: string
    initialEditDescriptionView: boolean
    updateDescription: (string) => void
    title?: string
    tabIndex?: number
}

export interface ClusteNotePatchRequest {
    id: number // this is mandatory to send in the request
    identifier: number // equals clusterId for cluster description and appId for app/job description
    description: string
}

export interface ClusterNoteType {
    id: number
    description: string
    updatedBy: string
    updatedOn: string
}
export interface ClusterNoteResponse extends ResponseType {
    result?: ClusterNoteType
}

export enum MD_EDITOR_TAB {
    WRITE = 'write',
    PREVIEW = 'preview',
}

export type MDEditorSelectedTabType = 'write' | 'preview'
