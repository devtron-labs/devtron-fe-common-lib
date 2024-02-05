import { SortingOrder } from '../../Constants'

export interface UseUrlFiltersProps<T> {
    /**
     * The key on which the sorting should be applied
     */
    initialSortKey?: T
}

export interface UseUrlFiltersReturnType<T> {
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
}
