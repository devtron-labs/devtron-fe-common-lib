import { post, trash } from '@Common/Api'
import { ROUTES } from '@Common/Constants'
import { ResponseType } from '@Common/Types'
import { MutableRefObject } from 'react'
import {
    CreateResourceDTO,
    CreateResourcePayload,
    K8sResourceDetailType,
    K8sResourceListPayloadType,
    NodeActionRequest,
    ResourceListPayloadType,
    ResourceType,
} from './ResourceBrowser.Types'

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
    abortControllerRef?: MutableRefObject<AbortController>,
): Promise<ResponseType<ResourceType[]>> => post(ROUTES.DELETE_RESOURCE, resourceListPayload, { abortControllerRef })

export const deleteNodeCapacity = (
    requestPayload: NodeActionRequest,
    abortControllerRef?: MutableRefObject<AbortController>,
): Promise<ResponseType> => trash(ROUTES.NODE_CAPACITY, requestPayload, { abortControllerRef })
