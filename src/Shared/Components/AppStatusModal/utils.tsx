import { Fragment } from 'react'

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

export const getAppStatusModalTitle = (segments: string[]) => {
    const filteredSegments = (segments || []).filter((segment) => !!segment)

    return (
        <h2 className="m-0 dc__truncate fs-16 fw-6 lh-1-5 dc__gap-4">
            {filteredSegments?.map((segment, index) => (
                <Fragment key={segment}>
                    {segment}
                    {index !== segments.length - 1 && <span className="cn-6 fs-16 fw-4">/</span>}
                </Fragment>
            ))}
        </h2>
    )
}
