import { ReactNode } from 'react'
import { AppEnvironment } from '@Common/Types'
import { ConfigurationType } from '@Shared/types'

export enum DeploymentTemplateTabsType {
    EDIT = 1,
    COMPARE = 2,
    PUBLISHED = 3,
}

export interface DeploymentTemplateQueryParamsType {
    hideLockedKeys: boolean
    resolveScopedVariables: boolean
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
}

export interface DeploymentTemplateProviderProps {
    children: ReactNode
    value: DeploymentConfigContextType
}
