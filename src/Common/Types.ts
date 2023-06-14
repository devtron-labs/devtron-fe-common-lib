import { ReactNode, CSSProperties } from 'react'
import { Placement } from 'tippy.js'
export interface ResponseType {
    code: number
    status: string
    result?: any
    errors?: any
}

export interface APIOptions {
    timeout?: number
    signal?: AbortSignal
    preventAutoLogout?: boolean
}

export interface OptionType {
    label: string
    value: string
}

export enum TippyTheme {
    black = 'black',
    white = 'white',
}
export interface TeamList extends ResponseType {
    result: Teams[]
}

export interface Teams {
    id: number
    name: string
    active: boolean
}

export enum CHECKBOX_VALUE {
    CHECKED = 'CHECKED',
    INTERMEDIATE = 'INTERMEDIATE',
}
export interface CheckboxProps {
    onChange: (event) => void
    isChecked: boolean
    value: 'CHECKED' | 'INTERMEDIATE'
    disabled?: boolean
    tabIndex?: number
    rootClassName?: string
    onClick?: (event) => void
    id?: string
    dataTestId?: string
}

export interface TippyCustomizedProps {
    theme: TippyTheme
    visible?: boolean
    heading?: ReactNode | string
    headingInfo?: ReactNode | string
    noHeadingBorder?: boolean
    infoTextHeading?: string
    placement: Placement
    className?: string
    Icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
    iconPath?: string
    iconClass?: string
    iconSize?: number // E.g. 16, 20, etc.. Currently, there are around 12 sizes supported. Check `icons.css` or `base.scss` for supported sizes or add new size (class names starts with `icon-dim-`).
    onImageLoadError?: (e) => void
    onClose?: () => void
    infoText?: string
    showCloseButton?: boolean
    arrow?: boolean
    interactive?: boolean
    showOnCreate?: boolean
    trigger?: string
    animation?: string
    duration?: number
    additionalContent?: ReactNode
    documentationLink?: string
    documentationLinkText?: string
    children: React.ReactElement<any>
}
export interface GenericEmptyStateType {
    title: ReactNode
    image?
    classname?: string
    subTitle?: ReactNode
    isButtonAvailable?: boolean
    styles?: CSSProperties
    heightToDeduct?: number
    imageType?: string
    renderButton?: () => JSX.Element
    imageClassName?: string
    children?: ReactNode
    noImage?: boolean
}

export enum ImageType {
    Large = 'large',
    Medium = 'medium',
}

export interface InfoColourBarType {
    message: React.ReactNode
    classname: string
    Icon
    iconClass?: string
    iconSize?: number // E.g. 16, 20, etc.. Currently, there are around 12 sizes supported. Check `icons.css` or `base.scss` for supported sizes or add new size (class names starts with `icon-dim-`).
    renderActionButton?: () => JSX.Element
    linkText?: React.ReactNode
    redirectLink?: string
    linkOnClick?: () => void
    linkClass?: string
    internalLink?: boolean
    styles?: CSSProperties
}

export interface ReloadType {
    reload?: (event?: any) => void
    className?: string
}

export interface RadioGroupItemProps {
    value: string
    dataTestId?: string
}

export interface RadioGroupProps {
    value: string
    name: string
    disabled?: boolean
    onChange: (event) => void
    className?: string
}

export interface ProgressingProps {
    pageLoader?: boolean
    loadingText?: string
    size?: number
    fullHeight?: boolean
    theme?: 'white' | 'default'
    styles?: React.CSSProperties
    children?: React.ReactNode
    fillColor?: string
}

export interface PopupMenuType {
    children?: any
    onToggleCallback?: (isOpen: boolean) => void
    autoClose?: boolean
    autoPosition?: boolean
}

export interface PopupMenuButtonType {
    children?: ReactNode
    disabled?: boolean
    rootClassName?: string
    tabIndex?: number
    onHover?: boolean
    isKebab?: boolean
    dataTestId?: string
}

export interface PopupMenuBodyType {
    children?: ReactNode
    rootClassName?: string
    style?: React.CSSProperties
    autoWidth?: boolean
    preventWheelDisable?: boolean
    noBackDrop?: boolean
}

export interface ModalType {
    style?: React.CSSProperties
    children?: ReactNode
    modal?: boolean
    rootClassName?: string
    onClick?: any
    callbackRef?: (element?: any) => any
    preventWheelDisable?: boolean
    noBackDrop?: boolean
}

export type CDModalTabType = 'SECURITY' | 'CHANGES'

export const CDModalTab = {
    Security: <CDModalTabType>'SECURITY',
    Changes: <CDModalTabType>'CHANGES',
}

export enum DeploymentNodeType {
    PRECD = 'PRECD',
    CD = 'CD',
    POSTCD = 'POSTCD',
    APPROVAL = 'APPROVAL',
}

export interface UserApprovalConfigType {
    requiredCount: number
}

interface ApprovalUserDataType {
    dataId: number
    userActionTime: string
    userComment: string
    userEmail: string
    userId: number
    userResponse: number
}

export interface UserApprovalMetadataType {
    approvalRequestId: number
    approvalRuntimeState: number
    approvedUsersData: ApprovalUserDataType[]
    requestedUserData: ApprovalUserDataType
}


export interface CDMaterialType {
    index: number
    id: string
    materialInfo: MaterialInfo[]
    tab: CDModalTabType
    scanEnabled: boolean
    scanned: boolean
    vulnerabilitiesLoading: boolean
    lastExecution: string //timestamp
    vulnerabilities: VulnerabilityType[]
    vulnerable: boolean
    deployedTime: string
    deployedBy?: string
    wfrId?: number
    buildTime: string
    image: string
    isSelected: boolean
    showSourceInfo: boolean
    latest: boolean
    runningOnParentCd?: boolean
    userApprovalMetadata?: UserApprovalMetadataType
    triggeredBy?: number
    imageComment?: ImageComment
    imageReleaseTags?: ReleaseTag[]
}

export interface CommonNodeAttr {
    connectingCiPipelineId?: number
    parents: string | number[] | string[]
    x: number
    y: number
    title: string
    description?: string
    triggerType?: string
    id: string
    icon?: string
    status?: string
    isSource: boolean
    isGitSource: boolean
    isRoot: boolean
    downstreams: string[]
    type: 'CI' | 'GIT' | 'PRECD' | 'CD' | 'POSTCD' | 'WEBHOOK'
    parentCiPipeline?: number
    parentAppId?: number
    url?: string
    branch?: string
    sourceType?: string
    colorCode?: string
    isExternalCI?: boolean
    isLinkedCI?: boolean
    environmentName?: string //used for CDs
    environmentId?: number
    inputMaterialList?: any[]
    rollbackMaterialList?: any[] //used for CDs
    linkedCount?: number //used for CI
    deploymentStrategy?: string
    height: number
    width: number
    preNode?: CommonNodeAttr //used for CDs
    postNode?: CommonNodeAttr //used for CDs
    stageIndex?: number //used for CDs
    sourceNodes?: Array<CommonNodeAttr> //used for CI
    downstreamNodes?: Array<CommonNodeAttr>
    parentPipelineId?: string
    parentPipelineType?: string
    parentEnvironmentName?: string
    isRegex?: boolean
    regex?: string
    primaryBranchAfterRegex?: string
    storageConfigured?: boolean
    deploymentAppDeleteRequest?: boolean
    approvalUsers?: string[]
    userApprovalConfig?: UserApprovalConfigType
    requestedUserId?: number
    showPluginWarning?: boolean
    helmPackageName?: string
    isVirtualEnvironment?: boolean
    isCITriggerBlocked?: boolean
    ciBlockState?: {
        action: any,
        metadataField: string
    }
    appReleaseTagNames?: string[]
    tagsEditable?: boolean
}

export interface VulnerabilityType {
    name: string
    severity: 'CRITICAL' | 'MODERATE' | 'LOW'
    package: string
    version: string
    fixedVersion: string
    policy: string
    url?: string
}

export interface ScanVulnerabilitiesTableProps {
    vulnerabilities: VulnerabilityType[]
}

export interface MaterialInfo {
    revision: string
    modifiedTime: string | Date
    author: string
    message: string
    commitLink: string
    tag: string
    webhookData: string
    branch: string
    url?: string
    type?: string
}

export interface CDMaterialResponseType {
    approvalUsers: string[]
    materials: any[]
    userApprovalConfig: UserApprovalConfigType
    requestedUserId: number
    tagsEditable: boolean
    appReleaseTagNames: string[]
}

export interface ReleaseTag {
    id: number
    tagName: string
    appId: number
    deleted: boolean
    artifactId: number
}

export interface ImageComment {
    id: number
    comment: string
    artifactId: number
}



