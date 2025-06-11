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

import { forwardRef } from 'react'

import { ReactComponent as ICChevronDown } from '../../../Assets/Icon/ic-chevron-down.svg'
import { Checkbox, noop } from '../../../Common'
import { ActionMenu, ActionMenuItemType, ActionMenuProps } from '../ActionMenu'
import { useBulkSelection } from './BulkSelectionProvider'
import { BULK_DROPDOWN_TEST_ID, BulkSelectionOptionsLabels } from './constants'
import { BulkSelectionEvents, BulkSelectionProps } from './types'

const BulkSelection = forwardRef<HTMLButtonElement, BulkSelectionProps>(
    ({ showPagination, disabled = false, showChevronDownIcon = true }, forwardedRef) => {
        const { handleBulkSelection, isChecked, checkboxValue, getSelectedIdentifiersCount } = useBulkSelection()
        const areOptionsSelected = getSelectedIdentifiersCount() > 0
        const BulkSelectionItems: ActionMenuItemType[] = [
            {
                id: BulkSelectionEvents.SELECT_ALL_ON_PAGE,
                label: BulkSelectionOptionsLabels[BulkSelectionEvents.SELECT_ALL_ON_PAGE],
                startIcon: { name: 'ic-check-square' },
            },
            ...(showPagination
                ? [
                      {
                          id: BulkSelectionEvents.SELECT_ALL_ACROSS_PAGES,
                          label: BulkSelectionOptionsLabels[BulkSelectionEvents.SELECT_ALL_ACROSS_PAGES],
                          startIcon: { name: 'ic-check-all' },
                      } as ActionMenuItemType,
                  ]
                : []),
            ...(areOptionsSelected
                ? [
                      {
                          id: BulkSelectionEvents.CLEAR_ALL_SELECTIONS,
                          label: BulkSelectionOptionsLabels[BulkSelectionEvents.CLEAR_ALL_SELECTIONS],
                          startIcon: { name: 'ic-close-small' },
                          type: 'negative',
                      } as ActionMenuItemType,
                  ]
                : []),
        ]

        const onActionMenuClick: ActionMenuProps['onClick'] = (item) => {
            handleBulkSelection({
                action: item.id as BulkSelectionEvents,
            })
        }

        return (
            <ActionMenu
                id={BULK_DROPDOWN_TEST_ID}
                onClick={onActionMenuClick}
                position="bottom"
                options={[
                    {
                        items: BulkSelectionItems,
                    },
                ]}
            >
                <div className="dc__position-rel flexbox">
                    <div className="flexbox dc__gap-4 dc__align-items-center">
                        <Checkbox
                            isChecked={isChecked}
                            onChange={noop}
                            rootClassName="icon-dim-20 m-0"
                            value={checkboxValue}
                            disabled={disabled}
                            // Ideally should be disabled but was giving issue with cursor
                        />

                        {showChevronDownIcon && <ICChevronDown className="icon-dim-20 fcn-6 dc__no-shrink" />}
                    </div>

                    <button
                        ref={forwardedRef}
                        type="button"
                        className="dc__position-abs dc__left-0 dc__top-0 h-100 w-100 dc__zi-1 p-0 dc__no-border dc__outline-none dc__transparent--unstyled"
                        aria-label="Bulk selection dropdown"
                    />
                </div>
            </ActionMenu>
        )
    },
)

export default BulkSelection
