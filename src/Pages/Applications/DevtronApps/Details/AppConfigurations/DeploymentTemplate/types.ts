import { MutableRefObject, ReactNode } from 'react'
import { AppEnvironment } from '@Common/Types'
import { ConfigKeysWithLockType, ConfigurationType } from '@Shared/types'
import { Operation } from 'fast-json-patch'

export enum DeploymentTemplateTabsType {
    EDIT = 1,
    COMPARE = 2,
    PUBLISHED = 3,
}

export interface DeploymentTemplateQueryParamsType {
    // TODO: Remove it from params itself
    hideLockedKeys?: boolean
    // TODO: Remove it from params itself
    resolveScopedVariables?: boolean
    selectedTab: DeploymentTemplateTabsType
    showReadMe: boolean
    editMode: ConfigurationType
}

export enum DeploymentConfigStateActionTypes {
    draftState = 'draftState',
    loading = 'loading',
    charts = 'charts',
    chartsMetadata = 'chartsMetadata',
    selectedChartRefId = 'selectedChartRefId',
    selectedChart = 'selectedChart',
    template = 'template',
    schemas = 'schemas',
    chartConfig = 'chartConfig',
    isAppMetricsEnabled = 'isAppMetricsEnabled',
    /**
     * @deprecated
     */
    tempFormData = 'tempFormData',
    chartConfigLoading = 'chartConfigLoading',
    showConfirmation = 'showConfirmation',
    showReadme = 'showReadme',
    openComparison = 'openComparison',
    selectedTabIndex = 'selectedTabIndex',
    readme = 'readme',
    fetchedValues = 'fetchedValues',
    fetchedValuesManifest = 'fetchedValuesManifest',
    yamlMode = 'yamlMode',
    duplicate = 'duplicate',
    appMetrics = 'appMetrics',
    data = 'data',
    toggleDialog = 'toggleDialog',
    reset = 'reset',
    toggleSaveChangesModal = 'toggleSaveChangesModal',
    toggleShowLockedTemplateDiff = 'toggleShowLockedTemplateDiff',
    allDrafts = 'allDrafts',
    publishedState = 'publishedState',
    toggleDraftComments = 'toggleDraftComments',
    toggleDeleteOverrideDraftModal = 'toggleDeleteOverrideDraftModal',
    isDraftOverriden = 'isDraftOverriden',
    unableToParseYaml = 'unableToParseYaml',
    selectedCompareOption = 'selectedCompareOption',
    multipleOptions = 'multipleOptions',
    groupedOptionsData = 'groupedOptionsData',
    isValuesOverride = 'isValuesOverride',
    groupedOptionsDataOverride = 'groupedOptionsDataOverride',
    loadingManifestOverride = 'loadingManifestOverride',
    manifestDataRHSOverride = 'manifestDataRHSOverride',
    manifestDataLHSOverride = 'manifestDataLHSOverride',
    /**
     * @deprecated - use from url
     *
     */
    convertVariables = 'convertVariables',
    convertVariablesOverride = 'convertVariablesOverride',
    lockChangesLoading = 'lockChangesLoading',
    guiSchema = 'guiSchema',
    wasGuiOrHideLockedKeysEdited = 'wasGuiOrHideLockedKeysEdited',
    editorTemplate = 'editorTemplate',
}

export type DeploymentChartOptionkind = 'base' | 'env' | 'chartVersion' | 'deployment'

export interface DeploymentConfigStateAction {
    type: DeploymentConfigStateActionTypes
    payload?: any
}

export interface DeploymentChartVersionType {
    id: number | string
    version: string
    chartRefId: number
    type: number
    deploymentTemplateHistoryId: number
    pipelineId: number
    environmentId: number
    name: string
    description?: string
    isAppMetricsSupported: boolean
}

export interface DeploymentChartOptionType extends DeploymentChartVersionType {
    value: string | number
    label: string
    kind?: DeploymentChartOptionkind
}

export interface ChartMetadataType {
    chartDescription: string
}

export interface DeploymentConfigStateType {
    charts: DeploymentChartVersionType[]
    chartsMetadata: Record<string, ChartMetadataType>
    selectedChartRefId: number
    selectedChart: DeploymentChartVersionType
    /**
     * Initial deployment template in JSON format
     */
    template: Record<string, string>
    schema: any
    guiSchema: string
    wasGuiOrHideLockedKeysEdited: boolean
    loading: boolean
    chartConfig: any
    isAppMetricsEnabled: boolean
    tempFormData: string
    chartConfigLoading: boolean
    lockChangesLoading: boolean
    showConfirmation: boolean
    showReadme: boolean
    /**
     * @deprecated - transient state on url
     */
    openComparison: boolean
    /**
     * @deprecated - move to URL
     */
    selectedTabIndex: number
    readme: string
    fetchedValues: Record<number | string, string>
    fetchedValuesManifest: Record<number | string, string>
    yamlMode: boolean
    data: any
    duplicate: any
    dialog: boolean
    latestAppChartRef: any
    latestChartRef: any
    isOverride: boolean
    groupedOptionsData: Array<Object>
    isValuesOverride: boolean
    manifestDataRHSOverride: string
    manifestDataLHSOverride: string
    groupedOptionsDataOverride: Array<Object>
    loadingManifestOverride: boolean
    convertVariables: boolean
    convertVariablesOverride: boolean
    /**
     * Base deployment template in string format
     */
    baseDeploymentTemplate: string
    /**
     * Deployment template of editable saved state
     */
    originalTemplate: string
    /**
     * Edited deployment template
     */
    editorTemplate: string
}

export interface DeploymentConfigStateWithDraft extends DeploymentConfigStateType {
    publishedState: DeploymentConfigStateType
    draftValues: string
    showSaveChangesModal: boolean
    allDrafts: any[]
    // TODO: Might be string
    latestDraft: any
    showComments: boolean
    showDeleteOverrideDraftModal: boolean
    showDraftOverriden: boolean
    isDraftOverriden: boolean
    unableToParseYaml: boolean
    selectedCompareOption: DeploymentChartOptionType
    showLockedTemplateDiff: boolean
}

export interface DeploymentConfigContextType {
    isUnSet: boolean
    state: DeploymentConfigStateWithDraft
    dispatch: React.Dispatch<DeploymentConfigStateAction>
    isConfigProtectionEnabled: boolean
    environments: AppEnvironment[]
    reloadEnvironments: () => void
    /**
     * @deprecated
     */
    changeEditorMode: () => void
    // TODO: Remove optional check
    handleChangeToYAMLMode?: () => void
    handleChangeToGUIMode?: () => void
    editorOnChange?: (str: string) => void
    handleDisableResolveScopedVariables: () => void
    lockedConfigKeysWithLockType: ConfigKeysWithLockType
    handleUpdateRemovedPatches: (patches: Operation[]) => void
    removedPatches: MutableRefObject<Operation[]>
}

export interface GetResolvedDeploymentTemplateReturnType {
    resolvedData: string
    areVariablesPresent: boolean
}

export interface DeploymentTemplateProviderProps {
    children: ReactNode
    value: DeploymentConfigContextType
}

export enum ValuesAndManifestFlagDTO {
    DEPLOYMENT_TEMPLATE = 1,
    MANIFEST = 2,
}

export interface GetResolvedDeploymentTemplatePayloadType {
    appId: number
    chartRefId: number
    /**
     * String to be resolved
     */
    values: string
    valuesAndManifestFlag: ValuesAndManifestFlagDTO.DEPLOYMENT_TEMPLATE
    /**
     * EnvId for the given VALUE
     */
    envId?: number
}

export interface GetResolvedDeploymentTemplateProps
    extends Omit<GetResolvedDeploymentTemplatePayloadType, 'valuesAndManifestFlag'> {}

export interface ResolvedDeploymentTemplateDTO {
    /**
     * Template with encoded variables
     */
    data: string
    /**
     * Template with resolved variables
     */
    resolvedData: string
    variableSnapshot: Record<string, string>
}

export interface UseDeploymentTemplateComputedDataProps
    extends Pick<DeploymentTemplateQueryParamsType, 'resolveScopedVariables'> {}

export interface UseDeploymentTemplateComputedDataReturnType {
    editedDocument: string
    uneditedDocument: string
    isResolvingVariables: boolean
    uneditedDocumentWithoutLockedKeys?: string
}

export interface GetDeploymentTemplateEditorKeyProps {
    resolveScopedVariables: boolean
    hideLockedKeys: boolean
    isResolvingVariables: boolean
}

interface DeploymentTemplateChartConfigType {
    id: number
    // TODO: May not need this
    refChartTemplate: string
    // TODO: May not need this
    refChartTemplateVersion: string
    chartRefId: number
    readme: string
}

export interface SelectedChartDetailsType {
    selectedChartRefId: number
    selectedChart: DeploymentChartVersionType
}

export interface DeploymentTemplateConfigState extends SelectedChartDetailsType {
    originalTemplate: Record<string, string>
    chartConfig: DeploymentTemplateChartConfigType
    isAppMetricsEnabled: boolean
    // TODO: Maybe can remove this
    readme: string
    schema: Record<string, string>
    // FIXME: need this in case of protected draft as well since they can be different
    guiSchema: string
    /**
     * API response from getDraftByResourceName
     * FIXME: Can we move it as separate type
     */
    latestDraft?: any
    /**
     * Stringified JSON of the deployment template
     */
    editorTemplate: string
    /**
     * Stringified JSON of the deployment template with locked keys removed
     */
    editorTemplateWithoutLockedKeys: string
}

export interface NewDeploymentTemplateContextType
    extends Pick<DeploymentTemplateQueryParamsType, 'editMode' | 'selectedTab' | 'showReadMe'> {
    editorTemplate: string
    publishedTemplateData: DeploymentTemplateConfigState
    isLoadingInitialData: boolean
}

type DTApplicationMetricsReadOnlyProps = {
    isLoading?: never
    selectedChart?: never
    isDisabled?: never
    toggleAppMetrics?: never
    selectedTab?: never
    showReadMe?: never
    /**
     * @default - false
     * If true, would only text depicting the information whether the application metrics is enabled or not
     */
    onlyShowCurrentStatus: true
}

type DTApplicationMetricsActionProps = {
    isLoading: boolean
    selectedChart: DeploymentChartVersionType
    isDisabled: boolean
    toggleAppMetrics: () => void
    onlyShowCurrentStatus?: false
} & Pick<DeploymentTemplateQueryParamsType, 'selectedTab' | 'showReadMe'>

export type DTApplicationMetricsFormFieldProps = {
    isAppMetricsEnabled: boolean
    showApplicationMetrics: boolean
} & (DTApplicationMetricsActionProps | DTApplicationMetricsReadOnlyProps)
