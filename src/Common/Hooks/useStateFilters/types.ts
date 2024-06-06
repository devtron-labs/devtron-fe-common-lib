import { UseUrlFiltersProps, UseUrlFiltersReturnType } from '../useUrlFilters'

export interface UseStateFiltersProps<T> extends Pick<UseUrlFiltersProps<T, never>, 'initialSortKey'> {}

export interface UseStateFiltersReturnType<T>
    extends Pick<
        UseUrlFiltersReturnType<T>,
        'sortBy' | 'sortOrder' | 'handleSorting' | 'clearFilters' | 'searchKey' | 'handleSearch'
    > {}
