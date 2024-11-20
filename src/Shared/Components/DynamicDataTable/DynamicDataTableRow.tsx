import { createRef, Fragment, RefObject, useEffect, useRef } from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { followCursor } from 'tippy.js'

import { ReactComponent as ICClose } from '@Icons/ic-close.svg'
import { ReactComponent as ICCross } from '@Icons/ic-cross.svg'
import { ComponentSizeType, DEFAULT_SECRET_PLACEHOLDER } from '@Shared/constants'
import { Tooltip } from '@Common/Tooltip'

import { Button, ButtonStyleType, ButtonVariantType } from '../Button'
import {
    getSelectPickerOptionByValue,
    SelectPicker,
    SelectPickerOptionType,
    SelectPickerVariantType,
} from '../SelectPicker'
import { MultipleResizableTextArea } from '../MultipleResizableTextArea'
import { getRowGridTemplateColumn } from './utils'
import { DynamicDataTableRowType, DynamicDataTableRowProps } from './types'

export const DynamicDataTableRow = <K extends string>({
    rows,
    headers,
    maskValue,
    readOnly,
    isAdditionNotAllowed,
    validationSchema,
    showError,
    errorMessages = [],
    actionButton = null,
    actionButtonWidth = '',
    onRowEdit,
    onRowDelete,
    leadingCellIcon,
    trailingCellIcon,
}: DynamicDataTableRowProps<K>) => {
    // CONSTANTS
    const isFirstRowEmpty = headers.every(({ key }) => !rows[0]?.data[key].value)
    /** Boolean determining if table has rows. */
    const hasRows = (!readOnly && !isAdditionNotAllowed) || !!rows.length
    const disableDeleteRow = rows.length === 1 && isFirstRowEmpty
    /** style: grid-template-columns */
    const rowGridTemplateColumn = getRowGridTemplateColumn(headers, actionButtonWidth, readOnly)

    const cellRef = useRef<Record<string | number, Record<K, RefObject<HTMLTextAreaElement>>>>()
    if (!cellRef.current) {
        cellRef.current = rows.reduce(
            (acc, curr) => ({
                ...acc,
                [curr.id]: headers.reduce((headerAcc, { key }) => ({ ...headerAcc, [key]: createRef() }), {}),
            }),
            {},
        )
    }

    useEffect(() => {
        if (rows) {
            const rowIds = rows.map(({ id }) => id)

            const updatedCellRef = rowIds.reduce((acc, curr) => {
                if (cellRef.current[curr]) {
                    acc[curr] = cellRef.current[curr]
                } else {
                    acc[curr] = headers.reduce((headerAcc, { key }) => ({ ...headerAcc, [key]: createRef() }), {})
                }
                return acc
            }, {})

            cellRef.current = updatedCellRef
        }
    }, [rows])

    // METHODS
    const onChange =
        (row: DynamicDataTableRowType<K>, key: K) =>
        (e: React.ChangeEvent<HTMLTextAreaElement> | SelectPickerOptionType<string>) => {
            let value = ''
            switch (row.data[key].type) {
                case 'dropdown':
                    value = (e as SelectPickerOptionType<string>).value
                    break
                default:
                    value = (e as React.ChangeEvent<HTMLTextAreaElement>).target.value
            }

            onRowEdit(row, key, value)
        }

    const onDelete = (row: DynamicDataTableRowType<K>) => () => {
        onRowDelete(row)
    }

    // RENDERERS
    const renderCellContent = (row: DynamicDataTableRowType<K>, key: K) => {
        switch (row.data[key].type) {
            case 'dropdown':
                return (
                    <div className="p-8 w-100 h-100 flex top dc__align-self-start">
                        <SelectPicker<string, false>
                            {...row.data[key].props}
                            inputId={`data-table-${row.id}-${key}-cell`}
                            variant={SelectPickerVariantType.BORDER_LESS}
                            value={getSelectPickerOptionByValue(row.data[key].props?.options, row.data[key].value)}
                            onChange={onChange(row, key)}
                            isDisabled={readOnly || row.data[key].disabled}
                            fullWidth
                        />
                    </div>
                )
            default:
                return (
                    <MultipleResizableTextArea
                        {...row.data[key].props}
                        className={`dynamic-data-table__cell-input placeholder-cn5 p-8 cn-9 fs-13 lh-20 dc__no-border-radius ${readOnly || row.data[key].disabled ? 'cursor-not-allowed' : ''}`}
                        minHeight={20}
                        maxHeight={160}
                        value={row.data[key].value}
                        onChange={onChange(row, key)}
                        disabled={readOnly || row.data[key].disabled}
                        refVar={cellRef?.current?.[row.id]?.[key]}
                        dependentRefs={cellRef?.current?.[row.id]}
                        disableOnBlurResizeToMinHeight
                    />
                )
        }
    }

    const renderAsterisk = (row: DynamicDataTableRowType<K>, key: K) =>
        row.data[key].required && <span className="mt-10 px-6 w-20 cr-5 fs-16 lh-20 dc__align-self-start">*</span>

    const renderCellIcon = (row: DynamicDataTableRowType<K>, key: K, isLeadingIcon?: boolean) => {
        const iconConfig = isLeadingIcon ? leadingCellIcon : trailingCellIcon
        if (!iconConfig?.[key]) {
            return null
        }

        return (
            <div
                className={`flex dc__align-self-start ${row.data[key].type !== 'text' ? `py-8 ${isLeadingIcon ? 'pl-8' : 'pr-8'}` : ''}`}
            >
                {iconConfig[key](row.id)}
            </div>
        )
    }

    const renderErrorMessage = (errorMessage: string) => (
        <div key={errorMessage} className="flexbox align-items-center dc__gap-4">
            <ICClose className="icon-dim-16 fcr-5 dc__align-self-start dc__no-shrink" />
            <p className="fs-12 lh-16 cn-7 m-0">{errorMessage}</p>
        </div>
    )

    const renderErrorMessages = (
        value: Parameters<typeof validationSchema>[0],
        key: Parameters<typeof validationSchema>[1],
        rowId: DynamicDataTableRowType<K>['id'],
    ) => {
        const showErrorMessages = showError && !validationSchema(value, key, rowId)
        if (!showErrorMessages) {
            return null
        }

        return (
            <div className="dynamic-data-table__error bcn-0 dc__border br-4 py-7 px-8 flexbox-col dc__gap-4">
                {errorMessages.map((error) => renderErrorMessage(error))}
            </div>
        )
    }

    return hasRows ? (
        <div className="bcn-2 px-1 pb-1 dc__bottom-radius-4">
            {!!rows.length && (
                <div
                    className={`dynamic-data-table w-100 bcn-1 dc__bottom-radius-4 ${!readOnly ? 'three-columns' : 'two-columns'}`}
                    style={{
                        gridTemplateColumns: rowGridTemplateColumn,
                    }}
                >
                    {rows.map((row) => (
                        <div key={row.id} className="dynamic-data-table__row">
                            {headers.map(({ key }) => (
                                <Fragment key={key}>
                                    <Tooltip
                                        alwaysShowTippyOnHover={readOnly || false}
                                        content="Cannot edit in read-only mode"
                                        followCursor="horizontal"
                                        plugins={[followCursor]}
                                    >
                                        <div
                                            className={`dynamic-data-table__cell bcn-0 flexbox dc__align-items-center dc__gap-4 dc__position-rel ${readOnly || row.data[key].disabled ? 'cursor-not-allowed no-hover' : ''} ${showError && !validationSchema(row.data[key].value, key, row.id) ? 'dynamic-data-table__cell--error no-hover' : ''}`}
                                        >
                                            {maskValue?.[key] && row.data[key].value ? (
                                                <div className="py-8 px-12 h-36 flex">{DEFAULT_SECRET_PLACEHOLDER}</div>
                                            ) : (
                                                <>
                                                    {renderCellIcon(row, key, true)}
                                                    {renderCellContent(row, key)}
                                                    {renderAsterisk(row, key)}
                                                    {renderCellIcon(row, key)}
                                                    {renderErrorMessages(row.data[key].value, key, row.id)}
                                                </>
                                            )}
                                        </div>
                                    </Tooltip>
                                </Fragment>
                            ))}
                            {actionButton && (
                                <div className="dynamic-data-table__cell flex top p-8 bcn-0">
                                    {actionButton(row.id)}
                                </div>
                            )}
                            {!readOnly && (
                                <div className="dynamic-data-table__row-delete-btn flex top bcn-0 dc__no-shrink py-6 px-8">
                                    <Button
                                        dataTestId="data-table-delete-row-button"
                                        ariaLabel="Delete"
                                        onClick={onDelete(row)}
                                        disabled={disableDeleteRow}
                                        icon={<ICCross className="dc__align-self-start" />}
                                        size={ComponentSizeType.xs}
                                        variant={ButtonVariantType.borderLess}
                                        style={ButtonStyleType.negative}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    ) : null
}
