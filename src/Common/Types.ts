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

import React, { ReactNode, CSSProperties, ReactElement, MutableRefObject } from 'react'
import { TippyProps } from '@tippyjs/react'
import { UserGroupDTO } from '@Pages/GlobalConfigurations'
import { ImageComment, ReleaseTag } from './ImageTags.Types'
import {
    MandatoryPluginBaseStateType,
    RegistryType,
    RuntimePluginVariables,
    Severity,
    PolicyBlockInfo,
    TargetPlatformItemDTO,
    ComponentLayoutType,
    StatusType,
    DocLinkProps,
    DeploymentStrategyType,
} from '../Shared'
import {
    ACTION_STATE,
    DEPLOYMENT_WINDOW_TYPE,
    DockerConfigOverrideType,
    RefVariableType,
    SortingOrder,
    TaskErrorObj,
    VariableTypeFormat,
} from '.'
import { IllustrationName } from '@Shared/Components'

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
    /**
     * @deprecated Use abortController instead
     */
    signal?: AbortSignal
    abortControllerRef?: MutableRefObject<AbortController>
    /**
     * @default false
     */
    preventAutoLogout?: boolean
    /**
     * @default false
     */
    preventLicenseRedirect?: boolean
    /**
     * @default false
     */
    shouldParseServerErrorForUnauthorizedUser?: boolean
}

export interface OptionType<T = string, K = string> {
    value: T
    label: K
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
    error?: boolean
    children?: ReactNode
}

export interface TippyWithBaseDocLinkTypes<T extends boolean>
    extends Pick<DocLinkProps<T>, 'isExternalLink' | 'openInNewTab'> {
    documentationLink?: DocLinkProps<T>['docLinkKey']
}

export type TippyCustomizedProps<T extends boolean> = Pick<TippyProps, 'appendTo'> &
    TippyWithBaseDocLinkTypes<T> & {
        theme: TippyTheme
        visible?: boolean
        heading?: ReactNode | string
        headingInfo?: ReactNode | string
        noHeadingBorder?: boolean
        infoTextHeading?: string
        hideHeading?: boolean
        placement?: TippyProps['placement']
        className?: string
        Icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
        iconPath?: string
        iconClass?: string
        iconSize?: number // E.g. 16, 20, etc.. Currently, there are around 12 sizes supported. Check `icons.css` or `base.scss` for supported sizes or add new size (class names starts with `icon-dim-`).
        onImageLoadError?: (e) => void
        onClose?: () => void
        infoText?: React.ReactNode
        showCloseButton?: boolean
        arrow?: boolean
        interactive?: boolean
        showOnCreate?: boolean
        trigger?: string
        animation?: string
        duration?: number
        additionalContent?: ReactNode
        documentationLinkText?: string
        children: React.ReactElement<any>
        disableClose?: boolean
    }

export interface InfoIconTippyProps<T extends boolean = false>
    extends Pick<
        TippyCustomizedProps<T>,
        | 'heading'
        | 'infoText'
        | 'iconClass'
        | 'documentationLinkText'
        | 'additionalContent'
        | 'placement'
        | 'Icon'
        | 'headingInfo'
        | 'documentationLink'
        | 'isExternalLink'
        | 'openInNewTab'
    > {
    dataTestid?: string
    children?: TippyCustomizedProps<T>['children']
    iconClassName?: string
    buttonPadding?: string
}

export interface GenericEmptyStateType {
    title: ReactNode
    imgName?: IllustrationName
    image?
    classname?: string
    subTitle?: ReactNode
    isButtonAvailable?: boolean
    styles?: CSSProperties
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
    layout?: ComponentLayoutType
    contentClassName?: string
}

export interface ErrorPageType
    extends Pick<GenericEmptyStateType, 'image' | 'title' | 'subTitle' | 'renderButton' | 'imageType'>,
        Pick<ErrorScreenManagerProps, 'reload' | 'redirectURL'> {
    code: number
    redirectURL?: string
    on404Redirect?: () => void
    reload?: () => void
}

export type ErrorScreenManagerProps = {
    code?: number
    imageType?: ImageType
    reload?: (...args) => any
    subtitle?: React.ReactChild
    reloadClass?: string
} & (
    | {
        /**
         * Would be used to redirect URL in case of 404
         * @default - APP_LIST
         */
        redirectURL?: string
        on404Redirect?: never
    } | {
        redirectURL?: never
        on404Redirect: () => void
    } | {
        redirectURL?: never
        on404Redirect?: never
    }
)

export interface ErrorScreenNotAuthorizedProps {
    subtitle?: React.ReactChild
    title?: string
}
export enum ImageType {
    Large = 'large',
    Medium = 'medium',
    SMALL = 'small',
}
export interface ReloadType {
    reload?: (event?: any) => void
    className?: string
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
    initialTab: string
    children: ReactNode
    disabled?: boolean
    className?: string
}

export interface RadioInterface {
    children: ReactNode
    value: string
    className?: string
    showTippy?: boolean
    tippyContent?: any
    tippyPlacement?: string
    /**
     * If false would make radio group controlled
     */
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
    shouldPreventDefault?: boolean
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

export enum ManualApprovalType {
    specific = 'SPECIFIC',
    any = 'ANY',
    notConfigured = 'NOT_CONFIGURED',
}

export type ImageApprovalUsersInfoDTO = Record<string, Pick<UserGroupDTO, 'identifier' | 'name'>[]>

export interface UserApprovalConfigType {
    type: ManualApprovalType
    requiredCount: number
    specificUsers: {
        identifiers: string[]
        // FIXME: Remove this ? check later when time permits
        requiredCount?: number
    }
    userGroups: (Pick<UserGroupDTO, 'identifier'> & {
        requiredCount: number
    })[]
}

interface ApprovalUserDataType {
    dataId: number
    userActionTime: string
    userComment: string
    userEmail: string
    userId: number
    userResponse: number
    userGroups?: Pick<UserGroupDTO, 'identifier' | 'name'>[]
}

export interface UserApprovalInfo {
    requiredCount: number
    currentCount: number
    approverList: {
        hasApproved: boolean
        canApprove: boolean
        identifier: string
    }[]
}

export enum ApprovalConfigDataKindType {
    configMap = 'configuration/config-map',
    configSecret = 'configuration/config-secret',
    deploymentTemplate = 'configuration/deployment-template',
    deploymentTrigger = 'approval/deployment',
}

export interface ApprovalConfigDataType extends Pick<UserApprovalInfo, 'currentCount' | 'requiredCount'> {
    kind: ApprovalConfigDataKindType | null
    anyUserApprovedInfo: UserApprovalInfo
    specificUsersApprovedInfo: UserApprovalInfo
    userGroupsApprovedInfo: Pick<UserApprovalInfo, 'currentCount' | 'requiredCount'> & {
        userGroups: (UserApprovalInfo & {
            groupIdentifier: UserGroupDTO['identifier']
            groupName: UserGroupDTO['name']
        })[]
    }
    isExceptionUser: boolean
}

export enum ApprovalRuntimeStateType {
    init = 0,
    requested = 1,
    approved = 2,
    consumed = 3,
}

export interface UserApprovalMetadataType {
    approvalRequestId: number
    approvalRuntimeState: ApprovalRuntimeStateType
    requestedUserData: ApprovalUserDataType
    hasCurrentUserApproved: boolean
    canCurrentUserApprove: boolean
    approvalConfigData: ApprovalConfigDataType
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
    id: number
    identifier: string
    releaseVersion: string
    name: string
    kind: string
    version: string
}

export interface CDMaterialListModalServiceUtilProps {
    artifacts: any[]
    offset: number
    artifactId?: number
    artifactStatus?: string
    disableDefaultSelection?: boolean
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
    /**
     * Would currently only be received in case of release
     */
    appWorkflowId: number
    /**
     * Denotes trigger blocking due to mandatory tags, (might be used for plugins and other features in future)
     */
    deploymentBlockedState?: PolicyBlockInfo
    targetPlatforms: TargetPlatformItemDTO[]
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

export enum TriggerBlockType {
    MANDATORY_TAG = 'mandatory-tags',
    MANDATORY_PLUGIN = 'mandatory-plugins',
    SECURITY_SCAN = 'security-scan',
}

export interface TriggerBlockedInfo {
    blockedBy: TriggerBlockType
    blockedReason?: string
}

export interface CommonNodeAttr extends Pick<MandatoryPluginBaseStateType, 'isTriggerBlocked' | 'pluginBlockState'> {
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
    approvalConfigData: ApprovalConfigDataType
    requestedUserId?: number
    showPluginWarning: boolean
    helmPackageName?: string
    isVirtualEnvironment?: boolean
    deploymentAppType?: DeploymentAppTypes
    appReleaseTagNames?: string[]
    tagsEditable?: boolean
    isGitOpsRepoNotConfigured?: boolean
    deploymentAppCreated?: boolean
    isLast?: boolean
    downstreamEnvironments?: DownstreamNodesEnvironmentsType[]
    cipipelineId?: number
    isDeploymentBlocked?: boolean
    triggerBlockedInfo?: TriggerBlockedInfo
}

export enum DeploymentAppTypes {
    HELM = 'helm',
    ARGO = 'argo_cd',
    MANIFEST_DOWNLOAD = 'manifest_download',
    MANIFEST_PUSH = 'manifest_push',
    FLUX = 'flux_cd',
}

export interface VulnerabilityType {
    name: string
    severity: Severity
    package: string
    version: string
    fixedVersion: string
    policy: string
    url?: string
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

export interface DeploymentApprovalInfoType {
    eligibleApprovers: {
        specificUsers: Pick<UserApprovalInfo, 'approverList'>
        anyUsers: Pick<UserApprovalInfo, 'approverList'>
        userGroups: (Pick<
            ApprovalConfigDataType['userGroupsApprovedInfo']['userGroups'][number],
            'groupIdentifier' | 'groupName'
        > &
            Pick<UserApprovalInfo, 'approverList'>)[]
    }
    approvalConfigData: ApprovalConfigDataType
}

export interface CDMaterialsApprovalInfo {
    canApproverDeploy: boolean
    deploymentApprovalInfo: DeploymentApprovalInfoType
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
    deploymentBlockedState?: PolicyBlockInfo
    runtimeParams: RuntimePluginVariables[]
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
    startIcon: ReactElement
}

export interface UseSearchString {
    queryParams: URLSearchParams
    searchParams: {
        [key: string]: string
    }
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
    pipelineId?: number
    latestCdWorkflowRunnerId?: number
    commits?: string[]
    ciArtifactId?: number
}

export interface Strategy {
    deploymentTemplate: DeploymentStrategyType
    config: any
    default?: boolean
}

export interface CDStage extends Partial<Pick<CommonNodeAttr, 'triggerBlockedInfo' | 'isTriggerBlocked'>> {
    status: string
    name: string
    triggerType: 'AUTOMATIC' | 'MANUAL'
    config: string
}

export interface CDStageConfigMapSecretNames {
    configMaps: any[]
    secrets: any[]
}

export interface PrePostDeployStageType
    extends MandatoryPluginBaseStateType,
        Partial<Pick<CommonNodeAttr, 'triggerBlockedInfo'>> {
    isValid: boolean
    steps: TaskErrorObj[]
    triggerType: string
    name: string
    status: string
}

export interface CdPipeline extends Partial<Pick<CommonNodeAttr, 'triggerBlockedInfo'>> {
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
    isVirtualEnvironment?: boolean
    deploymentAppType: DeploymentAppTypes
    helmPackageName?: string
    preDeployStage?: PrePostDeployStageType
    postDeployStage?: PrePostDeployStageType
    isProdEnv?: boolean
    isGitOpsRepoNotConfigured?: boolean
    isDeploymentBlocked?: boolean
    approvalConfigData: ApprovalConfigDataType
    isTriggerBlocked?: boolean
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
    /**
     * Available only for template view
     */
    gitMaterialUrl: string
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
    type?: any
    id?: number | string
}

export interface EdgeEndNodeType extends EdgeNodeType {
    approvalConfigData: ApprovalConfigDataType
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

export interface EnvironmentListHelmResult {
    clusterId: number
    clusterName: string
    environments: EnvironmentHelmResult[]
}

export interface EnvironmentHelmResult {
    environmentId: number
    environmentName: string
    namespace: string
    environmentIdentifier: string
    isVirtualEnvironment?: boolean // Need to confirm for not full mode
    allowedDeploymentTypes?: DeploymentAppTypes[]
}

export type EnvironmentListHelmResponse = ResponseType<EnvironmentListHelmResult[]>

export interface GlobalVariableDTO {
    name: string
    format: VariableTypeFormat
    description: string
    stageType: 'cd' | 'post-cd' | 'ci'
}

export type GlobalVariableOptionType = Omit<GlobalVariableDTO, 'name'> & {
    label: string
    value: string
    variableType: Extract<RefVariableType, RefVariableType.GLOBAL>
}

export interface UserRole extends ResponseType {
    result?: {
        roles: string[]
        superAdmin: boolean
        /**
         * Defines if a user is access manager and can manage all access
         */
        canManageAllAccess?: boolean
    }
}

export enum ActionTypes {
    MANAGER = 'manager',
    ADMIN = 'admin',
    TRIGGER = 'trigger',
    VIEW = 'view',
    UPDATE = 'update',
    EDIT = 'edit',
    APPROVER = 'approver',
}

export interface GetAppsInfoForEnvProps {
    envId: number
    appIds?: number[]
}

export interface AppMeta {
    appId: number
    appStatus: StatusType
    appName: string
}

export interface EnvAppsMetaDTO {
    appCount: number
    apps: AppMeta[]
}

export interface ClusterEnvironmentCategoryDTO {
    id: number
    name: string
    description?: string
}

export interface ClusterEnvironmentCategoryType extends ClusterEnvironmentCategoryDTO {}