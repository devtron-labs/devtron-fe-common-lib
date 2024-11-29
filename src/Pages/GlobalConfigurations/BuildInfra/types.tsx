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
import { Breadcrumb } from '../../../Common/BreadCrumb/Types'
import { ValidationResponseType } from '../../../Shared'
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
    TOLERANCE = 'tolerance',
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
}

// FIXME: Derive this from BuildInfraLocators
// Appending the locators from above
export enum BuildInfraInheritActions {
    ACTIVATE_CPU = 'activate_cpu',
    DE_ACTIVATE_CPU = 'de_activate_cpu',
    ACTIVATE_MEMORY = 'activate_memory',
    DE_ACTIVATE_MEMORY = 'de_activate_memory',
    ACTIVATE_BUILD_TIMEOUT = 'activate_timeout',
    DE_ACTIVATE_BUILD_TIMEOUT = 'de_activate_timeout',
}

export const BuildInfraConfigActionMap = {
    [BuildInfraConfigTypes.BUILD_TIMEOUT]: BuildInfraLocators.BUILD_TIMEOUT,
    [BuildInfraConfigTypes.CPU_LIMIT]: BuildInfraLocators.CPU,
    [BuildInfraConfigTypes.CPU_REQUEST]: BuildInfraLocators.CPU,
    [BuildInfraConfigTypes.MEMORY_LIMIT]: BuildInfraLocators.MEMORY,
    [BuildInfraConfigTypes.MEMORY_REQUEST]: BuildInfraLocators.MEMORY,
    [BuildInfraConfigTypes.NODE_SELECTOR]: BuildInfraLocators.NODE_SELECTOR,
    [BuildInfraConfigTypes.TOLERANCE]: BuildInfraLocators.TOLERANCE,
}

export enum BuildInfraProfileVariants {
    // TODO: Can look to change name to GLOBAL as well
    DEFAULT = 'GLOBAL',
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
    label: string
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
}

export enum BuildInfraToleranceOperatorType {
    EXISTS = 'Exists',
    EQUALS = 'Equals',
}

export enum BuildInfraToleranceEffectType {
    NO_EXECUTE = 'NoExecute',
    NO_SCHEDULE = 'NoSchedule',
    PREFER_NO_SCHEDULE = 'PreferNoSchedule',
}

export type BuildInfraToleranceValueType = {
    key: string
    effect: BuildInfraToleranceEffectType
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

export type BuildInfraConfigValuesType =
    | {
          key: NumericBuildInfraConfigTypes
          value: number
          unit: ConfigurationUnitType['name']
      }
    | {
          key: BuildInfraConfigTypes.NODE_SELECTOR
          value: BuildInfraNodeSelectorValueType[]
          unit?: never
      }
    | {
          key: BuildInfraConfigTypes.TOLERANCE
          value: BuildInfraToleranceValueType[]
          unit?: never
      }

interface BuildInfraProfileConfigBase {
    id?: number
    /**
     * This key holds value when we are inheriting values from other profiles in case of listing
     */
    profileName?: string
    active: boolean
    targetPlatform: string
}

export type BuildInfraConfigInfoType = BuildInfraConfigValuesType & BuildInfraProfileConfigBase

export type BuildInfraConfigurationDTO = BuildInfraConfigValuesType &
    Omit<BuildInfraProfileConfigBase, 'targetPlatform'>

/**
 * Maps target platform to its configuration values
 */
export type BuildInfraPlatformConfigurationMapDTO = Record<string, BuildInfraConfigurationDTO[]>

export type BuildInfraConfigurationType = BuildInfraConfigInfoType & {
    /**
     * Used to display values in case of inheriting data
     */
    defaultValue: BuildInfraConfigValuesType
}

export type BuildInfraConfigurationMapTypeWithoutDefaultFallback = {
    [key in BuildInfraConfigTypes]?: BuildInfraConfigInfoType
}

export type BuildInfraConfigurationMapType = Record<BuildInfraConfigTypes, BuildInfraConfigurationType>

interface BuildInfraProfileBaseDTO {
    id?: number
    name?: string
    description: string
    type: BuildInfraProfileVariants
    appCount?: number
    active?: boolean
}

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
    NODE_SELECTOR_KEY = 'node_selector_key',
    NODE_SELECTOR_VALUE = 'node_selector_value',
    TOLERANCE_KEY = 'tolerance_key',
    TOLERANCE_VALUE = 'tolerance_value',
}

/**
 * Would be maintaining error state for name and description irrespective of platform
 * For error states related to platform, we would not be letting user to switch platform if there are errors
 */
export type ProfileInputErrorType = {
    [key in NumericBuildInfraConfigTypes | BuildInfraMetaConfigTypes | BuildInfraProfileAdditionalErrorKeysType]: string
}

export interface ProfileInputDispatchDataType {
    targetPlatform: string
}

interface NumericBuildInfraConfigPayloadType {
    value: number
    unit: string
}

export type HandleProfileInputChangeType =
    | {
          action: NumericBuildInfraConfigTypes
          data: ProfileInputDispatchDataType & NumericBuildInfraConfigPayloadType
      }
    | {
          action: BuildInfraMetaConfigTypes
          data?: ProfileInputDispatchDataType & {
              value: string
          }
      }
    | {
          action: BuildInfraInheritActions
          data: ProfileInputDispatchDataType
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

export interface BuildInfraFormItemProps
    extends Pick<BuildInfraFormFieldType, 'marker' | 'heading'>,
        Partial<Pick<BuildInfraProfileConfigBase, 'targetPlatform'>> {
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
    isDefaultProfile: boolean
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

export interface BuildInfraConfigFormProps
    extends Pick<UseBuildInfraFormResponseType, 'profileInput' | 'profileInputErrors' | 'handleProfileInputChange'> {
    isDefaultProfile?: boolean
    unitsMap?: BuildInfraProfileResponseType['configurationUnits']
    configurationContainerLabel?: ReactNode
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
    extends Pick<BuildInfraInputFieldComponentProps, 'error' | 'handleProfileInputChange'>,
        Partial<Pick<BuildInfraProfileConfigBase, 'targetPlatform'>> {
    currentValue: string
}

export interface InheritingHeaderProps {
    defaultHeading: BuildInfraFormFieldType['heading']
    inheritingData: BuildInfraConfigValuesType[]
    isInheriting: boolean
    isDefaultProfile: boolean
}

export interface BuildInfraConfigResponseDataType {
    name: BuildInfraConfigTypes
    units: ConfigurationUnitType[]
}

interface BaseBuildInfraProfileDTO {
    defaultConfigurations: BuildInfraPlatformConfigurationMapDTO
    configurationUnits: BuildInfraUnitsMapType
}

export interface BuildInfraListResponseType extends BaseBuildInfraProfileDTO {
    profiles: BuildInfraProfileInfoDTO[]
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
}
