import { ROUTES, ResponseType, get, showError } from '../../Common'
import { CIMaterialInfoDTO, CIMaterialInfoType, GetCITriggerInfoParamsType } from './app.types'
import { getParsedCIMaterialInfo } from './utils'

export const getCITriggerInfo = async (params: GetCITriggerInfoParamsType): Promise<CIMaterialInfoType> => {
    try {
        const { result } = (await get(
            `${ROUTES.APP}/material-info/${params.envId}/${params.ciArtifactId}`,
        )) as ResponseType<CIMaterialInfoDTO>

        return getParsedCIMaterialInfo(result)
    } catch (err) {
        showError(err)
        throw err
    }
}

/**
 * The only difference between this and getCITriggerInfo is it doesn't have env and trigger related meta info
 */
export const getArtifactInfo = async (
    params: Pick<GetCITriggerInfoParamsType, 'ciArtifactId'>,
): Promise<CIMaterialInfoType> => {
    try {
        const { result } = (await get(
            `${ROUTES.APP}/material-info/${params.ciArtifactId}`,
        )) as ResponseType<CIMaterialInfoDTO>

        return getParsedCIMaterialInfo(result)
    } catch (err) {
        showError(err)
        throw err
    }
}
