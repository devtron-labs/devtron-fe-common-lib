import { get, getUrlWithSearchParams, ResponseType, ROUTES, showError } from '../../../Common'
import { PluginDetailDTO, PluginDetailPayloadType } from './types'

export const getPluginsDetail = async ({
    appId,
    parentPluginId,
    pluginId,
    fetchLatestVersionDetails,
}: PluginDetailPayloadType): Promise<PluginDetailDTO> => {
    try {
        const { result } = (await get(
            getUrlWithSearchParams(ROUTES.PLUGIN_GLOBAL_DETAIL, {
                appId,
                parentPluginId,
                pluginId,
                fetchLatestVersionDetails,
            }),
        )) as ResponseType<PluginDetailDTO>
        return result
    } catch (error) {
        showError(error)
        throw error
    }
}
