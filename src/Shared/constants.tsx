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

export const ARTIFACT_STATUS = {
    PROGRESSING: 'Progressing',
    DEGRADED: 'Degraded',
    FAILED: 'Failed',
}

export const STAGE_TYPE = {
    CD: 'CD',
    CI: 'CI',
    GIT: 'GIT',
    PRECD: 'PRECD',
    POSTCD: 'POSTCD',
    ROLLBACK: 'ROLLBACK',
}

export const SCAN_TOOL_ID_TRIVY = 3

export const IMAGE_SCAN_TOOL = {
    Clair: 'Clair',
    Trivy: 'Trivy',
}

export const EXCLUDED_IMAGE_TOOLTIP =
    'This image is excluded for new deployment as it does not match the filter conditions configured for this environment.'

export const ModuleNameMap = {
    ARGO_CD: 'argo-cd',
    CICD: 'cicd',
    SECURITY: 'security',
    BLOB_STORAGE: 'blob-storage',
    GRAFANA: 'monitoring.grafana',
    NOTIFICATION: 'notifier',
    SECURITY_TRIVY: 'security.trivy',
    SECURITY_CLAIR: 'security.clair',
}

// TODO: Convert to object later if more formats arise
export const DATE_TIME_FORMAT_STRING = 'ddd DD MMM YYYY HH:mm:ss'
export const API_TOKEN_PREFIX = 'API-TOKEN:'

export enum PatchOperationType {
    replace = 'replace',
    remove = 'remove',
}

export enum DeploymentStageType {
    PRE = 'PRE',
    DEPLOY = 'DEPLOY',
    POST = 'POST',
}

export enum DeploymentWithConfigType {
    LAST_SAVED_CONFIG = 'LAST_SAVED_CONFIG',
    LATEST_TRIGGER_CONFIG = 'LATEST_TRIGGER_CONFIG',
    SPECIFIC_TRIGGER_CONFIG = 'SPECIFIC_TRIGGER_CONFIG',
}
