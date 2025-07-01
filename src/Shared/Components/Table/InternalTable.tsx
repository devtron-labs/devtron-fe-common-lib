import { Fragment, useEffect, useMemo, useRef } from 'react'

import ErrorScreenManager from '@Common/ErrorScreenManager'
import { GenericEmptyState, GenericFilterEmptyState, useAsync, UseRegisterShortcutProvider } from '@Common/index'

import { NO_ROWS_OR_GET_ROWS_ERROR } from './constants'
import TableContent from './TableContent'
import { FiltersTypeEnum, InternalTableProps, PaginationEnum } from './types'
import { getFilteringPromise, searchAndSortRows } from './utils'

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
    areColumnsConfigurable,
    filter,
    setVisibleColumns,
    visibleColumns,
    stylesConfig,
    loading,
    bulkSelectionConfig,
    bulkSelectionReturnValue,
    handleClearBulkSelection,
    handleToggleBulkSelectionOnRow,
    paginationVariant,
    RowActionsOnHoverComponent,
    pageSizeOptions,
    clearFilters: userGivenUrlClearFilters,
}: InternalTableProps) => {
    const {
        sortBy,
        sortOrder,
        searchKey = '',
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        handleSorting,
        pageSize,
        offset,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        changePage,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        changePageSize,
        clearFilters,
        areFiltersApplied,
        // Destructuring specific filters, grouping the rest with the rest operator
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        handleSearch,
        ...otherFilters
    } = filterData ?? {}

    const wrapperDivRef = useRef<HTMLDivElement>(null)

    const { setIdentifiers } = bulkSelectionReturnValue ?? {}

    const searchSortTimeoutRef = useRef<number>(-1)

    useEffect(() => {
        wrapperDivRef.current?.addEventListener('focusout', (e: FocusEvent) => {
            const container = e.currentTarget as HTMLElement
            const related = e.relatedTarget as HTMLElement | null

            if (container && (!related || related.tagName === 'BODY')) {
                const tableElement = wrapperDivRef.current.getElementsByClassName('generic-table')[0] as HTMLDivElement
                tableElement?.focus()
            }
        })

        return () => {
            clearTimeout(searchSortTimeoutRef.current)
        }
    }, [])

    useEffect(() => {
        handleClearBulkSelection()
    }, [rows])

    const [_areFilteredRowsLoading, filteredRows, filteredRowsError, reloadFilteredRows] = useAsync(async () => {
        if (!rows && !getRows) {
            throw NO_ROWS_OR_GET_ROWS_ERROR
        }

        return getFilteringPromise({
            searchSortTimeoutRef,
            callback: rows
                ? () =>
                      searchAndSortRows(
                          rows,
                          filter,
                          filterData,
                          visibleColumns.find(({ field }) => field === sortBy)?.comparator,
                      )
                : () => getRows(filterData),
        })
    }, [searchKey, sortBy, sortOrder, rows, JSON.stringify(otherFilters), visibleColumns])

    const areFilteredRowsLoading = _areFilteredRowsLoading || filteredRowsError === NO_ROWS_OR_GET_ROWS_ERROR

    const visibleRows = useMemo(() => {
        const normalizedFilteredRows = filteredRows ?? []

        const paginatedRows =
            paginationVariant !== PaginationEnum.PAGINATED
                ? normalizedFilteredRows
                : normalizedFilteredRows.slice(offset, offset + pageSize)

        return paginatedRows
    }, [paginationVariant, offset, pageSize, filteredRows])

    useEffect(() => {
        setIdentifiers?.(
            visibleRows.reduce((acc, row) => {
                acc[row.id] = row
                return acc
            }, {}),
        )
    }, [visibleRows])

    const Wrapper = ViewWrapper ?? Fragment

    const renderContent = () => {
        if (filteredRowsError && !areFilteredRowsLoading && !loading) {
            return <ErrorScreenManager code={filteredRowsError.code} reload={reloadFilteredRows} />
        }

        if (!areFilteredRowsLoading && !filteredRows?.length && !loading) {
            return filtersVariant !== FiltersTypeEnum.NONE && areFiltersApplied ? (
                <GenericFilterEmptyState handleClearFilters={userGivenUrlClearFilters ?? clearFilters} />
            ) : (
                <GenericEmptyState {...emptyStateConfig.noRowsConfig} />
            )
        }

        return (
            <UseRegisterShortcutProvider shouldHookOntoWindow={false} shortcutTimeout={50}>
                <TableContent
                    filteredRows={filteredRows}
                    areFilteredRowsLoading={areFilteredRowsLoading}
                    visibleColumns={visibleColumns}
                    bulkSelectionReturnValue={bulkSelectionReturnValue}
                    paginationVariant={paginationVariant}
                    resizableConfig={resizableConfig}
                    filterData={filterData}
                    handleClearBulkSelection={handleClearBulkSelection}
                    handleToggleBulkSelectionOnRow={handleToggleBulkSelectionOnRow}
                    RowActionsOnHoverComponent={RowActionsOnHoverComponent}
                    additionalProps={additionalProps}
                    bulkSelectionConfig={bulkSelectionConfig}
                    loading={loading}
                    pageSizeOptions={pageSizeOptions}
                    rows={rows}
                    stylesConfig={stylesConfig}
                />
            </UseRegisterShortcutProvider>
        )
    }

    return (
        <div ref={wrapperDivRef} className="flexbox-col flex-grow-1 dc__overflow-hidden">
            <Wrapper
                {...{
                    ...filterData,
                    ...additionalProps,
                    areRowsLoading: areFilteredRowsLoading,
                    filteredRows,
                    ...(areColumnsConfigurable
                        ? {
                              allColumns: columns,
                              setVisibleColumns,
                              visibleColumns,
                          }
                        : {}),
                }}
            >
                {renderContent()}
            </Wrapper>
        </div>
    )
}

export default InternalTable
