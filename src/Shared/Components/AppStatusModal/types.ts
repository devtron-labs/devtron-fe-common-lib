import { FunctionComponent } from 'react'

import { APIOptions } from '@Common/Types'
import {
    AppDetails,
    ConfigDriftModalProps,
    DeploymentStatusDetailsBreakdownDataType,
    DeploymentStatusDetailsType,
} from '@Shared/types'

export enum AppStatusModalTabType {
    APP_STATUS = 'appStatus',
    DEPLOYMENT_STATUS = 'deploymentStatus',
}

export type AppStatusModalProps = {
    titleSegments: string[]
    handleClose: () => void
    isConfigDriftEnabled: boolean
    configDriftModal: FunctionComponent<ConfigDriftModalProps>
} & (
    | {
          type: 'release'
          processVirtualEnvironmentDeploymentData: (
              data?: DeploymentStatusDetailsType,
          ) => DeploymentStatusDetailsBreakdownDataType
          appId: number
          envId: number
          appDetails?: never
          deploymentStatusDetailsBreakdownData?: never
          initialTab?: never
          isDeploymentTimelineLoading?: never
      }
    | {
          type: 'devtron-app' | 'other-apps' | 'stack-manager'
          appDetails: AppDetails
          deploymentStatusDetailsBreakdownData: DeploymentStatusDetailsBreakdownDataType | null
          initialTab: AppStatusModalTabType
          isDeploymentTimelineLoading?: boolean
          processVirtualEnvironmentDeploymentData?: never
          appId?: never
          envId?: never
      }
)

export interface AppStatusBodyProps
    extends Required<Pick<AppStatusModalProps, 'appDetails' | 'type' | 'deploymentStatusDetailsBreakdownData'>> {
    handleShowConfigDriftModal: () => void
    selectedTab: AppStatusModalTabType
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

/**
 * Params for getAppDetails which is called in case of release [i.e, devtron apps]
 */
export interface GetAppDetailsParamsType extends Pick<APIOptions, 'abortControllerRef'> {
    appId: number
    envId: number
    /**
     * If given would fetch deploymentConfig
     */
    deploymentStatusConfig: {
        showTimeline: boolean
        processVirtualEnvironmentDeploymentData: AppStatusModalProps['processVirtualEnvironmentDeploymentData']
    } | null
}

export interface AppStatusModalTabListProps
    extends Pick<AppStatusModalProps, 'appDetails' | 'type' | 'deploymentStatusDetailsBreakdownData'> {
    handleSelectTab: (updatedTab: AppStatusModalTabType) => void
    selectedTab: AppStatusModalTabType
}
