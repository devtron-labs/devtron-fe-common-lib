import { FunctionComponent, ReactNode } from 'react'

import { AppDetails, ConfigDriftModalProps } from '@Shared/types'

export interface AppStatusModalProps {
    title: ReactNode
    handleClose: () => void
    type: 'devtron-app' | 'external-apps' | 'stack-manager' | 'release'
    /**
     * If not given would assume to hide config drift related info
     */
    handleShowConfigDriftModal: () => void | null
    /**
     * If given would not poll for app details and resource tree, Polling for gitops timeline would still be done
     */
    appDetails?: AppDetails
    isConfigDriftEnabled: boolean
    configDriftModal: FunctionComponent<ConfigDriftModalProps>
}

export interface AppStatusBodyProps
    extends Pick<AppStatusModalProps, 'appDetails' | 'type' | 'handleShowConfigDriftModal'> {}

export interface AppStatusContentProps extends Pick<AppStatusBodyProps, 'appDetails' | 'handleShowConfigDriftModal'> {
    /**
     * @default false
     */
    filterHealthyNodes?: boolean
    /**
     * @default true
     */
    isCardLayout?: boolean
}

export interface GetFilteredFlattenedNodesFromAppDetailsParamsType
    extends Pick<AppStatusContentProps, 'appDetails' | 'filterHealthyNodes'> {}
