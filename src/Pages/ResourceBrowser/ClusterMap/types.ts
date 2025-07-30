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
