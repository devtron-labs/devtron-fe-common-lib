import { ParentPluginDTO, PluginCreationType, PluginDataStoreType } from './types'
import { commonSelectStyles } from '../ReactSelect'
import { stringComparatorBySortOrder } from '../../Helpers'
import { DEFAULT_PLUGIN_CREATED_BY } from './constants'

const parseMinimalPluginVersionsDTO = (
    pluginVersionData: ParentPluginDTO['pluginVersions']['minimalPluginVersionData'],
): PluginDataStoreType['parentPluginStore'][number]['pluginVersions'] => {
    if (!pluginVersionData?.length) {
        return []
    }

    return pluginVersionData.map(({ id, description, name, pluginVersion, isLatest }) => ({
        id,
        description: description || '',
        name: name || '',
        pluginVersion: pluginVersion || '',
        isLatest: isLatest || false,
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
        const latestPluginVersionIndex = pluginVersions.findIndex((pluginVersion) => pluginVersion.isLatest)

        // Adding this check to ensure better debugging in case backend panics
        if (latestPluginVersionIndex === -1) {
            throw new Error('Latest plugin version not found')
        }

        parentPluginStore[plugin.id] = {
            id: plugin.id,
            name: plugin.name || '',
            description: plugin.description || '',
            type: plugin.type,
            icon: plugin.icon || '',
            // Assuming latest version is always present
            latestVersionId: pluginVersions[latestPluginVersionIndex].id,
            pluginVersions,
        }

        plugin.pluginVersions.detailedPluginVersionData.forEach((pluginVersionData) => {
            const targetTags = pluginVersionData.tags || []
            const sortedUniqueTags = Array.from(new Set(targetTags)).sort(stringComparatorBySortOrder)

            pluginVersionStore[pluginVersionData.id] = {
                id: pluginVersionData.id,
                name: pluginVersionData.name || '',
                description: pluginVersionData.description || '',
                pluginVersion: pluginVersionData.pluginVersion || '',
                docLink: pluginVersionData.docLink || '',
                updatedBy:
                    plugin.type === PluginCreationType.SHARED ? pluginVersionData.updatedBy : DEFAULT_PLUGIN_CREATED_BY,
                outputVariables: pluginVersionData.outputVariables || [],
                inputVariables: pluginVersionData.inputVariables || [],
                isLatest: pluginVersionData.isLatest || false,
                tags: sortedUniqueTags,
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

export const pluginTagSelectStyles = {
    ...commonSelectStyles,
    option: (base, state) => ({
        ...base,
        height: '36px',
        padding: '8px 12px',
        backgroundColor: state.isFocused ? 'var(--N100)' : 'white',
        color: 'var(--N900)',
        cursor: 'pointer',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',

        ':active': {
            backgroundColor: 'var(--N100)',
        },
    }),
}
