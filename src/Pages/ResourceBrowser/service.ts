import { get, post, trash } from '@Common/Api'
import { ROUTES } from '@Common/Constants'
import { APIOptions, ResponseType } from '@Common/Types'
import {
    CreateResourceDTO,
    CreateResourcePayload,
    K8sResourceDetailType,
    K8sResourceListPayloadType,
    NodeActionRequest,
    ResourceListPayloadType,
    ResourceType,
} from './ResourceBrowser.Types'
import { ClusterDetail } from './types'

export const getK8sResourceList = (
    resourceListPayload: K8sResourceListPayloadType,
    signal?: AbortSignal,
): Promise<ResponseType<K8sResourceDetailType>> =>
    post(ROUTES.K8S_RESOURCE_LIST, resourceListPayload, {
        signal,
    })

export const createNewResource = (
    resourceListPayload: CreateResourcePayload,
): Promise<ResponseType<CreateResourceDTO[]>> => post(ROUTES.K8S_RESOURCE_CREATE, resourceListPayload)

export const deleteResource = (
    resourceListPayload: ResourceListPayloadType,
    abortControllerRef?: APIOptions['abortControllerRef'],
): Promise<ResponseType<ResourceType[]>> => post(ROUTES.DELETE_RESOURCE, resourceListPayload, { abortControllerRef })

export const deleteNodeCapacity = (
    requestPayload: NodeActionRequest,
    abortControllerRef?: APIOptions['abortControllerRef'],
): Promise<ResponseType> => trash(ROUTES.NODE_CAPACITY, requestPayload, { abortControllerRef })

export const getClusterListRaw = () => get<ClusterDetail[]>(ROUTES.CLUSTER_LIST_RAW)
