/* eslint-disable no-param-reassign */
import { BehaviorSubject } from 'rxjs'
import { DEPLOYMENT_STATUS, TIMELINE_STATUS, handleUTCTime, mapByKey } from '../../../Common'
import {
    DeploymentStatusDetailsType,
    DeploymentStatusDetailsBreakdownDataType,
    AggregatedNodes,
    PodMetadatum,
    AggregationKeys,
} from './types'
import { AppDetails, Node, Nodes, NodeType } from '../../types'

const _appDetailsSubject: BehaviorSubject<AppDetails> = new BehaviorSubject({} as AppDetails)
const _nodesSubject: BehaviorSubject<Array<Node>> = new BehaviorSubject([] as Node[])
const _nodesFilteredSubject: BehaviorSubject<Array<Node>> = new BehaviorSubject([] as Node[])

export function getAggregator(nodeType: NodeType, defaultAsOtherResources?: boolean): AggregationKeys {
    switch (nodeType) {
        case Nodes.DaemonSet:
        case Nodes.Deployment:
        case Nodes.Pod:
        case Nodes.ReplicaSet:
        case Nodes.Job:
        case Nodes.CronJob:
        case Nodes.ReplicationController:
        case Nodes.StatefulSet:
            return AggregationKeys.Workloads
        case Nodes.Ingress:
        case Nodes.Service:
        case Nodes.Endpoints:
        case Nodes.EndpointSlice:
        case Nodes.NetworkPolicy:
            return AggregationKeys.Networking
        case Nodes.ConfigMap:
        case Nodes.Secret:
        case Nodes.PersistentVolume:
        case Nodes.PersistentVolumeClaim:
        case Nodes.StorageClass:
        case Nodes.VolumeSnapshot:
        case Nodes.VolumeSnapshotContent:
        case Nodes.VolumeSnapshotClass:
        case Nodes.PodDisruptionBudget:
            return AggregationKeys['Config & Storage']
        case Nodes.ServiceAccount:
        case Nodes.ClusterRoleBinding:
        case Nodes.RoleBinding:
        case Nodes.ClusterRole:
        case Nodes.Role:
        case Nodes.PodSecurityPolicy:
            return AggregationKeys.RBAC
        case Nodes.MutatingWebhookConfiguration:
        case Nodes.ValidatingWebhookConfiguration:
            return AggregationKeys.Administration
        case Nodes.Alertmanager:
        case Nodes.Prometheus:
        case Nodes.ServiceMonitor:
            return AggregationKeys['Custom Resource']
        case Nodes.Event:
            return AggregationKeys.Events
        case Nodes.Namespace:
            return AggregationKeys.Namespaces
        default:
            return defaultAsOtherResources ? AggregationKeys['Other Resources'] : AggregationKeys['Custom Resource']
    }
}

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

let _nodeFilter = {
    filterType: '',
    searchString: '',
}

const publishFilteredNodes = () => {
    const filteredNodes = _nodesSubject.getValue().filter((_node: Node) => {
        if (!_nodeFilter.filterType && !_nodeFilter.searchString) {
            return true
        }

        if (_nodeFilter.filterType === 'ALL') {
            return true
        }

        if (_nodeFilter.filterType.toLowerCase() === _node.health?.status?.toLowerCase()) {
            return true
        }

        return false
    })

    _nodesFilteredSubject.next([...filteredNodes])
}

export const getAppDetails = (): AppDetails => _appDetailsSubject.getValue()

export const updateFilterType = (filterType: string) => {
    _nodeFilter = { ..._nodeFilter, filterType }
    publishFilteredNodes()
}

export const processDeploymentStatusDetailsData = (
    data?: DeploymentStatusDetailsType,
): DeploymentStatusDetailsBreakdownDataType => {
    const deploymentData = {
        deploymentStatus: 'inprogress',
        deploymentStatusText: 'In progress',
        deploymentTriggerTime: data?.deploymentStartedOn || '',
        deploymentEndTime: data?.deploymentFinishedOn || '',
        deploymentError: '',
        triggeredBy: data?.triggeredBy || '',
        nonDeploymentError: '',
        deploymentStatusBreakdown: {
            DEPLOYMENT_INITIATED: {
                icon: 'success',
                displayText: `Deployment initiated ${data?.triggeredBy ? `by ${data?.triggeredBy}` : ''}`,
                displaySubText: '',
                time: '',
            },
            GIT_COMMIT: {
                icon: '',
                displayText: 'Push manifest to Git',
                displaySubText: '',
                timelineStatus: '',
                time: '',
                isCollapsed: true,
            },
            ARGOCD_SYNC: {
                icon: '',
                displayText: 'Synced with Argo CD',
                displaySubText: '',
                timelineStatus: '',
                time: '',
                isCollapsed: true,
            },
            KUBECTL_APPLY: {
                icon: '',
                displayText: 'Apply manifest to Kubernetes',
                timelineStatus: '',
                displaySubText: '',
                time: '',
                resourceDetails: [],
                isCollapsed: true,
                kubeList: [],
            },
            APP_HEALTH: {
                icon: '',
                displayText: 'Propogate manifest to Kubernetes resources',
                timelineStatus: '',
                displaySubText: '',
                time: '',
                isCollapsed: true,
            },
        },
    }

    const lastFetchedTime = handleUTCTime(data?.statusLastFetchedAt, true)
    const deploymentPhases = ['PreSync', 'Sync', 'PostSync', 'Skip', 'SyncFail']
    const tableData: { currentPhase: string; currentTableData: { icon: string; phase?: string; message: string }[] } = {
        currentPhase: '',
        currentTableData: [{ icon: 'success', message: 'Started by Argo CD' }],
    }

    // data when timelines is available
    if (data?.timelines?.length) {
        // TO Support legacy data have to make sure that if ARGOCD_SYNC is not available then we fill it with dummy values
        const isArgoCDAvailable = data.timelines.some((timeline) =>
            timeline.status.includes(TIMELINE_STATUS.ARGOCD_SYNC),
        )

        for (let index = data.timelines.length - 1; index >= 0; index--) {
            const element = data.timelines[index]
            if (element.status === TIMELINE_STATUS.HEALTHY || element.status === TIMELINE_STATUS.DEGRADED) {
                deploymentData.deploymentStatus = DEPLOYMENT_STATUS.SUCCEEDED
                deploymentData.deploymentStatusText = 'Succeeded'
                deploymentData.deploymentStatusBreakdown.APP_HEALTH.displaySubText =
                    element.status === TIMELINE_STATUS.HEALTHY ? '' : 'Degraded'
                deploymentData.deploymentStatusBreakdown.APP_HEALTH.time = element.statusTime
                deploymentData.deploymentStatusBreakdown.APP_HEALTH.icon = 'success'
                deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.icon = 'success'
                deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.isCollapsed = true
                deploymentData.deploymentStatusBreakdown.APP_HEALTH.isCollapsed = true
                deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.icon = 'success'
                deploymentData.deploymentStatusBreakdown.GIT_COMMIT.icon = 'success'
            } else if (element.status === TIMELINE_STATUS.DEPLOYMENT_FAILED) {
                deploymentData.deploymentStatus = DEPLOYMENT_STATUS.FAILED
                deploymentData.deploymentStatusText = 'Failed'
                deploymentData.deploymentStatusBreakdown.APP_HEALTH.displaySubText = '   Failed'
                deploymentData.deploymentError = element.statusDetail
            } else if (element.status === TIMELINE_STATUS.DEPLOYMENT_SUPERSEDED) {
                deploymentData.deploymentStatus = DEPLOYMENT_STATUS.SUPERSEDED
            } else if (
                index === data.timelines.length - 1 &&
                (element.status === TIMELINE_STATUS.FETCH_TIMED_OUT ||
                    element.status === TIMELINE_STATUS.UNABLE_TO_FETCH_STATUS)
            ) {
                if (element.status === TIMELINE_STATUS.FETCH_TIMED_OUT) {
                    deploymentData.deploymentStatus = DEPLOYMENT_STATUS.TIMED_OUT
                    deploymentData.deploymentStatusText = 'Timed out'
                } else if (element.status === TIMELINE_STATUS.UNABLE_TO_FETCH_STATUS) {
                    deploymentData.deploymentStatus = DEPLOYMENT_STATUS.UNABLE_TO_FETCH
                    deploymentData.deploymentStatusText = 'Unable to fetch status'
                }
                deploymentData.deploymentError = `Below resources did not become healthy within 10 mins. Resource status shown below was last fetched ${lastFetchedTime}. ${data.statusFetchCount} retries failed.`
            } else if (element.status.includes(TIMELINE_STATUS.KUBECTL_APPLY)) {
                if (!isArgoCDAvailable) {
                    deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.icon = 'success'
                    deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.displaySubText = ''
                    deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.time = element.statusTime
                }

                if (element?.resourceDetails) {
                    deploymentPhases.forEach((phase) => {
                        // eslint-disable-next-line no-restricted-syntax
                        for (const item of element.resourceDetails) {
                            if (phase === item.resourcePhase) {
                                tableData.currentPhase = phase
                                // Seems else block was forgotten to add here, TODO: Sync for this later
                                // eslint-disable-next-line no-empty
                                if (item.resourceStatus === 'failed') {
                                }
                                tableData.currentTableData.push({
                                    icon: 'success',
                                    phase,
                                    message: `${phase}: Create and update resources based on manifest`,
                                })
                                return
                            }
                        }
                    })
                }
                if (
                    element.status === TIMELINE_STATUS.KUBECTL_APPLY_STARTED &&
                    deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.time === '' &&
                    deploymentData.deploymentStatus !== DEPLOYMENT_STATUS.SUCCEEDED
                ) {
                    deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.resourceDetails =
                        element.resourceDetails?.filter((item) => item.resourcePhase === tableData.currentPhase)
                    if (deploymentData.deploymentStatus === DEPLOYMENT_STATUS.FAILED) {
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.icon = 'unknown'
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.displaySubText = ': Unknown'
                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.icon = 'unknown'
                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.displaySubText = ': Unknown'
                    } else if (deploymentData.deploymentStatus === DEPLOYMENT_STATUS.SUCCEEDED) {
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.icon = 'success'
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.displaySubText = ''
                    } else if (
                        deploymentData.deploymentStatus === DEPLOYMENT_STATUS.TIMED_OUT ||
                        deploymentData.deploymentStatus === DEPLOYMENT_STATUS.UNABLE_TO_FETCH
                    ) {
                        if (deploymentData.deploymentStatus === DEPLOYMENT_STATUS.TIMED_OUT) {
                            deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.icon = 'unknown'
                            deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.isCollapsed = false
                        } else {
                            deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.icon = 'disconnect'
                        }
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.displaySubText = 'Unknown'
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.timelineStatus =
                            deploymentData.deploymentError
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.kubeList =
                            tableData.currentTableData.map((item) => ({
                                icon: item.phase === tableData.currentPhase ? 'failed' : 'success',
                                message: item.message,
                            }))
                    } else {
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.icon = 'inprogress'
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.displaySubText = 'In progress'
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.time = element.statusTime
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.timelineStatus = element.statusDetail
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.isCollapsed = false
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.kubeList =
                            tableData.currentTableData.map((item) => ({
                                icon: item.phase === tableData.currentPhase ? 'loading' : 'success',
                                message: item.message,
                            }))
                    }
                } else if (element.status === TIMELINE_STATUS.KUBECTL_APPLY_SYNCED) {
                    deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.resourceDetails = []
                    deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.displaySubText = ''
                    deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.time = element.statusTime
                    deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.icon = 'success'
                    deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.icon = 'success'
                    deploymentData.deploymentStatusBreakdown.GIT_COMMIT.icon = 'success'
                    deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.kubeList = tableData.currentTableData

                    if (deploymentData.deploymentStatus === DEPLOYMENT_STATUS.INPROGRESS) {
                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.icon = 'inprogress'
                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.isCollapsed = false
                    } else if (deploymentData.deploymentStatus === DEPLOYMENT_STATUS.FAILED) {
                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.icon = 'failed'
                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.displaySubText = 'Failed'
                    } else if (deploymentData.deploymentStatus === DEPLOYMENT_STATUS.TIMED_OUT) {
                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.icon = 'timed_out'
                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.displaySubText = 'Unknown'
                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.timelineStatus =
                            deploymentData.deploymentError
                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.isCollapsed = false
                    } else if (deploymentData.deploymentStatus === DEPLOYMENT_STATUS.UNABLE_TO_FETCH) {
                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.icon = 'disconnect'
                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.displaySubText = 'Unknown'
                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.timelineStatus =
                            deploymentData.deploymentError
                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.isCollapsed = false
                    }
                }
            } else if (element.status.includes(TIMELINE_STATUS.ARGOCD_SYNC)) {
                deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.time = element.statusTime

                if (element.status === TIMELINE_STATUS.ARGOCD_SYNC_FAILED) {
                    deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.displaySubText = 'Failed'
                    deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.icon = 'failed'

                    deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.displaySubText = ''
                    deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.icon = 'unreachable'

                    deploymentData.deploymentStatusBreakdown.APP_HEALTH.displaySubText = ''
                    deploymentData.deploymentStatusBreakdown.APP_HEALTH.icon = 'unreachable'

                    deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.isCollapsed = false
                    deploymentData.deploymentStatus = DEPLOYMENT_STATUS.FAILED
                    deploymentData.deploymentStatusText = 'Failed'
                    deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.timelineStatus = element.statusDetail
                } else {
                    deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.icon = 'success'
                    if (deploymentData.deploymentStatus === DEPLOYMENT_STATUS.FAILED) {
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.displaySubText = ''
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.icon = 'unreachable'

                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.displaySubText = ''
                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.icon = 'unreachable'

                        if (deploymentData.nonDeploymentError === '') {
                            deploymentData.nonDeploymentError = TIMELINE_STATUS.KUBECTL_APPLY
                        }
                    } else if (
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.time === '' &&
                        deploymentData.deploymentStatus === DEPLOYMENT_STATUS.INPROGRESS
                    ) {
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.icon = ''
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.displaySubText = 'Waiting'
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.kubeList = [
                            { icon: '', message: 'Waiting to be started by Argo CD' },
                            { icon: '', message: 'Create and update resources based on manifest' },
                        ]
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.isCollapsed = false
                    }
                }
            } else if (element.status.includes(TIMELINE_STATUS.GIT_COMMIT)) {
                deploymentData.deploymentStatusBreakdown.GIT_COMMIT.time = element.statusTime
                if (element.status === TIMELINE_STATUS.GIT_COMMIT_FAILED) {
                    deploymentData.deploymentStatusBreakdown.GIT_COMMIT.displaySubText = 'Failed'
                    deploymentData.deploymentStatusBreakdown.GIT_COMMIT.icon = 'failed'

                    deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.displaySubText = ''
                    deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.icon = 'unreachable'

                    deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.displaySubText = ''
                    deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.icon = 'unreachable'

                    deploymentData.deploymentStatusBreakdown.APP_HEALTH.displaySubText = ''
                    deploymentData.deploymentStatusBreakdown.APP_HEALTH.icon = 'unreachable'

                    deploymentData.deploymentStatusBreakdown.GIT_COMMIT.isCollapsed = false
                    deploymentData.deploymentStatus = DEPLOYMENT_STATUS.FAILED
                    deploymentData.deploymentStatusText = 'Failed'
                    deploymentData.deploymentStatusBreakdown.GIT_COMMIT.timelineStatus = element.statusDetail
                } else {
                    deploymentData.deploymentStatusBreakdown.GIT_COMMIT.icon = 'success'
                    if (deploymentData.deploymentStatus === DEPLOYMENT_STATUS.FAILED) {
                        if (deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.icon === '') {
                            deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.displaySubText = ''
                            deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.icon = 'unreachable'
                        }

                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.displaySubText = ''
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.icon = 'unreachable'

                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.displaySubText = ''
                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.icon = 'unreachable'

                        if (deploymentData.nonDeploymentError === '') {
                            deploymentData.nonDeploymentError = TIMELINE_STATUS.ARGOCD_SYNC
                        }
                    } else if (
                        deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.time === '' &&
                        deploymentData.deploymentStatus === DEPLOYMENT_STATUS.INPROGRESS
                    ) {
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.icon = ''
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.displaySubText = 'Waiting'
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.kubeList = [
                            { icon: '', message: 'Waiting to be started by Argo CD' },
                            { icon: '', message: 'Create and update resources based on manifest' },
                        ]
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.isCollapsed = false
                        deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.icon = 'inprogress'
                        deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.displaySubText = 'In progress'
                    }
                }
            } else if (element.status === TIMELINE_STATUS.DEPLOYMENT_INITIATED) {
                deploymentData.deploymentStatusBreakdown.DEPLOYMENT_INITIATED.time = element.statusTime
                if (
                    deploymentData.deploymentStatusBreakdown.GIT_COMMIT.time === '' &&
                    deploymentData.deploymentStatus === DEPLOYMENT_STATUS.INPROGRESS
                ) {
                    deploymentData.deploymentStatusBreakdown.GIT_COMMIT.icon = 'inprogress'

                    deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.icon = ''
                    deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.displaySubText = 'Waiting'

                    deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.icon = ''
                    deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.displaySubText = 'Waiting'
                    deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.kubeList = [
                        { icon: '', message: 'Waiting to be started by Argo CD' },
                        { icon: '', message: 'Create and update resources based on manifest' },
                    ]
                    deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.isCollapsed = false
                }
                if (deploymentData.deploymentStatus === DEPLOYMENT_STATUS.FAILED) {
                    if (deploymentData.deploymentStatusBreakdown.GIT_COMMIT.time === '') {
                        deploymentData.deploymentStatusBreakdown.GIT_COMMIT.displaySubText = ''
                        deploymentData.deploymentStatusBreakdown.GIT_COMMIT.icon = 'unreachable'

                        deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.displaySubText = ''
                        deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.icon = 'unreachable'

                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.displaySubText = ''
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.icon = 'unreachable'

                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.displaySubText = ''
                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.icon = 'unreachable'

                        deploymentData.nonDeploymentError = TIMELINE_STATUS.GIT_COMMIT
                    } else if (deploymentData.deploymentStatusBreakdown.GIT_COMMIT.icon !== 'failed') {
                        if (deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.time === '') {
                            deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.displaySubText = 'Unknown'
                            deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.icon = 'unknown'

                            deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.displaySubText = 'Unknown'
                            deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.icon = 'unknown'

                            deploymentData.deploymentStatusBreakdown.APP_HEALTH.displaySubText = ': Unknown'
                            deploymentData.deploymentStatusBreakdown.APP_HEALTH.icon = 'unknown'
                        } else if (deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.icon !== 'failed') {
                            deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.displaySubText = 'Unknown'
                            deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.icon = 'unknown'

                            deploymentData.deploymentStatusBreakdown.APP_HEALTH.displaySubText = ': Unknown'
                            deploymentData.deploymentStatusBreakdown.APP_HEALTH.icon = 'unknown'
                        }
                    } else {
                        deploymentData.deploymentStatusBreakdown.GIT_COMMIT.displaySubText = ''
                        deploymentData.deploymentStatusBreakdown.GIT_COMMIT.icon = 'unreachable'

                        deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.displaySubText = ''
                        deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.icon = 'unreachable'

                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.displaySubText = ''
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.icon = 'unreachable'

                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.displaySubText = ''
                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.icon = 'unreachable'

                        deploymentData.nonDeploymentError = TIMELINE_STATUS.GIT_COMMIT
                    }
                }
            }
        }
    } else if (!data?.timelines) {
        // data when timelines is not available in case of the previously deployed app(deployment-status/timline api) )
        if (data?.wfrStatus === 'Healthy' || data?.wfrStatus === 'Succeeded') {
            deploymentData.deploymentStatus = DEPLOYMENT_STATUS.SUCCEEDED
            deploymentData.deploymentStatusText = 'Succeeded'
            deploymentData.deploymentStatusBreakdown.APP_HEALTH.icon = 'success'
            deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.icon = 'success'
            deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.isCollapsed = true
            deploymentData.deploymentStatusBreakdown.APP_HEALTH.isCollapsed = true
            deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.icon = 'success'
            deploymentData.deploymentStatusBreakdown.GIT_COMMIT.icon = 'success'
        } else if (data?.wfrStatus === 'Failed' || data?.wfrStatus === 'Degraded') {
            deploymentData.deploymentStatus = DEPLOYMENT_STATUS.FAILED
            deploymentData.deploymentStatusText = 'Failed'
            deploymentData.deploymentStatusBreakdown.APP_HEALTH.displaySubText = 'Failed'
        } else if (data?.wfrStatus === 'Progressing') {
            deploymentData.deploymentStatus = DEPLOYMENT_STATUS.INPROGRESS
            deploymentData.deploymentStatusText = 'In progress'
        } else if (data?.wfrStatus === 'TimedOut') {
            deploymentData.deploymentStatus = DEPLOYMENT_STATUS.TIMED_OUT
            deploymentData.deploymentStatusText = 'Timed out'
        }
    }
    return deploymentData
}

const getDecodedEncodedData = (data, isEncoded: boolean = false) => {
    if (isEncoded) {
        return btoa(data)
    }
    return atob(data)
}

export const decode = (data, isEncoded: boolean = false) =>
    Object.keys(data)
        .map((m) => ({ key: m, value: data[m] ? getDecodedEncodedData(data[m], isEncoded) : data[m] }))
        .reduce((agg, curr) => {
            agg[curr.key] = curr.value
            return agg
        }, {})
