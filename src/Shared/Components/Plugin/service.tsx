import { get, getIsRequestAborted, getUrlWithSearchParams, ResponseType, ROUTES, showError } from '../../../Common'
import { stringComparatorBySortOrder } from '../../Helpers'
import {
    GetPluginListPayloadType,
    GetPluginStoreDataReturnType,
    GetPluginStoreDataServiceParamsType,
    GetPluginTagsPayloadType,
    PluginDetailDTO,
    PluginDetailPayloadType,
    PluginDetailServiceParamsType,
    PluginTagNamesDTO,
} from './types'
import { parsePluginDetailsDTOIntoPluginStore } from './utils'

export const getPluginsDetail = async ({
    appId,
    parentPluginIds,
    pluginIds,
}: PluginDetailServiceParamsType): Promise<Pick<GetPluginStoreDataReturnType, 'pluginStore'>> => {
    try {
        const payload: PluginDetailPayloadType = {
            appId,
            parentPluginId: parentPluginIds,
            pluginId: pluginIds,
        }

        const { result } = (await get(
            getUrlWithSearchParams(ROUTES.PLUGIN_GLOBAL_LIST_DETAIL_V2, payload),
        )) as ResponseType<PluginDetailDTO>

        const pluginStore = parsePluginDetailsDTOIntoPluginStore(result?.parentPlugins)

        return {
            pluginStore,
        }
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
    signal,
}: GetPluginStoreDataServiceParamsType): Promise<GetPluginStoreDataReturnType> => {
    try {
        const payload: GetPluginListPayloadType = {
            searchKey,
            offset,
            appId,
            size: 20,
            tag: selectedTags,
        }
        const { result } = (await get(getUrlWithSearchParams(ROUTES.PLUGIN_GLOBAL_LIST_V2, payload), {
            signal,
        })) as ResponseType<PluginDetailDTO>

        const pluginStore = parsePluginDetailsDTOIntoPluginStore(result?.parentPlugins)
        return {
            totalCount: result?.totalCount || 0,
            pluginStore,
        }
    } catch (error) {
        if (!getIsRequestAborted(error)) {
            showError(error)
        }
        throw error
    }
}

export const getAvailablePluginTags = async (appId: number): Promise<string[]> => {
    try {
        const payload: GetPluginTagsPayloadType = {
            appId,
        }

        const { result } = (await get(
            getUrlWithSearchParams(ROUTES.PLUGIN_GLOBAL_LIST_TAGS, payload),
        )) as ResponseType<PluginTagNamesDTO>

        if (!result?.tagNames) {
            return []
        }

        const uniqueTags = new Set(result.tagNames)
        return Array.from(uniqueTags).sort(stringComparatorBySortOrder)
    } catch (error) {
        showError(error)
        throw error
    }
}
