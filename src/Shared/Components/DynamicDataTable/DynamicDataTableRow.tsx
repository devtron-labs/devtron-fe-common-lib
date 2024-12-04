import { createRef, Fragment, RefObject, useEffect, useRef } from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { followCursor } from 'tippy.js'

import { ReactComponent as ICClose } from '@Icons/ic-close.svg'
import { DEFAULT_SECRET_PLACEHOLDER } from '@Shared/constants'
import { Tooltip } from '@Common/Tooltip'

import { ConditionalWrap } from '@Common/Helper'
import { ResizableTagTextArea } from '@Common/CustomTagSelector'
import { SelectTextArea } from '../SelectTextArea'
import {
    getSelectPickerOptionByValue,
    SelectPicker,
    SelectPickerOptionType,
    SelectPickerVariantType,
} from '../SelectPicker'
import { getActionButtonPosition, getRowGridTemplateColumn, rowTypeHasInputField } from './utils'
import { DynamicDataTableRowType, DynamicDataTableRowProps, DynamicDataTableRowDataType } from './types'

const conditionalWrap =
    (
        renderer: (props: { customState?: Record<string, any>; children: JSX.Element }) => JSX.Element,
        customState: Record<string, any>,
    ) =>
    (children: JSX.Element) =>
        renderer({ children, customState })

export const DynamicDataTableRow = <K extends string>({
    rows,
    headers,
    maskValue,
    readOnly,
    isAdditionNotAllowed,
    isDeletionNotAllowed,
    validationSchema = () => ({ isValid: true, errorMessages: [] }),
    showError,
    actionButtonConfig = null,
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
    const rowGridTemplateColumn = getRowGridTemplateColumn(
        headers,
        actionButtonConfig,
        isDeletionNotAllowed || readOnly,
    )

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
            const extraData = { selectedValue: null }
            switch (row.data[key].type) {
                case DynamicDataTableRowDataType.DROPDOWN:
                    value = (e as SelectPickerOptionType<string>).value
                    extraData.selectedValue = e
                    break
                case DynamicDataTableRowDataType.SELECT_TEXT:
                    value = (e as SelectPickerOptionType<string>).value
                    extraData.selectedValue = e
                    break
                default:
                    value = (e as React.ChangeEvent<HTMLTextAreaElement>).target.value
            }

            onRowEdit(row, key, value, extraData)
        }

    const onDelete = (row: DynamicDataTableRowType<K>) => () => {
        onRowDelete(row)
    }

    // RENDERERS
    const renderCellContent = (row: DynamicDataTableRowType<K>, key: K) => {
        switch (row.data[key].type) {
            case DynamicDataTableRowDataType.DROPDOWN:
                return (
                    <div className="w-100 h-100 flex top dc__align-self-start">
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
            case DynamicDataTableRowDataType.SELECT_TEXT:
                return (
                    <div className="dynamic-data-table__select-text-area w-100 h-100 flex top dc__align-self-start">
                        <SelectTextArea
                            {...row.data[key].props}
                            value={row.data[key].value}
                            onChange={onChange(row, key)}
                            inputId={`data-table-${row.id}-${key}-cell`}
                            disabled={readOnly || row.data[key].disabled}
                            refVar={cellRef?.current?.[row.id]?.[key]}
                            dependentRef={cellRef?.current?.[row.id]}
                            textAreaProps={{
                                ...row.data[key].props?.textAreaProps,
                                className: 'dynamic-data-table__cell-input placeholder-cn5 py-8 pr-8 cn-9 fs-13 lh-20',
                                disableOnBlurResizeToMinHeight: true,
                                minHeight: 20,
                                maxHeight: 160,
                            }}
                        />
                    </div>
                )
            case DynamicDataTableRowDataType.BUTTON:
                return (
                    <div className="w-100 h-100 flex top left">
                        <ConditionalWrap
                            condition={row.data[key].wrap}
                            wrap={conditionalWrap(row.data[key].wrapRenderer, row.customState)}
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
            default:
                return (
                    <ResizableTagTextArea
                        {...row.data[key].props}
                        className={`dynamic-data-table__cell-input placeholder-cn5 p-8 cn-9 fs-13 lh-20 dc__no-border-radius ${readOnly || row.data[key].disabled ? 'cursor-not-allowed' : ''}`}
                        minHeight={20}
                        maxHeight={160}
                        value={row.data[key].value}
                        onChange={onChange(row, key)}
                        disabled={readOnly || row.data[key].disabled}
                        refVar={cellRef?.current?.[row.id]?.[key]}
                        dependentRef={cellRef?.current?.[row.id]}
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
                className={`flex dc__align-self-start ${row.data[key].type !== DynamicDataTableRowDataType.TEXT ? `py-8 ${isLeadingIcon ? 'pl-8' : 'pr-8'}` : ''}`}
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

    const renderErrorMessages = (row: DynamicDataTableRowType<K>, key: K) => {
        const { isValid, errorMessages } = validationSchema(row.data[key].value, key, row)
        const showErrorMessages = showError && !isValid
        if (!showErrorMessages) {
            return null
        }

        return (
            <div className="dynamic-data-table__error bcn-0 dc__border br-4 py-7 px-8 flexbox-col dc__gap-4">
                {errorMessages.map((error) => renderErrorMessage(error))}
            </div>
        )
    }

    const renderCell = (row: DynamicDataTableRowType<K>, key: K, index: number) => {
        const cellNode = (
            <Tooltip
                alwaysShowTippyOnHover={readOnly || row.data[key].disabled || false}
                content="Cannot edit in read-only mode"
                followCursor="horizontal"
                plugins={[followCursor]}
            >
                <div
                    className={`dynamic-data-table__cell bcn-0 flexbox dc__align-items-center dc__gap-4 dc__position-rel ${readOnly || row.data[key].disabled ? 'cursor-not-allowed no-hover' : ''} ${showError && !validationSchema(row.data[key].value, key, row).isValid ? 'dynamic-data-table__cell--error no-hover' : ''} ${!rowTypeHasInputField(row.data[key].type) ? 'no-hover no-focus' : ''}`}
                >
                    {maskValue?.[key] && row.data[key].value ? (
                        <div className="py-8 px-12 h-36 flex">{DEFAULT_SECRET_PLACEHOLDER}</div>
                    ) : (
                        <>
                            {renderCellIcon(row, key, true)}
                            {renderCellContent(row, key)}
                            {renderAsterisk(row, key)}
                            {renderCellIcon(row, key)}
                            {renderErrorMessages(row, key)}
                        </>
                    )}
                </div>
            </Tooltip>
        )

        const actionButtonIndex = getActionButtonPosition({ headers, actionButtonConfig })
        if (actionButtonIndex === index) {
            const { renderer, position = 'start' } = actionButtonConfig
            const actionButtonNode = <div className="dc__overflow-hidden flex top bcn-0">{renderer(row)}</div>

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
            {!!rows.length && (
                <div
                    className={`dynamic-data-table w-100 bcn-1 dc__bottom-radius-4 ${!readOnly ? 'three-columns' : 'two-columns'}`}
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
                                <button
                                    type="button"
                                    className={`dynamic-data-table__row-delete-btn dc__unset-button-styles dc__align-self-stretch dc__no-shrink flex py-10 px-8 bcn-0 dc__hover-n50 dc__tab-focus ${disableDeleteRow ? 'dc__disabled' : ''}`}
                                    onClick={onDelete(row)}
                                    disabled={disableDeleteRow}
                                >
                                    <ICClose
                                        aria-label="delete-row"
                                        className="icon-dim-16 fcn-4 dc__align-self-start icon-use-fill-n6"
                                    />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    ) : null
}
