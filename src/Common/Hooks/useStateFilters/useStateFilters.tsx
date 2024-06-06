import { useState } from 'react'
import { SortingOrder } from '../../Constants'
import { UseStateFiltersProps, UseStateFiltersReturnType } from './types'

/**
 * Generic hook for implementing state based pagination, search, sorting.
 * Sister method of [useUrlFilters](https://github.com/devtron-labs/devtron-fe-common-lib/blob/main/src/Common/Hooks/useUrlFilters/useUrlFilters.ts)
 *
 * The exposed handlers can be consumed directly without the need for explicit state management
 *
 * @example Usage with custom type for sort keys and initial sort key:
 * ```tsx
 * const  { sortBy, sortOrder } = useUrlFilters<'email' | 'name'>({ initialSortKey: 'email' })
 * ```
 *
 * To be extended to be used with pagination and search as and when required
 */
const useStateFilters = <T = string,>({
    initialSortKey,
}: UseStateFiltersProps<T> = {}): UseStateFiltersReturnType<T> => {
    const [sortingConfig, setSortingConfig] = useState({
        sortOrder: SortingOrder.ASC,
        sortBy: initialSortKey,
    })
    const [searchKey, setSearchKey] = useState('')

    const { sortBy, sortOrder } = sortingConfig

    const handleSorting = (_sortBy: T) => {
        let order: SortingOrder

        if (_sortBy === sortBy && sortOrder === SortingOrder.ASC) {
            order = SortingOrder.DESC
        } else {
            order = SortingOrder.ASC
        }

        setSortingConfig(() => ({
            ...sortingConfig,
            sortBy: _sortBy,
            sortOrder: order,
        }))
    }

    const handleSearch = (searchTerm: string) => {
        setSearchKey(searchTerm?.trim() ?? '')
    }

    const clearFilters = () => {
        setSearchKey('')
        setSortingConfig({
            sortOrder: SortingOrder.ASC,
            sortBy: initialSortKey,
        })
    }

    return {
        ...sortingConfig,
        handleSorting,
        searchKey,
        handleSearch,
        clearFilters,
    }
}

export default useStateFilters
