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

import { FormEvent, FunctionComponent, ReactNode } from 'react'
import { BUILD_INFRA_INHERIT_ACTIONS, useBuildInfraForm } from '@Pages/index'
import { Breadcrumb } from '../../../Common/BreadCrumb/Types'
import {
    CMSecretComponentType,
    CMSecretConfigData,
    CMSecretPayloadType,
    ConfigMapSecretUseFormProps,
    getUniqueId,
    useForm,
    UseFormErrors,
    ValidationResponseType,
} from '../../../Shared'
import { ServerErrors } from '../../../Common'

/**
 * Unique actions that will be dispatched and,
 * Keeping values (cpu_limit, etc) in sync with backend
 */
export enum BuildInfraConfigTypes {
    CPU_LIMIT = 'cpu_limit',
    CPU_REQUEST = 'cpu_request',
    MEMORY_LIMIT = 'memory_limit',
    MEMORY_REQUEST = 'memory_request',
    BUILD_TIMEOUT = 'timeout',
    NODE_SELECTOR = 'node_selector',
    TOLERANCE = 'tolerations',
    CONFIG_MAP = 'cm',
}

/**
 * Combination of BuildInfraConfigTypes and BuildInfraMetaConfigTypes is going to derive error state and actions(actions will also be derived with BuildInfraInheritActions)
 */
export enum BuildInfraMetaConfigTypes {
    NAME = 'name',
    DESCRIPTION = 'description',
}

/**
 * Would be used as key for few components and would be appending activate and de_activate actions to it
 */
export enum BuildInfraLocators {
    CPU = 'cpu',
    MEMORY = 'memory',
    // This name can be also different from BuildInfraConfigTypes[BUILD_TIMEOUT] in case we want to show different label
    BUILD_TIMEOUT = 'timeout',
    NODE_SELECTOR = 'node selector',
    TOLERANCE = 'tolerance',
    CONFIG_MAP = 'cm',
}

export type BuildInfraInheritActions = keyof typeof BUILD_INFRA_INHERIT_ACTIONS

export enum BuildInfraProfileVariants {
    GLOBAL = 'GLOBAL',
    NORMAL = 'NORMAL',
    CUSTOM = 'CUSTOM',
}

export interface BuildInfraDescriptorProps {
    /**
     * In case we want to restrict the max-width
     */
    additionalContainerClasses?: string
    breadCrumbs: Breadcrumb[]
    /**
     * Would stick at right of div
     */
    children?: ReactNode
    tippyInfoText?: string
    tippyAdditionalContent?: ReactNode
    tooltipNode?: ReactNode
}

export type NumericBuildInfraConfigTypes = Extract<
    BuildInfraConfigTypes,
    | BuildInfraConfigTypes.BUILD_TIMEOUT
    | BuildInfraConfigTypes.CPU_LIMIT
    | BuildInfraConfigTypes.CPU_REQUEST
    | BuildInfraConfigTypes.MEMORY_LIMIT
    | BuildInfraConfigTypes.MEMORY_REQUEST
>

export interface BuildInfraActionType {
    /**
     * Type of action to be dispatched, would be suffixed with type of change
     */
    actionType: NumericBuildInfraConfigTypes
    /**
     * Label to be shown above input
     */
    label?: string
    /**
     * Placeholder for input, can be optional
     */
    placeholder?: string
    // Can add a prop for variant, if there is a need to show different types of inputs
}

export interface BuildInfraConfigurationMarkerProps {
    className?: string
}

export interface BuildInfraFormFieldType {
    /**
     * Heading of the form item
     */
    heading: ReactNode
    /**
     * Icon/Checkbox to be shown in front of heading
     */
    marker: FunctionComponent<BuildInfraConfigurationMarkerProps>
    /**
     * Actions to be shown in the form item
     */
    actions: BuildInfraActionType[]
    /**
     * Unique identifier for the form item used for key
     */
    locator: BuildInfraLocators
}

export interface ConfigurationUnitType {
    name: string
    conversionFactor: number
}

// key would be the name of ConfigurationUnitType
export type ConfigurationUnitMapType = {
    [key: ConfigurationUnitType['name']]: ConfigurationUnitType
}

export type BuildInfraUnitsMapType = Record<NumericBuildInfraConfigTypes, ConfigurationUnitMapType>

export interface BuildInfraNodeSelectorValueType {
    key: string
    value: string
    /**
     * Generated at UI, if consuming in service please ensure to add this in response
     */
    id: string
}

export enum BuildInfraToleranceOperatorType {
    EXISTS = 'Exists',
    EQUALS = 'Equal',
}

export enum BuildInfraToleranceEffectType {
    NO_EXECUTE = 'NoExecute',
    NO_SCHEDULE = 'NoSchedule',
    PREFER_NO_SCHEDULE = 'PreferNoSchedule',
}

export type BuildInfraToleranceValueType = {
    key: string
    effect: BuildInfraToleranceEffectType
    /**
     * Generated at UI
     */
    id: string
} & (
    | {
          operator: BuildInfraToleranceOperatorType.EQUALS
          value: string
      }
    | {
          operator: BuildInfraToleranceOperatorType.EXISTS
          value?: never
      }
)

interface NumericBuildInfraConfigValueDTO {
    key: NumericBuildInfraConfigTypes
    value: number
    unit: ConfigurationUnitType['name']
}

interface NodeSelectorConfigDTO {
    key: BuildInfraConfigTypes.NODE_SELECTOR
    value: BuildInfraNodeSelectorValueType[]
    unit?: never
}

interface ToleranceConfigDTO {
    key: BuildInfraConfigTypes.TOLERANCE
    value: BuildInfraToleranceValueType[]
    unit?: never
}

interface BuildInfraCMCSConfigDTO {
    key: BuildInfraConfigTypes.CONFIG_MAP
    value: CMSecretConfigData[]
    unit?: never
}

export type BuildInfraCMCSValueType = ConfigMapSecretUseFormProps & {
    id: ReturnType<typeof getUniqueId>
    isOverridden: boolean
    canOverride: boolean
    defaultValue: ConfigMapSecretUseFormProps | null
    initialResponse: CMSecretConfigData
}

export interface BuildInfraCMCSConfigType {
    key: BuildInfraConfigTypes.CONFIG_MAP
    value: BuildInfraCMCSValueType[]
    unit?: never
}

interface BuildInfraCMCSPayloadConfigType {
    key: BuildInfraConfigTypes.CONFIG_MAP
    value: CMSecretPayloadType[]
    unit?: never
}

export type BuildInfraConfigDTO =
    | NumericBuildInfraConfigValueDTO
    | NodeSelectorConfigDTO
    | ToleranceConfigDTO
    | BuildInfraCMCSConfigDTO

export type BuildInfraConfigValuesType =
    | NumericBuildInfraConfigValueDTO
    | NodeSelectorConfigDTO
    | ToleranceConfigDTO
    | BuildInfraCMCSConfigType

export type BuildInfraConfigPayloadType =
    | NumericBuildInfraConfigValueDTO
    | NodeSelectorConfigDTO
    | ToleranceConfigDTO
    | BuildInfraCMCSPayloadConfigType

export interface BuildInfraProfileConfigBase {
    id?: number
    /**
     * This key holds value when we are inheriting values from other profiles in case of listing
     */
    profileName?: string
    active: boolean
    targetPlatform: string
}

interface BuildInfraProfileBaseDTO {
    id?: number
    name?: string
    description: string
    type: BuildInfraProfileVariants
    appCount?: number
    active?: boolean
}

export type BuildInfraConfigInfoType = BuildInfraConfigValuesType & BuildInfraProfileConfigBase
export type BuildInfraConfigurationDTO = BuildInfraConfigDTO & Omit<BuildInfraProfileConfigBase, 'targetPlatform'>
export type BuildInfraConfigurationItemPayloadType = Omit<BuildInfraProfileConfigBase, 'targetPlatform'> &
    BuildInfraConfigPayloadType

export interface BuildInfraPayloadType extends BuildInfraProfileBaseDTO {
    configurations: Record<string, BuildInfraConfigurationItemPayloadType[]>
}

/**
 * Maps target platform to its configuration values
 */
export type BuildInfraPlatformConfigurationMapDTO = Record<string, BuildInfraConfigurationDTO[]>

export type BuildInfraConfigurationType = BuildInfraConfigInfoType & {
    /**
     * Used to display values in case of inheriting data
     * This will be null in case of CM/CS
     */
    defaultValue: BuildInfraConfigValuesType
}

export type BuildInfraConfigurationMapTypeWithoutDefaultFallback = {
    [key in BuildInfraConfigTypes]?: BuildInfraConfigInfoType
}

export type BuildInfraConfigurationMapType = Record<BuildInfraConfigTypes, BuildInfraConfigurationType>

export interface BuildInfraProfileBase extends BuildInfraProfileBaseDTO {}

export interface BuildInfraProfileInfoDTO extends BuildInfraProfileBaseDTO {
    configurations: BuildInfraPlatformConfigurationMapDTO
}

export interface BuildInfraProfileData extends BuildInfraProfileBase {
    /**
     * Maps platformName to its configuration values
     */
    configurations: Record<string, BuildInfraConfigurationMapType>
}

export interface GetBuildInfraProfileType {
    name: string
    fromCreateView?: boolean
}

export interface BuildInfraProfileResponseType {
    configurationUnits: BuildInfraUnitsMapType | null
    profile: BuildInfraProfileData | null
    /**
     * To be used in case user is creating configuration for new platform
     */
    fallbackPlatformConfigurationMap: BuildInfraProfileData['configurations']
}

export interface UseBuildInfraFormProps {
    /**
     * Name of the profile, if not provided assumption would be for create view
     */
    name?: string
    /**
     * If true, would send put request else would create profile via post
     */
    editProfile?: boolean
    /**
     * If true, call this on form submission success
     */
    handleSuccessRedirection?: () => void
}

export enum BuildInfraProfileAdditionalErrorKeysType {
    TARGET_PLATFORM = 'target_platform',
}

export enum NodeSelectorHeaderType {
    KEY = 'KEY',
    VALUE = 'VALUE',
}

export enum ToleranceHeaderType {
    KEY = 'KEY',
    OPERATOR = 'OPERATOR',
    VALUE = 'VALUE',
    EFFECT = 'EFFECT',
}

/**
 * Would be maintaining error state for name and description irrespective of platform
 * For error states related to platform, we would not be letting user to switch platform if there are errors
 */
export type ProfileInputErrorType = Record<
    NumericBuildInfraConfigTypes | BuildInfraMetaConfigTypes | BuildInfraProfileAdditionalErrorKeysType.TARGET_PLATFORM,
    string
> &
    Record<
        BuildInfraConfigTypes.NODE_SELECTOR,
        Record<BuildInfraNodeSelectorValueType['id'], Partial<Record<NodeSelectorHeaderType, string[]>>>
    > &
    Record<
        BuildInfraConfigTypes.TOLERANCE,
        Record<BuildInfraNodeSelectorValueType['id'], Partial<Record<ToleranceHeaderType, string[]>>>
    > &
    Record<
        BuildInfraConfigTypes.CONFIG_MAP,
        Record<BuildInfraCMCSValueType['id'], UseFormErrors<BuildInfraCMCSValueType>>
    >

export type TargetPlatformErrorFields = BuildInfraConfigTypes | BuildInfraProfileAdditionalErrorKeysType

export interface ProfileInputDispatchDataType {
    targetPlatform: string
}

interface NumericBuildInfraConfigPayloadType {
    value: number
    unit: string
}

export enum BuildInfraProfileInputActionType {
    ADD_TARGET_PLATFORM = 'add_target_platform',
    REMOVE_TARGET_PLATFORM = 'remove_target_platform',
    RENAME_TARGET_PLATFORM = 'rename_target_platform',
    RESTORE_PROFILE_CONFIG_SNAPSHOT = 'restore_profile_config_snapshot',

    DELETE_NODE_SELECTOR_ITEM = 'delete_node_selector_item',
    ADD_NODE_SELECTOR_ITEM = 'add_node_selector_item',
    EDIT_NODE_SELECTOR_ITEM = 'edit_node_selector_item',

    DELETE_TOLERANCE_ITEM = 'delete_tolerance_item',
    ADD_TOLERANCE_ITEM = 'add_tolerance_item',
    EDIT_TOLERANCE_ITEM = 'edit_tolerance_item',
}

export type HandleProfileInputChangeType =
    | {
          action: NumericBuildInfraConfigTypes
          data: ProfileInputDispatchDataType & NumericBuildInfraConfigPayloadType
      }
    | {
          action: BuildInfraMetaConfigTypes
          data: {
              value: string
          }
      }
    | {
          action:
              | BuildInfraInheritActions
              | BuildInfraProfileInputActionType.ADD_TARGET_PLATFORM
              | BuildInfraProfileInputActionType.REMOVE_TARGET_PLATFORM
          data: ProfileInputDispatchDataType
      }
    | {
          action: BuildInfraProfileInputActionType.RENAME_TARGET_PLATFORM
          data: {
              originalPlatformName: string
              newPlatformName: string
              configSnapshot: BuildInfraProfileData['configurations']
          }
      }
    | {
          action: BuildInfraProfileInputActionType.RESTORE_PROFILE_CONFIG_SNAPSHOT
          data: {
              configSnapshot: BuildInfraProfileData['configurations']
          }
      }
    | {
          action: BuildInfraProfileInputActionType.DELETE_NODE_SELECTOR_ITEM
          data: ProfileInputDispatchDataType & Pick<BuildInfraNodeSelectorValueType, 'id'>
      }
    | {
          action: BuildInfraProfileInputActionType.ADD_NODE_SELECTOR_ITEM
          data: ProfileInputDispatchDataType
      }
    | {
          action: BuildInfraProfileInputActionType.EDIT_NODE_SELECTOR_ITEM
          data: ProfileInputDispatchDataType & Pick<BuildInfraNodeSelectorValueType, 'id' | 'key' | 'value'>
      }
    | {
          action: BuildInfraProfileInputActionType.DELETE_TOLERANCE_ITEM
          data: ProfileInputDispatchDataType & Pick<BuildInfraToleranceValueType, 'id'>
      }
    | {
          action: BuildInfraProfileInputActionType.ADD_TOLERANCE_ITEM
          data: ProfileInputDispatchDataType
      }
    | {
          action: BuildInfraProfileInputActionType.EDIT_TOLERANCE_ITEM
          data: ProfileInputDispatchDataType &
              Pick<BuildInfraToleranceValueType, 'id' | 'key' | 'value' | 'effect' | 'operator'>
      }

export interface UseBuildInfraFormResponseType {
    isLoading: boolean
    profileResponse: BuildInfraProfileResponseType | null
    responseError: ServerErrors | null
    reloadRequest: () => void
    profileInput: BuildInfraProfileData
    profileInputErrors: ProfileInputErrorType
    handleProfileInputChange: ({ action, data }: HandleProfileInputChangeType) => void
    loadingActionRequest: boolean
    handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>
}

export interface BuildInfraConfigFormProps
    extends Pick<UseBuildInfraFormResponseType, 'profileInput' | 'profileInputErrors' | 'handleProfileInputChange'> {
    isGlobalProfile?: boolean
    unitsMap?: BuildInfraProfileResponseType['configurationUnits']
    configurationContainerLabel?: ReactNode
}

export interface BuildInfraFormItemProps
    extends Pick<BuildInfraFormFieldType, 'marker' | 'heading'>,
        Partial<Pick<BuildInfraProfileConfigBase, 'targetPlatform'>>,
        Pick<BuildInfraConfigFormProps, 'isGlobalProfile'> {
    children?: ReactNode
    /**
     * If true, means profile is inheriting values from other profile (e.g, default)
     */
    isInheriting?: boolean
    /**
     * Would be false for last item
     */
    showDivider?: boolean

    /**
     * Would be used to dispatch inherit actions (activate_cpu, de_activate_cpu, etc)
     */
    handleProfileInputChange: UseBuildInfraFormResponseType['handleProfileInputChange']
    locator: BuildInfraFormFieldType['locator']
}

export interface ValidateRequestLimitType {
    request: NumericBuildInfraConfigPayloadType
    limit: NumericBuildInfraConfigPayloadType
    unitsMap: ConfigurationUnitMapType
}

export interface ValidateRequestLimitResponseType {
    request: ValidationResponseType
    limit: ValidationResponseType
}

export interface BuildInfraFormActionProps
    extends BuildInfraActionType,
        Pick<BuildInfraFormItemProps, 'targetPlatform'> {
    handleProfileInputChange: UseBuildInfraFormResponseType['handleProfileInputChange']
    currentValue: number
    error?: string
    isRequired?: boolean
    profileUnitsMap?: ConfigurationUnitMapType
    currentUnitName?: BuildInfraConfigValuesType['unit']
    /**
     * @default false
     */
    isDisabled?: boolean
    /**
     * @default false
     */
    autoFocus?: boolean
}

export interface FooterProps {
    /**
     * If true, means form contains errors
     */
    disabled?: boolean
    handleCancel?: () => void
    /**
     * If true would show save changes else would show save for submit button
     */
    editProfile?: boolean
    loading?: boolean
}

export interface UpdateBuildInfraProfileType extends Pick<UseBuildInfraFormResponseType, 'profileInput'> {
    name: string
}

export interface CreateBuildInfraProfileType extends Pick<UseBuildInfraFormResponseType, 'profileInput'> {}

export interface BuildInfraInputFieldComponentProps {
    handleProfileInputChange: UseBuildInfraFormResponseType['handleProfileInputChange']
    currentValue: BuildInfraConfigValuesType['value']
    error?: string
}

export interface BuildInfraProfileMetaFieldProps
    extends Pick<BuildInfraInputFieldComponentProps, 'error' | 'handleProfileInputChange'> {
    currentValue: string
}

export interface InheritingHeaderProps extends Pick<BuildInfraConfigFormProps, 'isGlobalProfile'> {
    defaultHeading: BuildInfraFormFieldType['heading']
    inheritingData: BuildInfraConfigValuesType[]
    isInheriting: boolean
}

export interface BuildInfraConfigResponseDataType {
    name: BuildInfraConfigTypes
    units: ConfigurationUnitType[]
}

interface BaseBuildInfraProfileDTO {
    defaultConfigurations: BuildInfraPlatformConfigurationMapDTO
    configurationUnits: BuildInfraUnitsMapType
}

export interface BuildInfraProfileDTO extends BaseBuildInfraProfileDTO {
    profile: BuildInfraProfileInfoDTO
}

export interface BuildInfraProfileTransformerParamsType
    extends BuildInfraProfileDTO,
        Pick<GetBuildInfraProfileType, 'fromCreateView'> {}

export interface GetPlatformConfigurationsWithDefaultValuesParamsType {
    profileConfigurationsMap: BuildInfraConfigurationMapTypeWithoutDefaultFallback
    defaultConfigurationsMap: BuildInfraConfigurationMapTypeWithoutDefaultFallback
    platformName: string
    /**
     * @default false
     */
    isDefaultProfile?: boolean
}

export enum BuildInfraAPIVersionType {
    ALPHA1 = 'alpha1',
}

export type RequestLimitConfigType = Extract<
    BuildInfraConfigTypes,
    | BuildInfraConfigTypes.CPU_LIMIT
    | BuildInfraConfigTypes.CPU_REQUEST
    | BuildInfraConfigTypes.MEMORY_LIMIT
    | BuildInfraConfigTypes.MEMORY_REQUEST
>

export interface ValidateNodeSelectorParamsType
    extends Pick<ReturnType<typeof useBuildInfraForm>, 'profileInputErrors'> {
    selector: BuildInfraNodeSelectorValueType
    existingKeys: string[]
}

export interface BuildInfraCMCSFormProps {
    parsedData: BuildInfraCMCSValueType
    useFormProps: ReturnType<typeof useForm<ConfigMapSecretUseFormProps>>
    componentType: CMSecretComponentType
}

export interface BuildInfraUtilityContextType {
    BuildInfraCMCSForm: FunctionComponent<BuildInfraCMCSFormProps>
}
