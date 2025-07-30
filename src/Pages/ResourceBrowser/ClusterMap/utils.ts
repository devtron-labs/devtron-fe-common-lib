/*
 * Copyright (c) 2024. Devtron Inc.
 */

import { ClusterEntitiesTypes, ClusterStatusAndType, StatusCountEnum } from './types'

/**
 *
 * @param filteredList
 * @returns healthyCount, unhealthyCount, connectionFailedCount, prodCount, virtualCount
 */
export const getStatusCount = (filteredList: ClusterStatusAndType[]): StatusCountEnum => {
    const statusCounts = filteredList.reduce(
        (acc, dataItem) => {
            if (dataItem.isProd) {
                acc.prodCount += 1
            }
            if (dataItem.isVirtualCluster) {
                acc.virtualCount += 1
                return acc // Skip further processing for virtual clusters as we ignore their status
            }
            switch (dataItem.status) {
                case 'healthy':
                    acc.healthyCount += 1
                    break
                case 'unhealthy':
                    acc.unhealthyCount += 1
                    break
                case 'connection failed':
                    acc.connectionFailedCount += 1
                    break
                default:
                    break
            }
            return acc
        },
        { healthyCount: 0, unhealthyCount: 0, connectionFailedCount: 0, virtualCount: 0, prodCount: 0 },
    )

    return statusCounts
}

/**
 *
 * @param filteredList
 * @returns statusEntities, deploymentEntities
 *
 */
export const getEntities = (filteredList: ClusterStatusAndType[]): ClusterEntitiesTypes => {
    const { healthyCount, unhealthyCount, connectionFailedCount, prodCount, virtualCount } =
        getStatusCount(filteredList)

    const statusEntities = [
        {
            value: healthyCount,
            label: 'Healthy',
            color: 'var(--G500)',
            proportionalValue: `${healthyCount}/${filteredList.length}`,
        },
        {
            value: unhealthyCount,
            label: 'Unhealthy',
            color: 'var(--Y500)',
            proportionalValue: `${unhealthyCount}/${filteredList.length}`,
        },
        {
            value: connectionFailedCount,
            label: 'Connection Failed',
            color: 'var(--R500)',
            proportionalValue: `${connectionFailedCount}/${filteredList.length}`,
        },
        {
            value: virtualCount,
            label: 'Isolated Clusters',
            color: 'var(--N300)',
            proportionalValue: `${virtualCount}/${filteredList.length}`,
        },
    ]

    const deploymentEntities = [
        {
            value: prodCount,
            label: 'Production',
            color: 'var(--B300)',
            proportionalValue: `${prodCount}/${filteredList.length}`,
        },
        {
            value: filteredList.length - prodCount,
            label: 'Non-Production',
            color: 'var(--N300',
            proportionalValue: `${filteredList.length - prodCount}/${filteredList.length}`,
        },
    ]
    return { statusEntities, deploymentEntities }
}
