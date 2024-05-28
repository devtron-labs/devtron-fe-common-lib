import { SortingOrder } from '../../Constants'

export interface UseUrlFiltersProps<T, K> {
    /**
     * The key on which the sorting should be applied
     */
    initialSortKey?: T
    /**
     * Callback function for parsing the search params
     */
    parseSearchParams?: (searchParams: URLSearchParams) => K
}

export type UseUrlFiltersReturnType<T, K = unknown> = K & {
    /**
     * Currently applied page size
     */
    pageSize: number
    /**
     * Handler for updating the current page
     */
    changePage: (pageNumber: number) => void
    /**
     * Handler for updating the current page size
     */
    changePageSize: (pageSize: number) => void
    /**
     * Current search key
     */
    searchKey: string
    /**
     * Handler for updating the search
     */
    handleSearch: (searchKey: string) => void
    /**
     * Computed offset using the pageSize and pageNumber
     *
     * Note: Used in pagination component
     */
    offset: number
    /**
     * Key on which the sorting is applied
     */
    sortBy: T
    /**
     * Current sort order
     */
    sortOrder: SortingOrder
    /**
     * Handle the sorting type change / key change
     */
    handleSorting: (sortBy: T) => void
    /**
     * Clear all the applied filters
     */
    clearFilters: () => void
    /**
     * Update the search params with the passed object
     */
    updateSearchParams: (paramsToSerialize: Partial<K>) => void
}
