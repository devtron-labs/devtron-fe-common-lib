import { ResponseType } from '..'

export interface GenericDescriptionProps {
    isSuperAdmin: boolean
    descriptionText?: string
    descriptionUpdatedBy?: string
    descriptionUpdatedOn?: string
    initialEditDescriptionView: boolean
    updateDescription: (string) => void
    releaseId: number
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
