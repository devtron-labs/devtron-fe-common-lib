import { OptionType } from '../../../../Common'
import { DeploymentTemplateList, RunSource, renderRunSourceType } from '../types'

export interface DeploymentHistoryParamsType {
    appId: string
    pipelineId?: string
    historyComponent?: string
    baseConfigurationId?: string
    historyComponentName?: string
    envId?: string
    triggerId?: string
}

export interface CompareViewDeploymentType extends renderRunSourceType {
    setFullScreenView: React.Dispatch<React.SetStateAction<boolean>>
    deploymentHistoryList: DeploymentTemplateList[]
    setDeploymentHistoryList: React.Dispatch<React.SetStateAction<DeploymentTemplateList[]>>
}

export interface DeploymentTemplateOptions extends OptionType {
    author: string
    status: string
    runSource?: RunSource
}

export interface CompareWithBaseConfiguration extends renderRunSourceType {
    selectedDeploymentTemplate: DeploymentTemplateOptions
    setSelectedDeploymentTemplate: (selected) => void
    setFullScreenView: React.Dispatch<React.SetStateAction<boolean>>
    setLoader: React.Dispatch<React.SetStateAction<boolean>>
    setPreviousConfigAvailable: React.Dispatch<React.SetStateAction<boolean>>
}

export interface TemplateConfiguration {
    setFullScreenView: React.Dispatch<React.SetStateAction<boolean>>
    deploymentHistoryList: DeploymentTemplateList[]
    setDeploymentHistoryList: React.Dispatch<React.SetStateAction<DeploymentTemplateList[]>>
}
