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
    docLink?: string | null
}

export interface MainContext {
    serverMode: SERVER_MODE
    setServerMode: (serverMode: SERVER_MODE) => void
    isHelpGettingStartedClicked: boolean
    showCloseButtonAfterGettingStartedClicked: () => void
    loginCount: number
    setLoginCount: (loginCount: number) => void
    showGettingStartedCard: boolean
    setShowGettingStartedCard: (showGettingStartedCard: boolean) => void
    isGettingStartedClicked: boolean
    setGettingStartedClicked: (isGettingStartedClicked: boolean) => void
    moduleInInstallingState: string
    setModuleInInstallingState: (moduleInInstallingState: string) => void
    installedModuleMap: MutableRefObject<Record<string, boolean>>
    currentServerInfo: {
        serverInfo: ServerInfo
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
    /**
     * Data is set only if showLicenseData is received as true
     */
    licenseData: DevtronLicenseInfo
    setLicenseData: Dispatch<SetStateAction<DevtronLicenseInfo>>
    canFetchHelmAppStatus: boolean
    reloadVersionConfig: ReloadVersionConfigTypes
    intelligenceConfig: IntelligenceConfig
    setIntelligenceConfig: Dispatch<SetStateAction<IntelligenceConfig>>
    aiAgentContext: {
        path: string
        context: Record<string, string>
    }
    setAIAgentContext: (aiAgentContext: MainContext['aiAgentContext']) => void

    sidePanelConfig: SidePanelConfig
    setSidePanelConfig: Dispatch<SetStateAction<SidePanelConfig>>

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
}

export interface MainContextProviderProps {
    children: ReactNode
    value: MainContext
}
