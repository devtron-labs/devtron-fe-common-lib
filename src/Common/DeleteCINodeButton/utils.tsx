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

import { Routes } from '@Shared/constants'
import { getTemplateAPIRoute } from '@Shared/index'
import { AppConfigProps, GetTemplateAPIRouteType } from '@Pages/index'

import { post, trash } from '..'

export function savePipeline(
    request,
    {
        isRegexMaterial = false,
        isTemplateView,
    }: Required<Pick<AppConfigProps, 'isTemplateView'>> & {
        isRegexMaterial?: boolean
    },
): Promise<any> {
    let url
    if (isRegexMaterial) {
        url = `${Routes.CI_PIPELINE_PATCH}/regex`
    } else {
        url = isTemplateView
            ? getTemplateAPIRoute({
                  type: GetTemplateAPIRouteType.CI_PIPELINE,
                  queryParams: {
                      id: request.appId,
                  },
              })
            : Routes.CI_PIPELINE_PATCH
    }
    return post(url, request)
}

export function deleteWorkflow(appId: string, workflowId: number, isTemplateView: AppConfigProps['isTemplateView']) {
    const URL = isTemplateView
        ? getTemplateAPIRoute({
              type: GetTemplateAPIRouteType.WORKFLOW,
              queryParams: { id: appId, appWorkflowId: workflowId },
          })
        : `${Routes.WORKFLOW}/${appId}/${workflowId}`
    return trash(URL)
}
