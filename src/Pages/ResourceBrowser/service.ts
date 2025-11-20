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

import { get, post, put, trash } from '@Common/API'
import { ROUTES } from '@Common/Constants'
import { APIOptions, ResponseType } from '@Common/Types'

import { createResourceRequestBody } from '..'
import {
    CreateResourceDTO,
    CreateResourcePayload,
    GVKType,
    K8sResourceDetailType,
    K8sResourceListPayloadType,
    NodeActionRequest,
    ResourceListPayloadType,
    ResourceManifestDTO,
    ResourceType,
} from './ResourceBrowser.Types'
import { ClusterDetail, GetResourceManifestProps, NodeCordonRequest } from './types'

export const getK8sResourceList = (
    resourceListPayload: K8sResourceListPayloadType,
    signal?: AbortSignal,
): Promise<ResponseType<K8sResourceDetailType>> =>
    post(ROUTES.K8S_RESOURCE_LIST, resourceListPayload, {
        signal,
    })

export const createNewResource = (
    resourceListPayload: CreateResourcePayload,
    abortControllerRef?: APIOptions['abortControllerRef'],
): Promise<ResponseType<CreateResourceDTO[]>> =>
    post(ROUTES.K8S_RESOURCE_CREATE, resourceListPayload, { abortControllerRef })

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

export const getClusterListRaw = (abortControllerRef?: APIOptions['abortControllerRef']) =>
    get<ClusterDetail[]>(ROUTES.CLUSTER_LIST_RAW, { abortControllerRef })

export const getK8sResourceManifest = ({ selectedResource, signal }: GetResourceManifestProps) =>
    post<ResourceManifestDTO>(
        ROUTES.K8S_RESOURCE,
        createResourceRequestBody({
            clusterId: selectedResource.clusterId,
            group: selectedResource.group,
            version: selectedResource.version,
            kind: selectedResource.kind as GVKType['Kind'],
            name: selectedResource.name,
            namespace: selectedResource.namespace,
            updatedManifest: null,
        }),
        { signal },
    )
