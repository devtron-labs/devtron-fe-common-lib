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

import { Dispatch, SetStateAction, ReactElement } from 'react'
import { InstallationClusterType } from '@Shared/index'
import { NodeActionRequest } from './ResourceBrowser.Types'

export enum ClusterFiltersType {
    ALL_CLUSTERS = 'all',
    HEALTHY = 'healthy',
    UNHEALTHY = 'unhealthy',
}

export enum InstallationClusterStatus {
    Creating = 'Creating',
    Updating = 'Updating',
    Succeeded = 'Succeeded',
    Failed = 'Failed',
}

export enum ClusterStatusType {
    HEALTHY = 'healthy',
    UNHEALTHY = 'unhealthy',
    CONNECTION_FAILED = 'connection failed',
    CREATING = 'creating',
    UPDATING = 'updating',
}

export interface ResourceDetail {
    name: string
    capacity: string
    allocatable: string
    usage: string
    request: string
    limit: string
    usagePercentage: string
    requestPercentage: string
    limitPercentage: string
}

export interface NodeTaintType {
    effect: string
    key: string
    value: string
}

export interface NodeDetailsType {
    nodeName: string
    nodeGroup: string
    taints?: NodeTaintType[]
}

export interface ClusterCapacityType {
    name: string
    nodeCount: number
    nodeK8sVersions: string[]
    cpu: ResourceDetail
    memory: ResourceDetail
    serverVersion: string
    nodeDetails?: NodeDetailsType[]
    nodeErrors: Record<string, string>[]
    status?: ClusterStatusType
    isProd: boolean
    installationId?: number
}

export interface ClusterDetail extends ClusterCapacityType {
    id: number
    errorInNodeListing: string
    nodeNames?: string[]
    isVirtualCluster?: boolean
    isInstallationCluster?: boolean
}

interface NodeCordonOptions {
    unschedulableDesired: boolean
}

export interface NodeCordonRequest extends NodeActionRequest {
    nodeCordonOptions: NodeCordonOptions
}

interface NodeDrainOptions {
    gracePeriodSeconds: number
    deleteEmptyDirData: boolean
    disableEviction: boolean
    force: boolean
    ignoreAllDaemonSets: boolean
}

export interface NodeDrainRequest extends NodeActionRequest {
    nodeDrainOptions: NodeDrainOptions
}

export interface AdditionalConfirmationModalOptionsProps<T = unknown> {
    optionsData: T
    setOptionsData: Dispatch<SetStateAction<T>>
    children?: ReactElement
}

export interface InstallationClusterStepType {
    lastTransitionTime: string
    lastProbeTime: string
    message: string
    reason: string
    status: 'False' | 'True' | 'Unknown'
    type: string
}

export interface InstallationClusterConfigDTO {
    installationId: number
    installationStatus: InstallationClusterStatus
    name: string
    values: string
    valuesSchema: string
    isProd: boolean
    installationType: InstallationClusterType
    conditions: InstallationClusterStepType[]
}

export interface InstallationClusterConfigType extends Pick<InstallationClusterConfigDTO, 'installationType'> {
    schema: object
    values: object
    installationId: number
    name: string
    status: InstallationClusterStatus
}
