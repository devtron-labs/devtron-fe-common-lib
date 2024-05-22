export interface RemoteConnectionConfig {
    connectionMethod: string
    proxyConfig: Record<string, string>
    sshConfig: Record<string, string>
}

export interface ConfigCluster {
    bearerToken: string
    cert_auth_data: string
    cert_data: string
    tls_key: string
}

export interface UserDetails {
    userName: string
    errorInConnecting: string
    config: ConfigCluster
}

export interface DataListType {
    id: number
    cluster_name: string
    userInfos: UserDetails[]
    server_url: string
    active: boolean
    defaultClusterComponent: number
    insecureSkipTlsVerify: boolean
    remoteConnectionConfig: RemoteConnectionConfig
}

export enum SSHAuthenticationType {
    Password = 'PASSWORD',
    SSH_Private_Key = 'SSH_PRIVATE_KEY',
    Password_And_SSH_Private_Key = 'PASSWORD_AND_SSH_PRIVATE_KEY',
}

export interface SaveClusterPayloadType {
    id: number
    cluster_name: string
    insecureSkipTlsVerify: boolean
    config: ConfigCluster
    active: boolean
    prometheus_url: string
    prometheusAuth: Record<string, string>
    server_url: string
    remoteConnectionConfig: RemoteConnectionConfig
}

export interface ClusterStepModalProps {
    subTitle: string
    command: string
    clusterName: string
}
