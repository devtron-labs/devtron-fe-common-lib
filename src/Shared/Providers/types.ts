import { MutableRefObject, ReactNode } from 'react'
import { ServerInfo } from '../Components/Header/types'
import { SERVER_MODE } from '../../Common'

export interface MainContext {
    serverMode: SERVER_MODE
    setServerMode: (serverMode: SERVER_MODE) => void
    isHelpGettingStartedClicked: boolean
    setPageOverflowEnabled: (isPageOverflowEnabled: boolean) => void
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
}

export interface MainContextProviderProps {
    children: ReactNode
    value: MainContext
}
