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

import { FormEvent, FunctionComponent, ReactNode, SyntheticEvent } from 'react'
import { BUILD_INFRA_INHERIT_ACTIONS, useBuildInfraForm } from '@Pages/index'
import { Breadcrumb } from '../../../Common/BreadCrumb/Types'
import {
    CMSecretComponentType,
    CMSecretConfigData,
    CMSecretPayloadType,
    ConfigMapSecretUseFormProps,
    getUniqueId,
    useForm,
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
    SECRET = 'cs',
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
    SECRET = 'cs',
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
    tooltipHeading?: string
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

export type InfraConfigWithSubValues = Extract<
    BuildInfraConfigTypes,
    BuildInfraConfigTypes.CONFIG_MAP | BuildInfraConfigTypes.SECRET
>

type BuildInfraConfigTypeFormat<Key, Value, Unit> = {
    key: Key
    value: Value
} & ([Unit] extends [never]
    ? {
          unit?: Unit
      }
    : {
          unit: Unit
      })

type NumericBuildInfraConfigValueDTO = BuildInfraConfigTypeFormat<
    NumericBuildInfraConfigTypes,
    number,
    ConfigurationUnitType['name']
>

type NodeSelectorConfigDTO = BuildInfraConfigTypeFormat<
    BuildInfraConfigTypes.NODE_SELECTOR,
    BuildInfraNodeSelectorValueType[],
    never
>

type ToleranceConfigDTO = BuildInfraConfigTypeFormat<
    BuildInfraConfigTypes.TOLERANCE,
    BuildInfraToleranceValueType[],
    never
>

type BuildInfraCMCSConfigDTO = BuildInfraConfigTypeFormat<InfraConfigWithSubValues, CMSecretConfigData[], never>

export type BuildInfraCMCSValueType = {
    useFormProps: ConfigMapSecretUseFormProps
    id: ReturnType<typeof getUniqueId>
    isOverridden: boolean
    canOverride: boolean
    defaultValue: ConfigMapSecretUseFormProps | null
    defaultValueInitialResponse: CMSecretConfigData
    initialResponse: CMSecretConfigData
}

export interface BuildInfraCMCSConfigType extends Pick<BuildInfraCMCSConfigDTO, 'key' | 'unit'> {
    value: BuildInfraCMCSValueType[]
}

interface BuildInfraCMCSPayloadConfigType extends Pick<BuildInfraCMCSConfigDTO, 'key' | 'unit'> {
    value: CMSecretPayloadType[]
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

export type BuildInfraConfigInfoType = BuildInfraConfigValuesType & BuildInfraProfileConfigBase
export type BuildInfraConfigurationDTO = BuildInfraConfigDTO & Omit<BuildInfraProfileConfigBase, 'targetPlatform'>
export type BuildInfraConfigurationItemPayloadType = Omit<BuildInfraProfileConfigBase, 'targetPlatform'> &
    BuildInfraConfigPayloadType

export enum BuildXDriverType {
    KUBERNETES = 'kubernetes',
    DOCKER_CONTAINER = 'docker-container',
}

interface BuildInfraProfileBaseDTO {
    id?: number
    name?: string
    description: string
    type: BuildInfraProfileVariants
    appCount?: number
    active?: boolean
    /**
     * @default `BuildXDriverType.KUBERNETES`
     */
    buildxDriverType?: BuildXDriverType
}

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

export interface BuildInfraProfileBase extends Omit<BuildInfraProfileBaseDTO, 'buildxDriverType'> {
    useK8sDriver?: boolean
}

export interface BuildInfraProfileInfoDTO extends BuildInfraProfileBaseDTO {
    configurations: BuildInfraPlatformConfigurationMapDTO
}

export interface BuildInfraProfileData extends BuildInfraProfileBase {
    /**
     * Maps platformName to its configuration values
     */
    configurations: Record<string, BuildInfraConfigurationMapType>
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
    /**
     * @default false
     */
    canConfigureUseK8sDriver?: boolean
}

export interface GetBuildInfraProfileType extends Pick<UseBuildInfraFormProps, 'canConfigureUseK8sDriver'> {
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

export type BuildInfraCMCSErrorType = Record<InfraConfigWithSubValues, Record<BuildInfraCMCSValueType['id'], boolean>>

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
    BuildInfraCMCSErrorType

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

    ADD_CM_CS_ITEM = 'add_cm_cs_item',
    SYNC_CM_CS_ITEM = 'sync_cm_cs_item',
    DELETE_CM_CS_ITEM = 'delete_cm_cs_item',
}

export type BuildInfraInheritActionsOnSubValues = Extract<
    BuildInfraInheritActions,
    | `activate_${BuildInfraLocators.CONFIG_MAP}`
    | `de_activate_${BuildInfraLocators.CONFIG_MAP}`
    | `activate_${BuildInfraLocators.SECRET}`
    | `de_activate_${BuildInfraLocators.SECRET}`
>

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
          action: BuildInfraProfileInputActionType.ADD_TARGET_PLATFORM
          data: ProfileInputDispatchDataType & {
              handleCaptureSnapshot: (data: BuildInfraProfileData) => void
          }
      }
    | {
          action:
              | Exclude<BuildInfraInheritActions, BuildInfraInheritActionsOnSubValues>
              | BuildInfraProfileInputActionType.REMOVE_TARGET_PLATFORM
          data: ProfileInputDispatchDataType
      }
    | {
          action: BuildInfraInheritActionsOnSubValues
          data: ProfileInputDispatchDataType & {
              componentType: CMSecretComponentType
              id: string
          }
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
    | {
          action: BuildInfraProfileInputActionType.ADD_CM_CS_ITEM
          data: ProfileInputDispatchDataType &
              Pick<BuildInfraCMCSValueType, 'id'> & {
                  infraConfigType: InfraConfigWithSubValues
              }
      }
    | {
          action: BuildInfraProfileInputActionType.SYNC_CM_CS_ITEM
          data: ProfileInputDispatchDataType & {
              id: BuildInfraCMCSValueType['id']
              value: ConfigMapSecretUseFormProps
              hasError: boolean
              componentType: CMSecretComponentType
          }
      }
    | {
          action: BuildInfraProfileInputActionType.DELETE_CM_CS_ITEM
          data: ProfileInputDispatchDataType &
              Pick<BuildInfraCMCSValueType, 'id'> & {
                  componentType: CMSecretComponentType
              }
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
    handleSubmit: (e?: FormEvent<HTMLFormElement>) => Promise<void>
}

export interface BuildInfraConfigFormProps
    extends Pick<UseBuildInfraFormResponseType, 'profileInput' | 'profileInputErrors' | 'handleProfileInputChange'> {
    isGlobalProfile?: boolean
    unitsMap?: BuildInfraProfileResponseType['configurationUnits']
    configurationContainerLabel?: ReactNode
}

export interface BuildInfraFormItemProps extends Pick<BuildInfraFormFieldType, 'marker' | 'heading'> {
    children?: ReactNode
    /**
     * If true, means profile is inheriting values from other profile (e.g, default)
     */
    isInheriting?: boolean
    /**
     * Would be false for last item
     */
    showDivider?: boolean
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

export interface BuildInfraFormActionProps extends BuildInfraActionType {
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
    targetPlatform?: string
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

export interface UpsertBuildInfraProfileServiceParamsType
    extends Pick<UseBuildInfraFormResponseType, 'profileInput'>,
        Pick<UseBuildInfraFormProps, 'canConfigureUseK8sDriver'> {
    /**
     * If not given would consider as create view
     */
    name?: string
}

export interface CreateBuildInfraProfileType extends Pick<UseBuildInfraFormResponseType, 'profileInput'> {}

export interface BuildInfraInputFieldComponentProps {
    handleProfileInputChange: UseBuildInfraFormResponseType['handleProfileInputChange']
    currentValue: BuildInfraConfigValuesType['value']
    error?: string
}

export type BuildInfraProfileMetaFieldProps = Pick<BuildInfraInputFieldComponentProps, 'error'> & {
    currentValue: string
} & (
        | {
              handleProfileInputChange: BuildInfraInputFieldComponentProps['handleProfileInputChange']
              onChange?: never
          }
        | {
              onChange: (e: SyntheticEvent) => void
              handleProfileInputChange?: never
          }
    )

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
        Pick<GetBuildInfraProfileType, 'fromCreateView'>,
        Pick<GetBuildInfraProfileType, 'canConfigureUseK8sDriver'> {}

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
export interface GetBaseProfileObjectParamsType
    extends Pick<BuildInfraProfileTransformerParamsType, 'canConfigureUseK8sDriver' | 'fromCreateView' | 'profile'> {}
