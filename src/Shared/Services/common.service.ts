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

import { AppConfigProps, GetTemplateAPIRouteType } from '@Pages/index'
import { getUrlWithSearchParams, post, ROUTES } from '../../Common'
import { GetPolicyApiUrlProps, GetResourceApiUrlProps } from './types'
import { getTemplateAPIRoute } from '..'

export const getResourceApiUrl = <T>({ baseUrl, kind, version, suffix, queryParams }: GetResourceApiUrlProps<T>) =>
    getUrlWithSearchParams(`${baseUrl}/${kind}/${version}${suffix ? `/${suffix}` : ''}`, queryParams)

export const getPolicyApiUrl = <T>({ kind, version, queryParams, suffix }: GetPolicyApiUrlProps<T>) =>
    getUrlWithSearchParams(`global/policy/${kind}/${version}${suffix ? `/${suffix}` : ''}`, queryParams)

export const saveCDPipeline = (request, { isTemplateView }: Required<Pick<AppConfigProps, 'isTemplateView'>>) => {
    const url = isTemplateView
        ? getTemplateAPIRoute({
              type: GetTemplateAPIRouteType.CD_PIPELINE,
              queryParams: {
                  id: request.appId,
              },
          })
        : ROUTES.CD_CONFIG

    return post(url, request)
}
