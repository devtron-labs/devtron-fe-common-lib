import { ResponseType } from '..'

// TODO: remove interface from dashboard

export interface GenericDescriptionProps {
    isClusterTerminal: boolean
    clusterId?: string
    isSuperAdmin: boolean
    appId?: number
    descriptionId?: number
    initialDescriptionText?: string
    initialDescriptionUpdatedBy?: string
    initialDescriptionUpdatedOn?: string
    initialEditDescriptionView: boolean
    updateCreateAppFormDescription?: (string) => void
    appMetaInfo? // AppMetaInfo
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
