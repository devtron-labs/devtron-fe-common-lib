import { Fragment, useEffect, useMemo, useRef } from 'react'

import { GenericEmptyState, GenericFilterEmptyState } from '@Common/EmptyState'
import ErrorScreenManager from '@Common/ErrorScreenManager'
import { noop, useAsync } from '@Common/Helper'
import { UseRegisterShortcutProvider } from '@Common/Hooks'

import { NO_ROWS_OR_GET_ROWS_ERROR } from './constants'
import TableContent from './TableContent'
import { FiltersTypeEnum, InternalTableProps, PaginationEnum } from './types'
import { getFilteringPromise, searchAndSortRows } from './utils'

const InternalTable = <
    RowData extends unknown,
    FilterVariant extends FiltersTypeEnum,
    AdditionalProps extends Record<string, any>,
>({
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
}: InternalTableProps<RowData, FilterVariant, AdditionalProps>) => {
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
        const handleFocusOutEvent = (e: FocusEvent) => {
            setTimeout(() => {
                const container = e.currentTarget as HTMLElement
                const related = e.relatedTarget as HTMLElement | null

                // NOTE: we want to focus the table if the focus is lost from any element inside the table
                // and the focus is not moving to another element inside the table. Ideally we don't want to steal focus
                // inputs, buttons, etc. from the user, but when we blur any element by pressing Escape, we want to focus the table
                // Keep in mind that if we tab focus onto a div/span with tabIndex then the relatedTarget will be that null
                if (
                    !container?.contains(document.activeElement) &&
                    (!related || related.tagName === 'BODY' || document.activeElement === document.body)
                ) {
                    const tableElement = wrapperDivRef.current?.getElementsByClassName(
                        'generic-table',
                    )?.[0] as HTMLDivElement
                    tableElement?.focus({ preventScroll: true })
                }
            }, 0)
        }

        wrapperDivRef.current?.addEventListener('focusout', handleFocusOutEvent)

        return () => {
            clearTimeout(searchSortTimeoutRef.current)
            wrapperDivRef.current?.removeEventListener('focusout', handleFocusOutEvent)
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
                <GenericFilterEmptyState
                    {...emptyStateConfig.noRowsForFilterConfig}
                    handleClearFilters={userGivenUrlClearFilters ?? clearFilters}
                />
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
                areRowsLoading={areFilteredRowsLoading}
                clearFilters={clearFilters}
                rows={rows}
                filteredRows={filteredRows}
                handleSearch={handleSearch}
                updateSearchParams={noop}
                offset={offset}
                searchKey={searchKey}
                sortBy={sortBy}
                sortOrder={sortOrder}
                {...filterData}
                {...(areColumnsConfigurable
                    ? {
                          allColumns: columns,
                          setVisibleColumns,
                          visibleColumns,
                      }
                    : {})}
                {...additionalProps}
            >
                {renderContent()}
            </Wrapper>
        </div>
    )
}

export default InternalTable
