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
    const { sortBy, sortOrder } = filterData ?? {}

    const filteredRows = filter ? rows.filter((row) => filter(row, filterData)) : rows

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

export const getStickyColumnConfig = (gridTemplateColumns: string, columnIndex: number) => ({
    className: `dc__position-sticky dc__zi-1 generic-table__cell--sticky`,
    // NOTE: container has a padding left of 20px and the gap between columns is 16px
    // so we want each sticky column to stick to the left of the previous column
    left: `${
        Number(
            gridTemplateColumns
                .split(' ')
                .slice(0, columnIndex)
                .reduce((acc, num) => acc + Number(num.split('px')[0]), 0) ?? 1,
        ) +
        20 +
        16 * columnIndex
    }px`,
})

export const scrollToShowActiveElementIfNeeded = (
    activeElement: HTMLDivElement,
    parent: HTMLDivElement,
    topMargin: number,
) => {
    if (!activeElement || !parent) {
        return
    }

    // NOTE: we can't use scrollIntoView since that will also scroll it vertically
    // therefore we need to conditionally scroll and that too in the horizontal direction only
    const { bottom, top } = activeElement.getBoundingClientRect()
    const { bottom: parentBottom, top: parentTop } = parent.getBoundingClientRect()
    let { scrollTop } = parent

    // NOTE: please look into https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
    // for more information what left and right pertain to
    if (top < parentTop) {
        // eslint-disable-next-line no-param-reassign
        scrollTop += top - parentTop - topMargin
    }

    if (bottom > parentBottom) {
        // eslint-disable-next-line no-param-reassign
        scrollTop += bottom - parentBottom
    }

    parent.scrollTo({ top: scrollTop, behavior: 'smooth' })
}
