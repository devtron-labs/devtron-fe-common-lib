import { ParentPluginDTO, PluginDataStoreType } from './types'

export const parsePluginDetailsDTOIntoPluginStore = (pluginData: ParentPluginDTO[]): PluginDataStoreType => {
    if (!pluginData?.length) {
        return {
            parentPluginStore: {},
            pluginVersionStore: {},
        }
    }

    const parentPluginStore: PluginDataStoreType['parentPluginStore'] = {}
    const pluginVersionStore: PluginDataStoreType['pluginVersionStore'] = {}

    pluginData.forEach((plugin) => {
        parentPluginStore[plugin.id] = {
            id: plugin.id,
            name: plugin.name || '',
            description: plugin.description || '',
            type: plugin.type,
            icon: plugin.icon || '',
        }

        plugin.pluginVersions.detailedPluginVersionData.forEach((pluginVersionData) => {
            pluginVersionStore[pluginVersionData.id] = {
                id: pluginVersionData.id,
                name: pluginVersionData.name || '',
                description: pluginVersionData.description || '',
                pluginVersion: pluginVersionData.pluginVersion || '',
                docLink: pluginVersionData.docLink || '',
                updatedBy: pluginVersionData.updatedBy,
                outputVariables: pluginVersionData.outputVariables || [],
                inputVariables: pluginVersionData.inputVariables || [],
                isLatest: pluginVersionData.isLatest || false,
                tags: pluginVersionData.tags || [],
                parentPluginId: plugin.id,
            }
        })
    })

    return {
        parentPluginStore,
        pluginVersionStore,
    }
}
