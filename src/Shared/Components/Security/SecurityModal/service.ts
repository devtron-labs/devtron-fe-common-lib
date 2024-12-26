import { ROUTES } from '@Common/Constants'
import { getUrlWithSearchParams } from '@Common/Helper'
import { get } from '@Common/Api'
import { ResponseType } from '@Common/Types'
import { ScanResultDTO, AppDetailsPayload } from './types'

export const getSecurityScan = async ({
    appId,
    envId,
    installedAppId,
    artifactId,
    installedAppVersionHistoryId,
}: AppDetailsPayload): Promise<ResponseType<ScanResultDTO>> => {
    const url = getUrlWithSearchParams(ROUTES.SCAN_RESULT, {
        appId,
        envId,
        installedAppId,
        artifactId,
        installedAppVersionHistoryId,
    })
    const response = await get<ScanResultDTO>(url)
    return response
}
