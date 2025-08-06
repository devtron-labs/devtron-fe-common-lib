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

export interface BulkEditConfigV2Type {
    gvk: string
    readme: string
    schema: Record<string, any>
}

export interface AppEnvDetail {
    appName: string
    envName?: string
    message: string
}

export interface ObjectsWithAppEnvDetail extends AppEnvDetail {
    names: string[]
}

export interface DeploymentTemplateResponse {
    message: string[]
    failure: AppEnvDetail[]
    successful: AppEnvDetail[]
}

export interface CmCsResponse {
    message: string[]
    failure: ObjectsWithAppEnvDetail[]
    successful: ObjectsWithAppEnvDetail[]
}

export interface BulkEditResponseType {
    deploymentTemplate?: DeploymentTemplateResponse
    configMap?: CmCsResponse
    secret?: CmCsResponse
}

export interface ImpactedDeploymentTemplate {
    appId?: number
    envId?: number
    appName: string
    envName?: string
}

export interface ImpactedCmCs {
    appId?: number
    envId?: number
    appName: string
    envName?: string
    names: string[]
}

export interface ImpactedObjectsType {
    deploymentTemplate?: ImpactedDeploymentTemplate[]
    configMap?: ImpactedCmCs[]
    secret?: ImpactedCmCs[]
}

export enum BulkEditVersion {
    v1 = 'batch/v1beta1',
    v2 = 'batch/v1beta2',
}
