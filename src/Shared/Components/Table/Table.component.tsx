import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
    noop,
    UseRegisterShortcutProvider,
    useResizableTableConfig,
    useStateFilters,
    useUrlFilters,
} from '@Common/index'

import {
    FiltersTypeEnum,
    FilterWrapperProps,
    InternalTableProps,
    RowType,
    TableProps,
    TableWithBulkSelectionProps,
    UseResizableTableConfigWrapperProps,
    VisibleColumnsWrapperProps,
} from './types'
import { getVisibleColumns, setVisibleColumnsToLocalStorage } from './utils'
import { BULK_ACTION_GUTTER_LABEL } from './constants'
import { BulkSelectionEvents, BulkSelectionProvider, useBulkSelection } from '../BulkSelection'
import InternalTable from './InternalTable'

import './styles.scss'

const UseResizableTableConfigWrapper = (props: InternalTableProps) => {
    const { columns } = props

    const resizableConfig = useResizableTableConfig({
        headersConfig: columns.map(({ label, size }) => {
            if (size.range) {
                const {
                    range: { minWidth, maxWidth, startWidth },
                } = size

                return {
                    id: label,
                    minWidth,
                    width: startWidth,
                    maxWidth: maxWidth === 'infinite' ? Number.MAX_SAFE_INTEGER : maxWidth,
                }
            }

            return {
                id: label,
                minWidth: size.fixed,
                width: size.fixed,
                maxWidth: size.fixed,
            }
        }),
    })

    return <InternalTable {...props} resizableConfig={resizableConfig} />
}

const TableWithResizableConfigWrapper = (tableProps: UseResizableTableConfigWrapperProps) => {
    const { visibleColumns: columnsWithoutBulkActionGutter, bulkSelectionConfig: bulkActionsConfig } = tableProps

    const visibleColumns = useMemo(
        () =>
            bulkActionsConfig
                ? [{ size: { fixed: 40 }, field: BULK_ACTION_GUTTER_LABEL }, ...columnsWithoutBulkActionGutter]
                : columnsWithoutBulkActionGutter,
        [!!bulkActionsConfig, columnsWithoutBulkActionGutter],
    )

    const isResizable = visibleColumns.some(({ size }) => !!size?.range)

    if (isResizable && visibleColumns.some(({ size }) => size === null)) {
        throw new Error('If any column is resizable, all columns must have a fixed size')
    }

    const commonProps = { ...tableProps, visibleColumns, resizableConfig: null } as InternalTableProps

    return isResizable ? <UseResizableTableConfigWrapper {...commonProps} /> : <InternalTable {...commonProps} />
}

const TableWithUseBulkSelectionReturnValue = (tableProps: TableWithBulkSelectionProps) => {
    const bulkSelectionReturnValue = useBulkSelection()

    const { selectedIdentifiers, handleBulkSelection, isBulkSelectionApplied } = bulkSelectionReturnValue

    const handleClearBulkSelection = () => {
        handleBulkSelection({
            action: BulkSelectionEvents.CLEAR_ALL_SELECTIONS,
        })
    }

    const handleToggleBulkSelectionOnRow = useCallback(
        (row: RowType) => {
            const isRowSelected = selectedIdentifiers[row.id]

            if (!isRowSelected) {
                /**
                 * !FIXME: handleBulkSelection does not handle multiple updates in a single call
                 * can be done by using callbacks when setting setIdentifiers in BulkSelectionProvider
                 */
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

            handleBulkSelection({
                action: isBulkSelectionApplied
                    ? BulkSelectionEvents.CLEAR_IDENTIFIERS_AFTER_ACROSS_SELECTION
                    : BulkSelectionEvents.CLEAR_IDENTIFIERS,
                data: {
                    identifierIds: [row.id],
                },
            })
        },
        [isBulkSelectionApplied, selectedIdentifiers],
    )

    return (
        <TableWithResizableConfigWrapper
            {...tableProps}
            bulkSelectionReturnValue={bulkSelectionReturnValue}
            handleClearBulkSelection={handleClearBulkSelection}
            handleToggleBulkSelectionOnRow={handleToggleBulkSelectionOnRow}
        />
    )
}

const TableWithBulkSelection = (tableProps: TableWithBulkSelectionProps) => {
    const { bulkSelectionConfig } = tableProps

    return bulkSelectionConfig ? (
        <BulkSelectionProvider getSelectAllDialogStatus={bulkSelectionConfig.getSelectAllDialogStatus}>
            <TableWithUseBulkSelectionReturnValue {...tableProps} />
        </BulkSelectionProvider>
    ) : (
        <TableWithResizableConfigWrapper
            {...tableProps}
            bulkSelectionReturnValue={null}
            handleClearBulkSelection={noop}
            handleToggleBulkSelectionOnRow={noop}
        />
    )
}

const VisibleColumnsWrapper = (tableProps: VisibleColumnsWrapperProps) => {
    const { columns, id, areColumnsConfigurable } = tableProps

    const [visibleColumns, setVisibleColumns] = useState(getVisibleColumns({ columns, id, areColumnsConfigurable }))

    const setVisibleColumnsWrapper = (newVisibleColumns: typeof visibleColumns) => {
        setVisibleColumns(newVisibleColumns)
        setVisibleColumnsToLocalStorage({ id, visibleColumns: newVisibleColumns })
    }

    useEffect(() => {
        setVisibleColumns(getVisibleColumns({ columns, id, areColumnsConfigurable }))
    }, [columns, id, areColumnsConfigurable])

    return (
        <TableWithBulkSelection
            {...tableProps}
            visibleColumns={visibleColumns}
            setVisibleColumns={setVisibleColumnsWrapper}
        />
    )
}

const UseStateFilterWrapper = (props: FilterWrapperProps) => {
    const { additionalFilterProps } = props

    const filterData = useStateFilters<string>(additionalFilterProps)

    return <VisibleColumnsWrapper {...props} filterData={filterData} />
}

const UseUrlFilterWrapper = (props: FilterWrapperProps) => {
    const { additionalFilterProps } = props

    const filterData = useUrlFilters<string, unknown>(additionalFilterProps)

    return <VisibleColumnsWrapper {...props} filterData={filterData} />
}

const TableWrapper = (tableProps: TableProps) => {
    const { filtersVariant } = tableProps
    const tableContainerRef = useRef<HTMLDivElement>(null)

    const renderContent = () => {
        if (filtersVariant === FiltersTypeEnum.NONE) {
            return <UseStateFilterWrapper {...{ ...tableProps, tableContainerRef }} />
        }

        if (filtersVariant === FiltersTypeEnum.URL) {
            return <UseUrlFilterWrapper {...{ ...tableProps, tableContainerRef }} />
        }

        return <VisibleColumnsWrapper {...{ ...tableProps, tableContainerRef, filterData: null }} />
    }

    return (
        <UseRegisterShortcutProvider eventListenerTargetRef={tableContainerRef} shortcutTimeout={50} stopPropagation>
            {renderContent()}
        </UseRegisterShortcutProvider>
    )
}

export default TableWrapper
