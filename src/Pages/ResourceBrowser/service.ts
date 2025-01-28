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

import { get, post, put, trash } from '@Common/Api'
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
import { ClusterDetail, NodeCordonRequest } from './types'

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

export const cordonNodeCapacity = (
    requestPayload: NodeCordonRequest,
    abortControllerRef?: APIOptions['abortControllerRef'],
): Promise<ResponseType> => put(`${ROUTES.NODE_CAPACITY}/cordon`, requestPayload, { abortControllerRef })

export const drainNodeCapacity = (
    requestPayload: NodeActionRequest,
    abortControllerRef?: APIOptions['abortControllerRef'],
): Promise<ResponseType> => put(`${ROUTES.NODE_CAPACITY}/drain`, requestPayload, { abortControllerRef })

export const getClusterListRaw = () => get<ClusterDetail[]>(ROUTES.CLUSTER_LIST_RAW)
