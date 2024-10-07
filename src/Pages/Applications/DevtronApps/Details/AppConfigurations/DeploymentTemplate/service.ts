import YAML from 'yaml'
import { showError, YAMLStringify } from '@Common/Helper'
import { getIsRequestAborted, post } from '@Common/Api'
import { ROUTES } from '@Common/Constants'
import { ResponseType } from '@Common/Types'
import {
    GetDeploymentManifestPayloadType,
    GetDeploymentManifestProps,
    GetResolvedDeploymentTemplatePayloadType,
    GetResolvedDeploymentTemplateProps,
    GetResolvedDeploymentTemplateReturnType,
    ResolvedDeploymentTemplateDTO,
    ValuesAndManifestFlagDTO,
} from './types'

export const getDeploymentManifest = async (
    params: GetDeploymentManifestProps,
): Promise<ResponseType<ResolvedDeploymentTemplateDTO>> => {
    try {
        const payload: GetDeploymentManifestPayloadType = {
            ...params,
            valuesAndManifestFlag: ValuesAndManifestFlagDTO.MANIFEST,
        }

        return post<ResolvedDeploymentTemplateDTO>(ROUTES.APP_TEMPLATE_DATA, payload)
    } catch (error) {
        showError(error)
        throw error
    }
}

export const getResolvedDeploymentTemplate = async (
    params: GetResolvedDeploymentTemplateProps,
    signal?: AbortSignal,
): Promise<GetResolvedDeploymentTemplateReturnType> => {
    try {
        const payload: GetResolvedDeploymentTemplatePayloadType = {
            ...params,
            valuesAndManifestFlag: ValuesAndManifestFlagDTO.DEPLOYMENT_TEMPLATE,
        }

        const { result } = await post<ResolvedDeploymentTemplateDTO>(ROUTES.APP_TEMPLATE_DATA, payload, {
            signal,
        })
        const areVariablesPresent = Object.keys(result.variableSnapshot || {}).length > 0

        const parsedData = YAML.parse(result.data)
        const parsedResolvedData = YAML.parse(result.resolvedData)

        return {
            data: YAMLStringify(parsedData),
            resolvedData: YAMLStringify(parsedResolvedData),
            areVariablesPresent,
        }
    } catch (error) {
        if (!getIsRequestAborted(error)) {
            showError(error)
            throw error
        }
        return null
    }
}
