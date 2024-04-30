import { AggregationKeys, NodeType, Nodes } from '../../Shared'

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
