import { aggregateNodes } from '@Shared/Helpers'
import { AppDetails } from '@Shared/types'

import { AggregatedNodes } from '../CICDHistory'

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
