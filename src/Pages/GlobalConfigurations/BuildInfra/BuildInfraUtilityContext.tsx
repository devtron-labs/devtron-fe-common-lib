import { createContext, useContext } from 'react'
import { BuildInfraUtilityContextType } from '@Pages/index'

export const BuildInfraUtilityContext = createContext<BuildInfraUtilityContextType>(null)

export const useBuildInfraUtilityContext = () => {
    const context = useContext(BuildInfraUtilityContext)

    if (!context) {
        throw new Error('Please wrap parent component with BuildInfraUtilityProvider')
    }

    return context
}
