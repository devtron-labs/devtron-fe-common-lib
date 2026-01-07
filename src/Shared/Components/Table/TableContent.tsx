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

import { useEffect, useMemo, useRef, useState } from 'react'

import { Checkbox } from '@Common/Checkbox'
import { DEFAULT_BASE_PAGE_SIZE } from '@Common/Constants'
import { useEffectAfterMount } from '@Common/Helper'
import { Pagination } from '@Common/Pagination'
import { SortableTableHeaderCell } from '@Common/SortableTableHeaderCell'
import { CHECKBOX_VALUE } from '@Common/Types'
import { Button, ButtonStyleType, ButtonVariantType } from '@Shared/Components/Button'
import { Icon } from '@Shared/Components/Icon'
import { ComponentSizeType } from '@Shared/constants'

import { BulkSelection } from '../BulkSelection'
import BulkSelectionActionWidget from './BulkSelectionActionWidget'
import { ACTION_GUTTER_SIZE, BULK_ACTION_GUTTER_LABEL, EVENT_TARGET, SHIMMER_DUMMY_ARRAY } from './constants'
import { BulkActionStateType, FiltersTypeEnum, PaginationEnum, RowType, SignalsType, TableContentProps } from './types'
import useTableWithKeyboardShortcuts from './useTableWithKeyboardShortcuts'
import { getStickyColumnConfig, scrollToShowActiveElementIfNeeded } from './utils'

const TableContent = <
    RowData extends unknown,
    FilterVariant extends FiltersTypeEnum,
    AdditionalProps extends Record<string, any>,
>({
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
    rowActionOnHoverConfig,
    pageSizeOptions,
    filteredRows,
    areFilteredRowsLoading,
    getRows,
    totalRows,
    rowStartIconConfig,
}: TableContentProps<RowData, FilterVariant, AdditionalProps>) => {
    const rowsContainerRef = useRef<HTMLDivElement>(null)
    const parentRef = useRef<HTMLDivElement>(null)
    const bulkSelectionButtonRef = useRef<HTMLLabelElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)
    const skipFocusActiveRowRef = useRef<boolean>(false)

    const [bulkActionState, setBulkActionState] = useState<BulkActionStateType>(null)
    const [showBorderRightOnStickyElements, setShowBorderRightOnStickyElements] = useState(false)
    const [expandState, _setExpandState] = useState<Record<string, boolean>>({})

    const setExpandState: typeof _setExpandState = (value) => {
        skipFocusActiveRowRef.current = true
        _setExpandState(value)
    }

    const { width: rowOnHoverComponentWidth, Component: RowOnHoverComponent } = rowActionOnHoverConfig || {}

    const {
        BulkActionsComponent,
        bulkActionsData = null,
        BulkOperationModal,
        bulkOperationModalData = null,
        disableSelectAllAcrossEvenIfPaginated = false,
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
        gridTemplateColumns: initialGridTemplateColumns = visibleColumns
            .map((column) => (typeof column.size?.fixed === 'number' ? `${column.size.fixed}px` : 'minmax(200px, 1fr)'))
            .join(' '),
    } = resizableConfig ?? {}

    const { visibleRows, areAllRowsExpanded, isAnyRowExpandable } = useMemo(() => {
        const normalizedFilteredRows = filteredRows ?? []

        const paginatedRows =
            paginationVariant !== PaginationEnum.PAGINATED ||
            (paginationVariant === PaginationEnum.PAGINATED && getRows)
                ? normalizedFilteredRows
                : normalizedFilteredRows.slice(offset, offset + pageSize)

        const _isAnyRowExpandable = paginatedRows.some((row) => !!row.expandableRows)

        const _areAllRowsExpanded =
            _isAnyRowExpandable &&
            paginatedRows.reduce((acc, row) => {
                if (row.expandableRows) {
                    return acc && !!expandState[row.id]
                }

                return acc
            }, true)

        const paginatedRowsWithExpandedRows = paginatedRows.flatMap((row) => {
            if (row.expandableRows && expandState[row.id]) {
                return [row, ...row.expandableRows]
            }

            return [row]
        })

        return {
            visibleRows: paginatedRowsWithExpandedRows,
            areAllRowsExpanded: _areAllRowsExpanded,
            isAnyRowExpandable: _isAnyRowExpandable,
        }
    }, [paginationVariant, offset, pageSize, filteredRows, expandState])

    const gridTemplateColumnsWithoutExpandButton = rowOnHoverComponentWidth
        ? `${initialGridTemplateColumns} ${typeof rowOnHoverComponentWidth === 'number' ? `minmax(${rowOnHoverComponentWidth}px, 1fr)` : rowOnHoverComponentWidth}`
        : initialGridTemplateColumns

    const gridTemplateColumns = isAnyRowExpandable
        ? `${ACTION_GUTTER_SIZE}px ${gridTemplateColumnsWithoutExpandButton}`
        : gridTemplateColumnsWithoutExpandButton

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

    const bulkSelectionCount = isBulkSelectionApplied ? totalRows : (getSelectedIdentifiersCount?.() ?? 0)

    const isBEPagination = !!getRows

    const showPagination =
        paginationVariant === PaginationEnum.PAGINATED &&
        (isBEPagination || filteredRows?.length > (pageSizeOptions?.[0]?.value ?? DEFAULT_BASE_PAGE_SIZE))

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

    const toggleExpandAll = () => {
        setExpandState(
            visibleRows.reduce((acc, row) => {
                if ((row as RowType<RowData>).expandableRows) {
                    acc[row.id] = !areAllRowsExpanded
                }

                return acc
            }, {}),
        )
    }

    const focusActiveRow = (node: HTMLDivElement) => {
        if (skipFocusActiveRowRef.current) {
            skipFocusActiveRowRef.current = false
            return
        }

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
            const isExpandedRow = row.id.startsWith('expanded-row')

            const handleChangeActiveRowIndex = () => {
                setActiveRowIndex(visibleRowIndex)
            }

            const handleToggleBulkSelectionForRow = () => {
                handleToggleBulkSelectionOnRow(row)
            }

            const toggleExpandRow = () => {
                setExpandState({
                    ...expandState,
                    [row.id]: !expandState[row.id],
                })
            }

            const hasBulkOrExpandAction =
                (isAnyRowExpandable && !isExpandedRow && !!(row as RowType<RowData>).expandableRows) ||
                !!bulkSelectionReturnValue

            return (
                <div
                    key={row.id}
                    ref={isRowActive ? focusActiveRow : null}
                    onClick={handleChangeActiveRowIndex}
                    className={`dc__grid px-20 dc__min-width-fit-content checkbox__parent-container dc__opacity-hover dc__opacity-hover--parent ${
                        showSeparatorBetweenRows ? 'border__secondary--bottom' : ''
                    } fs-13 fw-4 lh-20 cn-9 generic-table__row dc__gap-16 ${
                        isRowActive ? 'generic-table__row--active checkbox__parent-container--active' : ''
                    } ${rowActionOnHoverConfig ? 'dc__opacity-hover dc__opacity-hover--parent' : ''} ${
                        isRowBulkSelected ? 'generic-table__row--bulk-selected' : ''
                    } ${isExpandedRow ? 'generic-table__row--expanded-row' : ''} ${
                        rowStartIconConfig && hasBulkOrExpandAction ? 'with-start-icon-and-bulk-or-expand-action' : ''
                    } ${!isExpandedRow && expandState[row.id] ? 'generic-table__row--is-expanded' : ''}`}
                    style={{
                        gridTemplateColumns,
                    }}
                    data-active={isRowActive}
                    // NOTE: by giving it a negative tabIndex we can programmatically focus it through .focus()
                    tabIndex={-1}
                >
                    {rowStartIconConfig && !isExpandedRow && (
                        <div className="flex row-start-icon">
                            <Icon {...rowStartIconConfig} />
                        </div>
                    )}

                    {!isExpandedRow && !!(row as RowType<RowData>).expandableRows ? (
                        <div className="flex expand-row-btn">
                            <Button
                                // NOTE: this dataTestId is being used in styles.scss
                                dataTestId={`expand-row-${row.id}`}
                                icon={
                                    <Icon
                                        name="ic-expand-right-sm"
                                        color={null}
                                        rotateBy={expandState[row.id] ? 90 : 0}
                                    />
                                }
                                ariaLabel="Expand row"
                                showAriaLabelInTippy={false}
                                variant={ButtonVariantType.borderLess}
                                size={ComponentSizeType.xs}
                                style={ButtonStyleType.neutral}
                                onClick={toggleExpandRow}
                            />
                        </div>
                    ) : null}

                    {/* empty div needed for alignment; therefore hide if rowStartIconConfig (only applies to parent rows) is present */}
                    {isAnyRowExpandable &&
                        (isExpandedRow || (!(row as RowType<RowData>).expandableRows && !rowStartIconConfig)) && (
                            <div />
                        )}

                    {visibleColumns.map(({ field, horizontallySticky: isStickyColumn, CellComponent }, index) => {
                        const isBulkActionGutter = field === BULK_ACTION_GUTTER_LABEL
                        const horizontallySticky = isStickyColumn || isBulkActionGutter
                        const { className: stickyClassName = '', left: stickyLeftValue = '' } = horizontallySticky
                            ? getStickyColumnConfig(gridTemplateColumns, index)
                            : {}

                        if (isBulkActionGutter && !isExpandedRow) {
                            return (
                                <div
                                    className={`flexbox dc__align-items-center ${stickyClassName} bulk-action-checkbox`}
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
                                        isExpandedRow={isExpandedRow}
                                        isRowInExpandState={expandState[row.id]}
                                        {...additionalProps}
                                    />
                                ) : (
                                    <div className="flex left">
                                        <span key={field} className="fs-13 fw-4 cn-9 lh-20 dc__truncate">
                                            {row.data[field]}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )
                    })}

                    {!isExpandedRow && RowOnHoverComponent && (
                        <div
                            className={`dc__position-sticky dc__right-0 dc__zi-1 ${!isRowActive ? 'dc__opacity-hover--child' : ''}`}
                        >
                            <RowOnHoverComponent row={row} {...additionalProps} />
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
                                {isAnyRowExpandable ? (
                                    <Button
                                        dataTestId="expand-all-rows"
                                        icon={
                                            <Icon
                                                name="ic-expand-right-sm"
                                                color={null}
                                                rotateBy={areAllRowsExpanded ? 90 : 0}
                                            />
                                        }
                                        ariaLabel="Expand row"
                                        showAriaLabelInTippy={false}
                                        variant={ButtonVariantType.borderLess}
                                        size={ComponentSizeType.xs}
                                        style={ButtonStyleType.neutral}
                                        onClick={toggleExpandAll}
                                    />
                                ) : null}

                                {visibleColumns.map(
                                    (
                                        {
                                            label,
                                            field,
                                            isSortable,
                                            size,
                                            showTippyOnTruncate,
                                            horizontallySticky: isStickyColumn,
                                            infoTooltipText,
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
                                                        showPagination={
                                                            disableSelectAllAcrossEvenIfPaginated
                                                                ? false
                                                                : showPagination
                                                        }
                                                        showChevronDownIcon={false}
                                                        selectAllIfNotPaginated
                                                    />
                                                </div>
                                            )
                                        }

                                        return (
                                            <div
                                                className={`flex left ${stickyClassName}`}
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
                                                    infoTooltipText={infoTooltipText}
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

            {showPagination && !areFilteredRowsLoading && (
                <Pagination
                    pageSize={pageSize}
                    changePage={changePage}
                    changePageSize={changePageSize}
                    offset={offset}
                    rootClassName="border__secondary--top flex dc__content-space px-20"
                    size={totalRows}
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
