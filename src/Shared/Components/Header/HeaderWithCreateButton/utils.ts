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

import { URLS } from '@Common/Constants'

import { CreateActionMenuItems, CreateActionMenuProps } from './types'

export const getCreateActionMenuOptions = (createCustomAppURL: string): CreateActionMenuProps['options'] => [
    {
        items: [
            {
                id: CreateActionMenuItems.CUSTOM_APP,
                label: 'Custom app',
                description: 'Connect a git repository to deploy a custom application',
                startIcon: { name: 'ic-add' },
                componentType: 'link',
                to: createCustomAppURL,
            },
            {
                id: CreateActionMenuItems.CHART_STORE,
                label: 'From Chart store',
                description: 'Deploy apps using third party helm charts (eg. prometheus, redis etc.)',
                startIcon: { name: 'ic-helm' },
                componentType: 'link',
                to: URLS.INFRASTRUCTURE_MANAGEMENT_CHART_STORE_DISCOVER,
            },
            {
                id: CreateActionMenuItems.JOB,
                label: 'Job',
                description: 'Jobs allow manual and automated execution of developer actions.',
                startIcon: { name: 'ic-k8s-job' },
                componentType: 'link',
                to: `${URLS.AUTOMATION_AND_ENABLEMENT_JOB}/${URLS.APP_LIST}/${URLS.CREATE_JOB}`,
            },
        ],
    },
]
