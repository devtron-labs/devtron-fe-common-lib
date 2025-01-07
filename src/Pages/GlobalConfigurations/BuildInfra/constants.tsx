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

import { ReactComponent as ICCpu } from '@Icons/ic-cpu.svg'
import { ReactComponent as ICMemory } from '@Icons/ic-memory.svg'
import { ReactComponent as ICTimer } from '@Icons/ic-timer.svg'
import { ReactComponent as ICSprayCan } from '@Icons/ic-spray-can.svg'
import { ReactComponent as ICTag } from '@Icons/ic-tag.svg'
import { UseBreadcrumbProps } from '@Common/BreadCrumb/Types'
import {
    BuildInfraConfigTypes,
    BuildInfraFormFieldType,
    BuildInfraLocators,
    BuildInfraMetaConfigTypes,
    ProfileInputErrorType,
    HandleProfileInputChangeType,
    BuildInfraProfileAdditionalErrorKeysType,
    BuildInfraAPIVersionType,
    TargetPlatformErrorFields,
    ValidateRequestLimitType,
    RequestLimitConfigType,
    BuildInfraToleranceEffectType,
    BuildInfraToleranceOperatorType,
} from './types'

export const BUILD_INFRA_INPUT_CONSTRAINTS = {
    // Will not enforce any decimal specification on input field
    STEP: 'any',
    MIN: 0,
    DECIMAL_PLACES: 2,
    MAX_LABEL_VALUE_LENGTH: 63,
} as const

export const DEFAULT_PROFILE_NAME = 'global'

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
    PROFILE_PLACEHOLDER: 'Enter a name eg. java/node/small/medium/large',
    INHERITING_HEADING_DESCRIPTION: `Inheriting from ${DEFAULT_PROFILE_NAME}`,
    SUBMIT_BUTTON_TIPPY: {
        INVALID_INPUT: 'Valid input is required for all mandatory fields.',
        REQUEST_IN_PROGRESS: 'Request in progress.',
    },
    VALIDATE_REQUEST_LIMIT: {
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

export const BUILD_INFRA_LOCATOR_MARKER_MAP: Readonly<Record<BuildInfraLocators, BuildInfraFormFieldType['marker']>> = {
    [BuildInfraLocators.CPU]: ICCpu,
    [BuildInfraLocators.MEMORY]: ICMemory,
    [BuildInfraLocators.BUILD_TIMEOUT]: ICTimer,
    [BuildInfraLocators.NODE_SELECTOR]: ICSprayCan,
    [BuildInfraLocators.TOLERANCE]: ICTag,
}

export const BUILD_INFRA_LOCATOR_LABEL_MAP: Readonly<Record<BuildInfraLocators, string>> = {
    [BuildInfraLocators.CPU]: 'CPU',
    [BuildInfraLocators.MEMORY]: 'Memory',
    [BuildInfraLocators.BUILD_TIMEOUT]: 'Build timeout',
    [BuildInfraLocators.NODE_SELECTOR]: 'Node selector',
    [BuildInfraLocators.TOLERANCE]: 'Tolerance',
}

export const BUILD_INFRA_FORM_FIELDS: Readonly<BuildInfraFormFieldType[]> = [
    {
        heading: <h3 className="m-0 cn-9 fs-13 fw-6 lh-20 w-240 dc__no-shrink">CPU (Request - Limit)</h3>,
        marker: BUILD_INFRA_LOCATOR_MARKER_MAP[BuildInfraLocators.CPU],
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
        heading: <h3 className="m-0 cn-9 fs-13 fw-6 lh-20 w-240 dc__no-shrink">Memory (Request - Limit)</h3>,
        marker: BUILD_INFRA_LOCATOR_MARKER_MAP[BuildInfraLocators.MEMORY],
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
        heading: <h3 className="m-0 cn-9 fs-13 fw-6 lh-20 w-240 dc__no-shrink">Build timeout</h3>,
        marker: BUILD_INFRA_LOCATOR_MARKER_MAP[BuildInfraLocators.BUILD_TIMEOUT],
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

export const NUMERIC_BUILD_INFRA_FORM_FIELD_CONFIGURATION_MAP: Readonly<
    Record<BuildInfraLocators, BuildInfraFormFieldType>
> = BUILD_INFRA_FORM_FIELDS.reduce<Record<BuildInfraLocators, BuildInfraFormFieldType>>(
    (acc, field) => {
        acc[field.locator] = field
        return acc
    },
    {} as Record<BuildInfraLocators, BuildInfraFormFieldType>,
)

export const PROFILE_INPUT_ERROR_FIELDS = Object.fromEntries(
    Object.values({
        ...BuildInfraConfigTypes,
        ...BuildInfraMetaConfigTypes,
        ...BuildInfraProfileAdditionalErrorKeysType,
    }).map((value) => [value, null]),
) as ProfileInputErrorType

// fields required to be filled before submitting the form in create view, since we pre-populate the form with default values so no need in configs
export const CREATE_MODE_REQUIRED_INPUT_FIELDS = [BuildInfraMetaConfigTypes.NAME]

export const BUILD_INFRA_TEST_IDS = {
    SUBMIT_BUTTON: 'build-infra-submit-button',
    CANCEL_BUTTON: 'build-infra-cancel-button',
} as const

export const BUILD_INFRA_DEFAULT_PLATFORM_NAME = 'runner'
export const BUILD_INFRA_LATEST_API_VERSION: BuildInfraAPIVersionType = BuildInfraAPIVersionType.ALPHA1
export const TARGET_PLATFORM_ERROR_FIELDS_MAP: Record<TargetPlatformErrorFields, true> = {
    [BuildInfraConfigTypes.BUILD_TIMEOUT]: true,
    [BuildInfraConfigTypes.CPU_LIMIT]: true,
    [BuildInfraConfigTypes.CPU_REQUEST]: true,
    [BuildInfraConfigTypes.MEMORY_LIMIT]: true,
    [BuildInfraConfigTypes.MEMORY_REQUEST]: true,
    [BuildInfraConfigTypes.NODE_SELECTOR]: true,
    [BuildInfraConfigTypes.TOLERANCE]: true,
    [BuildInfraProfileAdditionalErrorKeysType.TARGET_PLATFORM]: true,
}

export const BUILD_INFRA_INHERIT_ACTIONS: Record<
    `activate_${BuildInfraLocators}` | `de_activate_${BuildInfraLocators}`,
    BuildInfraLocators
> = Object.values(BuildInfraLocators).reduce<
    Record<`activate_${BuildInfraLocators}` | `de_activate_${BuildInfraLocators}`, BuildInfraLocators>
>(
    (acc, locator) => {
        acc[`activate_${locator}`] = locator
        acc[`de_activate_${locator}`] = locator
        return acc
    },
    {} as Record<`activate_${BuildInfraLocators}` | `de_activate_${BuildInfraLocators}`, BuildInfraLocators>,
)

export const BUILD_INFRA_LOCATOR_CONFIG_TYPES_MAP: Record<BuildInfraLocators, BuildInfraConfigTypes[]> = {
    [BuildInfraLocators.CPU]: [BuildInfraConfigTypes.CPU_REQUEST, BuildInfraConfigTypes.CPU_LIMIT],
    [BuildInfraLocators.MEMORY]: [BuildInfraConfigTypes.MEMORY_REQUEST, BuildInfraConfigTypes.MEMORY_LIMIT],
    [BuildInfraLocators.BUILD_TIMEOUT]: [BuildInfraConfigTypes.BUILD_TIMEOUT],
    [BuildInfraLocators.NODE_SELECTOR]: [BuildInfraConfigTypes.NODE_SELECTOR],
    [BuildInfraLocators.TOLERANCE]: [BuildInfraConfigTypes.TOLERANCE],
}

export const ACTION_TO_PERSISTED_VALUE_MAP: Readonly<
    Record<
        RequestLimitConfigType,
        {
            keyToPersist: keyof Pick<ValidateRequestLimitType, 'limit' | 'request'>
            keyToPersistConfigType: RequestLimitConfigType
        }
    >
> = {
    [BuildInfraConfigTypes.CPU_LIMIT]: {
        keyToPersist: 'request',
        keyToPersistConfigType: BuildInfraConfigTypes.CPU_REQUEST,
    },
    [BuildInfraConfigTypes.CPU_REQUEST]: {
        keyToPersist: 'limit',
        keyToPersistConfigType: BuildInfraConfigTypes.CPU_LIMIT,
    },
    [BuildInfraConfigTypes.MEMORY_LIMIT]: {
        keyToPersist: 'request',
        keyToPersistConfigType: BuildInfraConfigTypes.MEMORY_REQUEST,
    },
    [BuildInfraConfigTypes.MEMORY_REQUEST]: {
        keyToPersist: 'limit',
        keyToPersistConfigType: BuildInfraConfigTypes.MEMORY_LIMIT,
    },
}

export const DEFAULT_TOLERANCE_EFFECT = BuildInfraToleranceEffectType.NO_SCHEDULE
export const DEFAULT_TOLERANCE_OPERATOR = BuildInfraToleranceOperatorType.EQUALS

export const INFRA_CONFIG_NOT_SUPPORTED_BY_BUILD_X: Partial<Record<BuildInfraConfigTypes, true>> = {
    [BuildInfraConfigTypes.BUILD_TIMEOUT]: true,
}
