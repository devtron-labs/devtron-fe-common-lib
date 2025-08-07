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

import { useCallback, useEffect, useMemo, useState } from 'react'

import { noop, useResizableTableConfig, useStateFilters, useUrlFilters } from '@Common/index'

import { BulkSelectionEvents, BulkSelectionProvider, useBulkSelection } from '../BulkSelection'
import { BULK_ACTION_GUTTER_LABEL } from './constants'
import InternalTable from './InternalTable'
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

import './styles.scss'

const UseResizableTableConfigWrapper = <
    RowData extends unknown,
    FilterVariant extends FiltersTypeEnum,
    AdditionalProps extends Record<string, any>,
>(
    props: InternalTableProps<RowData, FilterVariant, AdditionalProps>,
) => {
    const { visibleColumns } = props

    const resizableConfig = useResizableTableConfig({
        headersConfig: visibleColumns.map(({ label, size }) => {
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

const TableWithResizableConfigWrapper = <
    RowData extends unknown,
    FilterVariant extends FiltersTypeEnum,
    AdditionalProps extends Record<string, any>,
>(
    tableProps: UseResizableTableConfigWrapperProps<RowData, FilterVariant, AdditionalProps>,
) => {
    const { visibleColumns: columnsWithoutBulkActionGutter, bulkSelectionConfig: bulkActionsConfig } = tableProps

    const visibleColumns = useMemo(
        () =>
            bulkActionsConfig
                ? [{ size: { fixed: 20 }, field: BULK_ACTION_GUTTER_LABEL }, ...columnsWithoutBulkActionGutter]
                : columnsWithoutBulkActionGutter,
        [!!bulkActionsConfig, columnsWithoutBulkActionGutter],
    )

    const isResizable = visibleColumns.some(({ size }) => size && 'range' in size && size.range)

    if (isResizable && visibleColumns.some(({ size }) => size === null)) {
        throw new Error('If any column is resizable, all columns must have a fixed size')
    }

    const commonProps = { ...tableProps, visibleColumns, resizableConfig: null } as InternalTableProps<
        RowData,
        FilterVariant,
        AdditionalProps
    >

    return isResizable ? <UseResizableTableConfigWrapper {...commonProps} /> : <InternalTable {...commonProps} />
}

const TableWithUseBulkSelectionReturnValue = <
    RowData extends unknown = unknown,
    FilterVariant extends FiltersTypeEnum = FiltersTypeEnum.NONE,
    AdditionalProps extends Record<string, any> = {},
>(
    tableProps: TableWithBulkSelectionProps<RowData, FilterVariant, AdditionalProps>,
) => {
    const bulkSelectionReturnValue = useBulkSelection()

    const { selectedIdentifiers, handleBulkSelection, isBulkSelectionApplied } = bulkSelectionReturnValue

    const handleClearBulkSelection = () => {
        handleBulkSelection({
            action: BulkSelectionEvents.CLEAR_ALL_SELECTIONS,
        })
    }

    const handleToggleBulkSelectionOnRow = useCallback(
        (row: RowType<RowData>) => {
            const isRowSelected = selectedIdentifiers[row.id]

            if (!isRowSelected && !isBulkSelectionApplied) {
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

const TableWithBulkSelection = <
    RowData extends unknown,
    FilterVariant extends FiltersTypeEnum,
    AdditionalProps extends Record<string, any>,
>(
    tableProps: TableWithBulkSelectionProps<RowData, FilterVariant, AdditionalProps>,
) => {
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

const VisibleColumnsWrapper = <
    RowData extends unknown,
    FilterVariant extends FiltersTypeEnum,
    AdditionalProps extends Record<string, any>,
>(
    tableProps: VisibleColumnsWrapperProps<RowData, FilterVariant, AdditionalProps>,
) => {
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

const UseStateFilterWrapper = <RowData extends unknown, AdditionalProps extends Record<string, any>>(
    props: FilterWrapperProps<RowData, FiltersTypeEnum.STATE, AdditionalProps>,
) => {
    const { additionalFilterProps } = props

    const filterData = useStateFilters<string>(additionalFilterProps)

    return <VisibleColumnsWrapper {...props} filterData={filterData} />
}

const UseUrlFilterWrapper = <RowData extends unknown, AdditionalProps extends Record<string, any>>(
    props: FilterWrapperProps<RowData, FiltersTypeEnum.URL, AdditionalProps>,
) => {
    const { additionalFilterProps } = props

    const filterData = useUrlFilters<string, unknown>(additionalFilterProps)

    return <VisibleColumnsWrapper {...props} filterData={filterData} />
}

const TableWrapper = <
    RowData extends unknown = unknown,
    FilterVariant extends FiltersTypeEnum = FiltersTypeEnum.NONE,
    AdditionalProps extends Record<string, any> = {},
>(
    tableProps: TableProps<RowData, FilterVariant, AdditionalProps>,
) => {
    const { filtersVariant } = tableProps

    if (filtersVariant === FiltersTypeEnum.STATE) {
        return (
            <UseStateFilterWrapper {...(tableProps as TableProps<RowData, FiltersTypeEnum.STATE, AdditionalProps>)} />
        )
    }

    if (filtersVariant === FiltersTypeEnum.URL) {
        return <UseUrlFilterWrapper {...(tableProps as TableProps<RowData, FiltersTypeEnum.URL, AdditionalProps>)} />
    }

    return (
        <VisibleColumnsWrapper
            {...{ ...(tableProps as TableProps<RowData, FiltersTypeEnum.NONE, AdditionalProps>), filterData: null }}
        />
    )
}

export default TableWrapper
