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

import { Fragment, useEffect, useMemo, useRef } from 'react'

import { useQuery } from '@Common/API'
import { GenericEmptyState, GenericFilterEmptyState } from '@Common/EmptyState'
import ErrorScreenManager from '@Common/ErrorScreenManager'
import { noop, useAsync } from '@Common/Helper'
import { UseRegisterShortcutProvider } from '@Common/Hooks'

import { NO_ROWS_OR_GET_ROWS_ERROR } from './constants'
import TableContent from './TableContent'
import { FiltersTypeEnum, InternalTableProps, RowsResultType } from './types'
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
    id,
    handleClearBulkSelection,
    handleToggleBulkSelectionOnRow,
    paginationVariant,
    rowActionOnHoverConfig,
    pageSizeOptions,
    clearFilters: userGivenUrlClearFilters,
    rowStartIconConfig,
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

    const handleFiltering = async () => {
        let totalRows = rows.length
        const filteredRows = await getFilteringPromise({
            searchSortTimeoutRef,
            callback: () => {
                const { rows: filteredAndSortedRows, totalRows: total } = searchAndSortRows(
                    rows,
                    filter,
                    filterData,
                    visibleColumns.find(({ field }) => field === sortBy)?.comparator,
                )

                totalRows = total

                return filteredAndSortedRows
            },
        })
        return { filteredRows, totalRows }
    }

    // useAsync hook for 'rows' scenario
    const [_areRowsLoading, rowsResult, rowsError, reloadRows] = useAsync(
        handleFiltering,
        [searchKey, sortBy, sortOrder, rows, JSON.stringify(otherFilters), visibleColumns],
        !!rows,
    )

    // useAsync hook for 'getRows' scenario
    const {
        isFetching: _areGetRowsLoading,
        data: getRowsResult,
        error: getRowsError,
        refetch: reloadGetRows,
    } = useQuery<unknown, RowsResultType<RowData>, unknown[], false>({
        queryFn: async ({ signal }) => {
            const { rows: newRows, totalRows } = await getRows(filterData, signal)
            return { filteredRows: newRows, totalRows }
        },
        // eslint-disable-next-line @tanstack/query/exhaustive-deps
        queryKey: [
            searchKey,
            sortBy,
            sortOrder,
            // !TODO: functions in queryKey cannot trigger refetch
            // getRows,
            offset,
            pageSize,
            JSON.stringify(otherFilters),
            visibleColumns,
        ],
        enabled: !!getRows,
    })

    // Combine results based on whether getRows is provided
    const _areFilteredRowsLoading = getRows ? _areGetRowsLoading : _areRowsLoading
    const filteredRowsResult = getRows ? getRowsResult : rowsResult
    const filteredRowsError = getRows ? getRowsError : rowsError
    const reloadFilteredRows = getRows ? reloadGetRows : reloadRows

    const { filteredRows, totalRows } = useMemo(
        () => filteredRowsResult ?? { filteredRows: [], totalRows: 0 },
        [filteredRowsResult],
    )

    const areFilteredRowsLoading = _areFilteredRowsLoading || filteredRowsError === NO_ROWS_OR_GET_ROWS_ERROR

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
                    rowActionOnHoverConfig={rowActionOnHoverConfig}
                    additionalProps={additionalProps}
                    bulkSelectionConfig={bulkSelectionConfig}
                    loading={loading}
                    pageSizeOptions={pageSizeOptions}
                    rows={rows}
                    stylesConfig={stylesConfig}
                    getRows={getRows}
                    totalRows={totalRows}
                    rowStartIconConfig={rowStartIconConfig}
                />
            </UseRegisterShortcutProvider>
        )
    }

    return (
        <div ref={wrapperDivRef} className="flexbox-col flex-grow-1 dc__overflow-hidden" id={`table-wrapper-${id}`}>
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
