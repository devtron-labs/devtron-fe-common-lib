import { PluginDataStoreType, PluginListFiltersType } from './types'

export const DEFAULT_PLUGIN_DATA_STORE: PluginDataStoreType = {
    parentPluginStore: {},
    pluginVersionStore: {},
}

export const DEFAULT_PLUGIN_LIST_FILTERS: PluginListFiltersType = {
    searchKey: '',
    selectedTags: [],
    offset: 0,
    showSelectedPlugins: false,
}
