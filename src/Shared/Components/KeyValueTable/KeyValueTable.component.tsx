/*
 *   Copyright (c) 2024 Devtron Inc.
 *   All rights reserved.

 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at

 *   http://www.apache.org/licenses/LICENSE-2.0

 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */

import React, { createRef, useEffect, useRef, useState } from 'react'

import { ReactComponent as ICArrowDown } from '@Icons/ic-sort-arrow-down.svg'
import { ReactComponent as ICClose } from '@Icons/ic-close.svg'
import { ReactComponent as ICCross } from '@Icons/ic-cross.svg'
import { ResizableTagTextArea, SortingOrder, useStateFilters } from '@Common/index'
import { stringComparatorBySortOrder } from '@Shared/Helpers'
import { DEFAULT_SECRET_PLACEHOLDER } from '@Shared/constants'

import { KeyValueRow, KeyValueTableProps } from './KeyValueTable.types'
import './KeyValueTable.scss'

export const KeyValueTable = <K extends string>({
    config,
    maskValue,
    isSortable,
    headerComponent,
    onChange,
    onDelete,
    placeholder,
    isAdditionNotAllowed,
    readOnly,
    showError,
    validationSchema,
    errorMessages = [],
    onError,
}: KeyValueTableProps<K>) => {
    // CONSTANTS
    const { headers, rows } = config
    const firstHeaderKey = headers[0].key
    const secondHeaderKey = headers[1].key

    // STATES
    const [updatedRows, setUpdatedRows] = useState<KeyValueRow<K>[]>(rows)
    const [newRowAdded, setNewRowAdded] = useState(false)

    // HOOKS
    const { sortBy, sortOrder, handleSorting } = useStateFilters({
        initialSortKey: firstHeaderKey,
    })
    const inputRowRef = useRef<HTMLTextAreaElement>()
    const keyTextAreaRef = useRef<Record<string, React.RefObject<HTMLTextAreaElement>>>()
    const valueTextAreaRef = useRef<Record<string, React.RefObject<HTMLTextAreaElement>>>()

    if (!keyTextAreaRef.current) {
        keyTextAreaRef.current = updatedRows.reduce((acc, curr) => ({ ...acc, [curr.id]: createRef() }), {})
    }

    if (!valueTextAreaRef.current) {
        valueTextAreaRef.current = updatedRows.reduce((acc, curr) => ({ ...acc, [curr.id]: createRef() }), {})
    }

    useEffect(() => {
        const sortedRows = [...updatedRows]
        sortedRows.sort((a, b) => stringComparatorBySortOrder(a.data[sortBy].value, b.data[sortBy].value, sortOrder))
        setUpdatedRows(sortedRows)
    }, [sortOrder])

    useEffect(() => {
        const firstRow = updatedRows?.[0]
        if (firstRow && newRowAdded) {
            setNewRowAdded(false)

            if (
                !firstRow.data[secondHeaderKey].value &&
                keyTextAreaRef.current[firstRow.id].current &&
                valueTextAreaRef.current[firstRow.id].current
            ) {
                keyTextAreaRef.current[firstRow.id].current.focus()
            }
            if (
                !firstRow.data[firstHeaderKey].value &&
                keyTextAreaRef.current[firstRow.id].current &&
                valueTextAreaRef.current[firstRow.id].current
            ) {
                valueTextAreaRef.current[firstRow.id].current.focus()
            }
        }
    }, [newRowAdded])

    // METHODS
    const onSortBtnClick = () => handleSorting(sortBy)

    const checkAllRowsAreValid = (_rows: KeyValueRow<K>[]) => {
        const isValid = _rows.every(
            ({ data: _data }) =>
                validationSchema?.(_data[firstHeaderKey].value) && validationSchema?.(_data[secondHeaderKey].value),
        )

        return isValid
    }

    const onNewRowAdd = (key: K) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.target

        const id = (Date.now() * Math.random()).toString(16)
        const data = {
            data: {
                [firstHeaderKey]: {
                    value: key === firstHeaderKey ? value : '',
                },
                [secondHeaderKey]: {
                    value: key === secondHeaderKey ? value : '',
                },
            },
            id,
        } as KeyValueRow<K>
        const editedRows = [data, ...updatedRows]

        onError?.(!checkAllRowsAreValid(editedRows))
        setNewRowAdded(true)
        setUpdatedRows(editedRows)
        onChange?.(id, key, value)

        keyTextAreaRef.current = {
            ...keyTextAreaRef.current,
            [id]: createRef(),
        }
        valueTextAreaRef.current = {
            ...valueTextAreaRef.current,
            [id]: createRef(),
        }
    }

    const onRowDelete = (row: KeyValueRow<K>) => () => {
        const remainingRows = updatedRows.filter(({ id }) => id !== row.id)
        onError?.(!checkAllRowsAreValid(remainingRows))
        setUpdatedRows(remainingRows)

        delete keyTextAreaRef.current[row.id]
        delete valueTextAreaRef.current[row.id]

        onDelete?.(row.id)
    }

    const onRowDataEdit = (row: KeyValueRow<K>, key: K) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.target

        if (!value && !row.data[key === firstHeaderKey ? secondHeaderKey : firstHeaderKey].value) {
            onRowDelete(row)()

            if (inputRowRef.current) {
                inputRowRef.current.focus()
            }
        } else {
            const rowData = {
                ...row,
                data: {
                    ...row.data,
                    [key]: {
                        ...row.data[key],
                        value,
                    },
                },
            }
            const editedRows = updatedRows.map((_row) => (_row.id === row.id ? rowData : _row))
            onError?.(!checkAllRowsAreValid(editedRows))
            setUpdatedRows(editedRows)
        }
    }

    const onRowDataBlur = (row: KeyValueRow<K>, key: K) => (e: React.FocusEvent<HTMLTextAreaElement>) => {
        const { value } = e.target

        if (value || row.data[key === firstHeaderKey ? secondHeaderKey : firstHeaderKey].value) {
            onChange?.(row.id, key, value)
        }
    }

    return (
        <div className="dc__border br-4 w-100 bcn-0 key-value">
            <div
                className={`key-value__row flexbox dc__align-items-center bcn-50 ${(!readOnly && !isAdditionNotAllowed) || updatedRows.length ? 'dc__border-bottom-n1' : ''}`}
            >
                {headers.map(({ key, label, className }) =>
                    isSortable && key === firstHeaderKey ? (
                        <button
                            key={key}
                            type="button"
                            className={`dc__unset-button-styles cn-9 fs-13 lh-20 py-8 px-12 fw-6 flexbox dc__align-items-center dc__gap-2 dc__align-self-stretch key-value__header__col-1 ${className || ''}`}
                            onClick={onSortBtnClick}
                        >
                            {label}
                            <ICArrowDown
                                className="icon-dim-16 scn-7 rotate cursor"
                                style={{
                                    ['--rotateBy' as string]: sortOrder === SortingOrder.ASC ? '0deg' : '180deg',
                                }}
                            />
                        </button>
                    ) : (
                        <div
                            key={key}
                            className={`cn-9 fs-13 lh-20 py-8 px-12 fw-6 flexbox dc__align-items-center dc__gap-2 ${key === firstHeaderKey ? 'dc__align-self-stretch dc__border-right--n1 key-value__header__col-1' : 'flex-grow-1 dc__border-left-n1'} ${className || ''}`}
                        >
                            {label}
                        </div>
                    ),
                )}
                {!!headerComponent && <div className="px-12">{headerComponent}</div>}
            </div>
            {!readOnly && !isAdditionNotAllowed && (
                <div
                    className={`key-value__row flexbox dc__align-items-center ${updatedRows.length ? 'dc__border-bottom-n1' : ''}`}
                >
                    {headers.map(({ key }) => (
                        <div
                            key={key}
                            className={`cn-9 fs-13 lh-20 flex dc__overflow-auto ${key === firstHeaderKey ? 'dc__align-self-stretch key-value__header__col-1' : 'flex-grow-1 dc__border-left-n1'}`}
                        >
                            <textarea
                                ref={key === firstHeaderKey ? inputRowRef : undefined}
                                className="key-value__row-input key-value__row-input--add placeholder-cn5 py-8 px-12 lh-20 fs-13 fw-4 dc__no-border-radius"
                                value=""
                                rows={1}
                                placeholder={placeholder[key]}
                                onChange={onNewRowAdd(key)}
                            />
                        </div>
                    ))}
                </div>
            )}
            {updatedRows.map((row, index) => (
                <div
                    key={row.id}
                    className={`key-value__row flexbox dc__align-items-center ${index !== updatedRows.length - 1 ? 'dc__border-bottom-n1' : ''}`}
                >
                    {headers.map(({ key }) => (
                        <div
                            key={key}
                            className={`cn-9 fs-13 lh-20 flexbox dc__align-items-center dc__gap-4 dc__position-rel ${key === firstHeaderKey ? 'dc__align-self-stretch key-value__header__col-1' : 'dc__border-left-n1 flex-grow-1'}`}
                        >
                            {maskValue?.[key] && row.data[key].value ? (
                                DEFAULT_SECRET_PLACEHOLDER
                            ) : (
                                <>
                                    <ResizableTagTextArea
                                        {...row.data[key]}
                                        className={`key-value__row-input placeholder-cn5 py-8 px-12 dc__no-border-radius ${showError && !validationSchema?.(row.data[key].value) ? 'key-value__row-input--error no-hover' : ''}`}
                                        minHeight={20}
                                        maxHeight={160}
                                        value={row.data[key].value}
                                        placeholder={placeholder[key]}
                                        onChange={onRowDataEdit(row, key)}
                                        onBlur={onRowDataBlur(row, key)}
                                        refVar={
                                            key === firstHeaderKey
                                                ? keyTextAreaRef.current?.[row.id]
                                                : valueTextAreaRef.current?.[row.id]
                                        }
                                        dependentRef={
                                            key === firstHeaderKey
                                                ? valueTextAreaRef.current?.[row.id]
                                                : keyTextAreaRef.current?.[row.id]
                                        }
                                        disabled={readOnly || row.data[key].disabled}
                                        disableOnBlurResizeToMinHeight
                                    />
                                    {row.data[key].required && (
                                        <span className="cr-5 fs-16 dc__align-self-start px-6 py-8">*</span>
                                    )}
                                    {showError && !validationSchema?.(row.data[key].value) && errorMessages.length && (
                                        <div className="key-value__error bcn-0 dc__border br-4 py-7 px-8 flexbox-col dc__gap-4">
                                            {errorMessages.map((error) => (
                                                <div className="flexbox align-items-center dc__gap-4">
                                                    <ICClose className="icon-dim-16 fcr-5 dc__align-self-start dc__no-shrink" />
                                                    <p className="fs-12 lh-16 cn-7 m-0">{error}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                    {!readOnly && (
                        <button
                            type="button"
                            className="dc__unset-button-styles dc__align-self-stretch dc__no-shrink flex py-10 px-8 dc__border-left-n1--important dc__hover-n50 dc__tab-focus"
                            onClick={onRowDelete(row)}
                        >
                            <ICCross
                                aria-label="delete-row"
                                className="icon-dim-16 fcn-4 dc__align-self-start cursor"
                            />
                        </button>
                    )}
                </div>
            ))}
        </div>
    )
}
