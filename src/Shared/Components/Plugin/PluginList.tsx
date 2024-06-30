import { useState } from 'react'
import { useParams } from 'react-router'
import PluginCard from './PluginCard'
import { DetectBottom } from '../DetectBottom'
import PluginCardSkeletonList from './PluginCardSkeletonList'
import { PluginListParamsType, PluginListProps } from './types'
import { GenericEmptyState, GenericFilterEmptyState, showError } from '../../../Common'
import { getPluginStoreData } from './service'

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
    showCardBorder,
}: PluginListProps) => {
    const { appId } = useParams<PluginListParamsType>()

    const [isLoadingMorePlugins, setIsLoadingMorePlugins] = useState<boolean>(false)
    const handleLoadMore = async () => {
        setIsLoadingMorePlugins(true)
        try {
            const pluginDataResponse = await getPluginStoreData({
                searchKey,
                offset: pluginList.length,
                selectedTags,
                appId: appId ? +appId : null,
            })

            handleDataUpdateForPluginResponse(pluginDataResponse, true)
        } catch (error) {
            showError(error)
        } finally {
            setIsLoadingMorePlugins(false)
        }
    }

    if (!pluginList.length) {
        if (!!searchKey || !!selectedTags.length) {
            return <GenericFilterEmptyState handleClearFilters={handleClearFilters} />
        }

        // Not going to happen but still handling in case of any issue that might arise
        return (
            <GenericEmptyState title="No plugins found" subTitle="We are unable to locate any plugin in our system" />
        )
    }

    // selectedPluginsMap should always be present if isSelectable is true
    if (showSelectedPlugins) {
        // TODO: Ask with product, filters and search can cause conflicting state

        return (
            <>
                {Object.keys(selectedPluginsMap).map((parentPluginId) => (
                    <PluginCard
                        key={parentPluginId}
                        parentPluginId={+parentPluginId}
                        isSelectable={isSelectable}
                        pluginDataStore={pluginDataStore}
                        handlePluginSelection={handlePluginSelection}
                        showCardBorder={showCardBorder}
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
                    showCardBorder={showCardBorder}
                />
            ))}

            {isLoadingMorePlugins && <PluginCardSkeletonList />}

            {/* TODO: Handle on error */}
            {totalCount > pluginList.length && !isLoadingMorePlugins && <DetectBottom callback={handleLoadMore} />}
        </>
    )
}

export default PluginList
