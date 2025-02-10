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

import { DeploymentStageType } from '@Shared/constants'
import { getUrlWithSearchParams } from '@Common/Helper'
import { GetTemplateAPIRouteProps } from './types'

export const getDeploymentStageTitle = (stage: DeploymentStageType) => {
    switch (stage) {
        case DeploymentStageType.PRE:
            return 'pre-deployment'
        case DeploymentStageType.POST:
            return 'post-deployment'
        case DeploymentStageType.DEPLOY:
            return 'deployment'
        default:
            return '-'
    }
}

const TEMPLATE_API_ROUTE_PREFIX = '/resource/template/devtron-application/alpha1'

export const getTemplateAPIRoute = ({ type, queryParams }: GetTemplateAPIRouteProps) =>
    getUrlWithSearchParams(`${TEMPLATE_API_ROUTE_PREFIX}/${type}`, { templateId: queryParams.id, ...queryParams })
