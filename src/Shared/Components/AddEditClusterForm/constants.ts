export const CLUSTER_COMMAND = {
    k8Cluster: {
        heading: 'K8s cluster providers',
        clusterName: 'K8s',
        title: 'Supports EKS, AKS, GKE, Kops, Digital Ocean managed Kubernetes.',
        command:
            'curl -O https://raw.githubusercontent.com/devtron-labs/utilities/main/kubeconfig-exporter/kubernetes_export_sa.sh && bash kubernetes_export_sa.sh cd-user devtroncd',
    },
    microK8s: {
        heading: 'MicroK8s',
        clusterName: 'microK8s',
        title: 'MicroK8s is a light weight Kubernetes cluster',
        command:
            "curl -O https://raw.githubusercontent.com/devtron-labs/utilities/main/kubeconfig-exporter/kubernetes_export_sa.sh && sed -i 's/kubectl/microk8s kubectl/g' kubernetes_export_sa.sh && bash kubernetes_export_sa.sh cd-user devtroncd",
    },
}

export const RemoteConnectionTypeCluster = 'cluster'

export const AuthenticationType = {
    BASIC: 'BASIC',
    ANONYMOUS: 'ANONYMOUS',
    IAM: 'IAM',
}
