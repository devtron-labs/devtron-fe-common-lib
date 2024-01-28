import { ReactComponent as ICCpu } from '../../../Assets/Icon/ic-cpu.svg'
import { ReactComponent as ICMemory } from '../../../Assets/Icon/ic-memory.svg'
import { ReactComponent as ICTimer } from '../../../Assets/Icon/ic-timer.svg'
import { UseBreadcrumbProps } from '../../../Common/BreadCrumb/Types'
import {
    BuildInfraConfigTypes,
    BuildInfraFormFieldType,
    BuildInfraLocators,
    BuildInfraMetaConfigTypes,
    ProfileInputErrorType,
    BuildInfraProfileBase,
    BuildInfraProfileVariants,
    HandleProfileInputChangeType,
} from './types'

export const BUILD_INFRA_INPUT_CONSTRAINTS = {
    STEP: 0.01,
    MIN: 0,
    DECIMAL_PLACES: 2,
} as const

export const BUILD_INFRA_TEXT = {
    HEADING: 'Build Infra Configuration',
    EDIT_SUBMIT: 'Save changes',
    SAVE_SUBMIT: 'Save',
    EDIT_CANCEL: 'Cancel',
    EDIT_DEFAULT_TOOLTIP:
        'Efficiently control infrastructure settings such as CPU, Memory, and Build timeout for your build pipelines. Streamline resource management to optimise build time and cost effortlessly.',
    DESCRIPTION_LABEL: 'Description',
    DESCRIPTION_PLACEHOLDER: 'Enter a description here',
    PROFILE_LABEL: 'Profile name',
    PROFILE_PLACEHOLDER: 'Eg. Java or Node',
    INHERITING_HEADING_DESCRIPTION: 'Inheriting from default',
    SUBMIT_BUTTON_TIPPY: {
        INVALID_INPUT: 'Valid input is required for all mandatory fields.',
        REQUEST_IN_PROGRESS: 'Request in progress.',
    },
    VALIDATE_REQUEST_LIMIT: {
        // Might use the constants from BUILD_INFRA_INPUT_CONSTRAINTS even for NEGATIVE_REQUEST and NEGATIVE_LIMIT
        NEGATIVE_REQUEST: 'Request should be a positive number.',
        NEGATIVE_LIMIT: 'Limit should be a positive number.',
        REQUEST_LESS_THAN_LIMIT: 'Request should be less than or equal to limit.',
        CAN_NOT_COMPUTE: 'Request and limit value diff are too high to validate.',
        REQUEST_DECIMAL_PLACES: `Request should be upto ${BUILD_INFRA_INPUT_CONSTRAINTS.DECIMAL_PLACES} decimal places.`,
        LIMIT_DECIMAL_PLACES: `Limit should be upto ${BUILD_INFRA_INPUT_CONSTRAINTS.DECIMAL_PLACES} decimal places.`,
    },
    getInvalidActionMessage: (action: HandleProfileInputChangeType['action']) => `Invalid action type: ${action}`,
    getSubmitSuccessMessage: (profileName: string, isEdited: boolean) =>
        `${profileName} profile is ${isEdited ? 'updated' : 'created'}`,
    PROFILE_NOT_FOUND: {
        title: 'Profile not found',
        subTitle: 'The profile you are looking for does not exist.',
    },
    INVALID_FORM_MESSAGE: 'Valid input is required for all mandatory fields.',
} as const

export const BUILD_INFRA_BREADCRUMB: UseBreadcrumbProps = {
    alias: {
        'global-config': null,
        'build-infra': {
            component: <h2 className="m-0 cn-9 fs-16 fw-6 lh-32">{BUILD_INFRA_TEXT.HEADING}</h2>,
            linked: false,
        },
    },
}

export const BUILD_INFRA_FORM_FIELDS: BuildInfraFormFieldType[] = [
    {
        heading: <h3 className="m-0 cn-9 fs-13 fw-6 lh-20">CPU (Request - Limit)</h3>,
        marker: ICCpu,
        actions: [
            {
                actionType: BuildInfraConfigTypes.CPU_REQUEST,
                label: 'Request',
                placeholder: 'Type CPU request',
            },
            {
                actionType: BuildInfraConfigTypes.CPU_LIMIT,
                label: 'Limit',
                placeholder: 'Type CPU limit',
            },
        ],
        locator: BuildInfraLocators.CPU,
    },
    {
        heading: <h3 className="m-0 cn-9 fs-13 fw-6 lh-20">Memory (Request - Limit)</h3>,
        marker: ICMemory,
        actions: [
            {
                actionType: BuildInfraConfigTypes.MEMORY_REQUEST,
                label: 'Request',
                placeholder: 'Type memory request',
            },
            {
                actionType: BuildInfraConfigTypes.MEMORY_LIMIT,
                label: 'Limit',
                placeholder: 'Type memory limit',
            },
        ],
        locator: BuildInfraLocators.MEMORY,
    },
    {
        heading: <h3 className="m-0 cn-9 fs-13 fw-6 lh-20">Build timeout</h3>,
        marker: ICTimer,
        actions: [
            {
                actionType: BuildInfraConfigTypes.BUILD_TIMEOUT,
                label: 'Timeout',
                placeholder: 'Type build timeout',
            },
        ],
        locator: BuildInfraLocators.BUILD_TIMEOUT,
    },
]

export const PROFILE_INPUT_ERROR_FIELDS = Object.fromEntries(
    Object.keys({ ...BuildInfraConfigTypes, ...BuildInfraMetaConfigTypes }).map((key) => [key, null]),
) as ProfileInputErrorType

// All fields in BuildInfraConfigTypes are required and name in BuildInfraMetaConfigTypes is required
export const REQUIRED_INPUT_FIELDS = [...Object.keys(BuildInfraConfigTypes), BuildInfraMetaConfigTypes.NAME]

export const DEFAULT_PROFILE_NAME = 'default' as const

export const CREATE_PROFILE_BASE_VALUE: BuildInfraProfileBase = {
    name: '',
    description: '',
    type: BuildInfraProfileVariants.NORMAL,
    appCount: 0,
}

export const CREATE_VIEW_CHECKED_CONFIGS = {
    [BuildInfraConfigTypes.CPU_REQUEST]: true,
    [BuildInfraConfigTypes.CPU_LIMIT]: true,
} as const

export const BUILD_INFRA_TEST_IDS = {
    SUBMIT_BUTTON: 'build-infra-submit-button',
    CANCEL_BUTTON: 'build-infra-cancel-button',
} as const
