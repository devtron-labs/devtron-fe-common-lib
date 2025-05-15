import ICCelebration from '@Images/ic-celebration.svg'
import ICManOnRocket from '@Images/ic-man-on-rocket.svg'
import ICPageNotFound from '@Images/ic-page-not-found.svg'
import NoDeploymentStatusImage from '@Images/no-artifact.webp'
import { DeploymentAppTypes, GenericEmptyStateType } from '@Common/Types'
import { DEPLOYMENT_STATUS } from '@Shared/constants'
import { aggregateNodes } from '@Shared/Helpers'
import { AppDetails, AppType, DeploymentStatusDetailsBreakdownDataType, Node } from '@Shared/types'
import { ReleaseMode } from '@Pages/index'

import { AggregatedNodes, STATUS_SORTING_ORDER } from '../CICDHistory'
import {
    FAILED_DEPLOYMENT_STATUS,
    PROGRESSING_DEPLOYMENT_STATUS,
    SUCCESSFUL_DEPLOYMENT_STATUS,
} from '../DeploymentStatusBreakdown'
import {
    AppStatusModalProps,
    GetFilteredFlattenedNodesFromAppDetailsParamsType as GetFlattenedNodesFromAppDetailsParamsType,
} from './types'

export const getAppStatusMessageFromAppDetails = (appDetails: AppDetails): string => {
    if (!appDetails?.resourceTree) {
        return ''
    }

    const { conditions } = appDetails.resourceTree

    if (Array.isArray(conditions) && conditions.length > 0 && conditions[0].message) {
        return conditions[0].message
    }

    const nodes: AggregatedNodes = aggregateNodes(
        appDetails.resourceTree.nodes || [],
        appDetails.resourceTree.podMetadata || [],
    )

    const rollout = nodes?.nodes?.Rollout?.entries()?.next()?.value?.[1]

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

export const getShowDeploymentStatusModal = ({
    type,
    appDetails,
}: Pick<AppStatusModalProps, 'type' | 'appDetails'>): boolean => {
    if (
        !appDetails ||
        type === 'stack-manager' ||
        (appDetails.appType !== AppType.DEVTRON_APP && appDetails.appType !== AppType.DEVTRON_HELM_CHART)
    ) {
        return false
    }

    if (appDetails.appType === AppType.DEVTRON_HELM_CHART) {
        return !!appDetails.lastDeployedTime && appDetails.deploymentAppType !== DeploymentAppTypes.HELM
    }

    return appDetails.releaseMode !== ReleaseMode.MIGRATE_EXTERNAL_APPS || appDetails.isPipelineTriggered
}

export const getEmptyViewImageFromHelmDeploymentStatus = (
    status: DeploymentStatusDetailsBreakdownDataType['deploymentStatus'],
): GenericEmptyStateType['image'] => {
    if (PROGRESSING_DEPLOYMENT_STATUS.includes(status)) {
        return ICManOnRocket
    }

    if (SUCCESSFUL_DEPLOYMENT_STATUS.includes(status)) {
        return ICCelebration
    }

    if (FAILED_DEPLOYMENT_STATUS.includes(status)) {
        return ICPageNotFound
    }

    return NoDeploymentStatusImage
}
