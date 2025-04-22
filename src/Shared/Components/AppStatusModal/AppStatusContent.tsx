import { useMemo, useState } from 'react'

import { SortableTableHeaderCell } from '@Common/SortableTableHeaderCell'
import { Tooltip } from '@Common/Tooltip'
import { ALL_RESOURCE_KIND_FILTER, APP_STATUS_HEADERS, ComponentSizeType } from '@Shared/constants'
import { Node } from '@Shared/types'

import { Button, ButtonStyleType, ButtonVariantType } from '../Button'
import { NodeFilters, StatusFilterButtonComponent } from '../CICDHistory'
import { Icon } from '../Icon'
import { AppStatusContentProps } from './types'
import { getFlattenedNodesFromAppDetails, getResourceKey } from './utils'

const APP_STATUS_ROWS_BASE_CLASS = 'px-16 py-8 dc__grid dc__column-gap-16 app-status-content__row'

const AppStatusContent = ({
    appDetails,
    handleShowConfigDriftModal,
    filterHealthyNodes = false,
    isCardLayout = true,
}: AppStatusContentProps) => {
    const [currentFilter, setCurrentFilter] = useState<string>(ALL_RESOURCE_KIND_FILTER)
    const { appId, environmentId: envId } = appDetails

    const flattenedNodes = useMemo(
        () =>
            getFlattenedNodesFromAppDetails({
                appDetails,
                filterHealthyNodes,
            }),
        [appDetails, filterHealthyNodes],
    )

    const filteredFlattenedNodes = useMemo(
        () =>
            flattenedNodes.filter(
                (nodeDetails) =>
                    currentFilter === ALL_RESOURCE_KIND_FILTER ||
                    (currentFilter === NodeFilters.drifted && nodeDetails.hasDrift) ||
                    nodeDetails.health.status?.toLowerCase() === currentFilter,
            ),
        [flattenedNodes, currentFilter],
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
                            <span>{nodeDetails.kind}</span>
                        </Tooltip>

                        <span>{nodeDetails.name}</span>

                        <div
                            className={`app-summary__status-name f-${getNodeStatus(nodeDetails)?.toLowerCase() || ''}`}
                        >
                            {getNodeStatus(nodeDetails)}
                        </div>

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
                            <div>{getNodeMessage(nodeDetails)}</div>
                        </div>
                    </div>
                ))}
            </>
        )
    }

    return (
        <div className={`flexbox-col ${isCardLayout ? 'br-6 border__primary dc__overflow-hidden' : ''}`}>
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
                className={`${APP_STATUS_ROWS_BASE_CLASS} cn-7 fs-13 fw-6 lh-20 border__secondary--bottom bg__primary`}
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
