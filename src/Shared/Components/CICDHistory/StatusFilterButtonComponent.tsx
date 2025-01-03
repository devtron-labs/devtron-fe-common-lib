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

/* eslint-disable eqeqeq */
import { ALL_RESOURCE_KIND_FILTER } from '@Shared/constants'
import { ReactComponent as ICCaretDown } from '@Icons/ic-caret-down.svg'
import { PopupMenu, StyledRadioGroup as RadioGroup } from '../../../Common'
import { NodeFilters, NodeStatus, StatusFilterButtonType } from './types'
import './StatusFilterButtonComponent.scss'

export const StatusFilterButtonComponent = ({ nodes, selectedTab, handleFilterClick }: StatusFilterButtonType) => {
    const maxInlineFilterCount = 4
    let allNodeCount: number = 0
    let healthyNodeCount: number = 0
    let progressingNodeCount: number = 0
    let failedNodeCount: number = 0
    let missingNodeCount: number = 0
    let driftedNodeCount: number = 0

    nodes?.forEach((_node) => {
        const _nodeHealth = _node.health?.status

        if (_node.hasDrift) {
            driftedNodeCount += 1
        }

        if (_nodeHealth?.toLowerCase() === NodeStatus.Healthy) {
            healthyNodeCount += 1
        } else if (_nodeHealth?.toLowerCase() === NodeStatus.Degraded) {
            failedNodeCount += 1
        } else if (_nodeHealth?.toLowerCase() === NodeStatus.Progressing) {
            progressingNodeCount += 1
        } else if (_nodeHealth?.toLowerCase() === NodeStatus.Missing) {
            missingNodeCount += 1
        }
        allNodeCount += 1
    })

    const handleInlineFilterClick = (e) => {
        handleFilterClick(e.target.value)
    }

    const filterOptions = [
        { status: ALL_RESOURCE_KIND_FILTER, count: allNodeCount, isSelected: selectedTab == ALL_RESOURCE_KIND_FILTER },
        { status: NodeStatus.Missing, count: missingNodeCount, isSelected: NodeStatus.Missing == selectedTab },
        { status: NodeStatus.Degraded, count: failedNodeCount, isSelected: NodeStatus.Degraded == selectedTab },
        {
            status: NodeStatus.Progressing,
            count: progressingNodeCount,
            isSelected: NodeStatus.Progressing == selectedTab,
        },
        { status: NodeStatus.Healthy, count: healthyNodeCount, isSelected: NodeStatus.Healthy == selectedTab },
        window._env_.FEATURE_CONFIG_DRIFT_ENABLE && {
            status: NodeFilters.drifted,
            count: driftedNodeCount,
            isSelected: selectedTab === NodeFilters.drifted,
        },
    ]
    const validFilterOptions = filterOptions.filter(({ count }) => count > 0)
    const displayedInlineFilters = validFilterOptions.slice(
        0,
        Math.min(maxInlineFilterCount, validFilterOptions.length),
    )
    const overflowFilters =
        validFilterOptions.length > maxInlineFilterCount ? validFilterOptions.slice(maxInlineFilterCount) : null

    const renderOverflowFilters = () =>
        overflowFilters ? (
            <PopupMenu autoClose>
                <PopupMenu.Button
                    isKebab
                    rootClassName="flex p-4 dc__border dc__no-left-radius dc__right-radius-4 bcn-0 dc__hover-n50"
                >
                    <ICCaretDown className="icon-dim-14 scn-6" />
                </PopupMenu.Button>
                <PopupMenu.Body rootClassName="w-150 py-4 mt-4" style={{ left: '136px' }}>
                    {overflowFilters.map((filter) => (
                        <button
                            key={filter.status}
                            type="button"
                            className={`dc__transparent w-100 py-6 px-8 flex left dc__gap-8 fs-13 lh-20 fw-4 cn-9 ${filter.isSelected ? 'bcb-1' : 'bcn-0 dc__hover-n50'}`}
                            onClick={() => handleFilterClick(filter.status)}
                        >
                            <span
                                className={`dc__app-summary__icon icon-dim-16 ${filter.status} ${filter.status}--node`}
                                style={{ zIndex: 'unset' }}
                            />
                            <span className="dc__first-letter-capitalize flex-grow-1 text-left">{filter.status}</span>
                            <span>{filter.count}</span>
                        </button>
                    ))}
                </PopupMenu.Body>
            </PopupMenu>
        ) : null

    return (
        <>
            <RadioGroup
                className={`gui-yaml-switch status-filter-button ${overflowFilters ? 'with-menu-button' : ''}`}
                name="status-filter-button"
                initialTab={selectedTab}
                disabled={false}
                onChange={handleInlineFilterClick}
            >
                {displayedInlineFilters.map((filter, index) => (
                    <RadioGroup.Radio
                        key={filter.status}
                        value={filter.status}
                        showTippy={index !== 0}
                        tippyPlacement="top"
                        tippyContent={filter.status}
                        tippyClass="w-100 dc__first-letter-capitalize"
                    >
                        {index !== 0 ? (
                            <>
                                <span
                                    className={`dc__app-summary__icon icon-dim-16 ${filter.status} ${filter.status}--node`}
                                    style={{ zIndex: 'unset' }}
                                />
                                <span>{filter.count}</span>
                            </>
                        ) : (
                            <span className="dc__first-letter-capitalize">{`${filter.status} (${filter.count})`}</span>
                        )}
                    </RadioGroup.Radio>
                ))}
            </RadioGroup>
            {renderOverflowFilters()}
        </>
    )
}
