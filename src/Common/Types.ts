import React, { ReactNode, CSSProperties } from 'react'
import { Placement } from 'tippy.js'
import { ImageComment, ReleaseTag } from './ImageTags.Types'
import { ACTION_STATE, DEPLOYMENT_WINDOW_TYPE, DockerConfigOverrideType, SortingOrder, TaskErrorObj } from '.'
import { RegistryType } from '../Shared'

/**
 * Generic response type object with support for overriding the result type
 *
 * @example Default usage:
 * ```ts
 * interface UserResponse extends ResponseType {}
 * ```
 *
 * @example Override the response type:
 * ```ts
 * interface UserResponse extends ResponseType<Record<string, string>> {}
 * ```
 */
export interface ResponseType<T = any> {
    code: number
    status: string
    result?: T
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
    BULK_CHECKED = 'BULK_CHECKED',
}
export interface CheckboxProps {
    onChange: (event) => void
    isChecked: boolean
    // FIXME: Need to replace this CHECKBOX_VALUE enum, and replace string instances in dashboard
    value: 'CHECKED' | 'INTERMEDIATE' | 'BULK_CHECKED'
    name?: string
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
    hideHeading?: boolean
    placement?: Placement
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

export interface InfoIconTippyProps
    extends Pick<
        TippyCustomizedProps,
        | 'heading'
        | 'infoText'
        | 'iconClass'
        | 'documentationLink'
        | 'documentationLinkText'
        | 'additionalContent'
        | 'placement'
        | 'Icon'
        | 'headingInfo'
    > {
    dataTestid?: string
    children?: TippyCustomizedProps['children']
    iconClassName?: string
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
    SvgImage?
    renderButton?: () => JSX.Element
    imageClassName?: string
    children?: ReactNode
    noImage?: boolean
    imageStyles?: CSSProperties
    /**
     * @default 'column'
     */
    layout?: 'row' | 'column'
    contentClassName?: string
}

export interface ErrorPageType
    extends Pick<GenericEmptyStateType, 'image' | 'title' | 'subTitle' | 'renderButton' | 'imageType'>, Pick<ErrorScreenManagerProps, 'reload'> {
    code: number
    heightToDeduct?: number
}

export interface ErrorScreenManagerProps {
    code?: number
    reload?: (...args) => any
    subtitle?: React.ReactChild
    reloadClass?: string
    heightToDeduct?: number
}

export interface ErrorScreenNotAuthorizedProps {
    subtitle?: React.ReactChild
    title?: string
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
    heightToDeduct?: number
}

export interface RadioGroupItemProps {
    value: string
    dataTestId?: string
    disabled?: boolean
    children: ReactNode
}

export interface RadioGroupInterface {
    name: string
    onChange: any
    className?: string
    initialTab: string
    disabled: boolean
    children: ReactNode
}

export interface RadioInterface {
    children: ReactNode
    value: string
    className?: string
    showTippy?: boolean
    tippyContent?: any
    tippyPlacement?: string
    canSelect?: boolean
    isDisabled?: boolean
    tippyClass?: string
    dataTestId?: string
}
export interface RadioGroupComposition {
    Radio?: React.FC<any>
}

export interface RadioGroupProps {
    children: ReactNode
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

export enum FilterStates {
    ALLOWED = 0,
    BLOCKED = 1,
    ERROR = 2,
}

export enum MaterialDataSource {
    EXTERNAL = 'ext',
}

export enum ImagePromotionRuntimeState {
    AWAITING = 'AWAITING',
    PROMOTED = 'PROMOTED',
    CANCELLED = 'CANCELLED',
    STALE = 'STALE',
}

export interface ImagePromotionPolicyApprovalMetadata {
    approverCount: number
    allowRequesterFromApprove: boolean
    allowImageBuilderFromApprove: boolean
    allowApproverFromDeploy: boolean
}

export interface ImagePromotionPolicyInfoType {
    name: string
    id: number
    description: string
    conditions: FilterConditionsInfo[]
    approvalMetadata: ImagePromotionPolicyApprovalMetadata
}

export interface PromotionApprovalMetadataType {
    approvalRequestId: number
    approvalRuntimeState: ImagePromotionRuntimeState
    approvedUsersData: ApprovalUserDataType[]
    requestedUserData: ApprovalUserDataType
    policy: ImagePromotionPolicyInfoType
    promotedFrom?: string
    promotedFromType?: CDMaterialResourceQuery
}

export interface DeploymentWindowArtifactMetadata {
    id: number
    name: string
    type: DEPLOYMENT_WINDOW_TYPE
}

export interface ArtifactReleaseMappingType {
    id : number, 
    identifier: string,
    // TODO: Ask BE to rename this to `releaseVersion`
    releaseVersion: string,
    name: string
    kind: string
    version: string
}

export interface CDMaterialType {
    index: number
    id: string
    materialInfo: MaterialInfo[]
    tab: CDModalTabType
    scanEnabled: boolean
    scanned: boolean
    vulnerabilitiesLoading: boolean
    lastExecution: string // timestamp
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
    artifactStatus?: string
    filterState: FilterStates
    registryType?: RegistryType
    imagePath?: string
    registryName?: string
    // Not even coming from API but required in CDMaterials for Security which makes its own api call but stores data in CDMaterials
    scanToolId?: number
    appliedFiltersTimestamp?: string
    appliedFilters?: FilterConditionsListType[]
    appliedFiltersState?: FilterStates
    createdTime?: string
    deployed?: boolean
    dataSource?: MaterialDataSource
    /**
     * The below two keys: `promotionApprovalMetaData`, `deployedOnEnvironments` are used in image promotion
     * and may not be available to cater other use-cases.
     */
    promotionApprovalMetadata?: PromotionApprovalMetadataType
    deployedOnEnvironments?: string[]
    deploymentWindowArtifactMetadata?: DeploymentWindowArtifactMetadata
    /**
     * Will only be present in case of release
     */
    configuredInReleases: ArtifactReleaseMappingType[]
}

export enum CDMaterialServiceEnum {
    ROLLBACK = 'rollback',
    CD_MATERIALS = 'cd-materials',
    IMAGE_PROMOTION = 'image-promotion',
}

export enum CDMaterialResourceQuery {
    PENDING_APPROVAL = 'PENDING_APPROVAL',
    PROMOTION_APPROVAL_PENDING_NODE = 'PROMOTION_APPROVAL_PENDING_NODE',
    CI = 'CI',
    ENVIRONMENT = 'ENVIRONMENT',
    WEBHOOK = 'WEBHOOK',
    LINKED_CI = 'LINKED-CI',
    CI_JOB = 'CI-JOB',
    LINKED_CD = 'LINKED-CD',
}

export enum CDMaterialFilterQuery {
    RESOURCE = 'ELIGIBLE_RESOURCES',
    ALL = 'ALL_RESOURCES',
}

export interface CDMaterialServiceQueryParams {
    search?: string
    offset?: number
    size?: number
    resource?: CDMaterialResourceQuery
    resourceName?: string
    resourceId?: number
    workflowId?: number
    appId?: number
    pendingForCurrentUser?: boolean
    filter?: CDMaterialFilterQuery
}

export interface DownstreamNodesEnvironmentsType {
    environmentId: number
    environmentName: string
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
    isLinkedCD?: boolean
    isJobCI?: boolean // used for Job type CI in Devtron Apps
    environmentName?: string // used for CDs
    environmentId?: number
    inputMaterialList?: any[]
    rollbackMaterialList?: any[] // used for CDs
    linkedCount?: number // used for CI
    deploymentStrategy?: string
    height: number
    width: number
    preNode?: CommonNodeAttr // used for CDs
    postNode?: CommonNodeAttr // used for CDs
    stageIndex?: number // used for CDs
    sourceNodes?: Array<CommonNodeAttr> // used for CI
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
    deploymentAppType?: DeploymentAppTypes
    isCITriggerBlocked?: boolean
    ciBlockState?: {
        action: any
        metadataField: string
    }
    appReleaseTagNames?: string[]
    tagsEditable?: boolean
    isGitOpsRepoNotConfigured?: boolean
    deploymentAppCreated?: boolean
    isLast?: boolean
    downstreamEnvironments?: DownstreamNodesEnvironmentsType[]
    cipipelineId?: number
    isDeploymentBlocked?: boolean
}

export enum DeploymentAppTypes {
    HELM = 'helm',
    GITOPS = 'argo_cd',
    MANIFEST_DOWNLOAD = 'manifest_download',
    MANIFEST_PUSH = 'manifest_push',
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
    hidePolicy?: boolean
    shouldStick?: boolean
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

export enum FilterConditionType {
    PASS = 1,
    FAIL = 0,
}

export interface FilterConditionsInfo {
    conditionType: FilterConditionType
    expression: string
}

export interface FilterConditionsListType {
    id: number
    name: string
    description: string
    conditions: FilterConditionsInfo[]
}

export interface CDMaterialsApprovalInfo {
    approvalUsers: string[]
    userApprovalConfig: UserApprovalConfigType
    canApproverDeploy: boolean
}

export interface CDMaterialsMetaInfo {
    tagsEditable: boolean
    appReleaseTagNames: string[]
    hideImageTaggingHardDelete: boolean
    resourceFilters?: FilterConditionsListType[]
    totalCount: number
    /**
     * This is the ID of user that has request the material
     */
    requestedUserId: number
    /**
     * Would currently only be received in case of release, otherwise it would be 0
     */
    appWorkflowId: number
}

export interface ImagePromotionMaterialInfo {
    isApprovalPendingForPromotion: boolean
    imagePromotionApproverEmails: string[]
}

export interface CDMaterialResponseType
    extends CDMaterialsMetaInfo,
        CDMaterialsApprovalInfo,
        ImagePromotionMaterialInfo {
    materials: CDMaterialType[]
}

export interface InputDetailType {
    label: string
    defaultValue: string
    placeholder: string
}

export interface RegistryTypeDetailType {
    value: string
    label: string
    desiredFormat: string
    placeholderText: string
    gettingStartedLink: string
    defaultRegistryURL: string
    registryURL: InputDetailType
    id: InputDetailType
    password: InputDetailType
}

export interface UseSearchString {
    queryParams: URLSearchParams
    searchParams: {
        [key: string]: string
    }
}

export interface ResizableTextareaProps {
    minHeight?: number
    maxHeight?: number
    value?: string
    onChange?: (e) => void
    onBlur?: (e) => void
    onFocus?: (e) => void
    className?: string
    placeholder?: string
    disabled?: boolean
    name?: string
    dataTestId?: string
}

export interface AsyncState<T> {
    loading: boolean
    result: T
    error: null
    dependencies: any[]
}

export interface AsyncOptions {
    resetOnChange: boolean
}

export interface AppEnvironment {
    environmentId: number
    environmentName: string
    appMetrics: boolean
    infraMetrics: boolean
    prod: boolean
    chartRefId?: number
    lastDeployed?: string
    lastDeployedBy?: string
    lastDeployedImage?: string
    appStatus?: string
    deploymentAppDeleteRequest?: boolean
    isVirtualEnvironment?: boolean
    isProtected?: boolean
    pipelineId?: number
    latestCdWorkflowRunnerId?: number
}

export interface Strategy {
    deploymentTemplate: string
    config: any
    default?: boolean
}

export interface CDStage {
    status: string
    name: string
    triggerType: 'AUTOMATIC' | 'MANUAL'
    config: string
}

export interface CDStageConfigMapSecretNames {
    configMaps: any[]
    secrets: any[]
}

export interface PrePostDeployStageType {
    isValid: boolean
    steps: TaskErrorObj[]
    triggerType: string
    name: string
    status: string
}

export interface CdPipeline {
    id: number
    environmentId: number
    environmentName?: string
    description?: string
    ciPipelineId: number
    triggerType: 'AUTOMATIC' | 'MANUAL'
    name: string
    strategies?: Strategy[]
    namespace?: string
    appWorkflowId?: number
    deploymentTemplate?: string
    preStage?: CDStage
    postStage?: CDStage
    preStageConfigMapSecretNames?: CDStageConfigMapSecretNames
    postStageConfigMapSecretNames?: CDStageConfigMapSecretNames
    runPreStageInEnv?: boolean
    runPostStageInEnv?: boolean
    isClusterCdActive?: boolean
    parentPipelineId?: number
    parentPipelineType?: string
    deploymentAppDeleteRequest?: boolean
    deploymentAppCreated?: boolean
    userApprovalConfig?: UserApprovalConfigType
    isVirtualEnvironment?: boolean
    deploymentAppType: DeploymentAppTypes
    helmPackageName?: string
    preDeployStage?: PrePostDeployStageType
    postDeployStage?: PrePostDeployStageType
    isProdEnv?: boolean
}

export interface ExternalCiConfig {
    id: number
    webhookUrl: string
    payload: string
    accessKey: string
}

export interface Source {
    type: string
    value?: string
    regex?: string
}

export interface CiMaterial {
    source: Source
    gitMaterialId: number
    id: number
    gitMaterialName: string
    isRegex?: boolean
}

export interface Task {
    name?: string
    type?: string
    cmd?: string
    args?: Array<string>
}

export interface CiScript {
    id: number
    index: number
    name: string
    script: string
    outputLocation?: string
}

export interface CiPipeline {
    isManual: boolean
    dockerArgs?: Map<string, string>
    isExternal: boolean
    parentCiPipeline: number
    parentAppId: number
    externalCiConfig: ExternalCiConfig
    ciMaterial?: CiMaterial[]
    name?: string
    id?: number
    active?: boolean
    linkedCount: number
    scanEnabled: boolean
    deleted?: boolean
    version?: string
    beforeDockerBuild?: Array<Task>
    afterDockerBuild?: Array<Task>
    appWorkflowId?: number
    beforeDockerBuildScripts?: Array<CiScript>
    afterDockerBuildScripts?: Array<CiScript>
    isDockerConfigOverridden?: boolean
    dockerConfigOverride?: DockerConfigOverrideType
    appName?: string
    appId?: string
    componentId?: number
    isCITriggerBlocked?: boolean
    ciBlockState?: {
        action: any
        metadataField: string
    }
    isOffendingMandatoryPlugin?: boolean
    pipelineType?: string
}
export interface InformationBarProps {
    text: string
    className?: string
    children?: React.ReactNode
}

export interface CodeEditorInterface {
    value?: string
    lineDecorationsWidth?: number
    responseType?: string
    onChange?: (string) => void
    onBlur?: () => void
    onFocus?: () => void
    children?: any
    defaultValue?: string
    mode?: 'json' | 'yaml' | 'shell' | 'dockerfile' | 'plaintext'
    tabSize?: number
    readOnly?: boolean
    noParsing?: boolean
    minHeight?: number
    maxHeight?: number
    inline?: boolean
    height?: number | string
    shebang?: string | JSX.Element
    diffView?: boolean
    loading?: boolean
    customLoader?: JSX.Element
    theme?: string
    original?: string
    focus?: boolean
    validatorSchema?: any
    isKubernetes?: boolean
    cleanData?: boolean
    chartVersion?: any
}

export interface CodeEditorComposition {
    Header?: React.FC<any>
    LanguageChanger?: React.FC<any>
    ThemeChanger?: React.FC<any>
    ValidationError?: React.FC<any>
    Clipboard?: React.FC<any>
    Warning?: React.FC<InformationBarProps>
    ErrorBar?: React.FC<InformationBarProps>
    Information?: React.FC<InformationBarProps>
}

export interface CodeEditorHeaderComposition {
    LanguageChanger?: React.FC<any>
    ThemeChanger?: React.FC<any>
    ValidationError?: React.FC<any>
    Clipboard?: React.FC<any>
}
export interface CodeEditorHeaderInterface {
    children?: any
    className?: string
    hideDefaultSplitHeader?: boolean
}

export interface DeploymentChartVersionType {
    chartRefId: number
    chartVersion: string
    chartType: string
    type: number
}

export interface ChartVersionAndTypeSelectorProps {
    setSelectedChartRefId: React.Dispatch<React.SetStateAction<number>>
}

export enum PipelineType {
    CI_PIPELINE = 'CI_PIPELINE',
    CD_PIPELINE = 'CD_PIPELINE',
    WEBHOOK = 'WEBHOOK',
    LINKED_CD = 'LINKED_CD',
}

export enum WorkflowNodeType {
    GIT = 'GIT',
    CI = 'CI',
    WEBHOOK = 'WEBHOOK',
    PRE_CD = 'PRECD',
    CD = 'CD',
    POST_CD = 'POSTCD',
}

export enum AddCDPositions {
    LEFT = 'left',
    RIGHT = 'right',
}

export interface SelectedNode {
    nodeType: WorkflowNodeType
    id: string
}

export enum AddPipelineType {
    SEQUENTIAL = 'SEQUENTIAL',
    PARALLEL = 'PARALLEL',
}

export interface Point {
    x: number
    y: number
}

export interface EdgeNodeType {
    height: number
    width: number
    userApprovalConfig?: UserApprovalConfigType
    type?: any
    id?: number | string
}

export interface EdgeEndNodeType extends EdgeNodeType {
    userApprovalConfig?: UserApprovalConfigType
}

/**
 * Search params for sorting configuration
 *
 * Note: Either both sortOrder and sortBy are required or none
 */
export type SortingParams<T = string> =
    | {
          sortOrder: SortingOrder
          sortBy: T
      }
    | { sortOrder?: never; sortBy?: never }

export interface DeploymentWindowProfileMetaData {
    name: string
    userActionState: ACTION_STATE
    type: string | DEPLOYMENT_WINDOW_TYPE
    calculatedTimestamp: string
    isActive: boolean
    excludedUserEmails: string[]
    warningMessage: string
}
