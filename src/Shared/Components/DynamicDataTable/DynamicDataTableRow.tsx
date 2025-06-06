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

import { createElement, createRef, Fragment, ReactElement, RefObject, useEffect, useMemo, useRef } from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { followCursor } from 'tippy.js'

import { ResizableTagTextArea } from '@Common/CustomTagSelector'
import { ConditionalWrap } from '@Common/Helper'
import { Tooltip } from '@Common/Tooltip'
import { ComponentSizeType } from '@Shared/constants'

import { Button, ButtonStyleType, ButtonVariantType } from '../Button'
import { FileUpload } from '../FileUpload'
import { Icon } from '../Icon'
import {
    getSelectPickerOptionByValue,
    SelectPicker,
    SelectPickerOptionType,
    SelectPickerTextArea,
    SelectPickerVariantType,
} from '../SelectPicker'
import { DynamicDataTableRowDataType, DynamicDataTableRowProps, DynamicDataTableRowType } from './types'
import { getActionButtonPosition, getRowGridTemplateColumn, rowTypeHasInputField } from './utils'

const getWrapperForButtonCell =
    <K extends string, CustomStateType = Record<string, unknown>>(
        renderer: (row: DynamicDataTableRowType<K, CustomStateType>) => ReactElement,
        row: DynamicDataTableRowType<K, CustomStateType>,
    ) =>
    (children: JSX.Element) => {
        if (renderer) {
            const { props, type } = renderer(row)
            return createElement(type, props, children)
        }

        return null
    }

export const DynamicDataTableRow = <K extends string, CustomStateType = Record<string, unknown>>({
    rows = [],
    headers,
    readOnly,
    isDeletionNotAllowed,
    cellError = {},
    actionButtonConfig = null,
    onRowEdit,
    onRowDelete,
    leadingCellIcon,
    trailingCellIcon,
    buttonCellWrapComponent,
    focusableFieldKey,
    shouldAutoFocusOnMount = false,
}: DynamicDataTableRowProps<K, CustomStateType>) => {
    // CONSTANTS
    const isFirstRowEmpty = headers.every(({ key }) => !rows[0]?.data[key].value)
    /** Boolean determining if table has rows. */
    const hasRows = !!rows.length
    const disableDeleteRow = rows.length === 1 && isFirstRowEmpty
    /** style: grid-template-columns */
    const rowGridTemplateColumn = getRowGridTemplateColumn(
        headers,
        actionButtonConfig,
        isDeletionNotAllowed || readOnly,
    )

    // CELL REFS
    const shouldAutoFocusNewRowRef = useRef(shouldAutoFocusOnMount)
    const cellRef = useRef<Record<string | number, Record<K, RefObject<HTMLTextAreaElement>>>>(null)
    if (!cellRef.current) {
        cellRef.current = rows.reduce((acc, curr) => {
            acc[curr.id] = headers.reduce((headerAcc, { key }) => ({ ...headerAcc, [key]: createRef() }), {})
            return acc
        }, {})
    }
    const rowIds = useMemo(() => rows.map(({ id }) => id), [rows])

    useEffect(() => {
        // When a new row is added, we create references for its cells.
        // This logic ensures that references are created only for the newly added row, while retaining the existing references.
        const updatedCellRef = rowIds.reduce((acc, curr) => {
            if (cellRef.current[curr]) {
                acc[curr] = cellRef.current[curr]
            } else {
                acc[curr] = headers.reduce((headerAcc, { key }) => ({ ...headerAcc, [key]: createRef() }), {})
            }
            return acc
        }, {})

        cellRef.current = updatedCellRef
    }, [JSON.stringify(rowIds)])

    // METHODS
    const onChange =
        (row: DynamicDataTableRowType<K, CustomStateType>, key: K) =>
        (e: React.ChangeEvent<HTMLTextAreaElement> | SelectPickerOptionType<string> | File[]) => {
            let value = ''
            const extraData = { selectedValue: null, files: [] }
            switch (row.data[key].type) {
                case DynamicDataTableRowDataType.DROPDOWN:
                case DynamicDataTableRowDataType.SELECT_TEXT:
                    value = (e as SelectPickerOptionType<string>)?.value || ''
                    extraData.selectedValue = e
                    break
                case DynamicDataTableRowDataType.FILE_UPLOAD:
                    value = (e as File[])[0]?.name || ''
                    extraData.files = e as File[]
                    break
                case DynamicDataTableRowDataType.TEXT:
                default:
                    value = (e as React.ChangeEvent<HTMLTextAreaElement>).target.value
                    break
            }

            onRowEdit(row, key, value, extraData)
        }

    const onDelete = (row: DynamicDataTableRowType<K, CustomStateType>) => () => {
        onRowDelete(row)
    }

    // RENDERERS
    const renderCellContent = (row: DynamicDataTableRowType<K, CustomStateType>, key: K, index: number) => {
        const isDisabled = readOnly || row.data[key].disabled
        const autoFocus =
            shouldAutoFocusNewRowRef.current && key === (focusableFieldKey ?? headers[0].key) && index === 0

        // This logic ensures only newly added rows get autofocus.
        // On the initial mount, all rows are treated as new, so autofocus is enabled.
        // After the first render, when cellRef is set (DOM rendered), we set shouldAutoFocusNewRowRef to true,
        // so autofocus is applied only to the correct cell in any subsequently added row.
        if (
            !shouldAutoFocusOnMount &&
            !shouldAutoFocusNewRowRef.current &&
            index === 0 &&
            cellRef?.current?.[row.id]?.[key].current
        ) {
            shouldAutoFocusNewRowRef.current = true
        }

        switch (row.data[key].type) {
            case DynamicDataTableRowDataType.DROPDOWN:
                return (
                    <div className="w-100 h-100 flex top dc__align-self-start">
                        <SelectPicker<string, false>
                            autoFocus={autoFocus}
                            {...row.data[key].props}
                            inputId={`data-table-${row.id}-${key}-cell`}
                            classNamePrefix="dynamic-data-table__cell__select-picker"
                            variant={SelectPickerVariantType.COMPACT}
                            value={getSelectPickerOptionByValue(
                                row.data[key].props?.options,
                                row.data[key].value,
                                null,
                            )}
                            onChange={onChange(row, key)}
                            isDisabled={isDisabled}
                            fullWidth
                        />
                    </div>
                )
            case DynamicDataTableRowDataType.SELECT_TEXT: {
                const { value, props } = row.data[key]
                const { isCreatable = true } = props

                return (
                    <div className="w-100 h-100 flex top dc__align-self-start">
                        <SelectPickerTextArea
                            autoFocus={autoFocus}
                            isCreatable={isCreatable}
                            isClearable
                            {...props}
                            variant={SelectPickerVariantType.COMPACT}
                            classNamePrefix="dynamic-data-table__cell__select-picker-text-area"
                            inputId={`data-table-${row.id}-${key}-cell`}
                            minHeight={20}
                            maxHeight={160}
                            value={getSelectPickerOptionByValue(
                                props?.options,
                                value,
                                isCreatable && value ? { label: value, value } : null,
                            )}
                            onChange={onChange(row, key)}
                            isDisabled={isDisabled}
                            formatCreateLabel={(input) => `Use ${input}`}
                            refVar={cellRef?.current?.[row.id]?.[key]}
                            dependentRefs={cellRef?.current?.[row.id]}
                            fullWidth
                        />
                    </div>
                )
            }
            case DynamicDataTableRowDataType.BUTTON:
                return (
                    <div className="w-100 h-100 flex top">
                        <ConditionalWrap
                            condition={!!buttonCellWrapComponent}
                            wrap={getWrapperForButtonCell(buttonCellWrapComponent, row)}
                        >
                            <button
                                type="button"
                                className={`dc__transparent w-100 p-8 flex left dc__gap-8 dc__hover-n50 cn-9 fs-13 lh-20 ${row.data[key].disabled ? 'dc__disabled' : ''}`}
                            >
                                {row.data[key].props?.icon || null}
                                {row.data[key].props.text}
                            </button>
                        </ConditionalWrap>
                    </div>
                )
            case DynamicDataTableRowDataType.FILE_UPLOAD:
                return (
                    <div
                        className={`mw-none w-100 h-100 flex top left px-8 ${row.data[key].props?.isLoading || row.data[key].value ? 'py-3' : 'py-8'}`}
                    >
                        <FileUpload
                            {...row.data[key].props}
                            fileName={row.data[key].value}
                            onUpload={onChange(row, key)}
                        />
                    </div>
                )
            default:
                return (
                    <ResizableTagTextArea
                        autoFocus={autoFocus}
                        {...row.data[key].props}
                        id={`data-table-${row.id}-${key}-cell`}
                        className={`dynamic-data-table__cell-input placeholder-cn5 p-8 cn-9 fs-13 lh-20 dc__align-self-start dc__no-border-radius ${isDisabled ? 'cursor-not-allowed' : ''}`}
                        minHeight={20}
                        maxHeight={160}
                        value={row.data[key].value}
                        onChange={onChange(row, key)}
                        disabled={isDisabled}
                        refVar={cellRef?.current?.[row.id]?.[key]}
                        dependentRefs={cellRef?.current?.[row.id]}
                        disableOnBlurResizeToMinHeight
                    />
                )
        }
    }

    const renderAsterisk = (row: DynamicDataTableRowType<K, CustomStateType>, key: K) =>
        row.data[key].required && <span className="mt-10 px-6 w-20 cr-5 fs-16 lh-20 dc__align-self-start">*</span>

    const renderCellIcon = (row: DynamicDataTableRowType<K, CustomStateType>, key: K, isLeadingIcon?: boolean) => {
        const iconConfig = isLeadingIcon ? leadingCellIcon : trailingCellIcon
        if (!iconConfig?.[key]?.(row)) {
            return null
        }

        return (
            <div
                className={`flex h-100 dc__align-self-start ${row.data[key].type !== DynamicDataTableRowDataType.TEXT ? `py-8 ${isLeadingIcon ? 'pl-8' : 'pr-8'}` : ''}`}
            >
                {iconConfig[key](row)}
            </div>
        )
    }

    const renderErrorMessage = (errorMessage: string) => (
        <div key={errorMessage} className="flexbox dc__gap-4">
            <Icon name="ic-close-small" color="R500" />
            <p className="fs-12 lh-16 cn-7 m-0">{errorMessage}</p>
        </div>
    )

    const renderErrorMessages = (row: DynamicDataTableRowType<K, CustomStateType>, key: K) => {
        const { isValid, errorMessages } =
            !row.data[key].disabled && cellError[row.id]?.[key]
                ? cellError[row.id][key]
                : { isValid: true, errorMessages: [] }

        const isDropdown =
            row.data[key].type === DynamicDataTableRowDataType.SELECT_TEXT ||
            row.data[key].type === DynamicDataTableRowDataType.DROPDOWN

        if (isValid) {
            return null
        }

        // Adding 'no-error' class to hide error when SelectPicker or SelectPickerTextArea is focused.
        return (
            <div
                className={`dynamic-data-table__error bg__primary dc__border br-4 py-7 px-8 flexbox-col dc__gap-4 ${isDropdown ? 'no-error' : ''}`}
            >
                {errorMessages.map((error) => renderErrorMessage(error))}
            </div>
        )
    }

    const renderCell = (row: DynamicDataTableRowType<K, CustomStateType>, key: K, index: number) => {
        const isDisabled = readOnly || row.data[key].disabled || false
        const hasError = !(cellError[row.id]?.[key]?.isValid ?? true)

        const cellNode = (
            <Tooltip
                alwaysShowTippyOnHover={!!row.data[key].tooltip?.content || isDisabled}
                className={row.data[key].tooltip?.className}
                content={row.data[key].tooltip?.content || (isDisabled ? 'Cannot edit in read-only mode' : '')}
                followCursor="horizontal"
                plugins={[followCursor]}
            >
                <div
                    className={`dynamic-data-table__cell bg__primary flexbox dc__align-items-center dc__gap-4 dc__position-rel ${isDisabled ? 'cursor-not-allowed no-hover' : ''} ${!isDisabled && hasError ? 'dynamic-data-table__cell--error no-hover' : ''} ${!rowTypeHasInputField(row.data[key].type) ? 'no-hover no-focus' : ''}`}
                >
                    {renderCellIcon(row, key, true)}
                    {renderCellContent(row, key, index)}
                    {renderAsterisk(row, key)}
                    {renderCellIcon(row, key)}
                    {renderErrorMessages(row, key)}
                </div>
            </Tooltip>
        )

        const actionButtonIndex = getActionButtonPosition({ headers, actionButtonConfig })
        if (actionButtonIndex === index) {
            const { renderer, position = 'start' } = actionButtonConfig
            const actionButtonNode = (
                <div
                    className={`dc__overflow-hidden flex top bg__primary ${(position === 'start' && key === headers[0].key) || (isDeletionNotAllowed && position === 'end' && key === headers[headers.length - 1].key) ? 'dynamic-data-table__cell' : ''}`}
                >
                    {renderer(row)}
                </div>
            )

            return position === 'start' ? (
                <>
                    {actionButtonNode}
                    {cellNode}
                </>
            ) : (
                <>
                    {cellNode}
                    {actionButtonNode}
                </>
            )
        }

        return cellNode
    }

    return hasRows ? (
        <div className="bcn-2 px-1 pb-1 dc__bottom-radius-4">
            <div
                className={`dynamic-data-table w-100 bcn-1 dc__bottom-radius-4 ${!readOnly ? 'row-column' : 'header-column'}`}
                style={{
                    gridTemplateColumns: rowGridTemplateColumn,
                }}
            >
                {rows.map((row) => (
                    <div key={row.id} className="dynamic-data-table__row">
                        {headers.map(({ key }, index) => (
                            <Fragment key={key}>{renderCell(row, key, index)}</Fragment>
                        ))}
                        {!isDeletionNotAllowed && !readOnly && (
                            <div className="dynamic-data-table__row-delete-btn bg__primary">
                                <Button
                                    dataTestId="dynamic-data-table-row-delete-btn"
                                    ariaLabel="Delete Row"
                                    showAriaLabelInTippy={false}
                                    icon={<Icon name="ic-close-large" color={null} />}
                                    disabled={disableDeleteRow || row.disableDelete}
                                    onClick={onDelete(row)}
                                    variant={ButtonVariantType.borderLess}
                                    style={ButtonStyleType.negativeGrey}
                                    size={ComponentSizeType.small}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    ) : null
}
