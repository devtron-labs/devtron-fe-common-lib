import { Fragment, FunctionComponent } from 'react'
import { noop } from '@Common/Helper'
import {
    Column,
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
    filterData: UseFiltersReturnType,
    sortByIndex: number | null,
    comparator?: Column['comparator'],
) => {
    const { searchKey } = filterData

    const filteredRows = searchKey
        ? rows.filter((row) => row.some((cell) => cell.filter?.(cell.label, filterData, cell.data) ?? true))
        : rows

    const sortedRows =
        sortByIndex && comparator
            ? filteredRows.sort((rowA, rowB) => comparator(rowA[sortByIndex].data, rowB[sortByIndex].data))
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

type ConfigurableColumnsConfigType = Record<string, ConfigurableColumnsType['visibleColumns']>

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
