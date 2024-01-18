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
} from './types'

export const BUILD_INFRA_TEXT = {
    HEADING: 'Build Infra Configuration',
    EDIT_SUBMIT: 'Save changes',
    SAVE_SUBMIT: 'Save',
    EDIT_CANCEL: 'Cancel',
    EDIT_DEFAULT_TOOLTIP:
        'Efficiently control infrastructure settings such as CPU, Memory, and Build timeout for your build pipelines. Streamline resource management to optimise build time and cost effortlessly.',
    DESCRIPTION_LABEL: 'Description',
    DESCRIPTION_PLACEHOLDER: 'Type description',
    PROFILE_LABEL: 'Profile name',
    PROFILE_PLACEHOLDER: 'Type profile name',
    INHERITING_HEADING_DESCRIPTION: 'Inheriting from default',
}

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

// TODO: Handle the case of create profile to disable save button initially and enable it when all the fields are filled
export const PROFILE_INPUT_ERROR_FIELDS = {
    ...Object.fromEntries(
        Object.keys({ ...BuildInfraConfigTypes, ...BuildInfraMetaConfigTypes }).map((key) => [key, null]),
    ),
} as ProfileInputErrorType

export const DEFAULT_PROFILE_NAME = 'default'
