import { SortingOrder } from '@Common/Constants'
import { showError } from '@Common/Helper'
import { isNullOrUndefined } from '@Shared/Helpers'

import {
    LOCAL_STORAGE_EXISTS,
    LOCAL_STORAGE_KEY_FOR_VISIBLE_COLUMNS,
    SEARCH_SORT_CHANGE_DEBOUNCE_TIME,
} from './constants'
import {
    Column,
    ConfigurableColumnsConfigType,
    ConfigurableColumnsType,
    GetFilteringPromiseProps,
    RowsType,
    TableProps,
    UseFiltersReturnType,
} from './types'

export const searchAndSortRows = (
    rows: TableProps['rows'],
    filter: TableProps['filter'],
    filterData: UseFiltersReturnType,
    comparator?: Column['comparator'],
) => {
    const { sortBy, sortOrder, isFilterApplied } = filterData ?? {}

    const filteredRows = isFilterApplied ? rows.filter((row) => filter(row, filterData)) : rows

    return comparator && sortBy
        ? filteredRows.sort(
              (rowA, rowB) =>
                  (sortOrder === SortingOrder.ASC ? 1 : -1) * comparator(rowA.data[sortBy], rowB.data[sortBy]),
          )
        : filteredRows
}

export const getVisibleColumnsFromLocalStorage = ({
    allColumns,
    id,
}: Pick<ConfigurableColumnsType, 'allColumns'> & Pick<TableProps, 'id'>) => {
    if (!LOCAL_STORAGE_EXISTS) {
        // NOTE: show all headers by default
        return allColumns
    }

    try {
        const configurableColumnsConfig: ConfigurableColumnsConfigType = JSON.parse(
            localStorage.getItem(LOCAL_STORAGE_KEY_FOR_VISIBLE_COLUMNS),
        )

        if (!configurableColumnsConfig?.[id]) {
            throw new Error()
        }

        const visibleColumns = configurableColumnsConfig[id]

        if (
            !Array.isArray(visibleColumns) ||
            visibleColumns.some((column) => !column || isNullOrUndefined(column.field))
        ) {
            throw new Error()
        }

        const visibleColumnsFieldSet = new Set(visibleColumns.map((column) => column.field))

        return allColumns.filter((column) => visibleColumnsFieldSet.has(column.field))
    } catch {
        // NOTE: show all headers by default
        return allColumns
    }
}

export const setVisibleColumnsToLocalStorage = ({
    id,
    visibleColumns,
}: Pick<ConfigurableColumnsType, 'visibleColumns'> & Pick<TableProps, 'id'>) => {
    if (!LOCAL_STORAGE_EXISTS || !Array.isArray(visibleColumns)) {
        return
    }

    try {
        const configurableColumnsConfig: ConfigurableColumnsConfigType =
            JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_FOR_VISIBLE_COLUMNS)) ?? {}

        localStorage.setItem(
            LOCAL_STORAGE_KEY_FOR_VISIBLE_COLUMNS,
            JSON.stringify({ ...configurableColumnsConfig, [id]: visibleColumns }),
        )
    } catch {
        localStorage.removeItem(LOCAL_STORAGE_KEY_FOR_VISIBLE_COLUMNS)
    }
}

export const getVisibleColumns = ({
    areColumnsConfigurable,
    columns,
    id,
}: Pick<TableProps, 'areColumnsConfigurable' | 'columns' | 'id'>) =>
    areColumnsConfigurable ? getVisibleColumnsFromLocalStorage({ allColumns: columns, id }) : columns

export const getFilteringPromise = ({ searchSortTimeoutRef, callback }: GetFilteringPromiseProps) =>
    new Promise<RowsType>((resolve, reject) => {
        if (searchSortTimeoutRef.current !== -1) {
            clearTimeout(searchSortTimeoutRef.current)
        }

        // eslint-disable-next-line no-param-reassign
        searchSortTimeoutRef.current = setTimeout(async () => {
            try {
                resolve(await callback())
            } catch (error) {
                showError(error)
                reject(error)
            }

            // eslint-disable-next-line no-param-reassign
            searchSortTimeoutRef.current = -1
        }, SEARCH_SORT_CHANGE_DEBOUNCE_TIME)
    })
