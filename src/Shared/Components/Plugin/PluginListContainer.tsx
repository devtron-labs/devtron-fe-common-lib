import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router'
import { APIResponseHandler } from '../APIResponseHandler'
import PluginTagSelect from './PluginTagSelect'
import { SearchBar, useAsync } from '../../../Common'
import { getAvailablePluginTags, getPluginStoreData } from './service'
import { PluginListParamsType, PluginListContainerProps, PluginListProps } from './types'
import { ReactComponent as ICCross } from '../../../Assets/Icon/ic-cross.svg'
import { ReactComponent as ICVisibility } from '../../../Assets/Icon/ic-visibility-on.svg'
import PluginList from './PluginList'

const PluginListContainer = ({
    pluginList,
    handlePluginListUpdate,
    filters,
    handleUpdateFilters,
    isSelectable,
    availableTags,
    handleUpdateAvailableTags,
    pluginDataStore,
    handlePluginDataStoreUpdate,
    totalCount,
    handleUpdateTotalCount,
    persistFilters,
    selectedPluginsMap,
    handlePluginSelection,
}: Readonly<PluginListContainerProps>) => {
    const { searchKey, selectedTags, showSelectedPlugins } = filters
    const { appId } = useParams<PluginListParamsType>()

    const pluginDataDependency = persistFilters ? [pluginList] : [searchKey, appId, selectedTags]
    // TODO: Add abortController as well
    const [isLoadingPluginData, pluginData, pluginDataError, reloadPluginData] = useAsync(
        () =>
            getPluginStoreData({
                searchKey,
                selectedTags,
                offset: 0,
                appId: appId ? +appId : undefined,
            }),
        pluginDataDependency,
        persistFilters ? !pluginList.length : true,
    )

    const [areTagsLoading, tags, tagsError, reloadTags] = useAsync(getAvailablePluginTags, [], !availableTags?.length)

    useEffect(() => {
        if (!isLoadingPluginData && !tagsError && pluginData) {
            handleUpdateAvailableTags(tags)
        }
    }, [areTagsLoading, tags, tagsError])

    const handleDataUpdateForPluginResponse: PluginListProps['handleDataUpdateForPluginResponse'] = (
        pluginResponse,
    ) => {
        const clonedPluginDataStore = structuredClone(pluginDataStore)
        const { pluginStore: newPluginStore, totalCount: responseTotalCount } = pluginResponse
        const { parentPluginStore, pluginVersionStore } = newPluginStore

        Object.keys(parentPluginStore).forEach((key) => {
            if (!clonedPluginDataStore.parentPluginStore[key]) {
                clonedPluginDataStore.parentPluginStore[key] = parentPluginStore[key]
            }
        })

        Object.keys(pluginVersionStore).forEach((key) => {
            if (!clonedPluginDataStore.pluginVersionStore[key]) {
                clonedPluginDataStore.pluginVersionStore[key] = pluginVersionStore[key]
            }
        })

        handlePluginDataStoreUpdate(clonedPluginDataStore)
        handleUpdateTotalCount(responseTotalCount)

        const newPluginList: typeof pluginList = structuredClone(pluginList)
        Object.keys(parentPluginStore).forEach((key) => {
            if (!newPluginList.find((plugin) => plugin.parentPluginId === +key)) {
                newPluginList.push({
                    parentPluginId: +key,
                })
            }
        })

        handlePluginListUpdate(newPluginList)
    }

    useEffect(() => {
        // This will be reusable for load more so convert it to a function
        if (!isLoadingPluginData && !pluginDataError && pluginData) {
            handleDataUpdateForPluginResponse(pluginData)
        }
    }, [isLoadingPluginData, pluginData, pluginDataError])

    const handleClearFilters = () => {
        handleUpdateFilters({
            searchKey: '',
            selectedTags: [],
            showSelectedPlugins: false,
        })
    }

    useEffect(
        // TODO: Test this persistFilters value on unmount
        () => () => {
            if (!persistFilters) {
                handleClearFilters()
            }
        },
        [],
    )

    const handleSearch = (searchText: string) => {
        handleUpdateFilters({
            ...filters,
            searchKey: searchText,
        })

        if (persistFilters) {
            handlePluginListUpdate([])
        }
    }

    const handleUpdateSelectedTags = (updatedTags: string[]) => {
        handleUpdateFilters({
            ...filters,
            selectedTags: updatedTags,
        })

        if (persistFilters) {
            handlePluginListUpdate([])
        }
    }

    const handleShowSelectedPlugins = () => {
        handleUpdateFilters({
            ...filters,
            showSelectedPlugins: true,
        })
    }

    const handleHideSelectedPlugins = () => {
        handleUpdateFilters({
            ...filters,
            showSelectedPlugins: false,
        })
    }

    // TODO: Be remember to turn showSelectedPluginFilter as false if count becomes 0
    const showSelectedPluginFilter = useMemo(
        () => isSelectable && selectedPluginsMap && Object.keys(selectedPluginsMap).length > 0,
        [selectedPluginsMap, isSelectable],
    )

    return (
        <div className="flexbox-col dc__overflow-scroll w-100 h-100">
            {/* Filters section */}
            <div className="w-100 flexbox dc__gap-12 py-12">
                <SearchBar
                    containerClassName="flex-grow-1"
                    handleEnter={handleSearch}
                    inputProps={{
                        placeholder: 'Search plugins',
                    }}
                />

                <PluginTagSelect
                    availableTags={availableTags}
                    handleUpdateSelectedTags={handleUpdateSelectedTags}
                    selectedTags={selectedTags}
                    isLoading={areTagsLoading}
                    hasError={!!tagsError}
                    reloadTags={reloadTags}
                />

                {showSelectedPluginFilter && (
                    <button
                        className={`py-6 px-8 dc__gap-12 flex dc__no-border dc__no-background dc__outline-none-imp dc__tab-focus dc__tab-focus ${
                            showSelectedPlugins ? 'bc-n50 dc__border-n1' : ''
                        }`}
                        data-testid="view-only-selected"
                        type="button"
                        onClick={showSelectedPlugins ? handleHideSelectedPlugins : handleShowSelectedPlugins}
                    >
                        {showSelectedPlugins ? (
                            <ICCross className="icon-dim-16 dc__no-shrink" />
                        ) : (
                            <ICVisibility className="icon-dim-16 dc__no-shrink" />
                        )}
                        View only selected
                    </button>
                )}
            </div>

            <APIResponseHandler
                isLoading={isLoadingPluginData}
                error={pluginDataError}
                errorScreenManagerProps={{
                    code: pluginDataError?.code,
                    reload: reloadPluginData,
                }}
            >
                <PluginList
                    pluginDataStore={pluginDataStore}
                    pluginList={pluginList}
                    totalCount={totalCount}
                    handleDataUpdateForPluginResponse={handleDataUpdateForPluginResponse}
                    filters={filters}
                    handlePluginSelection={handlePluginSelection}
                    selectedPluginsMap={selectedPluginsMap}
                    isSelectable={isSelectable}
                    handleClearFilters={handleClearFilters}
                />
            </APIResponseHandler>
        </div>
    )
}

export default PluginListContainer
