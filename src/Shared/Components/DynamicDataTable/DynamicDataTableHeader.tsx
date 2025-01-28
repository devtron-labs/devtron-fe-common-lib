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

import { ReactComponent as ICArrowDown } from '@Icons/ic-sort-arrow-down.svg'
import { ReactComponent as ICAdd } from '@Icons/ic-add.svg'
import { ComponentSizeType } from '@Shared/constants'
import { SortingOrder } from '@Common/Constants'

import { Button, ButtonVariantType } from '../Button'
import { getActionButtonPosition, getHeaderGridTemplateColumn } from './utils'
import { DynamicDataTableHeaderType, DynamicDataTableHeaderProps } from './types'

export const DynamicDataTableHeader = <K extends string, CustomStateType = Record<string, unknown>>({
    headers,
    rows,
    sortingConfig,
    onRowAdd,
    readOnly,
    isAdditionNotAllowed,
    isDeletionNotAllowed,
    headerComponent = null,
    actionButtonConfig = null,
}: DynamicDataTableHeaderProps<K, CustomStateType>) => {
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

    const handleSorting = (key: K) => () => sortingConfig?.handleSorting(key)

    // RENDERERS

    const renderHeaderCell = ({ key, label, isSortable, renderAdditionalContent }: DynamicDataTableHeaderType<K>) => {
        const shouldRenderAddRowButton = !isActionDisabled && key === firstHeaderKey

        return (
            <div
                key={`${key}-header`}
                className={`bg__secondary ${shouldRenderAddRowButton ? 'py-6' : 'py-8'} px-8 flexbox dc__content-space dc__align-items-center ${(!isActionButtonAtTheStart && (key === firstHeaderKey ? `${hasRows || !isActionDisabled ? 'dc__top-left-radius' : 'dc__left-radius-4'}` : '')) || ''} ${key === lastHeaderKey ? `${hasRows || !isActionDisabled ? 'dc__top-right-radius-4' : 'dc__right-radius-4'}` : ''}`}
            >
                {isSortable ? (
                    <button
                        type="button"
                        className="cn-7 fs-12 lh-20-imp fw-6 flexbox dc__align-items-center dc__gap-2 dc__transparent"
                        onClick={handleSorting(key)}
                    >
                        {label}
                        <ICArrowDown
                            className="icon-dim-16 dc__no-shrink scn-7 rotate cursor"
                            style={{
                                ['--rotateBy' as string]:
                                    sortingConfig?.sortOrder === SortingOrder.ASC ? '0deg' : '180deg',
                            }}
                        />
                        {typeof renderAdditionalContent === 'function' && renderAdditionalContent()}
                    </button>
                ) : (
                    <div
                        className={`cn-7 fs-12 lh-20 fw-6 flexbox dc__align-items-center dc__content-space dc__gap-4 ${hasRows ? 'dc__top-left-radius' : 'dc__left-radius-4'}`}
                    >
                        {label}
                        {typeof renderAdditionalContent === 'function' && renderAdditionalContent()}
                    </div>
                )}
                {shouldRenderAddRowButton && (
                    <Button
                        dataTestId="data-table-add-row-button"
                        ariaLabel="Add"
                        onClick={onRowAdd}
                        icon={<ICAdd />}
                        variant={ButtonVariantType.borderLess}
                        size={ComponentSizeType.xs}
                        showAriaLabelInTippy={false}
                    />
                )}
                {key === lastHeaderKey && headerComponent}
            </div>
        )
    }

    return (
        <div className={`bcn-2 p-1 ${hasRows ? 'dc__top-radius-4' : 'br-4'}`}>
            <div
                className="dynamic-data-table header-column w-100 bcn-1 br-4"
                style={{ gridTemplateColumns: headerGridTemplateColumn }}
            >
                <div className="dynamic-data-table__row">
                    {isActionButtonAtTheStart && (
                        <div
                            className={`bg__secondary ${hasRows || !isActionDisabled ? 'dc__top-left-radius' : 'dc__left-radius-4'}`}
                        />
                    )}
                    {headers.map((header) => renderHeaderCell(header))}
                </div>
            </div>
        </div>
    )
}
