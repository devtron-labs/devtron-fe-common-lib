import { Fragment, FunctionComponent } from 'react'
import { noop } from '@Common/Helper'
import { SortingOrder } from '@Common/Constants'
import {
    Column,
    ConfigurableColumnsConfigType,
    ConfigurableColumnsType,
    FiltersTypeEnum,
    TableProps,
    UseFiltersReturnType,
    WrapperProps,
} from './types'
import UseStateFilterWrapper from './UseStateFilterWrapper'
import UseUrlFilterWrapper from './UseUrlFilterWrapper'
import { LOCAL_STORAGE_EXISTS, LOCAL_STORAGE_KEY_FOR_VISIBLE_COLUMNS } from './constants'

export const searchAndSortRows = (
    rows: TableProps['rows'],
    filter: TableProps['filter'],
    filterData: UseFiltersReturnType,
    comparator?: Column['comparator'],
) => {
    const { searchKey, sortBy, sortOrder } = filterData

    const filteredRows = searchKey ? rows.filter((row) => filter(row, filterData)) : rows

    const sortedRows = comparator
        ? filteredRows.sort(
              (rowA, rowB) =>
                  (sortOrder === SortingOrder.ASC ? 1 : -1) * comparator(rowA.data[sortBy], rowB.data[sortBy]),
          )
        : filteredRows

    return sortedRows
}

export const getFilterWrapperComponent = (filtersVariant: FiltersTypeEnum): FunctionComponent<WrapperProps> => {
    switch (filtersVariant) {
        case FiltersTypeEnum.STATE:
            return UseStateFilterWrapper

        case FiltersTypeEnum.URL:
            return UseUrlFilterWrapper

        default:
            return Fragment
    }
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

        return configurableColumnsConfig[id]
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
        noop()
    }
}

export const getVisibleColumns = ({
    configurableColumns,
    columns,
    id,
}: Pick<TableProps, 'configurableColumns' | 'columns' | 'id'>) =>
    configurableColumns ? getVisibleColumnsFromLocalStorage({ allColumns: columns, id }) : columns
