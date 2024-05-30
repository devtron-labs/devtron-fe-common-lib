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

const AppListConstants = {
    SAMPLE_NODE_REPO_URL: 'https://github.com/devtron-labs/getting-started-nodejs',
    CREATE_DEVTRON_APP_URL: 'create-d-app',
    AppTabs: {
        DEVTRON_APPS: 'Devtron Apps',
        HELM_APPS: 'Helm Apps',
        ARGO_APPS: 'ArgoCD Apps',
    },
    AppType: {
        DEVTRON_APPS: 'd',
        HELM_APPS: 'h',
        ARGO_APPS: 'a',
    },
    FilterType: {
        PROJECT: 'team',
        CLUTSER: 'cluster',
        NAMESPACE: 'namespace',
        ENVIRONMENT: 'environment',
        APP_STATUS: 'appStatus',
    },
}

export default AppListConstants
