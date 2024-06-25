import { ParentPluginDTO, PluginDataStoreType } from './types'

const parseMinimalPluginVersionsDTO = (
    pluginVersionData: ParentPluginDTO['pluginVersions']['minimalPluginVersionData'],
): PluginDataStoreType['parentPluginStore'][number]['pluginVersions'] => {
    if (!pluginVersionData?.length) {
        return []
    }

    return pluginVersionData.map((pluginVersion) => ({
        id: pluginVersion.id,
        description: pluginVersion.description || '',
        name: pluginVersion.name || '',
        pluginVersion: pluginVersion.pluginVersion || '',
        isLatest: false,
    }))
}

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
        const pluginVersions = parseMinimalPluginVersionsDTO(plugin.pluginVersions.minimalPluginVersionData)
        const latestPluginVersionId = pluginVersions.findIndex((pluginVersion) => pluginVersion.isLatest)

        parentPluginStore[plugin.id] = {
            id: plugin.id,
            name: plugin.name || '',
            description: plugin.description || '',
            type: plugin.type,
            icon: plugin.icon || '',
            latestVersionId: latestPluginVersionId !== -1 ? pluginVersions[latestPluginVersionId].id : null,
            pluginVersions,
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
                icon: plugin.icon || '',
                type: plugin.type,
            }
        })
    })

    return {
        parentPluginStore,
        pluginVersionStore,
    }
}
