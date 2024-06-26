import { useState } from 'react'
import { PluginListProps } from './types'
import { DetectBottom } from '../DetectBottom'
import { GenericEmptyState, GenericFilterEmptyState, showError } from '../../../Common'
import { getPluginStoreData } from './service'
import PluginCard from './PluginCard'

const PluginList = ({
    pluginDataStore,
    pluginList,
    totalCount,
    handleDataUpdateForPluginResponse,
    filters: { selectedTags, searchKey, showSelectedPlugins },
    handlePluginSelection,
    selectedPluginsMap,
    isSelectable,
    handleClearFilters,
}: PluginListProps) => {
    const [isLoadingMorePlugins, setIsLoadingMorePlugins] = useState<boolean>(false)
    const handleLoadMore = async () => {
        setIsLoadingMorePlugins(true)
        try {
            const pluginDataResponse = await getPluginStoreData({
                searchKey,
                offset: pluginList.length,
                selectedTags,
                appId: undefined,
            })

            handleDataUpdateForPluginResponse(pluginDataResponse)
        } catch (error) {
            showError(error)
        } finally {
            setIsLoadingMorePlugins(false)
        }
    }

    if (!pluginList.length) {
        if (!!searchKey || !selectedTags.length) {
            return <GenericFilterEmptyState handleClearFilters={handleClearFilters} />
        }

        // Not going to happen but still handling in case of any issue that might arise
        return (
            <GenericEmptyState title="No plugins found" subTitle="We are unable to locate any plugin in our system" />
        )
    }

    // selectedPluginsMap should always be present if s
    if (showSelectedPlugins) {
        return (
            <>
                {Object.keys(selectedPluginsMap).map((pluginId) => (
                    <PluginCard
                        key={pluginId}
                        parentPluginId={+pluginId}
                        isSelectable={isSelectable}
                        pluginDataStore={pluginDataStore}
                        handlePluginSelection={handlePluginSelection}
                        isSelected
                    />
                ))}
            </>
        )
    }

    return (
        <>
            {pluginList.map((plugin) => (
                <PluginCard
                    key={plugin.parentPluginId}
                    parentPluginId={plugin.parentPluginId}
                    isSelectable={isSelectable}
                    pluginDataStore={pluginDataStore}
                    handlePluginSelection={handlePluginSelection}
                    isSelected={!!selectedPluginsMap[plugin.parentPluginId]}
                />
            ))}

            {totalCount > pluginList.length && !isLoadingMorePlugins && <DetectBottom callback={handleLoadMore} />}
        </>
    )
}

export default PluginList
