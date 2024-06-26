import { get, getUrlWithSearchParams, ResponseType, ROUTES, showError } from '../../../Common'
import {
    GetPluginListPayloadType,
    GetPluginStoreDataReturnType,
    GetPluginStoreDataServiceParamsType,
    PluginDetailDTO,
    PluginDetailPayloadType,
    PluginTagNamesDTO,
} from './types'
import { parsePluginDetailsDTOIntoPluginStore } from './utils'

export const getPluginsDetail = async ({
    appId,
    parentPluginId,
    pluginId,
    // TODO: Can make it true by default
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

export const getPluginStoreData = async ({
    searchKey,
    offset = 0,
    selectedTags,
    appId,
}: GetPluginStoreDataServiceParamsType): Promise<GetPluginStoreDataReturnType> => {
    try {
        const payload: GetPluginListPayloadType = {
            searchKey,
            offset,
            appId,
            size: 20,
            fetchLatestVersionDetails: true,
            tag: selectedTags,
        }
        const { result } = (await get(
            getUrlWithSearchParams(ROUTES.PLUGIN_GLOBAL_LIST_V2, payload),
        )) as ResponseType<PluginDetailDTO>

        const pluginStore = parsePluginDetailsDTOIntoPluginStore(result.parentPlugins)
        return {
            totalCount: result.totalCount,
            pluginStore,
        }
    } catch (error) {
        showError(error)
        throw error
    }
}

export const getAvailablePluginTags = async (): Promise<string[]> => {
    try {
        const { result } = (await get(ROUTES.PLUGIN_GLOBAL_LIST_TAGS)) as ResponseType<PluginTagNamesDTO>
        if (!result?.tagNames) {
            return []
        }
        return result.tagNames
    } catch (error) {
        showError(error)
        throw error
    }
}
