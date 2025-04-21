import { DEPLOYMENT_STATUS } from '@Shared/constants'
import { aggregateNodes } from '@Shared/Helpers'
import { AppDetails, Node } from '@Shared/types'

import { AggregatedNodes, STATUS_SORTING_ORDER } from '../CICDHistory'
import { GetFilteredFlattenedNodesFromAppDetailsParamsType as GetFlattenedNodesFromAppDetailsParamsType } from './types'

export const getAppStatusMessageFromAppDetails = (appDetails: AppDetails): string => {
    if (!appDetails?.resourceTree) {
        return ''
    }

    const nodes: AggregatedNodes = aggregateNodes(
        appDetails.resourceTree.nodes || [],
        appDetails.resourceTree.podMetadata || [],
    )

    const { conditions } = appDetails.resourceTree
    const rollout = nodes?.nodes?.Rollout?.entries()?.next()?.value?.[1]

    if (Array.isArray(conditions) && conditions.length > 0 && conditions[0].message) {
        return conditions[0].message
    }

    if (rollout?.health?.message) {
        return rollout.health.message
    }
    if (appDetails.FluxAppStatusDetail) {
        return appDetails.FluxAppStatusDetail.message
    }

    return ''
}

export const getFlattenedNodesFromAppDetails = ({
    appDetails,
    filterHealthyNodes,
}: GetFlattenedNodesFromAppDetailsParamsType): Node[] => {
    const nodes: AggregatedNodes = aggregateNodes(
        appDetails.resourceTree?.nodes || [],
        appDetails.resourceTree?.podMetadata || [],
    )

    const flattenedNodes: Node[] = []

    Object.entries(nodes?.nodes || {}).forEach(([, element]) => {
        element.forEach((childElement) => {
            if (childElement.health) {
                flattenedNodes.push(childElement)
            }
        })
    })

    flattenedNodes.sort(
        (a, b) =>
            STATUS_SORTING_ORDER[a.health.status?.toLowerCase()] - STATUS_SORTING_ORDER[b.health.status?.toLowerCase()],
    )

    if (filterHealthyNodes) {
        return flattenedNodes.filter((node) => node.health.status?.toLowerCase() !== DEPLOYMENT_STATUS.HEALTHY)
    }

    return flattenedNodes
}

export const getResourceKey = (nodeDetails: Node) => `${nodeDetails.kind}/${nodeDetails.name}`
