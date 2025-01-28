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

import { versionComparatorBySortOrder } from '@Shared/Helpers'
import { DeploymentChartListDTO, DeploymentChartType, DEVTRON_DEPLOYMENT_CHART_NAMES } from './types'
import fallbackGuiSchema from './basicViewSchema.json'

export const convertDeploymentChartListToChartType = (data: DeploymentChartListDTO): DeploymentChartType[] => {
    if (!data) {
        return []
    }
    const chartMap = data.reduce(
        (acc, { id, version, chartDescription: description = '', name, isUserUploaded = true }) => {
            if (!name || !id || !version) {
                return acc
            }
            const detail = acc[name]
            if (detail) {
                detail.versions.push({
                    id,
                    version,
                    description,
                })
            } else {
                acc[name] = {
                    name,
                    isUserUploaded,
                    versions: [{ id, version, description }],
                }
            }
            return acc
        },
        {} as Record<string, DeploymentChartType>,
    )
    const result = Object.values(chartMap).map((element) => {
        element.versions.sort((a, b) => versionComparatorBySortOrder(a.version, b.version))
        return element
    })
    return result
}

export const getGuiSchemaFromChartName = (chartName: string) => {
    switch (chartName) {
        case DEVTRON_DEPLOYMENT_CHART_NAMES.JOB_AND_CRONJOB_CHART_NAME:
        case DEVTRON_DEPLOYMENT_CHART_NAMES.DEPLOYMENT:
        case DEVTRON_DEPLOYMENT_CHART_NAMES.ROLLOUT_DEPLOYMENT:
        case DEVTRON_DEPLOYMENT_CHART_NAMES.STATEFUL_SET:
            return fallbackGuiSchema
        default:
            return {}
    }
}
