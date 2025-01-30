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

import { ChangeEvent, useEffect, useMemo, useState } from 'react'

import { ReactComponent as ICCaretDown } from '@Icons/ic-caret-down.svg'
import { PopupMenu, StyledRadioGroup as RadioGroup } from '../../../Common'
import { StatusFilterButtonType } from './types'

import './StatusFilterButtonComponent.scss'
import { getAppStatusIcon, getNodesCount, getStatusFilters } from './utils'

export const StatusFilterButtonComponent = ({
    nodes,
    selectedTab,
    handleFilterClick,
    maxInlineFiltersCount = 0,
}: StatusFilterButtonType) => {
    // STATES
    const [overflowFilterIndex, setOverflowFilterIndex] = useState(0)

    // STATUS FILTERS
    const { allResourceKindFilter, statusFilters } = useMemo(() => getStatusFilters(getNodesCount(nodes)), [nodes])

    useEffect(() => {
        const filterIndex = statusFilters.findIndex(({ status }) => status === selectedTab)
        setOverflowFilterIndex(Math.max(filterIndex, 0))
    }, [statusFilters])

    const showOverflowFilters = maxInlineFiltersCount > 0 && statusFilters.length > maxInlineFiltersCount

    const inlineFilters = useMemo(() => {
        if (showOverflowFilters) {
            const min = Math.max(0, Math.min(overflowFilterIndex - 1, statusFilters.length - maxInlineFiltersCount))
            const max = Math.min(min + maxInlineFiltersCount, statusFilters.length)

            return statusFilters.slice(min, max)
        }

        return statusFilters
    }, [statusFilters.length, overflowFilterIndex, maxInlineFiltersCount])

    const handleInlineFilterClick = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        if (value === allResourceKindFilter.status) {
            setOverflowFilterIndex(0)
        }
        if (selectedTab !== value) {
            handleFilterClick(value)
        }
    }

    const handleOverflowFilterClick = (status: string, index: number) => () => {
        if (selectedTab !== status) {
            setOverflowFilterIndex(index)
            handleFilterClick(status)
        }
    }

    return (
        <div className="flexbox">
            <RadioGroup
                className={`gui-yaml-switch status-filter-button ${showOverflowFilters ? 'with-menu-button' : ''}`}
                name="status-filter-button"
                initialTab={selectedTab}
                disabled={false}
                onChange={handleInlineFilterClick}
            >
                <RadioGroup.Radio
                    key={allResourceKindFilter.status}
                    value={allResourceKindFilter.status}
                    tippyPlacement="top"
                    tippyContent={allResourceKindFilter.status}
                    tippyClass="w-100 dc__first-letter-capitalize"
                >
                    <span className="dc__first-letter-capitalize">{`${allResourceKindFilter.status} (${allResourceKindFilter.count})`}</span>
                </RadioGroup.Radio>
                {inlineFilters.map(({ status, count }) => (
                    <RadioGroup.Radio
                        key={status}
                        value={status}
                        showTippy
                        tippyPlacement="top"
                        tippyContent={status}
                        tippyClass="w-100 dc__first-letter-capitalize"
                    >
                        {getAppStatusIcon(status, true)}
                        <span>{count}</span>
                    </RadioGroup.Radio>
                ))}
            </RadioGroup>
            {showOverflowFilters && (
                <PopupMenu autoClose>
                    <PopupMenu.Button
                        isKebab
                        rootClassName="flex p-4 dc__border dc__no-left-radius dc__right-radius-4 bg__primary dc__hover-n50"
                    >
                        <ICCaretDown className="icon-dim-14 scn-6" />
                    </PopupMenu.Button>
                    <PopupMenu.Body rootClassName="w-150 py-4 mt-4" style={{ left: '136px' }}>
                        {statusFilters.map(({ status, count }, index) => (
                            <button
                                key={status}
                                type="button"
                                className={`dc__transparent w-100 py-6 px-8 flex dc__content-space dc__gap-8 fs-13 lh-20 fw-4 cn-9 dc__hover-n50 ${selectedTab === status ? 'bcb-1' : ''}`}
                                onClick={handleOverflowFilterClick(status, index)}
                            >
                                {getAppStatusIcon(status)}
                                <span>{count}</span>
                            </button>
                        ))}
                    </PopupMenu.Body>
                </PopupMenu>
            )}
        </div>
    )
}
