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

import { ReactComponent as ICArrowDown } from '../../../Assets/Icon/ic-arrow-down.svg'
import { ReactComponent as ICCross } from '../../../Assets/Icon/ic-cross.svg'
import { ResizableTagTextArea, SortingOrder, useStateFilters } from '../../../Common'
import { stringComparatorBySortOrder } from '../../Helpers'
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
}: KeyValueTableProps<K>) => {
    // CONSTANTS
    const { headers, rows } = config
    const firstHeaderKey = headers[0].key
    const secondHeaderKey = headers[1].key

    // STATES
    const [_rows, setRows] = useState<KeyValueRow<K>[]>(rows)
    const [newRowAdded, setNewRowAdded] = useState(false)

    // HOOKS
    const { sortBy, sortOrder, handleSorting } = useStateFilters({
        initialSortKey: firstHeaderKey,
    })
    const inputRowRef = useRef<HTMLTextAreaElement>()
    const keyTextAreaRef = useRef<Record<string, React.RefObject<HTMLTextAreaElement>>>()
    const valueTextAreaRef = useRef<Record<string, React.RefObject<HTMLTextAreaElement>>>()

    if (!keyTextAreaRef.current) {
        keyTextAreaRef.current = _rows.reduce((acc, curr) => ({ ...acc, [curr.id]: createRef() }), {})
    }

    if (!valueTextAreaRef.current) {
        valueTextAreaRef.current = _rows.reduce((acc, curr) => ({ ...acc, [curr.id]: createRef() }), {})
    }

    useEffect(() => {
        const sortedRows = [..._rows]
        sortedRows.sort((a, b) => stringComparatorBySortOrder(a.data[sortBy].value, b.data[sortBy].value, sortOrder))
        setRows(sortedRows)
    }, [sortOrder])

    useEffect(() => {
        const firstRow = _rows?.[0]
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
    }, [_rows, newRowAdded])

    // METHODS
    const onSortBtnClick = () => handleSorting(sortBy)

    const onNewRowAdd = (key: K) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.target

        const id = Date.now().toString(16)
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

        setNewRowAdded(true)
        setRows([data, ..._rows])

        keyTextAreaRef.current = {
            ...keyTextAreaRef.current,
            [id]: createRef(),
        }
        valueTextAreaRef.current = {
            ...valueTextAreaRef.current,
            [id]: createRef(),
        }
    }

    const onRowDataEdit =
        (row: KeyValueRow<K>, key: K, rowIndex: number) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const { value } = e.target

            let newRows = []
            if (!value && !row.data[key === firstHeaderKey ? secondHeaderKey : firstHeaderKey].value) {
                newRows = _rows.filter((_, idx) => idx !== rowIndex)

                delete keyTextAreaRef.current[row.id]
                delete valueTextAreaRef.current[row.id]

                if (inputRowRef.current) {
                    inputRowRef.current.focus()
                }
            } else {
                newRows = [
                    ..._rows.slice(0, rowIndex),
                    {
                        ...row,
                        data: {
                            ...row.data,
                            [key]: {
                                ...row.data[key],
                                value,
                            },
                        },
                    },
                    ..._rows.slice(rowIndex + 1),
                ]
            }

            setRows(newRows)
            onChange?.(rowIndex, key, value)
        }

    const onRowDelete = (rowIndex: number, row: KeyValueRow<K>) => (e: React.MouseEvent<HTMLButtonElement>) => {
        const newRows = _rows.filter((_, idx) => idx !== rowIndex)
        setRows(newRows)

        delete keyTextAreaRef.current[row.id]
        delete valueTextAreaRef.current[row.id]

        onDelete?.(e, rowIndex)
    }

    return (
        <div style={{ minHeight: '500px', background: 'white', padding: '2px' }}>
            <div className="dc__border br-4 w-100 table-container">
                <div
                    className={`table-row flexbox dc__align-items-center bcn-50 ${!isAdditionNotAllowed || _rows.length ? 'dc__border-bottom' : ''}`}
                    style={{ borderColor: 'var(--N100)' }}
                >
                    {headers.map(({ key, label, className }) =>
                        isSortable && key === firstHeaderKey ? (
                            <button
                                key={key}
                                type="button"
                                className={`dc__unset-button-styles cn-9 fs-13 lh-20 py-8 px-12 fw-6 flexbox dc__align-items-center dc__gap-2 head__key ${className || ''}`}
                                onClick={onSortBtnClick}
                            >
                                {label}
                                <ICArrowDown
                                    className="icon-dim-16 fcn-7 rotate cursor"
                                    style={{
                                        ['--rotateBy' as string]: sortOrder === SortingOrder.ASC ? '0deg' : '180deg',
                                    }}
                                />
                            </button>
                        ) : (
                            <div
                                key={key}
                                className={`cn-9 fs-13 lh-20 py-8 px-12 fw-6 flexbox dc__align-items-center dc__gap-2 ${key === firstHeaderKey ? 'head__key' : 'flex-grow-1'} ${className || ''}`}
                            >
                                {label}
                            </div>
                        ),
                    )}
                    {!!headerComponent && <div className="px-12">{headerComponent}</div>}
                </div>
                {!isAdditionNotAllowed && (
                    <div
                        className={`table-row flexbox dc__align-items-center ${_rows.length ? 'dc__border-bottom' : ''}`}
                        style={{ borderColor: 'var(--N100)' }}
                    >
                        {headers.map(({ key }) => (
                            <div
                                key={key}
                                className={`cn-9 fs-13 lh-20 py-8 px-12 flex dc__overflow-auto ${key === firstHeaderKey ? 'head__key' : 'flex-grow-1'}`}
                            >
                                <textarea
                                    ref={key === firstHeaderKey ? inputRowRef : undefined}
                                    className="table-input table-input__text-area pt-8 pb-8 pl-10 pb-10 lh-20 fs-13 fw-4"
                                    value=""
                                    rows={1}
                                    placeholder={placeholder[key]}
                                    onChange={onNewRowAdd(key)}
                                />
                            </div>
                        ))}
                    </div>
                )}
                {_rows.map((row, index) => (
                    <div
                        key={row.id}
                        className={`table-row flexbox dc__align-items-center ${index !== _rows.length - 1 ? 'dc__border-bottom' : ''}`}
                        style={{ borderColor: 'var(--N100)' }}
                    >
                        {headers.map(({ key }) => (
                            <div
                                key={key}
                                className={`cn-9 fs-13 lh-20 py-8 px-12 dc__overflow-auto flexbox dc__align-items-center dc__gap-4 ${key === firstHeaderKey ? 'head__key' : 'flex-grow-1'}`}
                            >
                                {maskValue?.[key] && row.data[key].value ? (
                                    '*****'
                                ) : (
                                    <>
                                        <ResizableTagTextArea
                                            {...row.data[key]}
                                            className="table-input"
                                            minHeight={20}
                                            maxHeight={144}
                                            value={row.data[key].value}
                                            placeholder={placeholder[key]}
                                            onChange={onRowDataEdit(row, key, index)}
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
                                            disableOnBlurResizeToMinHeight
                                        />
                                        {row.data[key].showAsterisk && (
                                            <span className="cr-5 fs-16 dc__align-self-start px-6">*</span>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            className=" dc__unset-button-styles icon flex dc__no-shrink py-10 px-8"
                            onClick={onRowDelete(index, row)}
                        >
                            <ICCross
                                aria-label="delete-data"
                                className="icon-dim-16 fcn-4 dc__align-self-start cursor"
                            />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
