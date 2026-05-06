import { Icon, ModalSidebarPanel } from '@Shared/Components'

const VirtualClusterSidebar = () => (
    <ModalSidebarPanel
        icon={<Icon name="ic-kubernetes" size={48} color={null} />}
        heading="Create Isolated Cluster"
        documentationLink="GLOBAL_CONFIG_CLUSTER"
        rootClassName="p-20 dc__no-background-imp dc__no-shrink"
    >
        <p>An isolated cluster in Devtron is an air-gapped Kubernetes cluster with restricted network access.</p>
        <p className="pb-0">
            Since Devtron does not have connectivity to these clusters, deployments are managed by packaging manifests
            and images for manual installation or retrieval from an OCI registry (if enabled).
        </p>
    </ModalSidebarPanel>
)

export default VirtualClusterSidebar
