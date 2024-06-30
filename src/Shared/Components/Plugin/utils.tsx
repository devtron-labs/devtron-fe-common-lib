import { cloneElement } from 'react'
import { components, ValueContainerProps } from 'react-select'
import { ParentPluginDTO, PluginCreationType, PluginDataStoreType } from './types'
import { ReactComponent as ICSearch } from '../../../Assets/Icon/ic-search.svg'
import { ReactComponent as ICFilter } from '../../../Assets/Icon/ic-filter.svg'
import { ReactComponent as ICFilterApplied } from '../../../Assets/Icon/ic-filter-applied.svg'
import { OptionType } from '../../../Common'

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
        isLatest: pluginVersion.isLatest || false,
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
            pluginVersionStore[pluginVersionData.id] = {
                id: pluginVersionData.id,
                name: pluginVersionData.name || '',
                description: pluginVersionData.description || '',
                pluginVersion: pluginVersionData.pluginVersion || '',
                docLink: pluginVersionData.docLink || '',
                updatedBy: plugin.type === PluginCreationType.SHARED ? pluginVersionData.updatedBy : 'Devtron',
                outputVariables: pluginVersionData.outputVariables || [],
                inputVariables: pluginVersionData.inputVariables || [],
                isLatest: pluginVersionData.isLatest || false,
                // TODO: can add unique check and sort them alphabetically
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

export const PluginTagSelectValueContainer = (props: ValueContainerProps<OptionType[]>) => {
    const { children, selectProps } = props

    const renderContainer = () => {
        if (selectProps.menuIsOpen) {
            if (!selectProps.inputValue) {
                return (
                    <>
                        <ICSearch className="icon-dim-16 dc__no-shrink mr-4 mw-18" />
                        <span className="dc__position-abs dc__left-35 cn-5 ml-2">{selectProps.placeholder}</span>
                    </>
                )
            }

            return <ICSearch className="icon-dim-16 dc__no-shrink mr-4 mw-18" />
        }

        if (selectProps.value.length) {
            return (
                <>
                    <ICFilterApplied className="icon-dim-16 dc__no-shrink mr-4 mw-18" />
                    <span className="dc__position-abs dc__left-35 cn-9 fs-13 fw-4 lh-20">Category</span>
                </>
            )
        }

        return (
            <>
                <ICFilter className="icon-dim-16 dc__no-shrink mr-4 mw-18" />
                <span className="dc__position-abs dc__left-35 cn-5 fs-13 fw-4 lh-20">Category</span>
            </>
        )
    }

    return (
        <components.ValueContainer {...props}>
            <div className="flexbox dc__align-items-center">
                {renderContainer()}
                {cloneElement(children[1])}
            </div>
        </components.ValueContainer>
    )
}
