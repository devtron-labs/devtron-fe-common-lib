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
    HOTJAR_ENABLED?: boolean
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
    HIDE_APPLICATION_GROUPS?: boolean
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
    LOGIN_PAGE_IMAGE?: string
    LOGIN_PAGE_IMAGE_BG?: string
    HIDE_DEFAULT_CLUSTER?: boolean
    GLOBAL_API_TIMEOUT?: number
    TRIGGER_API_TIMEOUT?: number
    NODE_REACT_APP_GIT_SHA?: string
    REACT_APP_GIT_SHA?: string
    NODE_ENV?: string
    LOGIN_DT_LOGO?: string
    SIDEBAR_DT_LOGO?: string
    ENABLE_EXTERNAL_ARGO_CD: boolean
    API_BATCH_SIZE: number
    SERVICE_WORKER_TIMEOUT?: string
    HIDE_RELEASES?: boolean
    FEATURE_USER_DEFINED_GITOPS_REPO_ENABLE: boolean
    HIDE_RESOURCE_WATCHER?: boolean
    ORGANIZATION_NAME: string
    FEATURE_EXTERNAL_FLUX_CD_ENABLE: boolean
    FEATURE_SCOPED_VARIABLE_ENVIRONMENT_LIST_ENABLE?: boolean
    HIDE_NETWORK_STATUS_INTERFACE?: boolean
    SYSTEM_CONTROLLER_LISTING_TIMEOUT?: number
    FEATURE_IMAGE_PROMOTION_ENABLE?: boolean
    FEATURE_CD_MANDATORY_PLUGINS_ENABLE?: boolean
    /**
     * If true, the direct permissions are hidden for non-super admins in user permissions
     *
     * @default false
     */
    FEATURE_HIDE_USER_DIRECT_PERMISSIONS_FOR_NON_SUPER_ADMINS?: boolean
    FEATURE_CONFIG_DRIFT_ENABLE: boolean
    FEATURE_PROMO_EMBEDDED_BUTTON_TEXT?: string
    FEATURE_PROMO_EMBEDDED_MODAL_TITLE?: string
    FEATURE_PROMO_EMBEDDED_IFRAME_URL?: string
    FEATURE_SWAP_TRAFFIC_ENABLE?: boolean
    FEATURE_BULK_RESTART_WORKLOADS_FROM_RB: string
    FEATURE_RB_SYNC_CLUSTER_ENABLE?: boolean
    FEATURE_DEFAULT_MERGE_STRATEGY?: OverrideMergeStrategyType
    FEATURE_DEFAULT_LANDING_RB_ENABLE?: boolean
    FEATURE_CLUSTER_MAP_ENABLE?: boolean
    FEATURE_ACTION_AUDIOS_ENABLE?: boolean
    /**
     * If true, the experimental theming feature is enabled
     *
     * @default false
     */
    FEATURE_EXPERIMENTAL_THEMING_ENABLE?: boolean
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
