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

import { Dispatch, FunctionComponent, MutableRefObject, ReactNode, SetStateAction } from 'react'

import { SERVER_MODE } from '../../../Common'
import {
    DevtronLicenseInfo,
    EnvironmentDataValuesDTO,
    IntelligenceConfig,
    LicenseInfoDialogType,
    ToastManager,
} from '../..'
import { ServerInfo } from '../../Components/Header/types'

export interface ReloadVersionConfigTypes {
    bgUpdated: boolean
    handleAppUpdate: () => void
    doesNeedRefresh: boolean
    updateServiceWorker: () => Promise<void>
    handleControllerChange: () => void
    updateToastRef: MutableRefObject<ReturnType<typeof ToastManager.showToast>> | null
    isRefreshing: boolean
}

export enum SidePanelTab {
    DOCUMENTATION = 'documentation',
    ASK_DEVTRON = 'ask-devtron',
}

export interface SidePanelConfig {
    state: SidePanelTab | 'closed'
    /** Optional flag to reset/reinitialize the side panel state */
    reinitialize?: boolean
    /** URL to documentation that should be displayed in the panel */
    docLink: string | null
    aiSessionId?: string
    isExpandedView?: boolean
}

export enum AIAgentContextSourceType {
    APP_DETAILS = 'app-details',
    RESOURCE_BROWSER_CLUSTER = 'resource-browser-cluster',
}

export type AIAgentContextType =
    | {
          source: AIAgentContextSourceType.APP_DETAILS
          data: {
              appId: number
              envId: number
              appName: string
              envName: string
              clusterId: number
              appType: 'devtronApp' | 'devtronHelmChart'
          } & Record<string, unknown>
      }
    | {
          source: AIAgentContextSourceType.RESOURCE_BROWSER_CLUSTER
          data: {
              clusterId: number
              clusterName: string
          } & Record<string, unknown>
      }

export type DebugAgentContextType = AIAgentContextType & {
    prompt?: string
}

export interface TempAppWindowConfig {
    /** Whether the temporary window is open */
    open: boolean
    /** Title of the temporary window */
    title: string
    /** URL to load in iframe in the window */
    url?: string
    /** Image URL to display in the window header */
    image?: string
    /** Whether to show an "Open in new tab" button */
    showOpenInNewTab?: boolean
    /** React component to render in the window */
    component?: JSX.Element
    customCloseConfig?: {
        /**
         * Provide this method if you want to do something before temp window closes
         * Provide noop if not relevant
         * */
        beforeClose: () => void
        icon: JSX.Element
    }
}

type CommonMainContextProps = {
    setServerMode: (serverMode: SERVER_MODE) => void
    isHelpGettingStartedClicked: boolean
    showCloseButtonAfterGettingStartedClicked: () => void
    setLoginCount: (loginCount: number) => void
    showGettingStartedCard: boolean
    setShowGettingStartedCard: (showGettingStartedCard: boolean) => void
    isGettingStartedClicked: boolean
    setGettingStartedClicked: (isGettingStartedClicked: boolean) => void
    moduleInInstallingState: string
    setModuleInInstallingState: (moduleInInstallingState: string) => void
    currentServerInfo: {
        serverInfo: ServerInfo | null
        fetchingServerInfo: boolean
    }
    isAirgapped: boolean
    isSuperAdmin: boolean
    featureGitOpsFlags: {
        /**
         * Would define whether gitops (Global config tab) feature is enabled or not
         */
        isFeatureGitOpsEnabled: boolean
        /**
         * Would define whether user can select allow custom repo in gitops global config
         */
        isFeatureUserDefinedGitOpsEnabled: boolean
        /**
         * Feature flag for Migrate to devtron from argo cd
         */
        isFeatureArgoCdMigrationEnabled: boolean
    }
    isManifestScanningEnabled: boolean
    canOnlyViewPermittedEnvOrgLevel: boolean
    viewIsPipelineRBACConfiguredNode: ReactNode
    handleOpenLicenseInfoDialog: (
        initialDialogType?: LicenseInfoDialogType.ABOUT | LicenseInfoDialogType.LICENSE,
    ) => void
    setLicenseData: Dispatch<SetStateAction<DevtronLicenseInfo>>
    canFetchHelmAppStatus: boolean
    setIntelligenceConfig: Dispatch<SetStateAction<IntelligenceConfig>>
    debugAgentContext: DebugAgentContextType | null
    setDebugAgentContext: (aiAgentContext: DebugAgentContextType | null) => void
    setAIAgentContext: (aiAgentContext: AIAgentContextType) => void
    setSidePanelConfig: Dispatch<SetStateAction<SidePanelConfig>>
} & Pick<EnvironmentDataValuesDTO, 'isResourceRecommendationEnabled'>

export type MainContext = CommonMainContextProps &
    (
        | {
              isLicenseDashboard?: never
              serverMode: SERVER_MODE
              loginCount: number | null
              installedModuleMap: MutableRefObject<Record<string, boolean>>
              /**
               * Data is set only if showLicenseData is received as true
               */
              licenseData: DevtronLicenseInfo

              reloadVersionConfig: ReloadVersionConfigTypes
              intelligenceConfig: IntelligenceConfig

              sidePanelConfig: SidePanelConfig

              /**
               * Indicates whether the current Devtron instance is running as an Enterprise edition. \
               * This flag is determined based on server-side configuration.
               */
              isEnterprise: boolean
              /**
               * Indicates whether the fe-lib modules are available in the current instance. \
               * Used to conditionally render or enable features that depend on fe-lib
               */
              isFELibAvailable: boolean
              aiAgentContext: AIAgentContextType
              tempAppWindowConfig: TempAppWindowConfig
              setTempAppWindowConfig: Dispatch<SetStateAction<TempAppWindowConfig>>
              AIRecommendations?: FunctionComponent
              featureAskDevtronExpert: EnvironmentDataValuesDTO['featureAskDevtronExpert']
          }
        | {
              isLicenseDashboard: true
              serverMode: null
              loginCount: null
              installedModuleMap: null
              /**
               * Data is set only if showLicenseData is received as true
               */
              licenseData: null
              reloadVersionConfig: null
              intelligenceConfig: null
              sidePanelConfig: null
              isEnterprise: false
              isFELibAvailable: false
              aiAgentContext: null
              tempAppWindowConfig: null
              setTempAppWindowConfig: null
              AIRecommendations?: null
              featureAskDevtronExpert?: null
          }
    )

export interface MainContextProviderProps {
    children: ReactNode
    value: MainContext
}
