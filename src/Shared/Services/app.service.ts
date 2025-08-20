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

import { get, getUrlWithSearchParams, ResponseType, ROUTES } from '../../Common'
import { getTemplateAPIRoute } from '..'
import {
    AppEnvDeploymentConfigDTO,
    AppEnvDeploymentConfigPayloadType,
    CIMaterialInfoDTO,
    GetCITriggerInfoParamsType,
} from './app.types'

export const getCITriggerInfo = async (params: GetCITriggerInfoParamsType) =>
    get<CIMaterialInfoDTO>(`${ROUTES.APP}/material-info/${params.envId}/${params.ciArtifactId}`)

/**
 * The only difference between this and getCITriggerInfo is it doesn't have env and trigger related meta info
 */
export const getArtifactInfo = (params: Pick<GetCITriggerInfoParamsType, 'ciArtifactId'>) =>
    get<CIMaterialInfoDTO>(`${ROUTES.APP}/material-info/${params.ciArtifactId}`)

export const getAppEnvDeploymentConfig = ({
    params,
    signal,
    isTemplateView,
    appId,
}: {
    params: AppEnvDeploymentConfigPayloadType
    signal?: AbortSignal
    isTemplateView: AppConfigProps['isTemplateView']
    appId: string | number | null
}): Promise<ResponseType<AppEnvDeploymentConfigDTO>> => {
    const url = isTemplateView
        ? getTemplateAPIRoute({
              type: GetTemplateAPIRouteType.CONFIG_DATA,
              queryParams: {
                  id: appId,
                  ...params,
              },
          })
        : getUrlWithSearchParams(ROUTES.CONFIG_DATA, params)

    return get(url, { signal })
}

export const getCompareSecretsData = async (
    params: AppEnvDeploymentConfigPayloadType[],
): Promise<AppEnvDeploymentConfigDTO[]> => {
    const payload = {
        comparisonItems: params.filter((param) => !!param).map((param, index) => ({ index, ...param })),
    }

    const results = Array(params.length).fill(null)

    const {
        result: { comparisonItemResponse },
    } = await (get(
        getUrlWithSearchParams(ROUTES.CONFIG_COMPARE_SECRET, {
            compareConfig: JSON.stringify(payload),
        }),
    ) as Promise<
        ResponseType<Record<'comparisonItemResponse', (AppEnvDeploymentConfigDTO & Record<'index', number>)[]>>
    >)

    comparisonItemResponse.forEach((resp) => {
        results[resp.index] = resp
    })

    return results
}
