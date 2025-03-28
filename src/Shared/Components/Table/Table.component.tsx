import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { noop, UseRegisterShortcutProvider } from '@Common/index'

import { InternalTablePropsWithWrappers, RowsType, TableProps } from './types'
import { getFilterWrapperComponent, getVisibleColumns, setVisibleColumnsToLocalStorage } from './utils'
import { BULK_ACTION_GUTTER_LABEL } from './constants'
import UseResizableTableConfigWrapper from './UseResizableTableConfigWrapper'
import { BulkSelectionEvents, BulkSelectionProvider, useBulkSelection } from '../BulkSelection'
import InternalTable from './InternalTable'

import './styles.scss'

const TableWithResizableConfigWrapper = (tableProps: InternalTablePropsWithWrappers) => {
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

    return isResizable ? (
        <UseResizableTableConfigWrapper columns={visibleColumns}>
            <InternalTable {...{ ...tableProps, visibleColumns }} />
        </UseResizableTableConfigWrapper>
    ) : (
        <InternalTable {...{ ...tableProps, visibleColumns }} />
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

    const handleToggleBulkSelectionOnRow = useCallback(
        (row: RowsType[number]) => {
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

const TableWithBulkSelection = (tableProps: InternalTablePropsWithWrappers) => {
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
                <VisibleColumnsWrapper {...(tableProps as InternalTablePropsWithWrappers)} />
            </FilterWrapperComponent>
        </UseRegisterShortcutProvider>
    )
}

export default TableWrapper
