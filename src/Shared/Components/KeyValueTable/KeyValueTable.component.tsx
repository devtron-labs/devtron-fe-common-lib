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
import { KeyValueRow, KeyValueTableProps } from './KeyValueTable.types'

import './KeyValueTable.scss'

export const KeyValueTable = <K extends string>({
    config,
    maskValue,
    isSortable,
    headerComponent,
    onChange,
    onDelete,
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
    const keyTextAreaRef = useRef<React.RefObject<HTMLTextAreaElement>[]>([])
    const valueTextAreaRef = useRef<React.RefObject<HTMLTextAreaElement>[]>([])

    useEffect(() => {
        if (keyTextAreaRef.current.length !== _rows.length) {
            keyTextAreaRef.current = new Array(_rows.length)
                .fill(0)
                .map((_, i) => keyTextAreaRef.current[i] || createRef<HTMLTextAreaElement>())
        }

        if (valueTextAreaRef.current.length !== _rows.length) {
            valueTextAreaRef.current = new Array(_rows.length)
                .fill(0)
                .map((_, i) => valueTextAreaRef.current[i] || createRef<HTMLTextAreaElement>())
        }
    }, [])

    useEffect(() => {
        const sortFn = (a: KeyValueRow<K>, b: KeyValueRow<K>) => {
            if (sortOrder === SortingOrder.ASC) {
                return b.data[sortBy].value.localeCompare(a.data[sortBy].value)
            }
            return a.data[sortBy].value.localeCompare(b.data[sortBy].value)
        }

        const sortedRows = [..._rows]
        sortedRows.sort(sortFn)
        setRows(sortedRows)
    }, [sortOrder])

    useEffect(() => {
        const firstRow = _rows?.[0]
        if (firstRow && newRowAdded) {
            setNewRowAdded(false)

            if (
                !firstRow.data[secondHeaderKey].value &&
                keyTextAreaRef.current[0].current &&
                valueTextAreaRef.current[0].current
            ) {
                keyTextAreaRef.current[0].current.focus()
            }
            if (
                !firstRow.data[firstHeaderKey].value &&
                valueTextAreaRef.current[0].current &&
                valueTextAreaRef.current[0].current
            ) {
                valueTextAreaRef.current[0].current.focus()
            }
        }
    }, [_rows, newRowAdded])

    // METHODS
    const onSortBtnClick = () => handleSorting(sortBy)

    const onNewRowEdit = (key: K) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.target

        const data = {
            data: {
                [firstHeaderKey]: {
                    value: key === firstHeaderKey ? value : '',
                    placeholder: 'Enter Key',
                },
                [secondHeaderKey]: {
                    value: key === secondHeaderKey ? value : '',
                    placeholder: 'Enter Value',
                },
            },
            id: Date.now() * Math.random(),
        } as KeyValueRow<K>

        setNewRowAdded(true)
        setRows([data, ..._rows])
        keyTextAreaRef.current = [createRef(), ...keyTextAreaRef.current]
        valueTextAreaRef.current = [createRef(), ...valueTextAreaRef.current]
    }

    const onRowDataEdit =
        (row: KeyValueRow<K>, key: K, rowIndex: number) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const { value } = e.target

            let newRows = []
            if (!value && !row.data[key === firstHeaderKey ? secondHeaderKey : firstHeaderKey].value) {
                newRows = _rows.filter((_, idx) => idx !== rowIndex)

                keyTextAreaRef.current = keyTextAreaRef.current.filter((_, idx) => idx !== rowIndex)
                valueTextAreaRef.current = valueTextAreaRef.current.filter((_, idx) => idx !== rowIndex)
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

    return (
        <div style={{ minHeight: '500px', background: 'white', padding: '2px' }}>
            <div className="dc__border br-4 w-100 table-container">
                <div
                    className="table-row flexbox dc__align-items-center bcn-50 dc__border-bottom"
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
                        className="table-row flexbox dc__align-items-center dc__border-bottom"
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
                                    placeholder={key === firstHeaderKey ? 'Enter Key' : 'Enter Value'}
                                    onChange={onNewRowEdit(key)}
                                />
                            </div>
                        ))}
                    </div>
                )}
                {_rows?.map((row, index) => (
                    <div
                        key={`${index.toString()}`}
                        className={`table-row flexbox dc__align-items-center ${index !== _rows.length - 1 ? 'dc__border-bottom' : ''}`}
                        style={{ borderColor: 'var(--N100)' }}
                    >
                        {headers.map(({ key }, i) => (
                            <div
                                key={`${index.toString()}-${i.toString()}`}
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
                                            onChange={onRowDataEdit(row, key, index)}
                                            refVar={
                                                key === firstHeaderKey
                                                    ? keyTextAreaRef.current[index]
                                                    : valueTextAreaRef.current[index]
                                            }
                                            dependentRef={
                                                key === firstHeaderKey
                                                    ? valueTextAreaRef.current[index]
                                                    : keyTextAreaRef.current[index]
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
                        <div className="icon flex dc__no-shrink py-10 px-8">
                            <ICCross
                                onClick={(e) => onDelete?.(e, index)}
                                className="icon-dim-16 fcn-4 dc__align-self-start"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
