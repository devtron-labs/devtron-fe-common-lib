import { ResponseType } from '../../../Common'

export enum InstallationType {
    OSS_KUBECTL = 'oss_kubectl',
    OSS_HELM = 'oss_helm',
    ENTERPRISE = 'enterprise',
}

export enum ModuleStatus {
    HEALTHY = 'healthy',
    NONE = 'none',
    UNKNOWN = 'unknown',
    UPGRADING = 'upgrading',
    UPGRADE_FAILED = 'upgradeFailed',
    // Module Status
    INSTALLED = 'installed',
    INSTALLING = 'installing',
    INSTALL_FAILED = 'installFailed',
    NOT_INSTALLED = 'notInstalled',
    TIMEOUT = 'timeout',
}

export interface PageHeaderType {
    headerName?: string
    showTabs?: boolean
    additionalHeaderInfo?: () => JSX.Element
    renderHeaderTabs?: () => JSX.Element
    isBreadcrumbs?: boolean
    breadCrumbs?: () => JSX.Element
    renderActionButtons?: () => JSX.Element
    showCloseButton?: boolean
    onClose?: () => void
    markAsBeta?: boolean
    showAnnouncementHeader?: boolean
    tippyProps?: {
        isTippyCustomized?: boolean
        tippyRedirectLink?: string
        TippyIcon?: React.FunctionComponent<any>
        tippyMessage?: string
        onClickTippyButton?: () => void
    }
}

export interface ServerInfo {
    currentVersion: string
    status: ModuleStatus
    releaseName: string
    installationType: InstallationType
}

export interface ServerInfoResponse extends ResponseType {
    result?: ServerInfo
}

export interface HelpNavType {
    className: string
    setShowHelpCard: React.Dispatch<React.SetStateAction<boolean>>
    serverInfo: ServerInfo
    fetchingServerInfo: boolean
    setGettingStartedClicked: (isClicked: boolean) => void
    showHelpCard: boolean
}

export interface HelpOptionType {
    name: string
    link: string
    icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
    showSeparator?: boolean
}
