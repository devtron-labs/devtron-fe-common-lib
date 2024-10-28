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

import { NodeType, Nodes } from '@Shared/types'

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
    [key: string]: string | number | object
}

export interface K8sResourceDetailType {
    headers: string[]
    data: K8sResourceDetailDataType[]
}
