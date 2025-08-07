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

/*
 * Copyright (c) 2024. Devtron Inc.
 */

import { ClusterStatusType } from '../types'

export interface ClusterStatusAndType {
    isProd: boolean
    status: ClusterStatusType
    isVirtualCluster?: boolean
}

export interface ClusterMapProps {
    isLoading?: boolean
    filteredList: ClusterStatusAndType[]
}

export interface StatusCountEnum {
    healthyCount: number
    unhealthyCount: number
    connectionFailedCount: number
    prodCount: number
    virtualCount: number
}

export interface StatusEntity {
    value: number
    label: string
    color: string
    proportionalValue: string
}

export interface ClusterEntitiesTypes {
    statusEntities: StatusEntity[]
    deploymentEntities: StatusEntity[]
}
