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

export const StatusConstants = {
    NOT_DEPLOYED: {
        noSpaceLower: 'notdeployed',
        normalCase: 'Not deployed',
        lowerCase: 'not-deployed',
    },
    APP_STATUS: {
        noSpaceLower: 'appStatus',
        normalText: 'App status',
    },
    PROJECT: {
        pluralLower: 'projects',
        lowerCase: 'project',
    },
    CLUSTER: {
        pluralLower: 'clusters',
        lowerCase: 'cluster',
    },
    NAMESPACE: {
        pluralLower: 'namespaces',
        lowerCase: 'namespace',
    },
    ENVIRONMENT: {
        pluralLower: 'environments',
        lowerCase: 'environment',
    },
    NOT_AVILABLE: {
        normalCase: 'Not available',
    },
}

export enum TIMELINE_STATUS {
    DEPLOYMENT_INITIATED = 'DEPLOYMENT_INITIATED',
    GIT_COMMIT = 'GIT_COMMIT',
    GIT_COMMIT_FAILED = 'GIT_COMMIT_FAILED',
    KUBECTL_APPLY = 'KUBECTL_APPLY',
    KUBECTL_APPLY_STARTED = 'KUBECTL_APPLY_STARTED',
    KUBECTL_APPLY_SYNCED = 'KUBECTL_APPLY_SYNCED',
    HEALTHY = 'HEALTHY',
    APP_HEALTH = 'APP_HEALTH',
    DEPLOYMENT_FAILED = 'FAILED',
    FETCH_TIMED_OUT = 'TIMED_OUT',
    UNABLE_TO_FETCH_STATUS = 'UNABLE_TO_FETCH_STATUS',
    DEGRADED = 'DEGRADED',
    DEPLOYMENT_SUPERSEDED = 'DEPLOYMENT_SUPERSEDED',
    ABORTED = 'ABORTED',
    INPROGRESS = 'INPROGRESS',
    HELM_PACKAGE_GENERATED = 'HELM_PACKAGE_GENERATED',
    HELM_MANIFEST_PUSHED_TO_HELM_REPO = 'HELM_MANIFEST_PUSHED_TO_HELM_REPO',
    HELM_MANIFEST_PUSHED_TO_HELM_REPO_FAILED = 'HELM_MANIFEST_PUSHED_TO_HELM_REPO_FAILED',
}

export const YET_TO_RUN = 'Yet to run'
