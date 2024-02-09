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
    pageSize: number
    changePage: (pageNumber: number) => void
    changePageSize: (pageSize: number) => void
    searchKey: string
    handleSearch: (searchKey: string) => void
    offset: number
    sortBy: T
    sortOrder: SortingOrder
    handleSorting: (sortBy: T) => void
    clearFilters: () => void
    updateSearchParams: (paramsToSerialize: K) => void
}
