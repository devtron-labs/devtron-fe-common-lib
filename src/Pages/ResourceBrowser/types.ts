import { Dispatch, SetStateAction, ReactElement } from 'react'
import { NodeActionRequest } from './ResourceBrowser.Types'

export enum ClusterFiltersType {
    ALL_CLUSTERS = 'all',
    HEALTHY = 'healthy',
    UNHEALTHY = 'unhealthy',
}

export enum ClusterStatusType {
    HEALTHY = 'healthy',
    UNHEALTHY = 'unhealthy',
    CONNECTION_FAILED = 'connection failed',
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
}

export interface ClusterDetail extends ClusterCapacityType {
    id: number
    errorInNodeListing: string
    nodeNames?: string[]
    isVirtualCluster?: boolean
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
