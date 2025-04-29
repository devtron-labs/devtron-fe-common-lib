import { FunctionComponent } from 'react'

import { AppDetails, ConfigDriftModalProps } from '@Shared/types'

export type AppStatusModalProps = {
    titleSegments: string[]
    handleClose: () => void
    /**
     * If given would not poll for app details and resource tree, Polling for gitops timeline would still be done
     */
    appDetails?: AppDetails
    isConfigDriftEnabled: boolean
    configDriftModal: FunctionComponent<ConfigDriftModalProps>
} & (
    | {
          type: 'release'
          appId: number
          envId: number
      }
    | {
          type: 'devtron-app' | 'other-apps' | 'stack-manager'
          appId?: never
          envId?: never
      }
)

export interface AppStatusBodyProps extends Required<Pick<AppStatusModalProps, 'appDetails' | 'type'>> {
    handleShowConfigDriftModal: () => void
}

export interface AppStatusContentProps
    extends Required<Pick<AppStatusBodyProps, 'appDetails'>>,
        Partial<Pick<AppStatusBodyProps, 'handleShowConfigDriftModal'>> {
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
