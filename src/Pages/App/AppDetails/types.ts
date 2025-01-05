export interface OptionsBase {
    name: string
    isInitContainer?: boolean
    isEphemeralContainer?: boolean
    isExternal?: boolean
}

export interface SelectedResourceType {
    clusterId: number
    group: string
    version: string
    kind: string
    namespace: string
    name: string
    containers: OptionsBase[]
    selectedContainer?: string
    clusterName?: string
}
