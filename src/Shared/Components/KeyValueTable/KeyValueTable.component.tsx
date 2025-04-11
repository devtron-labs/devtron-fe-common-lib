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

import { debounce, noop } from '@Common/Helper'
import { useStateFilters } from '@Common/Hooks'
import { DEFAULT_SECRET_PLACEHOLDER } from '@Shared/constants'
import { stringComparatorBySortOrder } from '@Shared/Helpers'

import { DynamicDataTable, DynamicDataTableCellValidationState } from '../DynamicDataTable'
import { DUPLICATE_KEYS_VALIDATION_MESSAGE, EMPTY_KEY_VALIDATION_MESSAGE } from './constants'
import {
    KeyValueTableData,
    KeyValueTableDataType,
    KeyValueTableInternalProps,
    KeyValueTableProps,
} from './KeyValueTable.types'
import {
    getEmptyRow,
    getKeyValueHeaders,
    getKeyValueInitialCellError,
    getKeyValueInitialRows,
    getKeyValueTableKeysFrequency,
    getModifiedDataForOnChange,
} from './utils'

import './KeyValueTable.scss'

export const KeyValueTable = ({
    headerLabel,
    initialRows,
    placeholder,
    maskValue,
    isSortable,
    headerComponent,
    onChange,
    isAdditionNotAllowed,
    readOnly,
    showError,
    validationSchema: parentValidationSchema,
    errorMessages: parentErrorMessages = [],
    onError,
    validateDuplicateKeys = false,
    validateEmptyKeys = false,
}: KeyValueTableProps) => {
    // STATES
    const [rows, setRows] = useState<KeyValueTableInternalProps['rows']>(
        getKeyValueInitialRows({ initialRows, placeholder }),
    )

    const [cellError, setCellError] = useState<KeyValueTableInternalProps['cellError']>(
        getKeyValueInitialCellError(rows),
    )

    // HOOKS
    const { sortBy, sortOrder, handleSorting } = useStateFilters<KeyValueTableDataType>({
        initialSortKey: isSortable ? 'key' : null,
    })

    const rowWithMaskedValues = useMemo<typeof rows>(() => {
        if (maskValue && Object.keys(maskValue).length) {
            return rows.map((row) => ({
                ...row,
                data: {
                    ...row.data,
                    key: {
                        ...row.data.key,
                        value: maskValue.key ? DEFAULT_SECRET_PLACEHOLDER : row.data.key.value,
                    },
                    value: {
                        ...row.data.value,
                        value: maskValue.value ? DEFAULT_SECRET_PLACEHOLDER : row.data.value.value,
                    },
                },
            }))
        }

        return rows
    }, [rows, maskValue])

    const debounceOnChange = useCallback(
        debounce((modifiedRows: KeyValueTableData[]) =>
            typeof onChange === 'function' ? onChange(modifiedRows) : noop,
        ),
        [],
    )

    // USE-EFFECTS
    useEffect(() => {
        if (isSortable) {
            setRows((prevRows) => {
                const sortedRows = prevRows
                sortedRows.sort((a, b) =>
                    stringComparatorBySortOrder(a.data[sortBy].value, b.data[sortBy].value, sortOrder),
                )
                return sortedRows
            })
        }
    }, [sortOrder])

    // METHODS
    const validationSchema = (
        value: Parameters<typeof parentValidationSchema>[0],
        key: Parameters<typeof parentValidationSchema>[1],
        rowId: Parameters<typeof parentValidationSchema>[2],
        keysFrequency: Record<string, number> = {},
    ): DynamicDataTableCellValidationState => {
        const trimmedValue = value.trim()

        if (validateDuplicateKeys && key === 'key' && (keysFrequency[trimmedValue] ?? 0) > 1) {
            return {
                isValid: false,
                errorMessages: [DUPLICATE_KEYS_VALIDATION_MESSAGE],
            }
        }

        if (validateEmptyKeys && key === 'key' && !trimmedValue) {
            const isValuePresentAtRow = rows.some(({ id, data }) => id === rowId && data.value.value.trim())
            if (isValuePresentAtRow) {
                return {
                    isValid: false,
                    errorMessages: [EMPTY_KEY_VALIDATION_MESSAGE],
                }
            }
        }

        if (parentValidationSchema) {
            const isValid = parentValidationSchema(value, key, rowId)
            return {
                isValid,
                errorMessages: !isValid ? parentErrorMessages : [],
            }
        }

        return {
            isValid: true,
            errorMessages: [],
        }
    }

    const checkAllRowsAreValid = (updatedRows: typeof rows) => {
        let isValid = true

        const updatedCellError = updatedRows.reduce((acc, { data, id }) => {
            const keyError = validationSchema(
                data.key.value,
                'key',
                id,
                validateDuplicateKeys ? getKeyValueTableKeysFrequency(rows) : {},
            )
            const valueError = validationSchema(data.value.value, 'value', id)

            if (isValid && !(keyError.isValid && valueError.isValid)) {
                isValid = false
            }

            acc[id] = {
                key: keyError,
                value: valueError,
            }

            return acc
        }, {})

        return { isValid, updatedCellError }
    }

    const setUpdatedRows = (updatedRows: typeof rows, shouldDebounceChange = false) => {
        const { isValid, updatedCellError } = checkAllRowsAreValid(updatedRows)

        setRows(updatedRows)
        setCellError(updatedCellError)

        onError?.(!isValid)

        if (shouldDebounceChange) {
            debounceOnChange(getModifiedDataForOnChange(updatedRows))
        } else {
            onChange?.(getModifiedDataForOnChange(updatedRows))
        }
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

        setUpdatedRows(updatedRows, true)
    }

    return (
        <DynamicDataTable
            headers={getKeyValueHeaders({ headerLabel, isSortable })}
            rows={rowWithMaskedValues}
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
