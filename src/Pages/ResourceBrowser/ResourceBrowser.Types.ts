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

import { RefObject } from 'react'

import { Nodes, NodeType } from '@Shared/types'

export interface GVKType {
    Group: string
    Version: string
    Kind: Nodes | NodeType
}

export interface ApiResourceGroupType {
    gvk: GVKType
    namespaced: boolean
    isGrouped?: boolean
    shortNames?: string[] | null
}

export interface ApiResourceType {
    apiResources: ApiResourceGroupType[]
    allowedAll: boolean
}

export interface K8SObjectBaseType {
    name: string
    isExpanded: boolean
}

interface K8sRequestResourceIdentifierType {
    groupVersionKind: GVKType
    namespace?: string
    name?: string
}

interface ResourceListPayloadK8sRequestType {
    resourceIdentifier: K8sRequestResourceIdentifierType
    patch?: string
    forceDelete?: boolean
}

export interface K8sResourceListPayloadType {
    clusterId: number
    filter?: string
    k8sRequest: ResourceListPayloadK8sRequestType
}

export type K8sResourceDetailDataType = {
    [key: string]: string | number | object | boolean
}

export interface K8sResourceDetailType {
    headers: string[]
    data: K8sResourceDetailDataType[]
}

export interface BulkSelectionActionWidgetProps {
    count: number
    handleOpenBulkDeleteModal: () => void
    handleClearBulkSelection: () => void
    handleOpenCordonNodeModal: () => void
    handleOpenUncordonNodeModal: () => void
    handleOpenDrainNodeModal: () => void
    handleOpenRestartWorkloadModal: () => void
    parentRef: RefObject<HTMLDivElement>
    showBulkRestartOption: boolean
    showNodeListingOptions: boolean
}

export type RBBulkOperationType = 'restart' | 'delete' | 'cordon' | 'uncordon' | 'drain'

export interface CreateResourceRequestBodyType {
    appId: string
    clusterId: number
    k8sRequest: {
        resourceIdentifier: Required<K8sRequestResourceIdentifierType>
        patch?: string
    }
}

export interface ResourceManifestDTO {
    manifestResponse: {
        manifest: Record<string, unknown>
    }
    secretViewAccess: boolean
}

export interface CreateResourceRequestBodyParamsType
    extends Pick<CreateResourceRequestBodyType, 'clusterId'>,
        Required<Pick<K8sRequestResourceIdentifierType, 'name' | 'namespace'>> {
    updatedManifest?: string
    group: GVKType['Group']
    version: GVKType['Version']
    kind: GVKType['Kind']
}

export interface CreateResourcePayload {
    clusterId: number
    manifest: string
}

export interface CreateResourceDTO {
    kind: string
    name: string
    isUpdate: boolean
    error: string
}

export interface ResourceListPayloadType {
    clusterId: number
    k8sRequest: {
        resourceIdentifier: {
            groupVersionKind: GVKType
            namespace?: string
            name?: string
        }
        patch?: string
        forceDelete?: boolean
    }
}

export interface ResourceType {
    kind: string
    name: string
    isUpdate: boolean
    error: string
}

export interface NodeActionRequest {
    clusterId?: number
    name: string
    version: string
    kind: string
}
