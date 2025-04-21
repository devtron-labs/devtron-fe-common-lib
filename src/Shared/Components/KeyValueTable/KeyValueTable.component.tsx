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

import { useStateFilters } from '@Common/Hooks'

import { DynamicDataTable } from '../DynamicDataTable'
import { KeyValueTableDataType, KeyValueTableInternalProps, KeyValueTableProps } from './KeyValueTable.types'
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

    // HOOKS
    const { sortBy, sortOrder, handleSorting } = useStateFilters<KeyValueTableDataType>({
        initialSortKey: isSortable ? 'key' : null,
    })

    // COMPUTED ROWS FOR DYNAMIC DATA TABLE
    const rows = useMemo<KeyValueTableInternalProps['rows']>(
        () => getKeyValueTableRows({ rows: initialRows, placeholder, maskValue }),
        [initialRows, placeholder, maskValue, isSortable, sortOrder, sortBy],
    )

    // Set cell error on mount
    useEffect(() => {
        const { isValid, updatedCellError } = getKeyValueTableCellError({
            rows,
            validateDuplicateKeys,
            validateEmptyKeys,
            validationSchema: parentValidationSchema,
        })

        setCellError(updatedCellError)
        onError?.(!isValid)
    }, [])

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
            rows={getKeyValueTableSortedRows({ isSortable, rows, sortBy, sortOrder })}
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
