import { createContext, useContext } from 'react'
import { DeploymentConfigContextType, DeploymentTemplateProviderProps } from './types'

const DeploymentTemplateContext = createContext<DeploymentConfigContextType>(null)

export const useDeploymentTemplateContext = () => {
    const context = useContext<DeploymentConfigContextType>(DeploymentTemplateContext)
    if (!context) {
        throw new Error('useDeploymentTemplateContext must be used within DeploymentTemplateProvider')
    }

    return context
}

export const DeploymentTemplateProvider = ({ children, value }: DeploymentTemplateProviderProps) => (
    <DeploymentTemplateContext.Provider value={value}>{children}</DeploymentTemplateContext.Provider>
)
