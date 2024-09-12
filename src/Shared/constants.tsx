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

import { OptionType } from '@Common/Types'
import { CDMaterialSidebarType, ConfigurationType } from './types'

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
export const DEFAULT_SECRET_PLACEHOLDER = '••••••••'

export enum PatchOperationType {
    add = 'add',
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

export enum EnvironmentTypeEnum {
    production = 'Production',
    nonProduction = 'Non-Production',
}

export enum TIMELINE_STATUS {
    DEPLOYMENT_INITIATED = 'DEPLOYMENT_INITIATED',
    GIT_COMMIT = 'GIT_COMMIT',
    GIT_COMMIT_FAILED = 'GIT_COMMIT_FAILED',
    ARGOCD_SYNC = 'ARGOCD_SYNC',
    ARGOCD_SYNC_FAILED = 'ARGOCD_SYNC_FAILED',
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

export const EMPTY_STATE_STATUS = {
    DATA_NOT_AVAILABLE: 'Data not available',
    API_TOKEN: {
        TITLE: 'No matching results',
        SUBTITLE: "We couldn't find any matching token",
    },
    ARTIFACTS_EMPTY_STATE_TEXTS: {
        NoFilesFound: 'No files found',
        BlobStorageNotConfigured: 'Blob storage must be configured to store any files generated by the pipeline',
        StoreFiles: 'Want to store files?',
        ConfigureBlobStorage: 'Configure blob storage',
        NoFilesGenerated: 'No files were generated by the job pipeline.',
        NoArtifactsGenerated: 'No artifacts generated',
        NoArtifactsError: 'Errr..!! We couldn’t build your code.',
        FailedToFetchArtifacts: 'Fail to find artifacts',
        FailedToFetchArtifactsError: 'Errr..!! The pipeline execution failed',
        NoArtifactsFound: 'No new artifacts found',
        NoArtifactsFoundError: 'No new artifacts were found',
    },
    CI_BUILD_HISTORY_PIPELINE_TRIGGER: {
        TITLE: 'pipeline not triggered',
        SUBTITLE: 'Pipeline trigger history, details and logs will be available here.',
    },
    CI_BUILD_HISTORY_LINKED_PIPELINE: {
        TITLE: 'This is a Linked CI Pipeline',
        SUBTITLE: 'This is a Linked CI Pipeline',
    },
    CI_BUILD_HISTORY_NO_PIPELINE: {
        TITLE: 'No pipeline selected',
        SUBTITLE: 'Please select a pipeline',
    },
    CI_DEATILS_NO_VULNERABILITY_FOUND: {
        TITLE: 'You’re secure!',
        SUBTITLE: 'No security vulnerability found for this image.',
    },
    CI_DETAILS_IMAGE_SCANNED_DISABLED: 'Go to build pipeline configurations and enable ’Scan for vulnerabilities’',
    CI_DETAILS_IMAGE_NOT_SCANNED: {
        TITLE: 'Image not scanned',
        SUBTITLE: 'This build was executed before scanning was enabled for this pipeline.',
    },
    CD_DETAILS_NO_ENVIRONMENT: {
        TITLE: 'No environment selected',
        SUBTITLE: 'Please select an environment to start seeing CD deployments.',
    },
    CD_DETAILS_NO_DEPLOYMENT: {
        TITLE: 'No deployments',
        SUBTITLE: 'No deployment history available for the',
    },
    CHART: {
        NO_SOURCE_TITLE: 'No chart source configured',
        NO_CHART_FOUND: 'Could not find any matching chart source',
    },
    CHART_DEPLOYMENT_HISTORY: {
        SUBTITLE:
            'Data for previous deployments is not available. History for any new deployment will be available here.',
    },
    CHART_GROUP_DEPLOYMENT: {
        TITLE: 'No Deployments',
        SUBTITLE: "You haven't made any deployments",
    },
    DEPLOYMENT_DETAILS_SETPS_FAILED: {
        TITLE: 'Deployment failed',
        SUBTITLE: 'A new deployment was initiated before this deployment completed.',
    },
    DEPLOYMENT_DETAILS_SETPS_PROGRESSING: {
        TITLE: 'Deployment in progress',
        SUBTITLE: 'This deployment is in progress. Click on Check status to know the live status.',
    },
    DEVTRON_APP_DEPLOYMENT_HISTORY_SOURCE_CODE: {
        SUBTITLE: 'Source code detail is not available',
    },
    DEPLOYMENT_HISTORY_CONFIG_LIST: {
        SUBTITLE: 'Deployed configurations is not available for older deployments',
    },
    GENERATE_API_TOKEN: {
        TITLE: 'Generate a token to access the Devtron API',
        SUBTITLE:
            'API tokens are like ordinary OAuth access tokens. They can be used instead of username and password for programmatic access to API.',
    },
    TRIGGER_URL: {
        TITLE: 'No URLs available',
        SUBTITLE: 'No URLs found in ingress and service resources',
    },

    CD_EMPTY_STATE: {
        TITLE: 'Data not available',
        SUBTITLE: 'Deployed configurations is not available for older deployments',
    },

    CI_PROGRESS_VIEW: {
        TITLE: 'Building artifacts',
        SUBTITLE: 'Generated artifact(s) will be available here after the pipeline is executed.',
    },

    RENDER_EMPTY_STATE: {
        TITILE: 'No deployments found',
        SUBTITLE: 'There are no deployments in this period on',
    },

    RENDER_NO_ENVIORNMENT_STATE: {
        TITLE: 'Deployment Metrics',
        SUBTITLE:
            'This app is not deployed on any production environment. Deploy on prod to get an overview of your deployment practices.',
    },

    RENDER_SELECT_ENVIRONMENT_VIEW: {
        TITLE: 'Select an Environment',
        SUBTITLE: 'Please select an Enviroment to view deployment metrics.',
    },

    SAVED_VALUES_EMPTY_STATE: {
        TITLE: 'No values saved for this chart',
        SUBTITLE: 'Customize, Dry Run and Save values so they’re ready to be used later.',
    },

    LOADING_CLUSTER: {
        TITLE: 'Trying to connect to Cluster',
        SUBTITLE: 'Please wait while the kubeconfig is verified and cluster details are fetched.',
    },

    NO_MATCHING_RESULT: {
        TITLE: 'No matching results',
        SUBTITLE: "We couldn't find any matching cluster",
    },

    CLUSTER_NODE_EMPTY_STATE: {
        TITLE: 'No matching clusters',
        SUBTITLE: 'We couldn’t find any matching results',
    },

    CHART_EMPTY_STATE: {
        TITLE: 'No matching charts',
        SUBTITLE: "We couldn't find any matching results",
    },

    CHART_VALUES_GUIT_VIEW: {
        SUBTITLE:
            'GUI view is not available as values.schema.json file does not exist for the selected version and values.',
    },

    DEVTRON_STACK_MANAGER: {
        TITLE: 'No integrations installed',
        SUBTITLE: 'Installed integrations will be available here.',
    },

    NO_GROUPS: {
        TITLE: 'No groups',
        SUBTITLE: 'Groups allow you to combine permissions and easily assign them to users.',
    },

    NO_USER: {
        TITLE: 'No users',
        SUBTITLE: 'Add users and assign group or direct permissions',
    },

    RENDER_LIST: {
        SUBTITLE: 'No results found for the applied filters.',
    },

    CUSTOM_CHART_LIST: {
        TITLE: 'Use custom charts in applications',
    },

    BULK_ACTION_EDITS: {
        TITLE: 'No Linked pipelines created',
        SUBTITLE: 'Deployment groups can only be created for applications and environments using Linked CI Pipelines.',
    },

    SECURITY_SCANS: {
        TITLE: 'No Scans Performed',
        SUBTITLE: 'No results found for the applied filters.',
    },

    NOTIFICATION_TAB: {
        TITLE: 'Notification',
        SUBTITL: 'Receive alerts when a pipeline triggers, completes successfully or fails.',
    },

    CONFIGURATION_TAB: {
        TITLE: 'No Configurations',
    },

    EXTERNAL_LINK_COMPONENT: {
        TITLE: 'Add external links',
        SUBTITLE: "We couldn't find any matching external link configuration",
    },
    CD_MATERIAL: {
        TITLE: 'No Image Available',
    },
    CI_DETAILS_NOT_FOUND: {
        TITLE: 'Not found',
        SUBTITLE: 'you are looking for does not exist',
    },
    TRIGGER_NOT_FOUND: {
        TITLE: 'Trigger not found',
        SUBTITLE: 'The trigger you are looking for does not exist',
    },
    OVERVIEW: {
        DEPLOYMENT_TITLE: "Explore your application's deployment landscape",
        DEPLOYMENT_SUB_TITLE:
            "Although there are no deployments to display just yet, it's the perfect time to start configuring and deploying your app to various environments. Let's go!",
        APP_DESCRIPTION: 'Write a short description for this application',
        JOB_DESCRIPTION: 'Write a short description for this job',
    },
}

export const DEPLOYMENT_HISTORY_CONFIGURATION_LIST_MAP = {
    DEPLOYMENT_TEMPLATE: {
        DISPLAY_NAME: 'Deployment template',
        VALUE: 'deployment-template',
    },
    PIPELINE_STRATEGY: {
        DISPLAY_NAME: 'Pipeline configurations',
        VALUE: 'pipeline-strategy',
    },
    CONFIGMAP: {
        DISPLAY_NAME: 'ConfigMap',
        VALUE: 'configmap',
    },
    SECRET: {
        DISPLAY_NAME: 'Secret',
        VALUE: 'secret',
    },
}

export const EXTERNAL_TYPES = {
    [DEPLOYMENT_HISTORY_CONFIGURATION_LIST_MAP.SECRET.DISPLAY_NAME]: {
        '': 'Kubernetes Secret',
        KubernetesSecret: 'Kubernetes External Secret',
        AWSSecretsManager: 'AWS Secrets Manager',
        AWSSystemManager: 'AWS System Manager',
        HashiCorpVault: 'Hashi Corp Vault',
        ESO_HashiCorpVault: 'Hashi Corp Vault',
        ESO_AWSSecretsManager: 'AWS Secrets Manager',
        ESO_GoogleSecretsManager: 'Google Secrets Manager',
        ESO_AzureSecretsManager: 'Azure Secrets Manager',
    },
    [DEPLOYMENT_HISTORY_CONFIGURATION_LIST_MAP.CONFIGMAP.DISPLAY_NAME]: {
        '': 'Kubernetes ConfigMap',
        KubernetesConfigMap: 'Kubernetes External ConfigMap',
    },
}

export const DEPLOYMENT_STATUS = {
    SUCCEEDED: 'succeeded',
    HEALTHY: 'healthy',
    FAILED: 'failed',
    TIMED_OUT: 'timed_out',
    UNABLE_TO_FETCH: 'unable_to_fetch',
    INPROGRESS: 'inprogress',
    PROGRESSING: 'progressing',
    STARTING: 'starting',
    INITIATING: 'initiating',
    SUPERSEDED: 'superseded',
    QUEUED: 'queued',
    UNKNOWN: 'unknown',
    CHECKING: 'checking',
} as const

export const statusIcon = {
    failed: 'failed',
    queued: 'queued',
    suspended: 'suspended',
    starting: 'progressing',
    initiating: 'progressing',
    unknown: 'unknown',
    degraded: 'degraded',
    healthy: 'healthy',
    notdeployed: 'not-deployed',
    missing: 'missing',
    progressing: 'progressing',
    deploymentinitiated: 'progressing',
    hibernating: 'hibernating',
    succeeded: 'healthy',
    timedout: 'timed-out',
    unabletofetch: 'failed',
}

export const statusColor = {
    suspended: 'var(--Y500)',
    unknown: 'var(--N700)',
    queued: 'var(--N700)',
    degraded: 'var(--R500)',
    healthy: 'var(--G500)',
    notdeployed: 'var(--N500)',
    missing: 'var(--N700)',
    progressing: 'var(--O500)',
    initiating: 'var(--O500)',
    starting: 'var(--O500)',
    succeeded: 'var(--G500)',
    running: 'var(--O500)',
    failed: 'var(--R500)',
    error: 'var(--R500)',
    cancelled: 'var(--R500)',
    aborted: 'var(--R500)',
    timedout: 'var(--R500)',
    unabletofetch: 'var(--R500)',
    hibernating: 'var(--N700)',
}

export const PULSATING_STATUS_MAP: { [key in keyof typeof statusColor]?: boolean } = {
    progressing: true,
    initiating: true,
    starting: true,
    running: true,
}

export const APP_STATUS_HEADERS = ['KIND', 'NAME', 'STATUS', 'MESSAGE']

export const MATERIAL_EXCLUDE_TIPPY_TEXT =
    'Not available for build as this commit contains changes in excluded files or folders'

export const AppListConstants = {
    SAMPLE_NODE_REPO_URL: 'https://github.com/devtron-labs/getting-started-nodejs',
    CREATE_DEVTRON_APP_URL: 'create-d-app',
    AppTabs: {
        DEVTRON_APPS: 'Devtron Apps',
        HELM_APPS: 'Helm Apps',
        ARGO_APPS: 'ArgoCD Apps',
        FLUX_APPS: 'FluxCD Apps',
    },
    AppType: {
        DEVTRON_APPS: 'd',
        HELM_APPS: 'h',
        ARGO_APPS: 'a',
        FLUX_APPS: 'f',
    },
    FilterType: {
        PROJECT: 'team',
        CLUTSER: 'cluster',
        NAMESPACE: 'namespace',
        ENVIRONMENT: 'environment',
        APP_STATUS: 'appStatus',
        TEMPLATE_TYPE: 'templateType',
    },
}

export enum K8sResourcePayloadAppType {
    DEVTRON_APP = 0,
    HELM_APP = 1,
    EXTERNAL_ARGO_APP = 2,
    EXTERNAL_FLUX_APP = 3,
}

// Disallowing this rule since ansi specifically works with escape characters
// eslint-disable-next-line no-control-regex
export const ANSI_UP_REGEX = /\x1B\[.*?m/g
/**
 * Size variants for components
 */
export enum ComponentSizeType {
    xs = 'xs',
    small = 'small',
    medium = 'medium',
    large = 'large',
    xl = 'xl',
}

export const POP_UP_MENU_MODAL_ID = 'popup'

/**
 * Identifiers for grouped / all resources
 */
export enum SelectAllGroupedResourceIdentifiers {
    // Projects
    allProjects = '-1',

    // Environments
    allExistingAndFutureNonProdEnvironments = '-1',
    allExistingAndFutureProdEnvironments = '-2',
    allExistingAndFutureEnvironments = '-3',
}

export const CD_MATERIAL_SIDEBAR_TABS: OptionType<CDMaterialSidebarType, CDMaterialSidebarType>[] = Object.values(
    CDMaterialSidebarType,
).map((tabValue) => ({
    value: tabValue,
    label: tabValue,
}))

export const TRIGGER_STATUS_PROGRESSING = ['progressing', 'initiating', 'running', 'starting']

export const CONFIGURATION_TYPE_VALUES = Object.values(ConfigurationType)
