import { FormEvent, FunctionComponent, ReactNode } from 'react'
import { Breadcrumb } from '../../../Common/BreadCrumb/Types'
import { ValidationResponseType } from '../../../Shared'
import { ServerErrors } from '../../../Common'

/**
 * Unique actions that will be dispatched and,
 * Keeping some values (cpu_limit, etc) in sync with backend
 */
export enum BuildInfraConfigTypes {
    CPU_LIMIT = 'cpu_limit',
    CPU_REQUEST = 'cpu_request',
    MEMORY_LIMIT = 'mem_limit',
    MEMORY_REQUEST = 'mem_request',
    BUILD_TIMEOUT = 'build_timeout',
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
    BUILD_TIMEOUT = 'build_timeout',
}

// FIXME: Derive this from BuildInfraLocators
// Appending the locators from above
export enum BuildInfraInheritActions {
    ACTIVATE_CPU = `activate_cpu`,
    DE_ACTIVATE_CPU = `de_activate_cpu`,
    ACTIVATE_MEMORY = `activate_memory`,
    DE_ACTIVATE_MEMORY = `de_activate_memory`,
    ACTIVATE_BUILD_TIMEOUT = `activate_build_timeout`,
    DE_ACTIVATE_BUILD_TIMEOUT = `de_activate_build_timeout`,
}

export enum BuildInfraProfileVariants {
    DEFAULT = 'DEFAULT',
    NORMAL = 'NORMAL',
    CUSTOM = 'CUSTOM',
}

export interface DescriptorProps {
    /**
     * In case we want to restrict the max-width
     */
    additionalContainerClasses?: string
    breadCrumbs: Breadcrumb[]
    /**
     * Would stick at right of div
     */
    children?: ReactNode
}

export interface BuildInfraActionType {
    /**
     * Type of action to be dispatched, would be suffixed with type of change
     */
    actionType: BuildInfraConfigTypes
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

export type BuildInfraUnitsMapType = {
    [key in BuildInfraConfigTypes]: ConfigurationUnitMapType
}

export interface BuildInfraConfigValuesType {
    value: string
    unit?: ConfigurationUnitType['name']
}

interface BuildInfraProfileConfigBase {
    id?: number
    key: BuildInfraConfigTypes
    profileName: string
    active: boolean
}

export interface BuildInfraProfileConfigResponseDataType
    extends BuildInfraConfigValuesType,
        BuildInfraProfileConfigBase {}

export interface BuildInfraConfigurationType extends BuildInfraConfigValuesType, BuildInfraProfileConfigBase {
    defaultValue: BuildInfraConfigValuesType
}

export type BuildInfraConfigurationMapType = {
    [key in BuildInfraConfigTypes]: BuildInfraConfigurationType
}

interface BuildInfraProfileBase {
    id?: number
    name: string
    description: string
    type: BuildInfraProfileVariants
    appCount: number
}

export interface BuildInfraProfileResponseDataType extends BuildInfraProfileBase {
    configurations: BuildInfraProfileConfigResponseDataType[]
}

export interface BuildInfraProfileData extends BuildInfraProfileBase {
    configurations: BuildInfraConfigurationMapType
}

export interface BuildInfraProfileResponseType {
    configurationUnits: BuildInfraUnitsMapType | null
    profile: BuildInfraProfileData | null
}

export interface UseBuildInfraFormProps {
    /**
     * Name of the profile
     */
    name?: string
    /**
     * If false, wont make any call
     */
    isSuperAdmin?: boolean
    /**
     * If true, would send put request else would create profile via post
     */
    editProfile?: boolean
    /**
     * If true, call this on form submition success
     */
    handleSuccessRedirection?: () => void
}

export type ProfileInputErrorType = {
    [key in BuildInfraConfigTypes | BuildInfraMetaConfigTypes]: string
}

export interface ProfileInputDispatchDataType {
    value: string
    unit?: string
}

export interface HandleProfileInputChangeType {
    action: BuildInfraConfigTypes | BuildInfraInheritActions | BuildInfraMetaConfigTypes
    data?: ProfileInputDispatchDataType
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

export interface BuildInfraFormItemProps extends Pick<BuildInfraFormFieldType, 'marker' | 'heading'> {
    children?: ReactNode
    /**
     * If true, means profile is inheriting values from other profile (e.g, default)
     */
    isInherting?: boolean
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
    request: BuildInfraConfigValuesType
    limit: BuildInfraConfigValuesType
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
}

export interface BuildInfraFormActionProps extends BuildInfraActionType {
    handleProfileInputChange: UseBuildInfraFormResponseType['handleProfileInputChange']
    currentValue: BuildInfraConfigValuesType['value']
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
    hideCancelButton?: boolean
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

export interface CreateBuildInfraServiceConfigurationType {
    key: BuildInfraConfigTypes
    value: string
    active: boolean
    unit?: string
    /**
     * Would send for those that are available in profileInput
     */
    id?: number
}

export interface CreateBuildInfraSerivcePayloadType {
    name: string
    description: string
    type: BuildInfraProfileVariants
    configurations: CreateBuildInfraServiceConfigurationType[]
}

export interface BuildInfraInputFieldComponentProps {
    handleProfileInputChange: UseBuildInfraFormResponseType['handleProfileInputChange']
    currentValue: BuildInfraConfigValuesType['value']
    error?: string
}

export interface InheritingHeaderProps {
    defaultHeading: BuildInfraFormFieldType['heading']
    inhertingData: BuildInfraConfigValuesType[]
}

export interface BuildInfraConfigResponseDataType {
    name: BuildInfraConfigTypes
    units: ConfigurationUnitType[]
}

interface BaseBuildInfraProfileResponseType {
    defaultConfigurations: BuildInfraProfileConfigResponseDataType[]
    configurationUnits: BuildInfraConfigResponseDataType[]
}

export interface BuildInfraListResponseType extends BaseBuildInfraProfileResponseType {
    profiles: BuildInfraProfileConfigResponseDataType[]
}

export interface BuildInfraProfileAPIResponseType extends BaseBuildInfraProfileResponseType {
    profile: BuildInfraProfileResponseDataType
}
