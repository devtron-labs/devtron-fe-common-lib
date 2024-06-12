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

import { getUrlWithSearchParams } from '../../Common'
import { ResourceKindType, ResourceVersionType } from '../types'

export interface ClusterType {
    id: number
    name: string
    /**
     * If true, denotes virtual cluster
     */
    isVirtual: boolean
}

export interface GetResourceApiUrlProps<T> {
    baseUrl: string
    kind: ResourceKindType
    version: ResourceVersionType
    queryParams?: T extends Parameters<typeof getUrlWithSearchParams>[1] ? T : never
}
