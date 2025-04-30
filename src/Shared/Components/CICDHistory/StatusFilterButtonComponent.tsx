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

import { useEffect, useState } from 'react'

import { ReactComponent as ICCaretDown } from '@Icons/ic-caret-down.svg'
import { SegmentType } from '@Common/SegmentedControl/types'
import { ComponentSizeType } from '@Shared/constants'

import { PopupMenu, SegmentedControl } from '../../../Common'
import { StatusFilterButtonType } from './types'
import { getAppStatusIcon, getNodesCount, getStatusFilters } from './utils'

import './StatusFilterButton.scss'

export const StatusFilterButtonComponent = ({
    nodes,
    selectedTab,
    handleFilterClick,
    maxInlineFiltersCount = 0,
}: StatusFilterButtonType) => {
    // STATES
    const [overflowFilterIndex, setOverflowFilterIndex] = useState(0)

    // STATUS FILTERS
    const { allResourceKindFilter, statusFilters } = getStatusFilters(getNodesCount(nodes))

    useEffect(() => {
        const filterIndex = statusFilters.findIndex(({ status }) => status === selectedTab)

        if (filterIndex === -1) {
            handleFilterClick(allResourceKindFilter.status)
        }

        setOverflowFilterIndex(Math.max(filterIndex, 0))
    }, [JSON.stringify(statusFilters)])

    const showOverflowFilters = maxInlineFiltersCount > 0 && statusFilters.length > maxInlineFiltersCount

    const getInlineFilters = () => {
        if (showOverflowFilters) {
            const min = Math.max(0, Math.min(overflowFilterIndex - 1, statusFilters.length - maxInlineFiltersCount))
            const max = Math.min(min + maxInlineFiltersCount, statusFilters.length)

            return statusFilters.slice(min, max)
        }

        return statusFilters
    }

    const inlineFilters = getInlineFilters()

    const handleInlineFilterClick = (segment: SegmentType) => {
        const { value } = segment

        if (value === allResourceKindFilter.status) {
            setOverflowFilterIndex(0)
        }
        if (selectedTab !== value) {
            handleFilterClick(value as string)
        }
    }

    const handleOverflowFilterClick = (status: string, index: number) => () => {
        if (selectedTab !== status) {
            setOverflowFilterIndex(index)
            handleFilterClick(status)
        }
    }

    const segments: SegmentType[] = [
        {
            value: allResourceKindFilter.status,
            label: `All (${allResourceKindFilter.count})`,
        },

        ...inlineFilters.map<SegmentType>(({ status, count }) => ({
            value: status,
            label: (
                <span className="flexbox dc__align-items-center dc__gap-4">
                    {getAppStatusIcon(status, true)}
                    <span>{count}</span>
                </span>
            ),
            tooltipProps: {
                content: status,
                className: 'w-100 dc__first-letter-capitalize',
            },
        })),
    ]

    const segmentValue = segments.find(({ value }) => value === selectedTab)?.value || null

    return (
        <div className="flexbox status-filter__container">
            <SegmentedControl
                segments={segments}
                value={segmentValue}
                onChange={handleInlineFilterClick}
                name="status-filter-button"
                size={ComponentSizeType.small}
            />

            {showOverflowFilters && (
                <PopupMenu autoClose>
                    <PopupMenu.Button
                        isKebab
                        rootClassName="flex p-4 dc__no-left-radius dc__right-radius-4 bg__primary dc__hover-n50"
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
