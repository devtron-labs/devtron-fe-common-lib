import { get, post } from '@Common/Api'
import { ROUTES } from '@Common/Constants'
import { ResponseType } from '@Common/Types'
import { TemplateListDTO } from '@Shared/Services'

export function getOptions(appId: number, envId: number): Promise<ResponseType<TemplateListDTO[]>> {
    return get(`${ROUTES.DEPLOYMENT_OPTIONS}?appId=${appId}&envId=${envId}`)
}

export function getChartReferencesForAppAndEnv(appId: number, envId?: number): Promise<ResponseType> {
    let envParam = ''
    if (envId) {
        envParam = `/${envId}`
    }
    return get(`${ROUTES.CHART_REFERENCES_MIN}/${appId}${envParam}`)
}

export function getDeploymentManifest(request) {
    return post(`${ROUTES.DEPLOYMENT_VALUES_MANIFEST}`, request)
}
