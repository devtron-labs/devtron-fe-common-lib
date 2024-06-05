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

    const clearFilters = () => {
        setSortingConfig({
            sortOrder: SortingOrder.ASC,
            sortBy: initialSortKey,
        })
    }

    return {
        ...sortingConfig,
        handleSorting,
        clearFilters,
    }
}

export default useStateFilters
