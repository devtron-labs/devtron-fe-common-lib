import { ResponseType, post, ROUTES, get } from '../../../Common'
import { ServerInfoResponse } from './types'

export const updatePostHogEvent = (payload): Promise<ResponseType> => post(ROUTES.TELEMETRY_EVENT, payload)

let serverInfo: ServerInfoResponse

const isValidServerInfo = (_serverInfo: ServerInfoResponse): boolean =>
    !!(_serverInfo?.result && _serverInfo.result.releaseName && _serverInfo.result.installationType)

const getSavedServerInfo = (): ServerInfoResponse => {
    if (!isValidServerInfo(serverInfo)) {
        if (typeof Storage !== 'undefined' && localStorage.serverInfo) {
            const _serverInfoFromLS = JSON.parse(localStorage.serverInfo)
            if (isValidServerInfo(_serverInfoFromLS)) {
                serverInfo = _serverInfoFromLS
            }
        }
    }
    return serverInfo
}

export const getServerInfo = async (withoutStatus: boolean, isFormHeader: boolean): Promise<ServerInfoResponse> => {
    if (withoutStatus && !isFormHeader) {
        const _serverInfo = getSavedServerInfo()
        if (_serverInfo) {
            return Promise.resolve(_serverInfo)
        }
    }
    const response = await get(`${ROUTES.SERVER_INFO_API}${withoutStatus ? '?showServerStatus=false' : ''}`)
    serverInfo = response
    if (typeof Storage !== 'undefined') {
        localStorage.serverInfo = JSON.stringify(serverInfo)
    }
    return Promise.resolve(response)
}
