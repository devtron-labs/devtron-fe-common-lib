import { ReactNode } from 'react'

export interface DeploymentEnvStateProps {
    envStateText: string
    envName: string
}

export interface GetDeploymentEnvConfigType {
    Icon: ReactNode
    stateClassName: string
}
