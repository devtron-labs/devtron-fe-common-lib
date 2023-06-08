import { VariableType } from "./CIPipeline.Types"

export enum ApplyPolicyToStage {
  PRE_CI = 'PRE_CI',
  POST_CI = 'POST_CI',
  PRE_OR_POST_CI = 'PRE_OR_POST_CI',
}

export enum PluginRequiredStage {
  PRE_CI = 'preBuildStage',
  POST_CI = 'postBuildStage',
  PRE_OR_POST_CI = 'PRE_OR_POST_CI',
}

export interface DefinitionSourceType {
  projectName: string
  isDueToProductionEnvironment: boolean
  isDueToLinkedPipeline: boolean
  policyName: string
  appName?: string
  clusterName?: string
  environmentName?: string
  branchNames?: string[]
  ciPipelineName?: string
}
export interface MandatoryPluginDetailType {
  id: number
  name: string
  description?: string
  requiredIn: PluginRequiredStage
  applied?: boolean
  inputVariables?: VariableType[]
  outputVariables?: VariableType[]
  definitionSources?: DefinitionSourceType[]
}
export interface MandatoryPluginDataType {
  pluginData: MandatoryPluginDetailType[]
  isValidPre: boolean
  isValidPost: boolean
}

export enum ConsequenceAction {
  BLOCK = 'BLOCK',
  ALLOW_UNTIL_TIME = 'ALLOW_UNTIL_TIME',
  ALLOW_FOREVER = 'ALLOW_FOREVER',
}

export interface ConsequenceType {
  action: ConsequenceAction
  metadataField: string
}