export interface AddEditEnvironmentModalProps {
    environmentName: string
    namespace: string
    id: number
    clusterId: number
    prometheusEndpoint: string
    isProduction: boolean
    description: string
    isVirtual: boolean
    reload: () => void
    hideClusterDrawer: () => void
    virtualClusterSaveUpdateApi?: (id) => void
}
