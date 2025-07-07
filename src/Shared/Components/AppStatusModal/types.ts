import { FunctionComponent, PropsWithChildren, ReactNode } from 'react'

import { APIOptions } from '@Common/Types'
import {
    AppDetails,
    ConfigDriftModalProps,
    DeploymentStatusDetailsBreakdownDataType,
    DeploymentStatusDetailsType,
    IntelligenceConfig,
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
    processVirtualEnvironmentDeploymentData: (
        data?: DeploymentStatusDetailsType,
    ) => DeploymentStatusDetailsBreakdownDataType
    debugWithAIButton: FunctionComponent<{ intelligenceConfig: IntelligenceConfig }>
} & (
    | {
          type: 'release'
          appId: number
          envId: number
          appDetails?: never
          initialTab?: never
          updateDeploymentStatusDetailsBreakdownData?: never
      }
    | {
          type: 'devtron-app' | 'other-apps' | 'stack-manager'
          appDetails: AppDetails
          initialTab: AppStatusModalTabType
          updateDeploymentStatusDetailsBreakdownData: (data: DeploymentStatusDetailsBreakdownDataType) => void
          appId?: never
          envId?: never
      }
)

export interface AppStatusBodyProps
    extends Required<Pick<AppStatusModalProps, 'appDetails' | 'type' | 'debugWithAIButton'>> {
    handleShowConfigDriftModal: () => void
    selectedTab: AppStatusModalTabType
    deploymentStatusDetailsBreakdownData: DeploymentStatusDetailsBreakdownDataType
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
}

export type GetDeploymentStatusWithTimelineParamsType = Pick<APIOptions, 'abortControllerRef'> & {
    /**
     * Incase of helm apps this is installed app id
     */
    appId: number
    envId: number
    showTimeline: boolean
    virtualEnvironmentConfig?: {
        processVirtualEnvironmentDeploymentData: AppStatusModalProps['processVirtualEnvironmentDeploymentData']
        wfrId: AppDetails['resourceTree']['wfrId']
    }
    isHelmApp?: boolean
}

export interface AppStatusModalTabListProps extends Pick<AppStatusModalProps, 'appDetails' | 'type'> {
    handleSelectTab: (updatedTab: AppStatusModalTabType) => void
    selectedTab: AppStatusModalTabType
    deploymentStatusDetailsBreakdownData: DeploymentStatusDetailsBreakdownDataType
}

export interface StatusHeadingContainerProps extends PropsWithChildren<Pick<AppStatusBodyProps, 'type'>> {
    appId: number
    envId?: number
    actionItem?: ReactNode
}

export interface InfoCardItemProps {
    heading: string
    value: ReactNode
    isLast?: boolean
    alignCenter?: boolean
}
