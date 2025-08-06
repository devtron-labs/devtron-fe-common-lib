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

import { useState } from 'react'

import { SortableTableHeaderCell } from '@Common/SortableTableHeaderCell'
import { Tooltip } from '@Common/Tooltip'
import { ALL_RESOURCE_KIND_FILTER, APP_STATUS_HEADERS, ComponentSizeType } from '@Shared/constants'
import { Node } from '@Shared/types'

import { Button, ButtonStyleType, ButtonVariantType } from '../Button'
import { NodeFilters, StatusFilterButtonComponent } from '../CICDHistory'
import { Icon } from '../Icon'
import { ShowMoreText } from '../ShowMoreText'
import { AppStatusContentProps } from './types'
import { getFlattenedNodesFromAppDetails, getResourceKey } from './utils'

import './AppStatusContent.scss'

const APP_STATUS_ROWS_BASE_CLASS = 'px-16 py-8 dc__grid dc__column-gap-16 app-status-content__row'

const AppStatusContent = ({
    appDetails,
    handleShowConfigDriftModal,
    filterHealthyNodes = false,
    isCardLayout = true,
}: AppStatusContentProps) => {
    const [currentFilter, setCurrentFilter] = useState<string>(ALL_RESOURCE_KIND_FILTER)
    const { appId, environmentId: envId } = appDetails

    const flattenedNodes = getFlattenedNodesFromAppDetails({
        appDetails,
        filterHealthyNodes,
    })

    const filteredFlattenedNodes = flattenedNodes.filter(
        (nodeDetails) =>
            currentFilter === ALL_RESOURCE_KIND_FILTER ||
            (currentFilter === NodeFilters.drifted && nodeDetails.hasDrift) ||
            nodeDetails.health.status?.toLowerCase() === currentFilter,
    )

    const handleFilterClick = (selectedFilter: string) => {
        const lowerCaseSelectedFilter = selectedFilter.toLowerCase()

        if (currentFilter !== lowerCaseSelectedFilter) {
            setCurrentFilter(lowerCaseSelectedFilter)
        }
    }

    const getNodeMessage = (nodeDetails: Node) => {
        const resourceKey = getResourceKey(nodeDetails)

        if (
            appDetails.resourceTree?.resourcesSyncResult &&
            // eslint-disable-next-line no-prototype-builtins
            appDetails.resourceTree.resourcesSyncResult.hasOwnProperty(resourceKey)
        ) {
            return appDetails.resourceTree.resourcesSyncResult[resourceKey]
        }
        return ''
    }

    const getNodeStatus = (nodeDetails: Node) => (nodeDetails.status ? nodeDetails.status : nodeDetails.health.status)

    const renderRows = () => {
        if (!flattenedNodes.length) {
            return (
                <div className="flex column py-16 dc__gap-4 dc__align-center h-100">
                    <Icon name="ic-info-filled" size={20} color={null} />
                    <span>Checking resources status</span>
                </div>
            )
        }

        return (
            <>
                {filteredFlattenedNodes.map((nodeDetails) => (
                    <div
                        className={`${APP_STATUS_ROWS_BASE_CLASS} cn-9 fs-13 fw-4 lh-20`}
                        key={getResourceKey(nodeDetails)}
                    >
                        <Tooltip content={nodeDetails.kind}>
                            <span className="dc__word-break">{nodeDetails.kind}</span>
                        </Tooltip>

                        <span className="dc__word-break">{nodeDetails.name}</span>

                        <Tooltip content={getNodeStatus(nodeDetails)}>
                            <span
                                className={`app-summary__status-name f-${getNodeStatus(nodeDetails)?.toLowerCase() || ''} dc__first-letter-capitalize--imp fs-13 fw-4 lh-20 dc__ellipsis-right`}
                            >
                                {getNodeStatus(nodeDetails)}
                            </span>
                        </Tooltip>

                        <div className="flexbox-col dc__gap-4">
                            {handleShowConfigDriftModal && nodeDetails.hasDrift && (
                                <div className="flexbox dc__gap-8 dc__align-items-center">
                                    <span className="fs-13 fw-4 lh-20 cy-7">Config drift detected</span>
                                    {appId && envId && (
                                        <Button
                                            dataTestId="show-config-drift"
                                            text="Compare with desired"
                                            variant={ButtonVariantType.text}
                                            style={ButtonStyleType.default}
                                            onClick={handleShowConfigDriftModal}
                                            size={ComponentSizeType.small}
                                        />
                                    )}
                                </div>
                            )}
                            <ShowMoreText
                                key={`${getNodeMessage(nodeDetails)}-${nodeDetails.name}-${nodeDetails.kind}`}
                                containerClass="w-450"
                                text={getNodeMessage(nodeDetails)}
                            />
                        </div>
                    </div>
                ))}
            </>
        )
    }

    return (
        <div className={`flexbox-col app-status-content ${isCardLayout ? 'br-6 border__primary' : ''}`}>
            {!!flattenedNodes.length && (
                <div className="p-12">
                    <StatusFilterButtonComponent
                        nodes={flattenedNodes}
                        selectedTab={currentFilter}
                        handleFilterClick={handleFilterClick}
                    />
                </div>
            )}

            <div
                className={`${APP_STATUS_ROWS_BASE_CLASS} dc__position-sticky dc__top-0 dc__zi-1 cn-7 fs-13 fw-6 lh-20 border__secondary--bottom bg__primary dc__top-radius-6`}
            >
                {APP_STATUS_HEADERS.map((headerKey) => (
                    <SortableTableHeaderCell key={`header_${headerKey}`} isSortable={false} title={headerKey} />
                ))}
            </div>

            {renderRows()}
        </div>
    )
}

export default AppStatusContent
