import { useEffect, useMemo, useRef, useState } from 'react'

import { Checkbox } from '@Common/Checkbox'
import { DEFAULT_BASE_PAGE_SIZE } from '@Common/Constants'
import { useEffectAfterMount } from '@Common/Helper'
import { Pagination } from '@Common/Pagination'
import { SortableTableHeaderCell } from '@Common/SortableTableHeaderCell'
import { CHECKBOX_VALUE } from '@Common/Types'

import { BulkSelection } from '../BulkSelection'
import BulkSelectionActionWidget from './BulkSelectionActionWidget'
import { BULK_ACTION_GUTTER_LABEL, EVENT_TARGET, SHIMMER_DUMMY_ARRAY } from './constants'
import { BulkActionStateType, PaginationEnum, SignalsType, TableContentProps } from './types'
import useTableWithKeyboardShortcuts from './useTableWithKeyboardShortcuts'
import { getStickyColumnConfig, scrollToShowActiveElementIfNeeded } from './utils'

const TableContent = ({
    filterData,
    rows,
    resizableConfig,
    additionalProps,
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
    filteredRows,
    areFilteredRowsLoading,
}: TableContentProps) => {
    const rowsContainerRef = useRef<HTMLDivElement>(null)
    const parentRef = useRef<HTMLDivElement>(null)
    const bulkSelectionButtonRef = useRef<HTMLLabelElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)

    const [bulkActionState, setBulkActionState] = useState<BulkActionStateType>(null)
    const [showBorderRightOnStickyElements, setShowBorderRightOnStickyElements] = useState(false)

    const {
        BulkActionsComponent,
        bulkActionsData = null,
        BulkOperationModal,
        bulkOperationModalData = null,
    } = bulkSelectionConfig ?? {}

    const { showSeparatorBetweenRows = true } = stylesConfig ?? {}

    const { sortBy, sortOrder, handleSorting, pageSize, offset, changePage, changePageSize } = filterData ?? {}

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

    useEffect(() => {
        const scrollEventHandler = () => {
            setShowBorderRightOnStickyElements(rowsContainerRef.current?.scrollLeft > 0)
        }

        const preventScrollByKeyboard = (event: KeyboardEvent) => {
            if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
                event.preventDefault()
            }
        }

        rowsContainerRef.current.addEventListener('scroll', scrollEventHandler)
        rowsContainerRef.current.addEventListener('keydown', preventScrollByKeyboard)
    }, [])

    const bulkSelectionCount = isBulkSelectionApplied && rows ? rows.length : (getSelectedIdentifiersCount?.() ?? 0)

    const visibleRows = useMemo(() => {
        const normalizedFilteredRows = filteredRows ?? []

        const paginatedRows =
            paginationVariant !== PaginationEnum.PAGINATED
                ? normalizedFilteredRows
                : normalizedFilteredRows.slice(offset, offset + pageSize)

        return paginatedRows
    }, [paginationVariant, offset, pageSize, filteredRows])

    const showPagination =
        paginationVariant === PaginationEnum.PAGINATED &&
        filteredRows?.length > (pageSizeOptions?.[0]?.value ?? DEFAULT_BASE_PAGE_SIZE)

    const { activeRowIndex, setActiveRowIndex, shortcutContainerProps } = useTableWithKeyboardShortcuts(
        { bulkSelectionConfig, bulkSelectionReturnValue, handleToggleBulkSelectionOnRow },
        visibleRows,
        showPagination,
        bulkSelectionButtonRef,
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

    const getTriggerSortingHandler = (newSortBy: string) => () => {
        handleSorting(newSortBy)
    }

    const focusActiveRow = (node: HTMLDivElement) => {
        if (
            node &&
            !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName.toUpperCase()) &&
            node.dataset.active === 'true'
        ) {
            node.focus({ preventScroll: true })
            scrollToShowActiveElementIfNeeded(node, rowsContainerRef.current, headerRef.current?.offsetHeight)
            // eslint-disable-next-line no-param-reassign
            node.dataset.active = 'false'
        }
    }

    const onBulkOperationModalClose = () => {
        setBulkActionState(null)
    }

    const getBulkSelections = () => {
        if (isBulkSelectionApplied && rows) {
            return filteredRows
        }

        return Object.values(bulkSelectionState)
    }

    const renderRows = () => {
        if (loading) {
            return SHIMMER_DUMMY_ARRAY.map((shimmerRowLabel) => (
                <div
                    key={shimmerRowLabel}
                    className={`px-20 flexbox py-12 dc__gap-16 ${showSeparatorBetweenRows ? 'border__secondary--bottom' : ''}`}
                >
                    {isBulkSelectionConfigured ? <div className="shimmer w-20" /> : null}
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
                    {visibleColumns.map(({ label }) => (
                        <div key={label} className="py-12 flex" aria-label="Loading...">
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
                    ref={isRowActive ? focusActiveRow : null}
                    onClick={handleChangeActiveRowIndex}
                    className={`dc__grid px-20 dc__min-width-fit-content checkbox__parent-container ${
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
                    {visibleColumns.map(({ field, horizontallySticky: isStickyColumn, CellComponent }, index) => {
                        const isBulkActionGutter = field === BULK_ACTION_GUTTER_LABEL
                        const horizontallySticky = isStickyColumn || isBulkActionGutter
                        const { className: stickyClassName = '', left: stickyLeftValue = '' } = horizontallySticky
                            ? getStickyColumnConfig(gridTemplateColumns, index)
                            : {}

                        if (isBulkActionGutter) {
                            return (
                                <div
                                    className={`flexbox dc__align-items-center ${stickyClassName}`}
                                    style={{ left: stickyLeftValue }}
                                    key={field}
                                >
                                    <Checkbox
                                        isChecked={isRowBulkSelected}
                                        onChange={handleToggleBulkSelectionForRow}
                                        rootClassName="mb-0"
                                        value={CHECKBOX_VALUE.CHECKED}
                                    />
                                </div>
                            )
                        }

                        return (
                            <div
                                className={`${stickyClassName} generic-table__cell`}
                                style={{ left: stickyLeftValue }}
                                key={field}
                            >
                                {CellComponent ? (
                                    <CellComponent
                                        field={field}
                                        value={row.data[field]}
                                        signals={EVENT_TARGET as SignalsType}
                                        row={row}
                                        filterData={filterData as any}
                                        isRowActive={isRowActive}
                                        {...additionalProps}
                                    />
                                ) : (
                                    <span key={field} className="py-12">
                                        {row.data[field]}
                                    </span>
                                )}
                            </div>
                        )
                    })}

                    {RowActionsOnHoverComponent && (
                        <div className="dc__position-fixed dc__right-0 dc__zi-1 dc__opacity-hover--child">
                            <RowActionsOnHoverComponent row={row} />
                        </div>
                    )}
                </div>
            )
        })
    }

    return (
        <div
            {...shortcutContainerProps}
            tabIndex={-1}
            role="grid"
            className="generic-table flexbox-col dc__overflow-hidden flex-grow-1 dc__outline-none-imp"
        >
            <div className="flexbox-col flex-grow-1 w-100 dc__overflow-hidden" ref={parentRef}>
                <div
                    ref={rowsContainerRef}
                    className={`flex-grow-1 flexbox-col dc__overflow-auto ${showBorderRightOnStickyElements ? 'generic-table--scrolled' : ''}`}
                >
                    <div
                        ref={headerRef}
                        className="bg__primary dc__min-width-fit-content px-20 border__secondary--bottom dc__position-sticky dc__zi-2 dc__top-0 generic-table__header"
                    >
                        {loading ? (
                            <div className="flexbox py-12 dc__gap-16">
                                {isBulkSelectionConfigured ? <div className="shimmer w-20" /> : null}
                                {SHIMMER_DUMMY_ARRAY.map((label) => (
                                    <div key={label} className="shimmer w-200" />
                                ))}
                            </div>
                        ) : (
                            <div
                                className="dc__grid fw-6 cn-7 fs-12 lh-20 py-8 dc__gap-16"
                                style={{
                                    gridTemplateColumns,
                                }}
                            >
                                {visibleColumns.map(
                                    (
                                        {
                                            label,
                                            field,
                                            isSortable,
                                            size,
                                            showTippyOnTruncate,
                                            horizontallySticky: isStickyColumn,
                                        },
                                        index,
                                    ) => {
                                        const isResizable = !!size?.range
                                        const isBulkActionGutter = field === BULK_ACTION_GUTTER_LABEL
                                        const horizontallySticky = isStickyColumn || isBulkActionGutter
                                        const { className: stickyClassName = '', left: stickyLeftValue = '' } =
                                            horizontallySticky ? getStickyColumnConfig(gridTemplateColumns, index) : {}

                                        if (field === BULK_ACTION_GUTTER_LABEL) {
                                            return (
                                                <div
                                                    className={`flex ${stickyClassName}`}
                                                    style={{ left: stickyLeftValue }}
                                                    key={field}
                                                >
                                                    <BulkSelection
                                                        ref={bulkSelectionButtonRef}
                                                        key={field}
                                                        showPagination={showPagination}
                                                        showChevronDownIcon={false}
                                                        selectAllIfNotPaginated
                                                    />
                                                </div>
                                            )
                                        }

                                        return (
                                            <div
                                                className={`${stickyClassName}`}
                                                style={{ left: stickyLeftValue }}
                                                key={field}
                                            >
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
                                            </div>
                                        )
                                    },
                                )}
                            </div>
                        )}
                    </div>
                    {renderRows()}
                </div>

                {!!bulkSelectionConfig && !!bulkSelectionCount && (
                    <BulkSelectionActionWidget
                        count={bulkSelectionCount}
                        handleClearBulkSelection={handleClearBulkSelection}
                        parentRef={parentRef}
                        BulkActionsComponent={BulkActionsComponent}
                        setBulkActionState={setBulkActionState}
                        bulkActionsData={bulkActionsData}
                    />
                )}
            </div>

            {showPagination && (
                <Pagination
                    pageSize={pageSize}
                    changePage={changePage}
                    changePageSize={changePageSize}
                    offset={offset}
                    rootClassName="border__secondary--top flex dc__content-space px-20"
                    size={filteredRows.length}
                    pageSizeOptions={pageSizeOptions}
                />
            )}

            {bulkActionState && (
                <BulkOperationModal
                    action={bulkActionState}
                    onClose={onBulkOperationModalClose}
                    bulkOperationModalData={bulkOperationModalData}
                    isBulkSelectionApplied={isBulkSelectionApplied}
                    selections={getBulkSelections()}
                />
            )}
        </div>
    )
}

export default TableContent
