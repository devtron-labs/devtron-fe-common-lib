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

import { DOCUMENTATION_HOME_PAGE } from '@Common/Constants'

export const DOCUMENTATION = {
    ADMIN_PASSWORD: 'install/install-devtron#devtron-admin-credentials',
    APP_CI_CONFIG_BUILD_WITHOUT_DOCKER:
        'usage/applications/creating-application/docker-build-configuration#build-docker-image-without-dockerfile',
    APP_CREATE: 'usage/applications/create-application',
    APP_CREATE_CI_CONFIG: 'usage/applications/creating-application/docker-build-configuration',
    APP_CREATE_CONFIG_MAP: 'usage/applications/creating-application/config-maps',
    APP_CREATE_ENVIRONMENT_OVERRIDE: 'usage/applications/creating-application/environment-overrides',
    APP_CREATE_MATERIAL: 'usage/applications/creating-application/git-material',
    APP_CREATE_SECRET: 'usage/applications/creating-application/secrets',
    APP_CREATE_WORKFLOW: 'usage/applications/creating-application/workflow',
    APP_DEPLOYMENT_TEMPLATE: 'usage/applications/creating-application/deployment-template',
    APP_EPHEMERAL_CONTAINER: 'usage/applications/app-details/ephemeral-containers',
    APP_GROUP: 'usage/application-groups',
    APP_METRICS: 'usage/applications/app-details/app-metrics',
    APP_OVERVIEW_TAGS: 'usage/applications/overview#manage-tags',
    APP_ROLLOUT_DEPLOYMENT_TEMPLATE: 'usage/applications/creating-application/deployment-template/rollout-deployment',
    BUILD_STAGE: 'usage/applications/creating-application/workflow/ci-pipeline#build-stage',
    APP_TAGS: 'usage/applications/create-application#tags',
    BLOB_STORAGE: 'configurations-overview/installation-configuration#configuration-of-blob-storage',
    BULK_UPDATE: 'usage/bulk-update',
    CHART_GROUP: 'usage/deploy-chart/chart-group',
    CHART_LIST: 'usage/deploy-chart/overview-of-charts',
    CHART_STORE: 'usage/deploy-chart',
    CHART_STORE_METRICS_SERVER: 'dashboard//chart-store/discover?appStoreName=metrics-server',
    CUSTOM_VALUES: 'usage/deploy-chart/overview-of-charts#custom-values',
    CONFIGURING_WEBHOOK: 'usage/applications/creating-application/workflow/ci-pipeline#configuring-webhook',
    DEPLOYMENT: 'usage/applications/creating-application/deployment-template/deployment',
    DEPLOYMENT_TEMPLATE: 'usage/applications/creating-application/deployment-template',
    DEVTRON_UPGRADE: 'getting-started/upgrade',
    DOC_HOME_PAGE: DOCUMENTATION_HOME_PAGE,
    ENTERPRISE_LICENSE: 'enterprise-license',
    EXECUTE_CUSTOM_SCRIPT:
        'usage/applications/creating-application/workflow/ci-pipeline/ci-build-pre-post-plugins#execute-custom-script',
    EXTERNAL_LINKS: 'getting-started/global-configurations/external-links',
    EXTERNAL_SECRET: 'usage/applications/creating-application/secrets#external-secrets',
    HOME_PAGE: 'https://devtron.ai',
    JOBS: 'usage/jobs',
    KUBE_CONFIG: 'usage/resource-browser#running-kubectl-commands-locally',
    RESOURCE_BROWSER: 'usage/resource-browser',
    TAINT: 'usage/resource-browser#taint-a-node',

    // Global Configurations
    GLOBAL_CONFIGUDATIONS: 'getting-started/global-configurations',
    GLOBAL_CONFIG_API_TOKEN: 'getting-started/global-configurations/authorization/api-tokens',
    GLOBAL_CONFIG_BUILD_INFRA: 'global-configurations/build-infra',
    GLOBAL_CONFIG_CHART: 'getting-started/global-configurations/chart-repo',
    GLOBAL_CONFIG_CLUSTER: 'getting-started/global-configurations/cluster-and-environments',
    GLOBAL_CONFIG_CUSTOM_CHART: 'getting-started/global-configurations/custom-charts',
    GLOBAL_CONFIG_CUSTOM_CHART_PRE_REQUISITES: 'global-configurations/deployment-charts#preparing-a-deployment-chart',
    GLOBAL_CONFIG_DOCKER: 'getting-started/global-configurations/container-registries',
    GLOBAL_CONFIG_GIT: 'getting-started/global-configurations/git-accounts',
    GLOBAL_CONFIG_GITOPS: 'global-configurations/gitops',
    GLOBAL_CONFIG_GITOPS_GITHUB: 'global-configurations/gitops#github',
    GLOBAL_CONFIG_GITOPS_GITLAB: 'global-configurations/gitops#gitlab',
    GLOBAL_CONFIG_GITOPS_AZURE: 'global-configurations/gitops#azure',
    GLOBAL_CONFIG_GITOPS_BITBUCKET: 'global-configurations/gitops#bitbucket',
    GLOBAL_CONFIG_GROUPS: 'getting-started/global-configurations/authorization/permission-groups',
    GLOBAL_CONFIG_HOST_URL: 'global-configurations/host-url',
    GLOBAL_CONFIG_NOTIFICATION: 'getting-started/global-configurations/manage-notification',
    GLOBAL_CONFIG_PERMISSION: 'global-configurations/authorization/user-access#devtron-apps-permissions',
    GLOBAL_CONFIG_PROJECT: 'global-configurations/projects',
    GLOBAL_CONFIG_SSO: 'getting-started/global-configurations/sso-login',
    GLOBAL_CONFIG_SCOPED_VARIABLES: 'getting-started/global-configurations/scoped-variables',
    GLOBAL_CONFIG_USER: 'getting-started/global-configurations/authorization/user-access',
    HYPERION: 'usage/applications#view-external-helm-app-listing',
    JOB_CRONJOB: 'usage/applications/creating-application/deployment-template/job-and-cronjob',
    JOB_SOURCE_CODE: 'usage/jobs/configuration-job',
    JOB_WORKFLOW_EDITOR: 'usage/jobs/workflow-editor-job',
    K8S_RESOURCES_PERMISSIONS: 'global-configurations/authorization/user-access#kubernetes-resources-permissions',
    PRE_POST_BUILD_STAGE: 'usage/applications/creating-application/ci-pipeline/ci-build-pre-post-plugins',
    ROLLOUT: 'usage/applications/creating-application/deployment-template/rollout-deployment',
    SECURITY: 'usage/security-features',
    SPECIFY_IMAGE_PULL_SECRET: 'getting-started/global-configurations/container-registries#specify-image-pull-secret',
    TENANT_INSTALLATION: 'usage/software-distribution-hub/tenants',

    // ENTERPRISE
    CEL: 'https://github.com/google/cel-spec/blob/master/doc/langdef.md',
    KUBERNETES_LABELS: 'https://kubernetes.io/docs/concepts/overview/working-with-objects/labels',
    IMAGE_PROMOTION: 'global-configurations/image-promotion-policy',
    IMAGE_PROMOTION_ASSIGN_TO: 'global-configurations/image-promotion-policy#applying-an-image-promotion-policy',
    TAGS: 'usage/applications/create-application#tags',
    TAGS_POLICY: 'global-configurations/tags-policy',
    RESOURCE_WATCHER: 'usage/resource-watcher',
    GITOPS_BITBUCKET: 'global-configurations/gitops#bitbucket',
    DEPLOYMENT_CONFIGS: 'resources/glossary#base-deployment-template',
    RJSF_PLAYGROUND: 'https://rjsf-team.github.io/react-jsonschema-form/',

    // GLOBAL CONFIGURATION
    GLOBAL_CONFIG_DEPLOYMENT_WINDOW: 'global-configurations/deployment-window',
    GLOBAL_CONFIG_CATALOG_FRAMEWORK: 'global-configurations/catalog-framework',
    GLOBAL_CONFIG_DEVTRON_APP_TEMPLATES: 'global-configurations',
    GLOBAL_CONFIG_FILTER_CONDITION: 'global-configurations/filter-condition',
    GLOBAL_CONFIG_LOCK_DEPLOYMENT_CONFIG: 'global-configurations/lock-deployment-config',
    GLOBAL_CONFIG_PLUGINS_POLICY: 'global-configurations/plugins-policy',
    GLOBAL_CONFIG_APPROVAL_POLICY: 'global-configurations/approval-policy',
    GLOBAL_CONFIG_SSO_LOGIN_LDAP: 'global-configurations/authorization/sso-login/ldap',
    GLOBAL_CONFIG_SSO_LOGIN_OIDC: 'global-configurations/authorization/sso-login/oidc',
    GLOBAL_CONFIG_SSO_LOGIN_MICROSOFT: 'global-configurations/authorization/sso-login/microsoft',
    GLOBAL_CONFIG_PULL_IMAGE_DIGEST: 'global-configurations/pull-image-digest',
    GLOBAL_CONFIG_TAGS: 'getting-started/global-configurations/tags-policy',

    // Application Management
    APP_MANAGEMENT: 'docs/user-guide/app-management',

    // Software Release Management
    SOFTWARE_DISTRIBUTION_HUB: 'usage/software-distribution-hub',
    RELEASE_TRACKS: 'usage/software-distribution-hub/release-hub#creating-release-tracks-and-versions',
    RELEASES: 'usage/software-distribution-hub/release-hub#creating-release-tracks-and-versions',
    RELEASE_HUB: 'usage/software-distribution-hub/release-hub',
    TENANTS: 'usage/software-distribution-hub/tenants#adding-installation',
    TENANTS_INSTALLATION: 'usage/software-distribution-hub/tenants',

    // Infrastructure Management
    AUTOSCALER_DETECTION: 'user-guide/infra-management/infrastructure-overview#troubleshooting-autoscaler-detection',
    HELM_APPS: 'user-guide/infra-management/other-applications',
    INFRA_MANAGEMENT: 'docs/user-guide/infra-management',

    // Cost Visibility
    COST_BREAKDOWN: 'user-guide/finops',
    COST_CALCULATION: 'user-guide/finops/overview-cost-visibility#how-is-the-cost-calculated',
    COST_VISIBILITY_OVERVIEW: 'user-guide/finops/overview-cost-visibility',

    // Security Center
    SECURITY_CENTER: 'docs/user-guide/security-features',

    // AI Recommendations
    AI_RECOMMENDATIONS: 'usage/ai-recommendations',

    // Automation & Enablement
    AUTOMATION_AND_ENABLEMENT: 'docs/user-guide/automation',
} as const
