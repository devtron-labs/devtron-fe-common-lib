import { AggregationKeys, NodeType, Nodes } from '../../Shared'
import { SIDEBAR_KEYS } from './Constants'
import { ApiResourceGroupType, K8SObjectType } from './ResourceBrowser.Types'

export function createClusterEnvGroup<T extends Record<string, string>>(
    list: T[],
    propKey: string,
    optionLabel?: string,
    optionValue?: string,
): { label: string; options: T[]; isVirtualEnvironment?: boolean }[] {
    const objList: Record<string, T[]> = list.reduce((acc, obj) => {
        const key = obj[propKey]
        if (!acc[key]) {
            acc[key] = []
        }
        acc[key].push(
            optionLabel
                ? {
                      label: obj[optionLabel],
                      value: obj[optionValue || optionLabel],
                      description: obj.description,
                      isVirtualEnvironment: obj.isVirtualEnvironment,
                      isClusterCdActive: obj.isClusterCdActive,
                  }
                : obj,
        )
        return acc
    }, {})

    return Object.entries(objList)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([key, value]) => ({
            label: key,
            options: value,
            isVirtualEnvironment: !!value[0].isVirtualEnvironment, // All the values will be having similar isVirtualEnvironment
        }))
}

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

export const processK8SObjects = (
    k8sObjects: ApiResourceGroupType[],
    selectedResourceKind?: string,
    disableGroupFilter?: boolean,
): { k8SObjectMap: Map<string, K8SObjectType>; selectedResource: ApiResourceGroupType } => {
    const _k8SObjectMap = new Map<string, K8SObjectType>()
    let _selectedResource: ApiResourceGroupType
    for (let index = 0; index < k8sObjects.length; index++) {
        const element = k8sObjects[index]
        const groupParent = disableGroupFilter
            ? element.gvk.Group
            : getAggregator(element.gvk.Kind, element.gvk.Group.endsWith('.k8s.io'))

        if (element.gvk.Kind.toLowerCase() === selectedResourceKind) {
            _selectedResource = { namespaced: element.namespaced, gvk: element.gvk }
        }
        const currentData = _k8SObjectMap.get(groupParent)
        if (!currentData) {
            _k8SObjectMap.set(groupParent, {
                name: groupParent,
                isExpanded:
                    element.gvk.Kind !== SIDEBAR_KEYS.namespaceGVK.Kind &&
                    element.gvk.Kind !== SIDEBAR_KEYS.eventGVK.Kind &&
                    element.gvk.Kind.toLowerCase() === selectedResourceKind,
                child: [{ namespaced: element.namespaced, gvk: element.gvk }],
            })
        } else {
            currentData.child = [...currentData.child, { namespaced: element.namespaced, gvk: element.gvk }]
            if (element.gvk.Kind.toLowerCase() === selectedResourceKind) {
                currentData.isExpanded =
                    element.gvk.Kind !== SIDEBAR_KEYS.namespaceGVK.Kind &&
                    element.gvk.Kind !== SIDEBAR_KEYS.eventGVK.Kind &&
                    element.gvk.Kind.toLowerCase() === selectedResourceKind
            }
        }
        if (element.gvk.Kind === SIDEBAR_KEYS.eventGVK.Kind) {
            SIDEBAR_KEYS.eventGVK = { ...element.gvk }
        }
        if (element.gvk.Kind === SIDEBAR_KEYS.namespaceGVK.Kind) {
            SIDEBAR_KEYS.namespaceGVK = { ...element.gvk }
        }
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const [, _k8sObject] of _k8SObjectMap.entries()) {
        _k8sObject.child.sort((a, b) => a.gvk.Kind.localeCompare(b.gvk.Kind))
    }
    return { k8SObjectMap: _k8SObjectMap, selectedResource: _selectedResource }
}
