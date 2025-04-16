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

import { ROUTES } from '@Common/Constants'
import { getUrlWithSearchParams } from '@Common/Helper'
import { GetTemplateAPIRouteProps } from '@Pages/index'

import { getResourceApiUrl, ResourceKindType, ResourceVersionType } from '..'

export const getTemplateAPIRoute = ({ type, queryParams: { id, ...restQueryParams } }: GetTemplateAPIRouteProps) =>
    getUrlWithSearchParams(
        `${getResourceApiUrl({
            baseUrl: ROUTES.RESOURCE_TEMPLATE,
            kind: ResourceKindType.devtronApplication,
            version: ResourceVersionType.alpha1,
        })}/${type}`,
        { templateId: id, ...restQueryParams },
    )
