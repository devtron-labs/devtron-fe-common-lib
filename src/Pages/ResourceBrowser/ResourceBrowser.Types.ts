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
import { RefObject } from 'react'

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

export interface BulkSelectionActionWidgetProps {
    count: number
    handleOpenBulkDeleteModal: () => void
    handleClearBulkSelection: () => void
    handleOpenRestartWorkloadModal: () => void
    parentRef: RefObject<HTMLDivElement>
    showBulkRestartOption: boolean
}

export interface BulkOperation {
    name: string
    namespace: string
    operation: (signal: AbortSignal, data?: unknown) => Promise<void>
}

export interface BulkOperationModalProps {
    operationType: 'restart' | 'delete'
    clusterName: string
    operations: NonNullable<BulkOperation[]>
    handleModalClose: () => void
    resourceKind: string
    handleReloadDataAfterBulkOperation?: () => void
    hideResultsDrawer?: boolean
    removeTabByIdentifier?: (id: string) => Promise<string>
}

export type BulkOperationModalState = BulkOperationModalProps['operationType'] | 'closed'
