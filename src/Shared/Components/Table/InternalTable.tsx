import { useRef, useEffect, useMemo, Fragment } from 'react'
import { Checkbox } from '@Common/Checkbox'
import { DEFAULT_BASE_PAGE_SIZE } from '@Common/Constants'
import ErrorScreenManager from '@Common/ErrorScreenManager'
import {
    useAsync,
    showError,
    CHECKBOX_VALUE,
    GenericFilterEmptyState,
    GenericEmptyState,
    useEffectAfterMount,
} from '@Common/index'
import { Pagination } from '@Common/Pagination'
import { SortableTableHeaderCell } from '@Common/SortableTableHeaderCell'

import { BulkSelection } from '../BulkSelection'
import BulkSelectionActionWidget from './BulkSelectionActionWidget'
import { SEARCH_SORT_CHANGE_DEBOUNCE_TIME, BULK_ACTION_GUTTER_LABEL, EVENT_TARGET } from './constants'
import { InternalTablePropsWithWrappers, RowsType, PaginationEnum, SignalsType, FiltersTypeEnum } from './types'
import useTableWithKeyboardShortcuts from './useTableWithKeyboardShortcuts'
import { searchAndSortRows } from './utils'

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
}: InternalTablePropsWithWrappers) => {
    const rowsContainerRef = useRef<HTMLDivElement>(null)
    const parentRef = useRef<HTMLDivElement>(null)

    const { BulkActionsComponent } = bulkSelectionConfig ?? {}

    const { showSeparatorBetweenRows = true } = stylesConfig ?? {}

    // FIXME: on resource browser kind change don't retain pageNumber only retain searchKey, and other filters for filter button
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

    const isBulkSelectionConfigured = !!bulkSelectionConfig

    const {
        selectedIdentifiers: bulkSelectionState = {},
        isBulkSelectionApplied = false,
        setIdentifiers,
        getSelectedIdentifiersCount,
        // TODO: maybe create a RowType
    } = bulkSelectionReturnValue ?? {}

    const {
        handleResize,
        gridTemplateColumns = visibleColumns
            .map((column) => (typeof column.size?.fixed === 'number' ? `${column.size.fixed}px` : '1fr'))
            .join(' '),
    } = resizableConfig ?? {}

    const searchSortTimeoutRef = useRef<number>(-1)

    const sortByToColumnIndexMap: Record<string, number> = useMemo(
        () =>
            visibleColumns.reduce((acc, column, index) => {
                acc[column.field] = index

                return acc
            }, {}),
        // NOTE: wrap columns in useMemo
        [visibleColumns],
    )

    const rowToIndexMap = useMemo(() => {
        if (!rows) {
            return null
        }

        const map = new Map()
        rows.forEach((row, index) => {
            map.set(row, index)
        })
        return map
    }, [rows])

    const [areFilteredRowsLoading, filteredRows, filteredRowsError] = useAsync(async () => {
        if (rows) {
            return new Promise<RowsType>((resolve, reject) => {
                const sortByColumnIndex = sortByToColumnIndexMap[sortBy]

                if (searchSortTimeoutRef.current !== -1) {
                    clearTimeout(searchSortTimeoutRef.current)
                }

                searchSortTimeoutRef.current = setTimeout(() => {
                    try {
                        resolve(
                            searchAndSortRows(rows, filter, filterData, visibleColumns[sortByColumnIndex]?.comparator),
                        )
                    } catch (error) {
                        showError(error)
                        reject(error)
                    }

                    searchSortTimeoutRef.current = -1
                }, SEARCH_SORT_CHANGE_DEBOUNCE_TIME)
            })
        }

        return new Promise<RowsType>((resolve, reject) => {
            if (searchSortTimeoutRef.current !== -1) {
                clearTimeout(searchSortTimeoutRef.current)
            }

            searchSortTimeoutRef.current = setTimeout(async () => {
                try {
                    resolve(await getRows(filterData))
                } catch (error) {
                    showError(error)
                    reject(error)
                }

                searchSortTimeoutRef.current = -1
            }, SEARCH_SORT_CHANGE_DEBOUNCE_TIME)
        })
    }, [searchKey, sortBy, sortOrder, rows, sortByToColumnIndexMap])

    const bulkSelectionCount = getSelectedIdentifiersCount?.() ?? 0

    const visibleRows = useMemo(() => {
        const normalizedFilteredRows = filteredRows ?? []

        const paginatedRows =
            paginationVariant !== PaginationEnum.PAGINATED
                ? normalizedFilteredRows
                : normalizedFilteredRows.slice(offset, offset + pageSize)

        return paginatedRows
    }, [paginationVariant, offset, pageSize, filteredRows])

    const { activeRowIndex, setActiveRowIndex } = useTableWithKeyboardShortcuts(
        { bulkSelectionConfig, bulkSelectionReturnValue, handleToggleBulkSelectionOnRow },
        visibleRows,
    )

    useEffectAfterMount(() => {
        rowsContainerRef.current.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
        })

        setActiveRowIndex(0)
    }, [offset])

    useEffect(() => {
        setIdentifiers?.(
            visibleRows.reduce((acc, row) => {
                acc[row.id] = row
                return acc
            }, {}),
        )
    }, [visibleRows])

    const Wrapper = ViewWrapper ?? Fragment

    const getTriggerSortingHandler = (newSortBy: string) => () => {
        handleSorting(newSortBy)
    }

    // FIXME: this is causing quick scroll on page switch
    const scrollIntoViewActiveRowRefCallback = (node: HTMLDivElement) => {
        if (!node || node.dataset.active !== 'true') {
            return
        }

        node.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }

    const showPagination =
        paginationVariant === PaginationEnum.PAGINATED &&
        !!filteredRows?.length &&
        filteredRows.length > DEFAULT_BASE_PAGE_SIZE

    const renderRows = () => {
        if (loading && !visibleColumns.length) {
            return Array(3)
                .fill(null)
                .map(() => (
                    <div
                        className={`px-20 flexbox py-12 dc__gap-16 ${showSeparatorBetweenRows ? 'dc__border-bottom-n1' : ''}`}
                    >
                        {isBulkSelectionConfigured ? <div className="shimmer w-20 mr-20" /> : null}
                        {Array(3)
                            .fill(null)
                            .map(() => (
                                <div className="shimmer mr-20 w-200" />
                            ))}
                    </div>
                ))
        }

        if (areFilteredRowsLoading) {
            return Array(3)
                .fill(null)
                .map(() => (
                    <div
                        className="dc__grid px-20 dc__border-bottom-n1 dc__gap-16"
                        style={{
                            gridTemplateColumns,
                        }}
                    >
                        {visibleColumns.map(({ horizontallySticky }) => (
                            <div
                                className={`${horizontallySticky ? 'dc__position-sticky dc__left-0 dc__zi-1' : ''} pr-12 py-12 flex`}
                                aria-label="Loading..."
                            >
                                <div className="shimmer h-16 w-100" />
                            </div>
                        ))}
                    </div>
                ))
        }

        return visibleRows.map((row, visibleRowIndex) => {
            const rowIndex = rowToIndexMap?.get(row)
            const isRowActive = activeRowIndex === visibleRowIndex
            const isRowBulkSelected = !!bulkSelectionState[row.id] || isBulkSelectionApplied

            return (
                <div
                    ref={scrollIntoViewActiveRowRefCallback}
                    className={`dc__grid px-20 form__checkbox-parent ${
                        showSeparatorBetweenRows ? 'dc__border-bottom-n1' : ''
                    } fs-13 fw-4 lh-20 cn-9 generic-table__row dc__gap-16 ${
                        isRowActive ? 'generic-table__row--active form__checkbox-parent--active' : ''
                    } ${RowActionsOnHoverComponent ? 'dc__position-rel dc__opacity-hover dc__opacity-hover--parent' : ''} ${
                        isRowBulkSelected ? 'generic-table__row--bulk-selected' : ''
                    }`}
                    style={{
                        gridTemplateColumns,
                    }}
                    key={rowIndex}
                    data-active={isRowActive}
                >
                    {visibleColumns.map(({ field, CellComponent }) => {
                        if (field === BULK_ACTION_GUTTER_LABEL) {
                            return (
                                <Checkbox
                                    isChecked={isRowBulkSelected}
                                    onChange={() => handleToggleBulkSelectionOnRow(row)}
                                    rootClassName="mb-0"
                                    value={CHECKBOX_VALUE.CHECKED}
                                />
                            )
                        }

                        if (CellComponent) {
                            return (
                                <CellComponent
                                    field={field}
                                    value={row.data[field]}
                                    signals={EVENT_TARGET as SignalsType}
                                    row={row}
                                    filterData={filterData}
                                    isRowActive={isRowActive}
                                    {...additionalProps}
                                />
                            )
                        }

                        return <span className="py-12">{row.data[field]}</span>
                    })}

                    {RowActionsOnHoverComponent && (
                        <div className="dc__position-fixed dc__left-0 dc__zi-1 dc__opacity-hover--child">
                            <RowActionsOnHoverComponent row={row} />
                        </div>
                    )}
                </div>
            )
        })
    }

    const renderContent = () => {
        if (!areFilteredRowsLoading && !filteredRows?.length) {
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
            <div className="generic-table flexbox-col dc__overflow-hidden flex-grow-1">
                <div className="flexbox-col flex-grow-1 w-100 dc__overflow-auto" ref={parentRef}>
                    <div className="bg__primary dc__min-width-fit-content px-20 dc__border-bottom-n1">
                        {loading && !visibleColumns.length ? (
                            <div className="flexbox py-12 dc__gap-16">
                                {Array(3)
                                    .fill(null)
                                    .map(() => (
                                        <div className="shimmer mr-20 w-200" />
                                    ))}
                            </div>
                        ) : (
                            <div
                                className="dc__grid fw-6 cn-7 fs-12 lh-20 py-8 dc__gap-16"
                                style={{
                                    gridTemplateColumns,
                                }}
                            >
                                {visibleColumns.map(({ label, field, isSortable, size, showTippyOnTruncate }) => {
                                    const isResizable = !!size.range

                                    if (field === BULK_ACTION_GUTTER_LABEL) {
                                        return <BulkSelection showPagination={showPagination} />
                                    }

                                    return (
                                        <SortableTableHeaderCell
                                            key={label}
                                            title={label}
                                            isSortable={!!isSortable}
                                            sortOrder={sortOrder}
                                            isSorted={sortBy === field}
                                            triggerSorting={getTriggerSortingHandler(field)}
                                            showTippyOnTruncate={showTippyOnTruncate}
                                            disabled={areFilteredRowsLoading}
                                            {...(isResizable
                                                ? { isResizable, handleResize, id: label }
                                                : { isResizable: false })}
                                        />
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    <div
                        ref={rowsContainerRef}
                        className="flex-grow-1 flexbox-col dc__min-width-fit-content dc__overflow-auto"
                    >
                        {renderRows()}
                    </div>

                    {!!bulkSelectionConfig && !!bulkSelectionCount && (
                        <BulkSelectionActionWidget
                            count={bulkSelectionCount}
                            handleClearBulkSelection={handleClearBulkSelection}
                            parentRef={parentRef}
                            BulkActionsComponent={BulkActionsComponent}
                        />
                    )}
                </div>

                {showPagination && (
                    <Pagination
                        pageSize={pageSize}
                        changePage={changePage}
                        changePageSize={changePageSize}
                        offset={offset}
                        rootClassName="dc__border-top flex dc__content-space px-20"
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
                          setVisibleColumns,
                          visibleColumns,
                      }
                    : {}),
            }}
        >
            {renderContent()}
        </Wrapper>
    )
}

export default InternalTable
