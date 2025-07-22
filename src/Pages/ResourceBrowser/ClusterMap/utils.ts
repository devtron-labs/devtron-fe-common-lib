/*
 * Copyright (c) 2024. Devtron Inc.
 */

import { ClusterEntitiesTypes, ClusterStatusAndType, StatusCountEnum } from './types'

/**
 *
 * @param filteredList
 * @returns healthyCount, unhealthyCount, connectionFailedCount, prodCount
 */
export const getStatusCount = (filteredList: ClusterStatusAndType[]): StatusCountEnum =>
    filteredList.reduce(
        (acc, dataItem) => {
            const updatedCounts = { ...acc }

            if (dataItem.isProd) {
                updatedCounts.prodCount += 1
            }

            switch (dataItem.status) {
                case 'healthy':
                    updatedCounts.healthyCount += 1
                    break
                case 'unhealthy':
                    updatedCounts.unhealthyCount += 1
                    break
                case 'connection failed':
                    updatedCounts.connectionFailedCount += 1
                    break
                default:
                    break // Handle cases for unexpected or missing properties, if needed
            }

            return updatedCounts
        },
        { healthyCount: 0, unhealthyCount: 0, connectionFailedCount: 0, prodCount: 0 },
    )

/**
 *
 * @param filteredList
 * @returns statusEntities, deploymentEntities
 *
 */
export const getEntities = (filteredList: ClusterStatusAndType[]): ClusterEntitiesTypes => {
    const { healthyCount, unhealthyCount, connectionFailedCount, prodCount } = getStatusCount(filteredList)

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
