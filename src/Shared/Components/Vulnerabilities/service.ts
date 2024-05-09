import { ROUTES, get, getUrlWithSearchParams } from '../../../Common'
import { LastExecutionResponseType } from '../../types'
import { parseLastExecutionResponse } from './utils'

export function getLastExecutionByArtifactAppEnv(
    artifactId: string | number,
    appId: number | string,
    envId: number | string,
): Promise<LastExecutionResponseType> {
    return get(
        getUrlWithSearchParams(ROUTES.SECURITY_SCAN_EXECUTION_DETAILS, {
            artifactId,
            appId,
            envId,
        }),
    ).then((response) => parseLastExecutionResponse(response))
}
