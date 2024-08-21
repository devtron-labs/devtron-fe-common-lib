import { versionComparator } from '@Shared/Helpers'
import { SortingOrder } from '@Common/Constants'
import { DeploymentChartListDTO, DeploymentChartType, DEVTRON_DEPLOYMENT_CHART_NAMES } from './types'
import fallbackGuiSchema from './basicViewSchema.json'
import fallbackJobsNCronJobGuiSchema from './fallbackJobsNCronJobGuiSchema.json'

export const convertDeploymentChartListToChartType = (data: DeploymentChartListDTO): DeploymentChartType[] => {
    if (!data) {
        return []
    }
    const chartMap: Record<string, DeploymentChartType> = data.reduce(
        (acc, { id, version, chartDescription: description = '', name, isUserUploaded = true }) => {
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
        {},
    )
    const result = Object.values(chartMap).map((element) => {
        element.versions?.sort((a, b) => versionComparator(a, b, 'version', SortingOrder.DESC))
        return element
    })
    return result
}

export const getGuiSchemaFromChartName = (chartName: string) => {
    switch (chartName) {
        case DEVTRON_DEPLOYMENT_CHART_NAMES.JOB_AND_CRONJOB_CHART_NAME:
            return fallbackJobsNCronJobGuiSchema
        case DEVTRON_DEPLOYMENT_CHART_NAMES.DEPLOYMENT:
        case DEVTRON_DEPLOYMENT_CHART_NAMES.ROLLOUT_DEPLOYMENT:
        case DEVTRON_DEPLOYMENT_CHART_NAMES.STATEFUL_SET:
            return fallbackGuiSchema
        default:
            return {}
    }
}
