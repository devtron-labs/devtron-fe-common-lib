import { Fragment, useEffect, useMemo, useRef } from 'react'

import { Checkbox } from '@Common/Checkbox'
import { DEFAULT_BASE_PAGE_SIZE } from '@Common/Constants'
import ErrorScreenManager from '@Common/ErrorScreenManager'
import {
    CHECKBOX_VALUE,
    GenericEmptyState,
    GenericFilterEmptyState,
    useAsync,
    useEffectAfterMount,
} from '@Common/index'
import { Pagination } from '@Common/Pagination'
import { SortableTableHeaderCell } from '@Common/SortableTableHeaderCell'

import { BulkSelection } from '../BulkSelection'
import BulkSelectionActionWidget from './BulkSelectionActionWidget'
import { BULK_ACTION_GUTTER_LABEL, EVENT_TARGET, SHIMMER_DUMMY_ARRAY } from './constants'
import { FiltersTypeEnum, InternalTableProps, PaginationEnum, SignalsType } from './types'
import useTableWithKeyboardShortcuts from './useTableWithKeyboardShortcuts'
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
}: InternalTableProps) => {
    const rowsContainerRef = useRef<HTMLDivElement>(null)
    const parentRef = useRef<HTMLDivElement>(null)
    const activeRowRef = useRef<HTMLDivElement>(null)

    const { BulkActionsComponent } = bulkSelectionConfig ?? {}

    const { showSeparatorBetweenRows = true } = stylesConfig ?? {}

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
        // Destructuring specific filters, grouping the rest with the rest operator
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        handleSearch,
        ...otherFilters
    } = filterData ?? {}

    const isBulkSelectionConfigured = !!bulkSelectionConfig

    const {
        selectedIdentifiers: bulkSelectionState = {},
        isBulkSelectionApplied = false,
        setIdentifiers,
        getSelectedIdentifiersCount,
    } = bulkSelectionReturnValue ?? {}

    const {
        handleResize,
        gridTemplateColumns = visibleColumns
            .map((column) => (typeof column.size?.fixed === 'number' ? `${column.size.fixed}px` : '1fr'))
            .join(' '),
    } = resizableConfig ?? {}

    const searchSortTimeoutRef = useRef<number>(-1)

    useEffect(
        () => () => {
            clearTimeout(searchSortTimeoutRef.current)
        },
        [],
    )

    const sortByToColumnIndexMap: Record<string, number> = useMemo(
        () =>
            visibleColumns.reduce((acc, column, index) => {
                acc[column.field] = index

                return acc
            }, {}),
        [visibleColumns],
    )

    const [areFilteredRowsLoading, filteredRows, filteredRowsError, reloadFilteredRows] = useAsync(async () => {
        if (!rows && !getRows) {
            throw new Error('Neither rows nor getRows function provided')
        }

        return getFilteringPromise({
            searchSortTimeoutRef,
            callback: rows
                ? () => {
                      const sortByColumnIndex = sortByToColumnIndexMap[sortBy]

                      return searchAndSortRows(rows, filter, filterData, visibleColumns[sortByColumnIndex]?.comparator)
                  }
                : () => getRows(filterData),
        })
    }, [searchKey, sortBy, sortOrder, rows, sortByToColumnIndexMap, JSON.stringify(otherFilters)])

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
        setActiveRowIndex(0)
    }, [offset, visibleRows])

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

    useEffect(() => {
        // Focus the active row only when activeRowIndex changes. This ensures that focus is not stolen from other elements,
        // such as the search bar, when it is already focused. For example, when typing in the search bar, the rows may be replaced
        // with loading shimmers, causing activeRowRef to be null. During this time, activeRowIndex might reset to 0, but focus
        // will not shift. However, when navigating with arrow keys, activeRowIndex changes, and activeRowRef will point to the
        // correct row once it is mounted, allowing focus to update appropriately.
        activeRowRef.current?.focus()
    }, [activeRowIndex])

    const showPagination =
        paginationVariant === PaginationEnum.PAGINATED && filteredRows?.length > DEFAULT_BASE_PAGE_SIZE

    const renderRows = () => {
        if (loading && !visibleColumns.length) {
            return SHIMMER_DUMMY_ARRAY.map((shimmerRowLabel) => (
                <div
                    key={shimmerRowLabel}
                    className={`px-20 flexbox py-12 dc__gap-16 ${showSeparatorBetweenRows ? 'border__secondary--bottom' : ''}`}
                >
                    {isBulkSelectionConfigured ? <div className="shimmer w-20 mr-20" /> : null}
                    {SHIMMER_DUMMY_ARRAY.map((shimmerCellLabel) => (
                        <div key={shimmerCellLabel} className="shimmer w-200" />
                    ))}
                </div>
            ))
        }

        if (areFilteredRowsLoading) {
            return SHIMMER_DUMMY_ARRAY.map((shimmerRowLabel) => (
                <div
                    key={shimmerRowLabel}
                    className="dc__grid px-20 border__secondary--bottom dc__gap-16"
                    style={{
                        gridTemplateColumns,
                    }}
                >
                    {visibleColumns.map(({ horizontallySticky, label }) => (
                        <div
                            key={label}
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
            const isRowActive = activeRowIndex === visibleRowIndex
            const isRowBulkSelected = !!bulkSelectionState[row.id] || isBulkSelectionApplied

            const handleChangeActiveRowIndex = () => {
                setActiveRowIndex(visibleRowIndex)
            }

            const handleToggleBulkSelectionForRow = () => {
                handleToggleBulkSelectionOnRow(row)
            }

            return (
                <div
                    key={row.id}
                    ref={isRowActive ? activeRowRef : null}
                    onClick={handleChangeActiveRowIndex}
                    className={`dc__grid px-20 checkbox__parent-container ${
                        showSeparatorBetweenRows ? 'border__secondary--bottom' : ''
                    } fs-13 fw-4 lh-20 cn-9 generic-table__row dc__gap-16 ${
                        isRowActive ? 'generic-table__row--active checkbox__parent-container--active' : ''
                    } ${RowActionsOnHoverComponent ? 'dc__position-rel dc__opacity-hover dc__opacity-hover--parent' : ''} ${
                        isRowBulkSelected ? 'generic-table__row--bulk-selected' : ''
                    }`}
                    style={{
                        gridTemplateColumns,
                    }}
                    data-active={isRowActive}
                    // NOTE: by giving it a negative tabIndex we can programmatically focus it through .focus()
                    tabIndex={-1}
                >
                    {visibleColumns.map(({ field, CellComponent }) => {
                        if (field === BULK_ACTION_GUTTER_LABEL) {
                            return (
                                <Checkbox
                                    key={field}
                                    isChecked={isRowBulkSelected}
                                    onChange={handleToggleBulkSelectionForRow}
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

                        return (
                            <span key={field} className="py-12">
                                {row.data[field]}
                            </span>
                        )
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

        if (filteredRowsError && !areFilteredRowsLoading) {
            return <ErrorScreenManager code={filteredRowsError.code} reload={reloadFilteredRows} />
        }

        return (
            <div tabIndex={0} role="grid" className="generic-table flexbox-col dc__overflow-hidden flex-grow-1">
                <div className="flexbox-col flex-grow-1 w-100 dc__overflow-auto" ref={parentRef}>
                    <div className="bg__primary dc__min-width-fit-content px-20 border__secondary--bottom">
                        {loading && !visibleColumns.length ? (
                            <div className="flexbox py-12 dc__gap-16">
                                {SHIMMER_DUMMY_ARRAY.map((label) => (
                                    <div key={label} className="shimmer w-180" />
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
                                        return <BulkSelection key={field} showPagination={showPagination} />
                                    }

                                    return (
                                        <SortableTableHeaderCell
                                            key={field}
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
                        rootClassName="border__primary--top flex dc__content-space px-20"
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
    )
}

export default InternalTable
