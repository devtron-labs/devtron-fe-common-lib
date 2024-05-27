import { OptionType } from '../../../../Common'
import { DeploymentTemplateList, RunSourceType, RenderRunSourceType } from '../types'

export interface DeploymentHistoryParamsType {
    appId: string
    pipelineId?: string
    historyComponent?: string
    baseConfigurationId?: string
    historyComponentName?: string
    envId?: string
    triggerId?: string
}

export interface CompareViewDeploymentType extends RenderRunSourceType {
    setFullScreenView: React.Dispatch<React.SetStateAction<boolean>>
    deploymentHistoryList: DeploymentTemplateList[]
    setDeploymentHistoryList: React.Dispatch<React.SetStateAction<DeploymentTemplateList[]>>
    releaseId?: number
}

export interface DeploymentTemplateOptions extends OptionType {
    author: string
    status: string
    runSource?: RunSourceType
}

export interface CompareWithBaseConfiguration extends RenderRunSourceType {
    selectedDeploymentTemplate: DeploymentTemplateOptions
    setSelectedDeploymentTemplate: (selected) => void
    setFullScreenView: React.Dispatch<React.SetStateAction<boolean>>
    setLoader: React.Dispatch<React.SetStateAction<boolean>>
    setPreviousConfigAvailable: React.Dispatch<React.SetStateAction<boolean>>
    releaseId?: number
}

export interface TemplateConfiguration {
    setFullScreenView: React.Dispatch<React.SetStateAction<boolean>>
    deploymentHistoryList: DeploymentTemplateList[]
    setDeploymentHistoryList: React.Dispatch<React.SetStateAction<DeploymentTemplateList[]>>
}
