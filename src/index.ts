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

import { OverrideMergeStrategyType } from '@Pages/Applications'

export interface customEnv {
    SENTRY_ENV?: string
    SENTRY_ERROR_ENABLED?: boolean
    SENTRY_PERFORMANCE_ENABLED?: boolean
    SENTRY_DSN?: string
    /**
     * Release version for sentry
     *
     * @default 'dashboard@${SHORT_GIT_HASH}'
     */
    SENTRY_RELEASE_VERSION?: string
    SENTRY_TRACES_SAMPLE_RATE?: number
    CLUSTER_NAME?: boolean
    APPLICATION_METRICS_ENABLED?: boolean
    GA_ENABLED?: boolean
    GA_TRACKING_ID?: string
    GTM_ENABLED?: boolean
    GTM_ID?: string
    RECOMMEND_SECURITY_SCANNING?: boolean
    FORCE_SECURITY_SCANNING?: boolean
    ENABLE_CI_JOB?: boolean
    HIDE_DISCORD?: boolean
    POSTHOG_ENABLED?: boolean
    POSTHOG_TOKEN?: string
    DEVTRON_APP_DETAILS_POLLING_INTERVAL?: number
    HELM_APP_DETAILS_POLLING_INTERVAL?: number
    EA_APP_DETAILS_POLLING_INTERVAL?: number
    CENTRAL_API_ENDPOINT?: string
    HIDE_GITOPS_OR_HELM_OPTION?: boolean
    CONFIGURABLE_TIMEOUT?: string
    K8S_CLIENT?: boolean
    CLUSTER_TERMINAL_CONNECTION_POLLING_INTERVAL?: number
    CLUSTER_TERMINAL_CONNECTION_RETRY_COUNT?: number
    ENABLE_CHART_SEARCH_IN_HELM_DEPLOY?: boolean
    HIDE_EXCLUDE_INCLUDE_GIT_COMMITS?: boolean
    ENABLE_BUILD_CONTEXT?: boolean
    CLAIR_TOOL_VERSION?: string
    ENABLE_RESTART_WORKLOAD?: boolean
    ENABLE_SCOPED_VARIABLES?: boolean
    DEFAULT_CI_TRIGGER_TYPE_MANUAL: boolean
    ANNOUNCEMENT_BANNER_MSG?: string
    ANNOUNCEMENT_BANNER_TYPE?: string
    ANNOUNCEMENT_BANNER_BUTTON_TEXT?: string
    ANNOUNCEMENT_BANNER_BUTTON_LINK?: string
    HIDE_DEFAULT_CLUSTER?: boolean
    GLOBAL_API_TIMEOUT?: number
    TRIGGER_API_TIMEOUT?: number
    NODE_REACT_APP_GIT_SHA?: string
    REACT_APP_GIT_SHA?: string
    NODE_ENV?: string
    SIDEBAR_DT_LOGO?: string
    ENABLE_EXTERNAL_ARGO_CD: boolean
    API_BATCH_SIZE: number
    SERVICE_WORKER_TIMEOUT?: string
    /**
     * @default false
     */
    FEATURE_USER_DEFINED_GITOPS_REPO_ENABLE: boolean
    ORGANIZATION_NAME: string
    FEATURE_EXTERNAL_FLUX_CD_ENABLE: boolean
    /**
     * If true, the direct permissions are hidden for non-super admins in user permissions
     *
     * @default false
     */
    FEATURE_HIDE_USER_DIRECT_PERMISSIONS_FOR_NON_SUPER_ADMINS?: boolean
    FEATURE_PROMO_EMBEDDED_BUTTON_TEXT?: string
    FEATURE_PROMO_EMBEDDED_MODAL_TITLE?: string
    FEATURE_PROMO_EMBEDDED_IFRAME_URL?: string
    FEATURE_BULK_RESTART_WORKLOADS_FROM_RB: string
    FEATURE_RB_SYNC_CLUSTER_ENABLE?: boolean
    FEATURE_DEFAULT_MERGE_STRATEGY?: OverrideMergeStrategyType
    FEATURE_DEFAULT_LANDING_RB_ENABLE?: boolean
    FEATURE_ACTION_AUDIOS_ENABLE?: boolean
    // ================== Feature flags for the enterprise release ==================
    /**
     * If true, only pipelines to which the user has access will be shown across the application
     * @default false
     */
    FEATURE_DEFAULT_AUTHENTICATED_VIEW_ENABLE?: boolean
    /**
     * Enable Image promotion feature
     *
     * @default false
     */
    FEATURE_IMAGE_PROMOTION_ENABLE?: boolean
    /**
     * Enable environment list for scoped variables
     *
     * @default false
     */
    FEATURE_SCOPED_VARIABLE_ENVIRONMENT_LIST_ENABLE?: boolean
    /**
     * If false, Enable release feature
     *
     * @default true
     */
    HIDE_RELEASES?: boolean
    /**
     * Enable resource watcher
     *
     * @default true
     */
    HIDE_RESOURCE_WATCHER?: boolean
    /**
     * Enable config drift
     *
     * @default false
     */
    FEATURE_CONFIG_DRIFT_ENABLE: boolean
    /**
     * Enable swap traffic (blue green deployment)
     *
     * @default false
     */
    FEATURE_SWAP_TRAFFIC_ENABLE?: boolean
    /**
     * Enable cluster map
     *
     * @default true
     */
    FEATURE_CLUSTER_MAP_ENABLE?: boolean
    /**
     * @default true
     */
    HIDE_NETWORK_STATUS_INTERFACE?: boolean
    /**
     * @default 300000
     */
    SYSTEM_CONTROLLER_LISTING_TIMEOUT?: number
    /**
     * If true, the application templates feature is enabled
     *
     * @default false
     */
    FEATURE_APPLICATION_TEMPLATES_ENABLE?: boolean
    /**
     * @default false
     */
    FEATURE_REDFISH_NODE_ENABLE?: boolean
    GATEKEEPER_URL?: string
    FEATURE_AI_INTEGRATION_ENABLE?: boolean
    LOGIN_PAGE_IMAGE?: string
    /**
     * If true, the manage traffic feature is enabled in apps & app groups.
     *
     * @default false
     */
    FEATURE_MANAGE_TRAFFIC_ENABLE?: boolean
    FEATURE_INFRA_PROVISION_INFO_BLOCK_HIDE?: boolean
    /**
     * If true, will add flux option to deployment types in devtron apps and devtron charts
     * @default false
     */
    FEATURE_FLUX_DEPLOYMENTS_ENABLE?: boolean
}
declare global {
    interface Window {
        __BASE_URL__: string
        __ORCHESTRATOR_ROOT__: string
        _env_: customEnv
    }
}

export * from './Common'
export * from './Pages'
export * from './Shared'
