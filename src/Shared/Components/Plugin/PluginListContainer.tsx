import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router'
import { APIResponseHandler } from '../APIResponseHandler'
import PluginTagSelect from './PluginTagSelect'
import PluginList from './PluginList'
import { FilterChips } from '../FilterChips'
import { SearchBar, useAsync } from '../../../Common'
import { getAvailablePluginTags, getPluginStoreData } from './service'
import {
    PluginListParamsType,
    PluginListContainerProps,
    PluginListProps,
    PluginListFiltersType,
    PluginListItemType,
} from './types'
import { DEFAULT_PLUGIN_LIST_FILTERS } from './constants'
import { ReactComponent as ICCross } from '../../../Assets/Icon/ic-cross.svg'
import { ReactComponent as ICVisibility } from '../../../Assets/Icon/ic-visibility-on.svg'

const PluginListContainer = ({
    availableTags,
    handleUpdateAvailableTags,
    pluginDataStore,
    handlePluginDataStoreUpdate,
    handlePluginSelection,
    // Selected plugins Section
    isSelectable,
    selectedPluginsMap = {},
    // Plugin list Section
    persistFilters,
    parentPluginList,
    handleParentPluginListUpdate,
    parentTotalCount,
    handleParentTotalCount,
    parentFilters,
    handleUpdateParentFilters,
    rootClassName,
    showCardBorder,
}: Readonly<PluginListContainerProps>) => {
    const { appId } = useParams<PluginListParamsType>()

    const [pluginList, setPluginList] = useState<PluginListItemType[]>(parentPluginList || [])
    const [totalCount, setTotalCount] = useState<number>(parentTotalCount || 0)
    // TODO: Maybe structuredClone is not required
    const [filters, setFilters] = useState<PluginListFiltersType>(
        parentFilters || structuredClone(DEFAULT_PLUGIN_LIST_FILTERS),
    )
    // Have to make a state to trigger clear filters, since filters are not on URL
    // TODO: Ask should it be number since in case of large state it can be a problem
    const [clearSearchTrigger, setClearSearchTrigger] = useState<boolean>(false)
    const [clearTagFilterTrigger, setClearTagFiltersTrigger] = useState<boolean>(false)

    const handlePluginListUpdate = (updatedPluginList: PluginListItemType[]) => {
        setPluginList(updatedPluginList)
        handleParentPluginListUpdate?.(updatedPluginList)
    }

    const handleUpdateTotalCount = (updatedTotalCount: number) => {
        setTotalCount(updatedTotalCount)
        handleParentTotalCount?.(updatedTotalCount)
    }

    const handleUpdateFilters = (updatedFilters: PluginListFiltersType) => {
        setFilters(updatedFilters)
        handleUpdateParentFilters?.(updatedFilters)
    }

    const { searchKey, selectedTags, showSelectedPlugins } = filters || {}

    // TODO: Add abortController as well
    const [isLoadingPluginData, pluginData, pluginDataError, reloadPluginData] = useAsync(
        () =>
            getPluginStoreData({
                searchKey,
                selectedTags,
                offset: 0,
                appId: appId ? +appId : null,
            }),
        // TODO: Test if this is correct since new reference is created every time
        persistFilters ? [pluginList] : [searchKey, appId, selectedTags],
        persistFilters ? !pluginList.length : true,
    )

    const [areTagsLoading, tags, tagsError, reloadTags] = useAsync(
        () => getAvailablePluginTags(appId ? +appId : null),
        [],
        !availableTags?.length,
    )

    useEffect(() => {
        if (!areTagsLoading && !tagsError && tags) {
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
            // TODO: Can convert to map
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

    const handlePersistFiltersChange = () => {
        // Doing this since in case of persistence of filter we have should run as plugin length
        if (persistFilters) {
            handlePluginListUpdate([])
        }
    }

    const handleClearFilters = () => {
        handleUpdateFilters({
            searchKey: '',
            selectedTags: [],
            showSelectedPlugins: false,
        })

        setClearSearchTrigger((prev) => !prev)
        setClearTagFiltersTrigger((prev) => !prev)
        handlePersistFiltersChange()
    }

    const handleSearch = (searchText: string) => {
        handleUpdateFilters({
            ...filters,
            searchKey: searchText,
        })

        handlePersistFiltersChange()
    }

    const handleUpdateSelectedTags = (updatedTags: string[]) => {
        handleUpdateFilters({
            ...filters,
            selectedTags: updatedTags,
        })

        handlePersistFiltersChange()
    }

    const handleRemoveSelectedTag = (filterConfig: Pick<PluginListFiltersType, 'selectedTags'>) => {
        handleUpdateFilters({
            ...filters,
            selectedTags: filterConfig.selectedTags,
        })

        setClearTagFiltersTrigger((prev) => !prev)
        handlePersistFiltersChange()
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

    const handlePluginSelectionWrapper: PluginListProps['handlePluginSelection'] = (parentPluginId) => {
        const isCurrentPluginSelected = isSelectable && selectedPluginsMap[parentPluginId]
        if (isCurrentPluginSelected && Object.keys(selectedPluginsMap).length === 1) {
            handleHideSelectedPlugins()
        }

        handlePluginSelection(parentPluginId)
    }

    const showSelectedPluginFilter = useMemo(
        () => isSelectable && selectedPluginsMap && Object.keys(selectedPluginsMap).length > 0,
        [selectedPluginsMap, isSelectable],
    )

    return (
        <div className={`flexbox-col w-100 ${rootClassName}`}>
            {/* Filters section */}
            <div className="w-100 flexbox dc__gap-12 py-12 dc__position-sticky dc__top-0 bcn-0 dc__zi-1">
                <SearchBar
                    key={`search-bar-key-${Number(clearSearchTrigger)}`}
                    containerClassName="flex-grow-1"
                    handleEnter={handleSearch}
                    inputProps={{
                        placeholder: 'Search plugins',
                    }}
                />

                <PluginTagSelect
                    key={`plugin-tag-select-key-${Number(clearTagFilterTrigger)}`}
                    availableTags={availableTags}
                    handleUpdateSelectedTags={handleUpdateSelectedTags}
                    selectedTags={selectedTags}
                    isLoading={areTagsLoading}
                    hasError={!!tagsError}
                    reloadTags={reloadTags}
                />

                {showSelectedPluginFilter && (
                    <button
                        className={`py-6 px-8 dc__gap-12 flex dc__outline-none-imp dc__tab-focus dc__tab-focus dc__no-shrink ${
                            showSelectedPlugins ? 'bc-n50 dc__border-n1' : 'dc__no-border dc__no-background'
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

            {!!selectedTags.length && (
                <FilterChips<Pick<PluginListFiltersType, 'selectedTags'>>
                    filterConfig={{
                        selectedTags,
                    }}
                    onRemoveFilter={handleRemoveSelectedTag}
                    clearFilters={handleClearFilters}
                    className="p-0 w-100 pt-4"
                    clearButtonClassName="dc__no-background-imp dc__no-border-imp dc__tab-focus"
                    shouldHideLabel
                />
            )}

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
                    handlePluginSelection={handlePluginSelectionWrapper}
                    selectedPluginsMap={selectedPluginsMap}
                    isSelectable={isSelectable}
                    handleClearFilters={handleClearFilters}
                    showCardBorder={showCardBorder}
                />
            </APIResponseHandler>
        </div>
    )
}

export default PluginListContainer
