import { OptionType } from '../../../../Common'
import { DeploymentTemplateList, RunSource } from '../types'

export interface DeploymentHistoryParamsType {
    appId: string
    pipelineId?: string
    historyComponent?: string
    baseConfigurationId?: string
    historyComponentName?: string
    envId?: string
    triggerId?: string
}

export interface CompareViewDeploymentType {
    setFullScreenView: React.Dispatch<React.SetStateAction<boolean>>
    deploymentHistoryList: DeploymentTemplateList[]
    setDeploymentHistoryList: React.Dispatch<React.SetStateAction<DeploymentTemplateList[]>>
    renderRunSource?: (runSource: RunSource) => JSX.Element
}

export interface DeploymentTemplateOptions extends OptionType {
    author: string
    status: string
    runSource?: {
        id: number
        identifier: string
        kind: string
        name: string
        releaseTrackName: string
        releaseVersion: string
        version: string
    }
    releaseId?: number
}

export interface CompareWithBaseConfiguration {
    selectedDeploymentTemplate: DeploymentTemplateOptions
    setSelectedDeploymentTemplate: (selected) => void
    setFullScreenView: React.Dispatch<React.SetStateAction<boolean>>
    setLoader: React.Dispatch<React.SetStateAction<boolean>>
    setPreviousConfigAvailable: React.Dispatch<React.SetStateAction<boolean>>
    renderRunSource: (runSource: RunSource) => JSX.Element
}
