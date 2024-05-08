import { useEffect, useState } from 'react'
import { StyledRadioGroup as RadioGroup } from '../../../Common'
import { NodeStatus, StatusFilterButtonType } from './types'
import { updateFilterType } from './utils'

interface TabState {
    status: string
    count: number
    isSelected: boolean
}

export const StatusFilterButtonComponent = ({ nodes, handleFilterClick }: StatusFilterButtonType) => {
    const [selectedTab, setSelectedTab] = useState('all')

    let allNodeCount: number = 0
    let healthyNodeCount: number = 0
    let progressingNodeCount: number = 0
    let failedNodeCount: number = 0
    let missingNodeCount: number = 0

    nodes?.forEach((_node) => {
        const _nodeHealth = _node.health?.status

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

    const filters = [
        { status: 'all', count: allNodeCount, isSelected: selectedTab === 'all' },
        { status: NodeStatus.Missing, count: missingNodeCount, isSelected: NodeStatus.Missing === selectedTab },
        { status: NodeStatus.Degraded, count: failedNodeCount, isSelected: NodeStatus.Degraded === selectedTab },
        {
            status: NodeStatus.Progressing,
            count: progressingNodeCount,
            isSelected: NodeStatus.Progressing === selectedTab,
        },
        { status: NodeStatus.Healthy, count: healthyNodeCount, isSelected: NodeStatus.Healthy === selectedTab },
    ]

    useEffect(() => {
        if (
            (selectedTab === NodeStatus.Healthy && healthyNodeCount === 0) ||
            (selectedTab === NodeStatus.Degraded && failedNodeCount === 0) ||
            (selectedTab === NodeStatus.Progressing && progressingNodeCount === 0) ||
            (selectedTab === NodeStatus.Missing && missingNodeCount === 0)
        ) {
            setSelectedTab('all')
        } else if (handleFilterClick) {
            handleFilterClick(selectedTab)
        } else {
            updateFilterType(selectedTab.toUpperCase())
        }
    }, [nodes, selectedTab])

    const handleTabSwitch = (event): void => {
        setSelectedTab(event.target.value)
    }

    return (
        <RadioGroup
            className="gui-yaml-switch"
            name="yaml-mode"
            initialTab={selectedTab}
            disabled={false}
            onChange={handleTabSwitch}
        >
            {filters.length &&
                filters.map(
                    (filter: TabState, index: number) =>
                        filter.count > 0 && (
                            <RadioGroup.Radio value={filter.status}>
                                {index !== 0 && (
                                    <span
                                        className={`dc__app-summary__icon icon-dim-16 mr-6 ${filter.status} ${filter.status}--node`}
                                        style={{ zIndex: 'unset' }}
                                    />
                                )}
                                <span className="dc__first-letter-capitalize">{filter.status}</span>
                                <span className="pl-4">({filter.count})</span>
                            </RadioGroup.Radio>
                        ),
                )}
        </RadioGroup>
    )
}
