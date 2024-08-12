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

import { createRef, useEffect, useRef, useState, ReactElement, Fragment } from 'react'
import Tippy from '@tippyjs/react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { followCursor } from 'tippy.js'

import { ReactComponent as ICArrowDown } from '@Icons/ic-sort-arrow-down.svg'
import { ReactComponent as ICClose } from '@Icons/ic-close.svg'
import { ReactComponent as ICCross } from '@Icons/ic-cross.svg'
import { ConditionalWrap, ResizableTagTextArea, SortingOrder, useStateFilters } from '@Common/index'
import { stringComparatorBySortOrder } from '@Shared/Helpers'
import { DEFAULT_SECRET_PLACEHOLDER } from '@Shared/constants'

import { KeyValueRow, KeyValueTableProps } from './KeyValueTable.types'
import './KeyValueTable.scss'

const renderWithReadOnlyTippy = (children: ReactElement) => (
    <Tippy
        className="default-tt"
        arrow={false}
        placement="bottom"
        content="Cannot edit in read-only mode"
        followCursor="horizontal"
        plugins={[followCursor]}
    >
        {children}
    </Tippy>
)

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

    /** Boolean determining if table has rows. */
    const hasRows = (!readOnly && !isAdditionNotAllowed) || !!updatedRows.length

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
                validationSchema?.(_data[firstHeaderKey].value, firstHeaderKey) &&
                validationSchema?.(_data[secondHeaderKey].value, secondHeaderKey),
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
        <>
            <div className={`bcn-2 p-1 ${hasRows ? 'dc__top-radius-4' : 'br-4'}`}>
                <div className="key-value-table two-columns w-100 bcn-1 br-4">
                    <div className="key-value-table__row">
                        {headers.map(({ key, label, className }) =>
                            isSortable && key === firstHeaderKey ? (
                                <button
                                    key={key}
                                    type="button"
                                    className={`bcn-50 dc__unset-button-styles cn-9 fs-13 lh-20-imp py-8 px-12 fw-6 flexbox dc__align-items-center dc__gap-2 ${updatedRows.length || (!readOnly && !isAdditionNotAllowed) ? 'dc__top-left-radius' : 'dc__left-radius-4'} ${className || ''}`}
                                    onClick={onSortBtnClick}
                                >
                                    {label}
                                    <ICArrowDown
                                        className="icon-dim-16 scn-7 rotate cursor"
                                        style={{
                                            ['--rotateBy' as string]:
                                                sortOrder === SortingOrder.ASC ? '0deg' : '180deg',
                                        }}
                                    />
                                </button>
                            ) : (
                                <div
                                    key={key}
                                    className={`bcn-50 cn-9 fs-13 lh-20 py-8 px-12 fw-6 flexbox dc__align-items-center dc__content-space dc__gap-2 ${key === firstHeaderKey ? `${hasRows ? 'dc__top-left-radius' : 'dc__left-radius-4'}` : `${hasRows ? 'dc__top-right-radius' : 'dc__right-radius-4'}`}  ${className || ''}`}
                                >
                                    {label}
                                    {!!headerComponent && headerComponent}
                                </div>
                            ),
                        )}
                    </div>
                </div>
            </div>
            {hasRows && (
                <div className="bcn-2 px-1 pb-1 dc__bottom-radius-4">
                    {!readOnly && !isAdditionNotAllowed && (
                        <div
                            className={`key-value-table two-columns-top-row bcn-1 ${updatedRows.length ? 'pb-1' : 'dc__bottom-radius-4'}`}
                        >
                            <div className="key-value-table__row">
                                {headers.map(({ key }) => (
                                    <div
                                        key={key}
                                        className={`key-value-table__cell bcn-0 flex dc__overflow-auto ${(!updatedRows.length && (key === firstHeaderKey ? 'dc__bottom-left-radius' : 'dc__bottom-right-radius')) || ''}`}
                                    >
                                        <textarea
                                            ref={key === firstHeaderKey ? inputRowRef : undefined}
                                            className="key-value-table__cell-input key-value-table__cell-input--add placeholder-cn5 py-8 px-12 cn-9 lh-20 fs-13 fw-4 dc__no-border-radius"
                                            value=""
                                            rows={1}
                                            placeholder={placeholder[key]}
                                            onChange={onNewRowAdd(key)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {!!updatedRows.length && (
                        <div
                            className={`key-value-table w-100 bcn-1 dc__bottom-radius-4 ${!readOnly ? 'three-columns' : 'two-columns'}`}
                        >
                            {updatedRows.map((row) => (
                                <div key={row.id} className="key-value-table__row">
                                    {headers.map(({ key }) => (
                                        <Fragment key={key}>
                                            <ConditionalWrap wrap={renderWithReadOnlyTippy} condition={readOnly}>
                                                <div
                                                    className={`key-value-table__cell bcn-0 flexbox dc__align-items-center dc__gap-4 dc__position-rel ${readOnly || row.data[key].disabled ? 'cursor-not-allowed no-hover' : ''} ${showError && !validationSchema?.(row.data[key].value, key) ? 'key-value-table__cell--error no-hover' : ''}`}
                                                >
                                                    {maskValue?.[key] && row.data[key].value ? (
                                                        <div className="py-8 px-12 h-36 flex">
                                                            {DEFAULT_SECRET_PLACEHOLDER}
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <ResizableTagTextArea
                                                                {...row.data[key]}
                                                                className={`key-value-table__cell-input placeholder-cn5 py-8 px-12 cn-9 fs-13 lh-20 dc__no-border-radius ${readOnly || row.data[key].disabled ? 'cursor-not-allowed' : ''}`}
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
                                                                <span className="cr-5 fs-16 dc__align-self-start px-6 py-8">
                                                                    *
                                                                </span>
                                                            )}
                                                            {showError &&
                                                                !validationSchema?.(row.data[key].value, key) &&
                                                                errorMessages.length && (
                                                                    <div className="key-value-table__error bcn-0 dc__border br-4 py-7 px-8 flexbox-col dc__gap-4">
                                                                        {errorMessages.map((error) => (
                                                                            <div
                                                                                key={error}
                                                                                className="flexbox align-items-center dc__gap-4"
                                                                            >
                                                                                <ICClose className="icon-dim-16 fcr-5 dc__align-self-start dc__no-shrink" />
                                                                                <p className="fs-12 lh-16 cn-7 m-0">
                                                                                    {error}
                                                                                </p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                        </>
                                                    )}
                                                </div>
                                            </ConditionalWrap>
                                        </Fragment>
                                    ))}
                                    {!readOnly && (
                                        <button
                                            type="button"
                                            className="key-value-table__row-delete-btn dc__unset-button-styles dc__align-self-stretch dc__no-shrink flex py-10 px-8 bcn-0 dc__hover-n50 dc__tab-focus"
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
                    )}
                </div>
            )}
        </>
    )
}
