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

import { WorkflowNodeType } from '@Common/Types'
import { CIPipelineNodeType } from '@Shared/types'

import { SourceTypeCardProps } from './types'

export const SOURCE_TYPE_CARD_VARIANTS = {
    BUILD: {
        BUILD_AND_DEPLOY_FROM_SOURCE_CODE: {
            title: 'Build & Deploy from Source Code',
            subtitle: 'Build container image from a Git repo and deploy to an environment.',
            dataTestId: 'build-and-deploy-from-source-code-button',
            type: CIPipelineNodeType.CI_CD,
            icons: [
                { name: 'ic-git-branch', color: 'N700' },
                { name: 'ic-build-color', color: null },
                { name: 'ic-deploy-color', color: null },
            ],
        },
        BUILD_FROM_SOURCE_CODE: {
            title: 'Build from Source Code',
            subtitle: 'Build container image from a Git repo',
            dataTestId: 'build-from-source-code-button',
            type: CIPipelineNodeType.CI,
            icons: [
                { name: 'ic-git-branch', color: 'N700' },
                { name: 'ic-build-color', color: null },
            ],
        },
        JOB: {
            title: 'Create a Job',
            subtitle: 'Create and trigger a job. Such as trigger Jenkins build trigger',
            dataTestId: 'job-ci-pipeline-button',
            type: CIPipelineNodeType.JOB_CI,
            icons: [{ name: 'ic-job-color', color: null }],
        },
    },
    RECEIVE: {
        EXTERNAL_SERVICE: {
            title: 'Deploy Image from External Service',
            subtitle: 'Receive images from an external service (eg. jenkins) & deploy to an environment.',
            dataTestId: 'deploy-image-external-service-link',
            type: WorkflowNodeType.WEBHOOK as const,
            icons: [
                { name: 'ic-webhook', color: null },
                { name: 'ic-deploy-color', color: null },
            ],
        },
        LINKED_PIPELINE: {
            title: 'Linked Build Pipeline',
            subtitle: 'Use image built by another build pipeline within Devtron.',
            dataTestId: 'linked-build-pipeline-button',
            type: CIPipelineNodeType.LINKED_CI,
            icons: [{ name: 'ic-linked-build-color', color: null }],
        },
    },
    JOB: {
        JOB: {
            title: 'Create a Job',
            subtitle: 'Create and trigger a job. Such as trigger Jenkins build trigger',
            dataTestId: 'job-ci-pipeline-button',
            type: CIPipelineNodeType.JOB_CI,
            icons: [{ name: 'ic-job-color', color: null }],
        },
    },
} satisfies Record<
    string,
    Record<string, Pick<SourceTypeCardProps, 'title' | 'subtitle' | 'type' | 'icons' | 'dataTestId'>>
>

export const NO_ENV_FOUND = 'No environment found. Please create a CD Pipeline first.'
export const REQUEST_IN_PROGRESS = 'Request in progress'

export const TOAST_MESSAGES = {
    SUCCESS_CHANGE_TO_WEBHOOK: 'Successfully changed CI to webhook',
    WORKFLOW_NOT_AVAILABLE: 'Selected workflow not available',
}
