/* eslint-disable no-param-reassign */
import { mapByKey } from '../../../Common'
import {
    AggregatedNodes,
    PodMetadatum,
    TriggerHistoryFilterCriteriaProps,
    DeploymentHistoryResultObject,
    DeploymentHistory,
    TriggerHistoryFilterCriteriaType,
} from './types'
import { Nodes, ResourceKindType, AggregationKeys } from '../../types'
import { getAggregator } from '../../../Pages'

export function aggregateNodes(nodes: any[], podMetadata: PodMetadatum[]): AggregatedNodes {
    const podMetadataMap = mapByKey(podMetadata, 'name')
    // group nodes
    const nodesGroup = nodes.reduce((agg, curr) => {
        agg[curr.kind] = agg[curr.kind] || new Map()
        if (curr.kind === Nodes.Pod) {
            curr.info?.forEach(({ name, value }) => {
                if (name === 'Status Reason') {
                    curr.status = value.toLowerCase()
                } else if (name === 'Containers') {
                    curr.ready = value
                }
            })
            const podMeta = podMetadataMap.has(curr.name) ? podMetadataMap.get(curr.name) : {}
            agg[curr.kind].set(curr.name, { ...curr, ...podMeta })
        } else if (curr.kind === Nodes.Service) {
            curr.url = `${curr.name}.${curr.namespace}: { portnumber }`
            agg[curr.kind].set(curr.name, curr)
        } else {
            agg[curr.kind].set(curr.name, curr)
        }
        return agg
    }, {})

    // populate parents
    return nodes.reduce(
        (agg, curr) => {
            const nodeKind = curr.kind
            const aggregator: AggregationKeys = getAggregator(nodeKind)
            agg.aggregation[aggregator] = agg.aggregation[aggregator] || {}
            agg.nodes[nodeKind] = nodesGroup[nodeKind]
            if (curr.health && curr.health.status) {
                agg.statusCount[curr.health.status] = (agg.statusCount[curr.health.status] || 0) + 1

                agg.nodeStatusCount[curr.kind] = agg.nodeStatusCount[curr.kind] || {}
                agg.nodeStatusCount[curr.kind][curr.health.status] =
                    (agg.nodeStatusCount[curr.kind][curr.health.status] || 0) + 1

                agg.aggregatorStatusCount[aggregator] = agg.aggregatorStatusCount[aggregator] || {}
                agg.aggregatorStatusCount[aggregator][curr.health.status] =
                    (agg.aggregatorStatusCount[aggregator][curr.health.status] || 0) + 1
            }
            if (Array.isArray(curr.parentRefs)) {
                curr.parentRefs.forEach(({ kind, name }) => {
                    if (nodesGroup[kind] && nodesGroup[kind].has(name)) {
                        const parentRef = nodesGroup[kind].get(name)
                        const children = parentRef.children || {}
                        children[nodeKind] = children[nodeKind] || []
                        children[nodeKind] = [...children[nodeKind], curr.name]
                        if (!agg.nodes[kind]) {
                            agg.nodes[kind] = new Map()
                        }
                        agg.nodes[kind].set(name, { ...parentRef, children })
                    }
                })
            }

            agg.aggregation[aggregator][nodeKind] = agg.nodes[nodeKind]
            return agg
        },
        { nodes: {}, aggregation: {}, statusCount: {}, nodeStatusCount: {}, aggregatorStatusCount: {} },
    )
}

export const getTriggerHistoryFilterCriteria = ({
    appId,
    envId,
    releaseId,
    showCurrentReleaseDeployments,
}: TriggerHistoryFilterCriteriaProps): TriggerHistoryFilterCriteriaType => {
    const filterCriteria: TriggerHistoryFilterCriteriaType = [
        `${ResourceKindType.devtronApplication}|id|${appId}`,
        `environment|id|${envId}`,
    ]
    if (showCurrentReleaseDeployments) {
        filterCriteria.push(`${ResourceKindType.release}|id|${releaseId}`)
    }

    return filterCriteria
}

export const getParsedTriggerHistory = (result): DeploymentHistoryResultObject => {
    const parsedResult = {
        cdWorkflows: (result.cdWorkflows || []).map((deploymentHistory: DeploymentHistory) => ({
            ...deploymentHistory,
            triggerId: deploymentHistory?.cd_workflow_id,
            podStatus: deploymentHistory?.pod_status,
            startedOn: deploymentHistory?.started_on,
            finishedOn: deploymentHistory?.finished_on,
            pipelineId: deploymentHistory?.pipeline_id,
            logLocation: deploymentHistory?.log_file_path,
            triggeredBy: deploymentHistory?.triggered_by,
            artifact: deploymentHistory?.image,
            triggeredByEmail: deploymentHistory?.email_id,
            stage: deploymentHistory?.workflow_type,
            image: deploymentHistory?.image,
            imageComment: deploymentHistory?.imageComment,
            imageReleaseTags: deploymentHistory?.imageReleaseTags,
            artifactId: deploymentHistory?.ci_artifact_id,
            runSource: deploymentHistory?.runSource,
        })),
        appReleaseTagNames: result.appReleaseTagNames,
        tagsEditable: result.tagsEditable,
        hideImageTaggingHardDelete: result.hideImageTaggingHardDelete,
    }
    return parsedResult
}
