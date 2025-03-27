import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import {
    Checkbox,
    CHECKBOX_VALUE,
    DEFAULT_BASE_PAGE_SIZE,
    ErrorScreenManager,
    GenericEmptyState,
    GenericFilterEmptyState,
    noop,
    Pagination,
    showError,
    SortableTableHeaderCell,
    useAsync,
    useRegisterShortcut,
    UseRegisterShortcutProvider,
} from '@Common/index'

import {
    Column,
    FiltersTypeEnum,
    InternalTablePropsWithWrappers,
    PaginationEnum,
    RowsType,
    SignalEnum,
    SignalsType,
    TableProps,
} from './types'
import {
    getFilterWrapperComponent,
    getVisibleColumns,
    searchAndSortRows,
    setVisibleColumnsToLocalStorage,
} from './utils'
import { BULK_ACTION_GUTTER_LABEL, SEARCH_SORT_CHANGE_DEBOUNCE_TIME } from './constants'
import UseResizableTableConfigWrapper from './UseResizableTableConfigWrapper'
import { BulkSelection, BulkSelectionEvents, BulkSelectionProvider, useBulkSelection } from '../BulkSelection'
import BulkSelectionActionWidget from './BulkSelectionActionWidget'

import './styles.scss'

const eventTarget = new EventTarget()

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
    visibleRowsNumberRef,
    activeRowIndex,
    bulkSelectionReturnValue,
    handleClearBulkSelection,
    handleToggleBulkSelectionOnRow,
    paginationVariant,
    RowActionsOnHoverComponent,
    activeRowRef,
}: InternalTablePropsWithWrappers) => {
    const rowsContainerRef = useRef<HTMLDivElement>(null)
    const parentRef = useRef<HTMLDivElement>(null)

    const { BulkActionsComponent, onBulkSelectionChanged } = bulkSelectionConfig ?? {}

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

    useEffect(() => {
        rowsContainerRef.current.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
        })
    }, [offset])

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

    useEffect(() => {
        if (!onBulkSelectionChanged) {
            return noop
        }

        let bulkSelectedRows = []

        const callback = ({ detail: { bulkSelectedRowIdsRef } }: CustomEvent) => {
            const bulkSelectedRowIdsSet = new Set(bulkSelectedRowIdsRef)
            bulkSelectedRows = [...bulkSelectedRows, ...filteredRows.filter((row) => bulkSelectedRowIdsSet[row.id])]

            bulkSelectedRows.forEach((row) => {
                handleToggleBulkSelectionOnRow(row)
            })

            onBulkSelectionChanged?.(bulkSelectedRows)
        }

        eventTarget.addEventListener(SignalEnum.BULK_SELECTION_CHANGED, callback)

        return () => {
            eventTarget.removeEventListener(SignalEnum.BULK_SELECTION_CHANGED, callback)
        }
    }, [filteredRows, onBulkSelectionChanged])

    const bulkSelectionCount = getSelectedIdentifiersCount?.() ?? 0

    const visibleRows = useMemo(() => {
        const normalizedFilteredRows = filteredRows ?? []

        const paginatedRows =
            paginationVariant !== PaginationEnum.PAGINATED
                ? normalizedFilteredRows
                : normalizedFilteredRows.slice(offset, offset + pageSize)

        // eslint-disable-next-line no-param-reassign
        visibleRowsNumberRef.current = paginatedRows.length
        // eslint-disable-next-line no-param-reassign
        activeRowRef.current = paginatedRows[activeRowIndex]
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

    const getTriggerSortingHandler = (newSortBy: string) => () => {
        handleSorting(newSortBy)
    }

    // FIXME: this is causing quick scroll on page switch
    const scrollIntoViewActiveRowRefCallback = (node: HTMLDivElement) => {
        if (!node || node.dataset.active !== 'true') {
            return
        }

        node.scrollIntoView({ behavior: 'instant', block: 'nearest' })
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

            return (
                <div
                    ref={scrollIntoViewActiveRowRefCallback}
                    className={`dc__grid px-20 ${
                        showSeparatorBetweenRows ? 'dc__border-bottom-n1' : ''
                    } fs-13 fw-4 lh-20 cn-9 generic-table__row dc__gap-16 ${
                        isRowActive ? 'generic-table__row--active' : ''
                    } ${RowActionsOnHoverComponent ? 'dc__position-rel dc__opacity-hover dc__opacity-hover--parent' : ''}`}
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
                                    isChecked={!!bulkSelectionState[rowIndex] || isBulkSelectionApplied}
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
                                    signals={eventTarget as SignalsType}
                                    data={row.data}
                                    filterData={filterData}
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
                <div className="flexbox-col flex-grow-1 w-100 dc__overflow-auto">
                    <div className="bg__primary dc__min-width-fit-content px-20 dc__border-bottom-n1" ref={parentRef}>
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
                                {visibleColumns.map(({ label, isSortable, size, showTippyOnTruncate }) => {
                                    const isResizable = !!size.range

                                    if (label === BULK_ACTION_GUTTER_LABEL) {
                                        return <BulkSelection showPagination={showPagination} />
                                    }

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
                            </div>
                        )}
                    </div>

                    <div
                        ref={rowsContainerRef}
                        className="flex-grow-1 flexbox-col dc__min-width-fit-content dc__overflow-auto"
                    >
                        {renderRows()}
                    </div>

                    {bulkSelectionConfig && (
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

const TableWithResizableConfigWrapper = (tableProps: InternalTablePropsWithWrappers) => {
    const { visibleColumns: columnsWithoutBulkActionGutter, bulkSelectionConfig: bulkActionsConfig } = tableProps

    const visibleColumns: Column[] = bulkActionsConfig
        ? [{ size: { fixed: 40 }, field: BULK_ACTION_GUTTER_LABEL }, ...columnsWithoutBulkActionGutter]
        : columnsWithoutBulkActionGutter

    const isResizable = visibleColumns.some(({ size }) => !!size?.range)

    if (isResizable && visibleColumns.some(({ size }) => size === null)) {
        throw new Error('If any column is resizable, all columns must have a fixed size')
    }

    return isResizable ? (
        <UseResizableTableConfigWrapper columns={visibleColumns}>
            <InternalTable {...tableProps} />
        </UseResizableTableConfigWrapper>
    ) : (
        <InternalTable {...tableProps} />
    )
}

const TableWithKeyboardShortcuts = (tableProps: InternalTablePropsWithWrappers) => {
    const { bulkSelectionConfig } = tableProps

    const isBulkSelectionConfigured = !!bulkSelectionConfig

    const { registerShortcut, unregisterShortcut } = useRegisterShortcut()

    const [activeRowIndex, setActiveRowIndex] = useState<number>(0)

    const visibleRowsNumberRef = useRef<number>(0)
    const activeRowRef = useRef<RowsType[number]>(null)
    const bulkSelectedRowIdsRef = useRef<string[]>([])

    const dispatchEvent = (signal: SignalEnum) => {
        eventTarget.dispatchEvent(new CustomEvent(signal, { detail: { activeRowData: activeRowRef.current } }))
    }

    useEffect(() => {
        dispatchEvent(SignalEnum.ACTIVE_ROW_CHANGED)
    }, [activeRowIndex])

    const handleMoveFocusToNextRow = () => {
        // NOTE: using a ref here so that we don't end up with a stale closure
        // If we had gone with a normal state, the callback would have been using the initial state
        // unless the register the callback every time the state changes
        setActiveRowIndex((prev) => Math.min(prev + 1, visibleRowsNumberRef.current - 1))
    }

    const handleMoveFocusToPreviousRow = () => {
        setActiveRowIndex((prev) => Math.max(prev - 1, 0))
    }

    useEffect(() => {
        registerShortcut({
            keys: ['ArrowDown'],
            callback: handleMoveFocusToNextRow,
        })

        registerShortcut({
            keys: ['ArrowUp'],
            callback: handleMoveFocusToPreviousRow,
        })

        registerShortcut({
            keys: ['Enter'],
            callback: () => {
                dispatchEvent(SignalEnum.ENTER_PRESSED)
            },
        })

        registerShortcut({
            keys: ['Delete'],
            callback: () => {
                dispatchEvent(SignalEnum.DELETE_PRESSED)
            },
        })

        registerShortcut({
            keys: ['.'],
            callback: () => {
                dispatchEvent(SignalEnum.OPEN_CONTEXT_MENU)
            },
        })

        if (isBulkSelectionConfigured) {
            registerShortcut({
                keys: ['Shift', 'ArrowDown'],
                callback: () => {
                    bulkSelectedRowIdsRef.current.push(activeRowRef.current.id)
                    handleMoveFocusToNextRow()

                    eventTarget.dispatchEvent(
                        new CustomEvent(SignalEnum.BULK_SELECTION_CHANGED, {
                            detail: { bulkSelectedRowIdsRef: bulkSelectedRowIdsRef.current },
                        }),
                    )
                },
            })

            registerShortcut({
                keys: ['Shift', 'ArrowUp'],
                callback: () => {
                    bulkSelectedRowIdsRef.current = bulkSelectedRowIdsRef.current.filter(
                        (id) => id !== activeRowRef.current.id,
                    )
                    handleMoveFocusToPreviousRow()

                    eventTarget.dispatchEvent(
                        new CustomEvent(SignalEnum.BULK_SELECTION_CHANGED, {
                            detail: { bulkSelectedRowIdsRef: bulkSelectedRowIdsRef.current },
                        }),
                    )
                },
            })

            registerShortcut({
                keys: ['X'],
                callback: () => {
                    const isRowSelected = bulkSelectedRowIdsRef.current.includes(activeRowRef.current.id)
                    if (isRowSelected) {
                        bulkSelectedRowIdsRef.current = bulkSelectedRowIdsRef.current.filter(
                            (id) => id !== activeRowRef.current.id,
                        )
                    } else {
                        bulkSelectedRowIdsRef.current.push(activeRowRef.current.id)
                    }

                    eventTarget.dispatchEvent(
                        new CustomEvent(SignalEnum.BULK_SELECTION_CHANGED, {
                            detail: { bulkSelectedRowIdsRef: bulkSelectedRowIdsRef.current },
                        }),
                    )
                },
            })
        }

        return () => {
            unregisterShortcut(['ArrowUp'])
            unregisterShortcut(['ArrowDown'])
            unregisterShortcut(['Enter'])
            unregisterShortcut(['.'])
            unregisterShortcut(['Delete'])

            if (isBulkSelectionConfigured) {
                unregisterShortcut(['Shift', 'ArrowUp'])
                unregisterShortcut(['Shift', 'ArrowDown'])
                unregisterShortcut(['X'])
            }
        }
    }, [])

    return (
        <TableWithResizableConfigWrapper
            {...tableProps}
            activeRowIndex={activeRowIndex}
            activeRowRef={activeRowRef}
            visibleRowsNumberRef={visibleRowsNumberRef}
            bulkSelectedRowIdsRef={bulkSelectedRowIdsRef}
        />
    )
}

const TableWithUseBulkSelectionReturnValue = (tableProps: InternalTablePropsWithWrappers) => {
    const bulkSelectionReturnValue = useBulkSelection()

    const { selectedIdentifiers, handleBulkSelection, isBulkSelectionApplied } = bulkSelectionReturnValue

    const handleClearBulkSelection = () => {
        handleBulkSelection({
            action: BulkSelectionEvents.CLEAR_ALL_SELECTIONS,
        })
    }

    const handleToggleBulkSelectionOnRow = (row: RowsType[number]) => {
        const isRowSelected = selectedIdentifiers[row.id]

        if (!isRowSelected) {
            handleBulkSelection({
                action: BulkSelectionEvents.SELECT_IDENTIFIER,
                data: {
                    // TODO: maybe add a few comments explaining the difference between identifierIds and identifierObject
                    identifierObject: {
                        [row.id]: row,
                    },
                },
            })

            return
        }

        if (isRowSelected && isBulkSelectionApplied) {
            handleBulkSelection({
                action: BulkSelectionEvents.CLEAR_IDENTIFIERS_AFTER_ACROSS_SELECTION,
                data: {
                    identifierIds: [row.id],
                },
            })

            return
        }

        handleBulkSelection({
            action: BulkSelectionEvents.CLEAR_IDENTIFIERS,
            data: {
                identifierIds: [row.id],
            },
        })
    }

    return (
        <TableWithKeyboardShortcuts
            {...tableProps}
            bulkSelectionReturnValue={bulkSelectionReturnValue}
            handleClearBulkSelection={handleClearBulkSelection}
            handleToggleBulkSelectionOnRow={handleToggleBulkSelectionOnRow}
        />
    )
}

const TableWithBulkSelection = (tableProps: InternalTablePropsWithWrappers) => {
    const { bulkSelectionConfig } = tableProps

    return bulkSelectionConfig ? (
        <BulkSelectionProvider getSelectAllDialogStatus={bulkSelectionConfig.getSelectAllDialogStatus}>
            <TableWithUseBulkSelectionReturnValue {...tableProps} />
        </BulkSelectionProvider>
    ) : (
        <TableWithKeyboardShortcuts
            {...tableProps}
            bulkSelectionReturnValue={null}
            handleClearBulkSelection={noop}
            handleToggleBulkSelectionOnRow={noop}
        />
    )
}

const VisibleColumnsWrapper = (tableProps: InternalTablePropsWithWrappers) => {
    const { columns, id, configurableColumns } = tableProps

    const [visibleColumns, setVisibleColumns] = useState(getVisibleColumns({ columns, id, configurableColumns }))

    const setVisibleColumnsWrapper = (newVisibleColumns: typeof visibleColumns) => {
        setVisibleColumns(newVisibleColumns)
        setVisibleColumnsToLocalStorage({ id, visibleColumns: newVisibleColumns })
    }

    useEffect(() => {
        setVisibleColumns(getVisibleColumns({ columns, id, configurableColumns }))
    }, [columns, id, configurableColumns])

    return (
        <TableWithBulkSelection
            {...tableProps}
            visibleColumns={visibleColumns}
            setVisibleColumns={setVisibleColumnsWrapper}
        />
    )
}

const TableWrapper = (tableProps: TableProps) => {
    const { filtersVariant, additionalFilterProps } = tableProps

    const FilterWrapperComponent = getFilterWrapperComponent(filtersVariant)
    const wrapperProps = FilterWrapperComponent === Fragment ? {} : { additionalFilterProps }

    return (
        <UseRegisterShortcutProvider shortcutTimeout={50}>
            <FilterWrapperComponent {...wrapperProps}>
                {/* NOTE: filterData will be populated by FilterWrapperComponent */}
                <VisibleColumnsWrapper
                    {...(tableProps as InternalTablePropsWithWrappers)}
                    resizableConfig={null}
                    filterData={null}
                />
            </FilterWrapperComponent>
        </UseRegisterShortcutProvider>
    )
}

export default TableWrapper
