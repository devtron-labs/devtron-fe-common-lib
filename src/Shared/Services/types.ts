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

import { MainContext } from '@Shared/Providers'

import { getUrlWithSearchParams } from '../../Common'
import { PolicyKindType, ResourceKindType, ResourceVersionType } from '../types'

export interface BaseAppMetaData {
    appId: number
    appName: string
}

export interface ClusterType {
    id: number
    name: string
    /**
     * If true, denotes virtual cluster
     */
    isVirtual: boolean
    /**
     * If true, denotes prod labelled cluster
     */
    isProd: boolean
}

/**
 * T => Type of query params
 * K => Type of kind
 * P => Type of version
 */
interface BaseGetApiUrlProps<T, K extends ResourceKindType | PolicyKindType, P extends ResourceVersionType> {
    baseUrl: string
    kind: K
    version: P
    suffix?: string
    queryParams?: T extends Parameters<typeof getUrlWithSearchParams>[1] ? T : never
}

export interface GetResourceApiUrlProps<T> extends BaseGetApiUrlProps<T, ResourceKindType, ResourceVersionType> {}

export interface GetPolicyApiUrlProps<T>
    extends Omit<BaseGetApiUrlProps<T, PolicyKindType, ResourceVersionType>, 'baseUrl'> {}

export interface EnvironmentDataValuesDTO extends Pick<MainContext, 'featureGitOpsFlags'> {
    isAirGapEnvironment: boolean
    isManifestScanningEnabled: boolean
    canOnlyViewPermittedEnvOrgLevel: boolean
    devtronManagedLicensingEnabled: boolean
}
