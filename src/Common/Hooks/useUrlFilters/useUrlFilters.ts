/*
 * Copyright (c) 2024. Devtron Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useMemo, useRef } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import { getUrlWithSearchParams } from '@Common/Helper'

import { DEFAULT_BASE_PAGE_SIZE, EXCLUDED_FALSY_VALUES, SortingOrder } from '../../Constants'
import { DEFAULT_PAGE_NUMBER, URL_FILTER_KEYS } from './constants'
import { UpdateSearchParamsOptionsType, UseUrlFiltersProps, UseUrlFiltersReturnType } from './types'
import { areAnyAdditionalFiltersApplied, setItemInLocalStorageIfKeyExists } from './utils'

const { PAGE_SIZE, PAGE_NUMBER, SEARCH_KEY, SORT_BY, SORT_ORDER } = URL_FILTER_KEYS

/**
 * Generic hook for implementing URL based filters.
 * eg: pagination, search, sort.
 *
 * The exposed handlers can be consumed directly without the need for explicit state management
 *
 * @example Default Usage:
 * ```tsx
 * const { pageSize, changePage, ...rest } = useUrlFilters()
 * ```
 *
 * @example Usage with custom type for sort keys and initial sort key:
 * ```tsx
 * const  { sortBy, sortOrder } = useUrlFilters<'email' | 'name'>({ initialSortKey: 'email' })
 * ```
 *
 */

const useUrlFilters = <T = string, K = {}>({
    initialSortKey,
    parseSearchParams,
    localStorageKey,
    redirectionMethod = 'replace',
    defaultPageSize = DEFAULT_BASE_PAGE_SIZE,
}: UseUrlFiltersProps<T, K> = {}): UseUrlFiltersReturnType<T, K> => {
    const location = useLocation()
    const history = useHistory()

    const isAlreadyReadFromLocalStorage = useRef<boolean>(false)

    const getSearchParams = () => {
        const locationSearchParams = new URLSearchParams(location.search)
        if (!isAlreadyReadFromLocalStorage.current && localStorageKey) {
            if (!location.search) {
                isAlreadyReadFromLocalStorage.current = true
                const localStorageValue = localStorage.getItem(localStorageKey)
                if (localStorageValue) {
                    try {
                        const localSearchString = getUrlWithSearchParams('', JSON.parse(localStorageValue))
                        const localSearchParams = new URLSearchParams(localSearchString.split('?')[1] ?? '')

                        // This would remain replace since the initial value is being set from local storage
                        history.replace({ search: localSearchParams.toString() })
                        return localSearchParams
                    } catch {
                        localStorage.removeItem(localStorageKey)
                    }
                }
            } else {
                setItemInLocalStorageIfKeyExists(
                    localStorageKey,
                    JSON.stringify(parseSearchParams(locationSearchParams)),
                )
            }
        }

        return locationSearchParams
    }

    const searchParams = getSearchParams()

    const getParsedSearchParams: UseUrlFiltersProps<T, K>['parseSearchParams'] = (searchParamsToParse) => {
        if (parseSearchParams) {
            return parseSearchParams(searchParamsToParse)
        }

        return {} as K
    }

    const { pageSize, pageNumber, searchKey, sortBy, sortOrder, parsedParams } = useMemo(() => {
        const _pageSize = searchParams.get(PAGE_SIZE)
        const _pageNumber = searchParams.get(PAGE_NUMBER)
        const _searchKey = searchParams.get(SEARCH_KEY)
        const _sortOrder = searchParams.get(SORT_ORDER) as SortingOrder
        const _sortBy = searchParams.get(SORT_BY)

        const sortByKey = (_sortBy || initialSortKey || '') as T
        // Fallback to ascending order
        const sortByOrder = Object.values(SortingOrder).includes(_sortOrder) ? _sortOrder : SortingOrder.ASC

        const _parsedParams = getParsedSearchParams(searchParams)

        return {
            pageSize: Number(_pageSize) || defaultPageSize,
            pageNumber: Number(_pageNumber) || DEFAULT_PAGE_NUMBER,
            searchKey: _searchKey || '',
            sortBy: sortByKey,
            // sort order should only be applied if the key is available
            sortOrder: (sortByKey ? sortByOrder : '') as SortingOrder,
            parsedParams: _parsedParams,
        }
    }, [searchParams])

    /**
     * Used for getting the required result from the API
     */
    const offset = pageSize * (pageNumber - 1)

    const updateFiltersInUrl = (updatedSearchString: string, options: UpdateSearchParamsOptionsType<T, K>) => {
        const params = { search: updatedSearchString }
        const methodForRedirection = options.redirectionMethod ?? redirectionMethod

        if (methodForRedirection === 'push') {
            history.push(params)
        } else {
            history.replace(params)
        }
    }

    /**
     * Update and replace the search params in the URL.
     *
     * Note: Currently only primitive data types are supported
     */
    const _updateSearchParam = (key: string, value: unknown, options: UpdateSearchParamsOptionsType<T, K> = {}) => {
        searchParams.set(key, String(value))
        updateFiltersInUrl(searchParams.toString(), options)
    }

    const _resetPageNumber = (options: UpdateSearchParamsOptionsType<T, K> = {}) => {
        if (pageNumber !== DEFAULT_PAGE_NUMBER) {
            _updateSearchParam(PAGE_NUMBER, DEFAULT_PAGE_NUMBER, options)
            return
        }

        updateFiltersInUrl(searchParams.toString(), options)
    }

    const changePage = (page: number) => {
        _updateSearchParam(PAGE_NUMBER, page)
    }

    const changePageSize = (_pageSize: number) => {
        _updateSearchParam(PAGE_SIZE, _pageSize)
        _resetPageNumber()
    }

    const handleSearch = (searchTerm: string) => {
        _updateSearchParam(SEARCH_KEY, searchTerm)
        _resetPageNumber()
    }

    const handleSorting = (_sortBy: T) => {
        let order: SortingOrder
        if (_sortBy === sortBy && sortOrder === SortingOrder.ASC) {
            order = SortingOrder.DESC
        } else {
            order = SortingOrder.ASC
        }

        _updateSearchParam(SORT_BY, _sortBy)
        _updateSearchParam(SORT_ORDER, order)

        // Reset page number on sorting change
        _resetPageNumber()
    }

    const clearFilters = () => {
        updateFiltersInUrl('', {})
        if (localStorageKey) {
            localStorage.removeItem(localStorageKey)
        }
    }

    const updateSearchParams = (paramsToSerialize: Partial<K>, options: UpdateSearchParamsOptionsType<T, K> = {}) => {
        Object.keys(paramsToSerialize).forEach((key) => {
            if (!EXCLUDED_FALSY_VALUES.includes(paramsToSerialize[key])) {
                if (Array.isArray(paramsToSerialize[key])) {
                    searchParams.delete(key)
                    paramsToSerialize[key].forEach((val) => {
                        searchParams.append(key, val)
                    })
                } else {
                    searchParams.set(key, paramsToSerialize[key])
                }
            } else {
                searchParams.delete(key)
            }
        })
        // Skipping primary params => pageSize, pageNumber, searchKey, sortBy, sortOrder
        setItemInLocalStorageIfKeyExists(localStorageKey, JSON.stringify(getParsedSearchParams(searchParams)))
        // Not replacing the params as it is being done by _resetPageNumber
        _resetPageNumber(options)
    }

    return {
        pageSize,
        changePage,
        changePageSize,
        searchKey,
        handleSearch,
        offset,
        sortBy,
        sortOrder,
        handleSorting,
        clearFilters,
        ...parsedParams,
        updateSearchParams,
        areFiltersApplied: !!searchKey || areAnyAdditionalFiltersApplied(parsedParams),
    }
}

export default useUrlFilters
