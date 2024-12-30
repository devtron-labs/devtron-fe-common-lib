import { ROUTES } from '@Common/Constants'
import { getUrlWithSearchParams } from '@Common/Helper'
import { get } from '@Common/Api'
import { ResponseType } from '@Common/Types'
import { ScanResultDTO, ScanResultParamsType } from './types'

export const getSecurityScan = async ({
    appId,
    envId,
    installedAppId,
    artifactId,
    installedAppVersionHistoryId,
}: ScanResultParamsType): Promise<ResponseType<ScanResultDTO>> => {
    const params: ScanResultParamsType = {
        appId,
        envId,
        installedAppId,
        artifactId,
        installedAppVersionHistoryId,
    }
    const url = getUrlWithSearchParams(ROUTES.SCAN_RESULT, params)
    const response = await get<ScanResultDTO>(url)
    return response
}
