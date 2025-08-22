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

import { DynamicDataTableCellValidationState, KeyValueTableData } from '@Shared/Components'

export interface MaterialType {
    name: string
    type: string
    value: string
    gitMaterialId: number
    id: number
    isSelected: boolean
    gitHostId: number
    gitProviderId: number
    regex?: string
    isRegex: boolean
    url: string
}

export interface Githost {
    id: number
    name: string
    active: boolean
    webhookSecret: string
    webhookUrl: string
}

export interface WebhookEvent {
    id: number
    gitHostId: number
    name: string
    isActive: boolean
    selectors: WebhookEventSelectors[]
}

interface WebhookEventSelectors {
    id: number
    eventId: number
    name: string
    selector: string
    toShowInCiFilter: boolean
    fixValue: string
    toShow: boolean
    possibleValues: string
    isActive: boolean
}

export interface CiPipelineSourceTypeOption {
    label: string
    value: string
    isDisabled: boolean
    isSelected: boolean
    isWebhook: boolean
}

export enum RefVariableType {
    GLOBAL = 'GLOBAL',
    FROM_PREVIOUS_STEP = 'FROM_PREVIOUS_STEP',
    NEW = 'NEW',
}

export enum PluginType {
    INLINE = 'INLINE',
    PLUGIN_REF = 'REF_PLUGIN',
}

export enum ScriptType {
    SHELL = 'SHELL',
    DOCKERFILE = 'DOCKERFILE',
    CONTAINERIMAGE = 'CONTAINER_IMAGE',
}

export enum MountPath {
    TRUE = 'Yes',
    FALSE = 'No',
}

export enum ConditionType {
    SKIP = 'SKIP',
    TRIGGER = 'TRIGGER',
    PASS = 'PASS',
    FAIL = 'FAIL',
}

export enum RefVariableStageType {
    PRE_CI = 'PRE_CI',
    POST_CI = 'POST_CI',
}

export enum FilePropertyTypeSizeUnit {
    KB = 'KB',
    MB = 'MB',
}

export interface FilePropertyType {
    allowedExtensions: string[]
    maxUploadSize: number
    sizeUnit: FilePropertyTypeSizeUnit
}

export interface ConstraintType {
    fileProperty: FilePropertyType
}

export interface ValueConstraintType {
    choices?: string[]
    blockCustomValue?: boolean
    constraint?: ConstraintType
}

export enum VariableTypeFormat {
    STRING = 'STRING',
    NUMBER = 'NUMBER',
    BOOL = 'BOOL',
    DATE = 'DATE',
    FILE = 'FILE',
}

export interface VariableType {
    id: number
    name: string
    value: string
    format: VariableTypeFormat
    description: string
    defaultValue: string
    allowEmptyValue: boolean
    variableType: RefVariableType
    refVariableStepIndex: number
    refVariableName: string
    refVariableStage?: RefVariableStageType
    variableStepIndexInPlugin?: number
    fileMountDir: string
    fileReferenceId?: number
    valueConstraintId?: number
    valueConstraint?: ValueConstraintType
    isRuntimeArg: boolean
    refVariableUsed: boolean
}

interface CommandArgsMap {
    command: string
    args: string[]
}

export interface PortMapType {
    portOnLocal: number
    portOnContainer: number
}
export interface ConditionDetails {
    id: number
    conditionOnVariable: string
    conditionOperator: string
    conditionType: ConditionType
    conditionalValue: string
}

export interface InlineStepDetailType {
    scriptType: ScriptType
    isMountCustomScript?: boolean
    script?: string
    dockerFileExists?: boolean
    mountPath?: string
    mountCodeToContainer?: boolean
    mountDirectoryFromHost?: boolean
    containerImagePath?: string
    imagePullSecret?: string
    commandArgsMap?: CommandArgsMap[]
    portMap?: PortMapType[]
    mountPathMap?: {
        filePathOnDisk: string
        filePathOnContainer: string
    }[]
    inputVariables?: VariableType[]
    outputVariables?: VariableType[]
    conditionDetails: ConditionDetails[]
    storeScriptAt?: string
    mountCodeToContainerPath?: string
}

interface PluginRefStepDetailType {
    id: number
    pluginId: number
    inputVariables?: VariableType[]
    outputVariables?: VariableType[]
    conditionDetails?: ConditionDetails[]
}

export interface StepType {
    id: number
    index: number
    name: string
    description: string
    stepType: PluginType
    outputDirectoryPath: string[]
    inlineStepDetail?: InlineStepDetailType
    pluginRefStepDetail?: PluginRefStepDetailType
    triggerIfParentStageFail: boolean
}

export interface BuildStageType {
    id: number
    steps: StepType[]
}

export enum CIBuildType {
    SELF_DOCKERFILE_BUILD_TYPE = 'self-dockerfile-build',
    MANAGED_DOCKERFILE_BUILD_TYPE = 'managed-dockerfile-build',
    BUILDPACK_BUILD_TYPE = 'buildpack-build',
}

export interface BuildPackConfigType {
    builderId: string
    language: string
    languageVersion: string
    projectPath: string
    builderLangEnvParam?: string
    currentBuilderLangEnvParam?: string
    buildPacks?: any
    args?: Record<string, string>
}

export interface DockerBuildConfigType {
    dockerfileContent: string
    dockerfileRelativePath: string
    buildContext: string
    dockerfilePath?: string
    dockerfileRepository?: string
    args?: Record<string, string>
    targetPlatform?: any
    language?: string
    languageFramework?: string
}

export interface CIBuildConfigType {
    buildPackConfig: BuildPackConfigType
    ciBuildType: CIBuildType
    dockerBuildConfig: DockerBuildConfigType
    gitMaterialId: number
    buildContextGitMaterialId: number
    id?: number
    useRootBuildContext: boolean
}

export interface DockerConfigOverrideType {
    dockerRegistry: string
    dockerRepository: string
    ciBuildConfig: CIBuildConfigType
}

export enum WORKFLOW_CACHE_CONFIG_ENUM {
    INHERIT = 'INHERIT',
    OVERRIDE = 'OVERRIDE',
}

export interface FormType {
    name: string
    args: KeyValueTableData[]
    materials: MaterialType[]
    gitHost: Githost
    webhookEvents: WebhookEvent[]
    ciPipelineSourceTypeOptions: CiPipelineSourceTypeOption[]
    webhookConditionList: { selectorId: number; value: string }[]
    triggerType: string
    scanEnabled?: boolean
    beforeDockerBuildScripts?: {
        id: number
        name: string
        outputLocation: string
        script: string
        isCollapsed: boolean
        index: number
    }[]
    afterDockerBuildScripts?: {
        id: number
        name: string
        outputLocation: string
        script: string
        isCollapsed: boolean
        index: number
    }[]
    ciPipelineEditable: true
    preBuildStage?: BuildStageType
    postBuildStage?: BuildStageType
    isDockerConfigOverridden?: boolean
    dockerConfigOverride?: DockerConfigOverrideType
    isOffendingMandatoryPlugin?: boolean
    workflowCacheConfig?: {
        type: WORKFLOW_CACHE_CONFIG_ENUM
        value: boolean
        globalValue: boolean
    }
}

export interface ErrorObj {
    isValid: boolean
    message: string | null
}

export enum InputOutputVariablesHeaderKeys {
    VARIABLE = 'variable',
    FORMAT = 'format',
    VALUE = 'val',
}

export enum ConditionDataTableHeaderKeys {
    VARIABLE = 'variable',
    OPERATOR = 'operator',
    VALUE = 'val',
}

type InputOutputVariablesErrorObj = Record<InputOutputVariablesHeaderKeys, DynamicDataTableCellValidationState>
type ConditionDetailsErrorObj = Record<ConditionDataTableHeaderKeys, DynamicDataTableCellValidationState>

interface StepDetailTaskErrorObj {
    inputVariables?: Record<number, InputOutputVariablesErrorObj>
    outputVariables?: Record<number, InputOutputVariablesErrorObj>
    isInputVariablesValid?: boolean
    isOutputVariablesValid?: boolean
    conditionDetails?: Record<number, ConditionDetailsErrorObj>
    isConditionDetailsValid?: boolean
}

export interface TaskErrorObj {
    isValid: boolean
    name: ErrorObj
    inlineStepDetail?: StepDetailTaskErrorObj
    pluginRefStepDetail?: StepDetailTaskErrorObj
}
export interface FormErrorObjectType {
    name: ErrorObj
    materials?: MaterialType[]
    preBuildStage?: {
        isValid: boolean
        steps: TaskErrorObj[]
    }
    buildStage?: {
        isValid: boolean
        name: ErrorObj
    }
    postBuildStage?: {
        isValid: boolean
        steps: TaskErrorObj[]
    }
}
