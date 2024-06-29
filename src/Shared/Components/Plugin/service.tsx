import { get, getUrlWithSearchParams, ResponseType, ROUTES, showError } from '../../../Common'
import { stringComparatorBySortOrder } from '../../Helpers'
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
}: PluginDetailPayloadType): Promise<PluginDetailDTO> => {
    try {
        // TODO: Add type for payload as well and return parsed data itself
        // Can parse the response here itself
        const { result } = (await get(
            getUrlWithSearchParams(ROUTES.PLUGIN_GLOBAL_LIST_DETAIL_V2, {
                appId,
                parentPluginId,
                pluginId,
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
    selectedTags,
    appId,
    offset = 0,
}: GetPluginStoreDataServiceParamsType): Promise<GetPluginStoreDataReturnType> => {
    try {
        const payload: GetPluginListPayloadType = {
            searchKey,
            offset,
            appId,
            size: 20,
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

export const getAvailablePluginTags = async (appId: number): Promise<string[]> => {
    try {
        const { result } = (await get(
            getUrlWithSearchParams(ROUTES.PLUGIN_GLOBAL_LIST_TAGS, { appId }),
        )) as ResponseType<PluginTagNamesDTO>
        if (!result?.tagNames) {
            return []
        }
        return result.tagNames.sort(stringComparatorBySortOrder)
    } catch (error) {
        showError(error)
        throw error
    }
}
