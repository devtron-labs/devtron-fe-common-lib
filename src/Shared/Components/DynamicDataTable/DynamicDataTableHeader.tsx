import { ReactComponent as ICArrowDown } from '@Icons/ic-sort-arrow-down.svg'
import { ReactComponent as ICAdd } from '@Icons/ic-add.svg'
import { ComponentSizeType } from '@Shared/constants'
import { SortingOrder } from '@Common/Constants'

import { Button, ButtonVariantType } from '../Button'
import { getActionButtonPosition, getHeaderGridTemplateColumn } from './utils'
import { DynamicDataTableHeaderType, DynamicDataTableHeaderProps } from './types'

export const DynamicDataTableHeader = <K extends string>({
    headers,
    rows,
    sortingConfig,
    onRowAdd,
    readOnly,
    isAdditionNotAllowed,
    isDeletionNotAllowed,
    headerComponent = null,
    actionButtonConfig = null,
}: DynamicDataTableHeaderProps<K>) => {
    // CONSTANTS
    const firstHeaderKey = headers[0].key
    const lastHeaderKey = headers[headers.length - 1].key
    /** Boolean determining if table actions are disabled. */
    const isActionDisabled = readOnly || isAdditionNotAllowed
    /** Boolean determining if table has rows. */
    const hasRows = (!readOnly && !isAdditionNotAllowed) || !!rows.length
    /** style: grid-template-columns */
    const headerGridTemplateColumn = getHeaderGridTemplateColumn(
        headers,
        actionButtonConfig,
        isDeletionNotAllowed || readOnly,
    )
    const isActionButtonAtTheStart =
        getActionButtonPosition({ headers, actionButtonConfig }) === 0 && actionButtonConfig.position !== 'end'

    // RENDERERS
    const renderHeaderCell = ({ key, label, isSortable, renderHelpTextForHeader }: DynamicDataTableHeaderType<K>) => (
        <div
            key={`${key}-header`}
            className={`bcn-50 py-6 px-8 flexbox dc__content-space dc__align-items-center ${(!isActionButtonAtTheStart && (key === firstHeaderKey ? `${hasRows || !isActionDisabled ? 'dc__top-left-radius' : 'dc__left-radius-4'}` : '')) || ''} ${key === lastHeaderKey ? `${hasRows || !isActionDisabled ? 'dc__top-right-radius-4' : 'dc__right-radius-4'}` : ''}`}
        >
            {isSortable ? (
                <button
                    type="button"
                    className="cn-7 fs-12 lh-20-imp fw-6 flexbox dc__align-items-center dc__gap-2 dc__transparent"
                    onClick={sortingConfig?.handleSorting}
                >
                    {label}
                    <ICArrowDown
                        className="icon-dim-16 dc__no-shrink scn-7 rotate cursor"
                        style={{
                            ['--rotateBy' as string]: sortingConfig?.sortOrder === SortingOrder.ASC ? '0deg' : '180deg',
                        }}
                    />
                    {typeof renderHelpTextForHeader === 'function' && renderHelpTextForHeader()}
                </button>
            ) : (
                <div
                    className={`cn-7 fs-12 lh-20 fw-6 flexbox dc__align-items-center dc__content-space dc__gap-4 ${hasRows ? 'dc__top-left-radius' : 'dc__left-radius-4'}`}
                >
                    {label}
                    {typeof renderHelpTextForHeader === 'function' && renderHelpTextForHeader()}
                </div>
            )}
            {!isActionDisabled && key === firstHeaderKey && (
                <Button
                    dataTestId="data-table-add-row-button"
                    ariaLabel="Add"
                    onClick={onRowAdd}
                    icon={<ICAdd />}
                    variant={ButtonVariantType.borderLess}
                    size={ComponentSizeType.xs}
                />
            )}
            {key === lastHeaderKey && headerComponent}
        </div>
    )

    return (
        <div className={`bcn-2 p-1 ${hasRows ? 'dc__top-radius-4' : 'br-4'}`}>
            <div
                className="dynamic-data-table two-columns w-100 bcn-1 br-4"
                style={{ gridTemplateColumns: headerGridTemplateColumn }}
            >
                <div className="dynamic-data-table__row">
                    {isActionButtonAtTheStart && (
                        <div
                            className={`bcn-50 ${hasRows || !isActionDisabled ? 'dc__top-left-radius' : 'dc__left-radius-4'}`}
                        />
                    )}
                    {headers.map((header) => renderHeaderCell(header))}
                </div>
            </div>
        </div>
    )
}
