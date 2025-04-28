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

import { useEffect, useMemo, useState } from 'react'

import { useEffectAfterMount } from '@Common/Helper'
import { useStateFilters } from '@Common/Hooks'

import { DynamicDataTable } from '../DynamicDataTable'
import {
    KeyValueTableDataType,
    KeyValueTableInternalProps,
    KeyValueTableProps,
    KeyValueTableRowType,
} from './KeyValueTable.types'
import {
    getEmptyRow,
    getKeyValueHeaders,
    getKeyValueTableCellError,
    getKeyValueTableRows,
    getKeyValueTableSortedRows,
    getModifiedDataForOnChange,
} from './utils'

import './KeyValueTable.scss'

export const KeyValueTable = ({
    headerLabel,
    rows: initialRows,
    placeholder,
    maskValue,
    isSortable,
    headerComponent,
    onChange,
    isAdditionNotAllowed,
    readOnly,
    showError,
    validationSchema: parentValidationSchema,
    onError,
    validateDuplicateKeys = false,
    validateEmptyKeys = false,
}: KeyValueTableProps) => {
    // STATES
    const [cellError, setCellError] = useState<KeyValueTableInternalProps['cellError']>({})
    const [sortedRows, setSortedRows] = useState<KeyValueTableInternalProps['rows']>([])

    // HOOKS
    const { sortBy, sortOrder, handleSorting } = useStateFilters<KeyValueTableDataType>({
        initialSortKey: isSortable ? 'key' : null,
    })

    // COMPUTED ROWS FOR DYNAMIC DATA TABLE
    const rows = useMemo<KeyValueTableInternalProps['rows']>(
        () => getKeyValueTableRows({ rows: initialRows, placeholder, maskValue }),
        [initialRows, placeholder, maskValue, isSortable, sortOrder, sortBy],
    )

    /** Function to update the sorted rows based on the current sorting configuration */
    const updateSortedRows = () => {
        if (isSortable) {
            setSortedRows(
                getKeyValueTableSortedRows({
                    rows,
                    sortBy,
                    sortOrder,
                }),
            )
        }
    }

    useEffect(() => {
        // Set cell error on mount
        const { isValid, updatedCellError } = getKeyValueTableCellError({
            rows,
            validateDuplicateKeys,
            validateEmptyKeys,
            validationSchema: parentValidationSchema,
        })

        setCellError(updatedCellError)
        onError?.(!isValid)

        // Set sorted rows on mount
        updateSortedRows()
    }, [])

    // Sort rows for display purposes only. \
    // The `sortedRows` state is used internally to render the data, while the original `rows` prop remains unaltered during sorting.
    useEffectAfterMount(() => {
        if (isSortable) {
            // Create a map of rows using their IDs for quick lookup
            const rowMap = rows.reduce<Record<KeyValueTableRowType['id'], KeyValueTableInternalProps['rows'][number]>>(
                (acc, row) => {
                    acc[row.id] = row
                    return acc
                },
                {},
            )

            // Create a set of IDs from the currently sorted rows for efficient lookup
            const sortedRowSet = new Set(sortedRows.map(({ id }) => id))

            // Update the sorted rows by filtering out rows that no longer exist and mapping them to the latest data
            const updatedSortedRows = sortedRows.filter(({ id }) => rowMap[id]).map(({ id }) => rowMap[id])

            // Identify rows that are not part of the current sorted set (new or unsorted rows)
            const unsortedRows = rows.filter(({ id }) => !sortedRowSet.has(id))

            // Combine unsorted rows with updated sorted rows and set them as the new sorted rows
            setSortedRows([...unsortedRows, ...updatedSortedRows])
        } else {
            // If sorting is disabled, directly set the rows as the sorted rows
            setSortedRows(rows)
        }
    }, [rows])

    // Update the sorted rows whenever the sorting configuration changes
    useEffectAfterMount(() => {
        updateSortedRows()
    }, [sortBy, sortOrder])

    // METHODS
    const setUpdatedRows = (updatedRows: typeof rows) => {
        const { isValid, updatedCellError } = getKeyValueTableCellError({
            rows: updatedRows,
            validateDuplicateKeys,
            validateEmptyKeys,
            validationSchema: parentValidationSchema,
        })

        setCellError(updatedCellError)
        onError?.(!isValid)

        onChange(getModifiedDataForOnChange(updatedRows))
    }

    const onRowAdd = () => {
        const newRow = getEmptyRow(placeholder)
        const updatedRows = [newRow, ...rows]

        setUpdatedRows(updatedRows)
    }

    const onRowDelete: KeyValueTableInternalProps['onRowDelete'] = (row) => {
        const remainingRows = rows.filter(({ id }) => id !== row.id)

        if (remainingRows.length === 0 && !isAdditionNotAllowed) {
            const emptyRowData = getEmptyRow(placeholder)

            setUpdatedRows([emptyRowData])
            return
        }

        setUpdatedRows(remainingRows)
    }

    const onRowEdit: KeyValueTableInternalProps['onRowEdit'] = (row, headerKey, value) => {
        const updatedRows = rows
        const rowIndex = rows.findIndex(({ id }) => row.id === id)
        const selectedRow = rows[rowIndex]
        if (selectedRow) {
            selectedRow.data[headerKey].value = value
            updatedRows[rowIndex] = selectedRow
        }

        setUpdatedRows(updatedRows)
    }

    return (
        <DynamicDataTable
            headers={getKeyValueHeaders({ headerLabel, isSortable })}
            rows={sortedRows}
            cellError={showError ? cellError : {}}
            onRowAdd={onRowAdd}
            onRowDelete={onRowDelete}
            onRowEdit={onRowEdit}
            headerComponent={headerComponent}
            readOnly={readOnly}
            isAdditionNotAllowed={isAdditionNotAllowed}
            sortingConfig={{
                sortBy,
                sortOrder,
                handleSorting,
            }}
        />
    )
}
