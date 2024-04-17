import { ROUTES, put } from '..'
import { ClusteNotePatchRequest, ClusterNoteResponse } from './types'

// TODO: Remove from dashboard
export const patchClusterNote = (requestPayload: ClusteNotePatchRequest): Promise<ClusterNoteResponse> =>
    put(ROUTES.CLUSTER_NOTE, requestPayload)

export const patchApplicationNote = (requestPayload: ClusteNotePatchRequest): Promise<ClusterNoteResponse> =>
    put(ROUTES.APPLICATION_NOTE, requestPayload)
