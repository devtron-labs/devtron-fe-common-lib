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

import { Dispatch, MutableRefObject, ReactNode, SetStateAction } from 'react'

import { SERVER_MODE } from '../../Common'
import { ServerInfo } from '../Components/Header/types'
import { DevtronLicenseInfo, IntelligenceConfig, LicenseInfoDialogType, ToastManager } from '..'

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
}

type AIAgentContextType = {
    path: string
    context: Record<string, string>
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
    setAIAgentContext: (aiAgentContext: AIAgentContextType) => void
    setSidePanelConfig: Dispatch<SetStateAction<SidePanelConfig>>
}

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
          }
    )

export interface MainContextProviderProps {
    children: ReactNode
    value: MainContext
}
