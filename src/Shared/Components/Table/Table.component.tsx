import {
    ErrorScreenManager,
    GenericEmptyState,
    GenericFilterEmptyState,
    Pagination,
    showError,
    SortableTableHeaderCell,
    useAsync,
} from '@Common/index'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { Cell, FiltersTypeEnum, InternalTablePropsWithWrappers, RowsType, TableProps } from './types'
import {
    getFilterWrapperComponent,
    getVisibleColumns,
    searchAndSortRows,
    setVisibleColumnsToLocalStorage,
} from './utils'
import { SEARCH_SORT_CHANGE_DEBOUNCE_TIME } from './constants'
import UseResizableTableConfigWrapper from './UseResizableTableConfigWrapper'

const InternalTable = ({
    filtersVariant,
    filterData,
    rows,
    getRows,
    columns,
    ViewWrapper,
    resizableConfig,
    emptyStateConfig,
    additionalProps,
    configurableColumns,
    id,
}: InternalTablePropsWithWrappers) => {
    const [visibleColumns, setVisibleColumns] = useState(getVisibleColumns({ columns, id, configurableColumns }))

    const setVisibleColumnsWrapper = (newVisibleColumns: typeof visibleColumns) => {
        setVisibleColumns(newVisibleColumns)
        setVisibleColumnsToLocalStorage({ id, visibleColumns: newVisibleColumns })
    }

    useEffect(() => {
        getVisibleColumns({ columns, id, configurableColumns })
    }, [columns, id, configurableColumns])

    const {
        sortBy,
        sortOrder,
        searchKey = '',
        handleSorting,
        pageSize,
        offset,
        changePage,
        changePageSize,
        clearFilters,
        isFilterApplied,
    } = filterData ?? {}

    const {
        handleResize,
        gridTemplateColumns = visibleColumns
            .map((column) => (typeof column.size?.fixed === 'number' ? `${column.size.fixed}px` : '1fr'))
            .join(' '),
    } = resizableConfig ?? {}

    const searchSortTimeoutRef = useRef<number>(-1)

    const isColumnVisibleVector = useMemo(() => {
        const visibleColumnsSet = new Set(visibleColumns.map(({ label }) => label))

        return columns.map((column) => !!visibleColumnsSet.has(column.label))
    }, [visibleColumns, columns])

    const sortByToColumnIndexMap: Record<string, number> = useMemo(
        () =>
            visibleColumns.reduce((acc, column, index) => {
                acc[column.label] = index

                return acc
            }, {}),
        // NOTE: wrap columns in useMemo
        [visibleColumns],
    )

    const [areFilteredRowsLoading, _filteredRows, filteredRowsError] = useAsync(async () => {
        if (rows) {
            return new Promise<RowsType>((resolve, reject) => {
                const sortByColumnIndex = sortByToColumnIndexMap[sortBy]

                if (searchSortTimeoutRef.current !== -1) {
                    clearTimeout(searchSortTimeoutRef.current)
                }

                searchSortTimeoutRef.current = setTimeout(() => {
                    try {
                        resolve(
                            searchAndSortRows(
                                rows,
                                filterData,
                                sortByColumnIndex,
                                visibleColumns[sortByColumnIndex]?.comparator,
                            ),
                        )
                    } catch (error) {
                        console.error('Error while filtering/sorting rows:', error)
                        showError(error)
                        reject(error)
                    }

                    searchSortTimeoutRef.current = -1
                }, SEARCH_SORT_CHANGE_DEBOUNCE_TIME)
            })
        }

        try {
            return getRows(filterData)
        } catch (error) {
            console.error('Error while fetching rows:', error)
            showError(error)
            throw error
        }
    }, [searchKey, sortBy, sortOrder, rows, sortByToColumnIndexMap])

    const filteredRows = _filteredRows ?? []

    const Wrapper = ViewWrapper ?? Fragment

    const getTriggerSortingHandler = (newSortBy: string) => () => {
        handleSorting(newSortBy)
    }

    const renderContent = () => {
        if (!areFilteredRowsLoading && !filteredRows.length) {
            return filtersVariant !== FiltersTypeEnum.NONE && isFilterApplied ? (
                <GenericFilterEmptyState handleClearFilters={clearFilters} />
            ) : (
                <GenericEmptyState {...emptyStateConfig.noRowsConfig} />
            )
        }

        if (filteredRowsError) {
            return <ErrorScreenManager code={filteredRowsError.code} />
        }

        return (
            /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
            <div tabIndex={0} className="generic-table flexbox-col dc__overflow-hidden">
                <table className="flexbox-col flex-grow-1 w-100 dc__overflow-hidden">
                    <thead>
                        <tr className="dc__grid" style={{ gridTemplateColumns }}>
                            {visibleColumns.map(({ label, isSortable, size, showTippyOnTruncate }) => {
                                const isResizable = !!size.range

                                return (
                                    <SortableTableHeaderCell
                                        key={label}
                                        title={label}
                                        isSortable={isSortable}
                                        sortOrder={sortOrder}
                                        isSorted={sortBy === label}
                                        triggerSorting={getTriggerSortingHandler(label)}
                                        showTippyOnTruncate={showTippyOnTruncate}
                                        disabled={areFilteredRowsLoading}
                                        {...(isResizable
                                            ? { isResizable, handleResize, id: label }
                                            : { isResizable: false })}
                                    />
                                )
                            })}
                        </tr>
                    </thead>

                    <tbody className="dc__overflow-auto flex-grow-1 flexbox-col">
                        {(areFilteredRowsLoading ? Array(3) : filteredRows)
                            .filter((_, index) => isColumnVisibleVector[index])
                            .map((row) => (
                                <tr className="dc__grid" style={{ gridTemplateColumns }}>
                                    {row.map(({ data, label, horizontallySticky, render }: Cell) => {
                                        if (areFilteredRowsLoading) {
                                            return <div className="dc__shimmer" />
                                        }

                                        if (render) {
                                            return render(data, filterData)
                                        }

                                        return (
                                            <td
                                                className={
                                                    horizontallySticky ? 'dc__position-sticky dc__left-0 dc__zi-1' : ''
                                                }
                                            >
                                                {label}
                                            </td>
                                        )
                                    })}
                                </tr>
                            ))}
                    </tbody>
                </table>

                {!!filteredRows?.length && filteredRows.length > pageSize && (
                    <Pagination
                        pageSize={pageSize}
                        changePage={changePage}
                        changePageSize={changePageSize}
                        offset={offset}
                        rootClassName="dc__border-top flex dc__content-space px-20 py-10"
                        size={filteredRows.length}
                    />
                )}
            </div>
        )
    }

    return (
        <Wrapper
            {...{
                ...filterData,
                ...additionalProps,
                areRowsLoading: areFilteredRowsLoading,
                ...(configurableColumns
                    ? {
                          allColumns: columns,
                          setVisibleColumns: setVisibleColumnsWrapper,
                          visibleColumns,
                      }
                    : {}),
            }}
        >
            {renderContent()}
        </Wrapper>
    )
}

const TableWithResizableConfigWrapper = (tableProps: InternalTablePropsWithWrappers) => {
    const { columns } = tableProps

    const isResizable = columns.some(({ size }) => !!size?.range)

    return isResizable ? (
        <UseResizableTableConfigWrapper columns={columns}>
            <InternalTable {...tableProps} />
        </UseResizableTableConfigWrapper>
    ) : (
        <InternalTable {...tableProps} />
    )
}

const TableWrapper = (tableProps: TableProps) => {
    const { filtersVariant, additionalFilterProps } = tableProps

    const FilterWrapperComponent = getFilterWrapperComponent(filtersVariant)
    const wrapperProps = FilterWrapperComponent === Fragment ? {} : { additionalFilterProps }

    return (
        <FilterWrapperComponent {...wrapperProps}>
            {/* NOTE: filterData will be populated by FilterWrapperComponent */}
            <TableWithResizableConfigWrapper
                {...(tableProps as InternalTablePropsWithWrappers)}
                resizableConfig={null}
                filterData={null}
            />
        </FilterWrapperComponent>
    )
}

export default TableWrapper
