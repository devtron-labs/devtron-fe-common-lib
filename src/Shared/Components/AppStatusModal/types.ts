/*
 * Copyright (c) 2024. Devtron Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { FunctionComponent, PropsWithChildren, ReactNode } from 'react'

import { APIOptions, DeploymentAppTypes } from '@Common/Types'
import { MainContext } from '@Shared/Providers'
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
    debugWithAIButton: FunctionComponent<{
        intelligenceConfig: IntelligenceConfig
        debugAgentContext: MainContext['debugAgentContext']
        onClick?: () => void
    }>
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
    extends Required<Pick<AppStatusModalProps, 'appDetails' | 'type' | 'debugWithAIButton' | 'handleClose'>> {
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
    deploymentAppType: DeploymentAppTypes
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
