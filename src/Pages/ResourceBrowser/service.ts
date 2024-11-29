import { post } from '@Common/Api'
import { ROUTES } from '@Common/Constants'
import { ResponseType } from '@Common/Types'
import {
    CreateResourceDTO,
    CreateResourcePayload,
    K8sResourceDetailType,
    K8sResourceListPayloadType,
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
