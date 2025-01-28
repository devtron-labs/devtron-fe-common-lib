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

import React, { memo, useEffect, useRef } from 'react'
import TippyHeadless from '@tippyjs/react/headless'
import ReactGA from 'react-ga4'
import { useHistory, useParams, useRouteMatch, generatePath, useLocation, NavLink } from 'react-router-dom'
import ReactSelect, { components } from 'react-select'
import moment from 'moment'
import { ReactComponent as ICArrowBackward } from '@Icons/ic-arrow-backward.svg'
import { ReactComponent as ICDocker } from '@Icons/ic-docker.svg'
import { DeploymentStageType } from '@Shared/constants'
import {
    SidebarType,
    CICDSidebarFilterOptionType,
    HistoryComponentType,
    HistorySummaryCardType,
    DeploymentSummaryTooltipCardType,
    FetchIdDataStatus,
} from './types'
import BuildAndTaskSummaryTooltipCard from './BuildAndTaskSummaryTooltipCard'
import { getCustomOptionSelectionStyle } from '../ReactSelect'
import { DetectBottom } from '../DetectBottom'
import { ConditionalWrap, DATE_TIME_FORMATS, DropdownIndicator } from '../../../Common'
import { HISTORY_LABEL, FILTER_STYLE, statusColor as colorMap } from './constants'
import { getHistoryItemStatusIconFromWorkflowStages, getTriggerStatusIcon, getWorkflowNodeStatusTitle } from './utils'
import GitTriggerList from './GitTriggerList'

/**
 * @description To be shown on deployment history or when we don't have workflowExecutionStages
 */
const DeploymentSummaryTooltipCard = memo(
    ({
        status,
        startedOn,
        triggeredBy,
        triggeredByEmail,
        ciMaterials,
        gitTriggers,
    }: DeploymentSummaryTooltipCardType): JSX.Element => (
        <div className="shadow__overlay p-16 br-4 w-400 bg__overlay border__primary mxh-300 dc__overflow-auto">
            <span className="fw-6 fs-16 mb-4" style={{ color: colorMap[status.toLowerCase()] }}>
                {getWorkflowNodeStatusTitle(status)}
            </span>
            <div className="flex column left">
                <div className="flex left fs-12 cn-7">
                    <div>{moment(startedOn).format(DATE_TIME_FORMATS.TWELVE_HOURS_FORMAT)}</div>
                    <div className="dc__bullet ml-6 mr-6" />
                    <div>{triggeredBy === 1 ? 'auto trigger' : triggeredByEmail}</div>
                </div>

                <GitTriggerList addMarginTop ciMaterials={ciMaterials} gitTriggers={gitTriggers} />
            </div>
        </div>
    ),
)

const ViewAllCardsTile = memo(
    ({ handleViewAllHistory }: { handleViewAllHistory: () => void }): JSX.Element => (
        <div className="flex pt-12 pb-12 pl-16 pr-16 dc__gap-16 dc__align-self-stretch">
            <button
                type="button"
                aria-label="all-history"
                className="p-0 dc__no-background dc__no-border h-16"
                onClick={handleViewAllHistory}
            >
                <ICArrowBackward width={16} height={16} />
            </button>

            <div style={{ flex: '1 0 0' }}>
                <p className="ci-cd-details__sidebar-typography">View all items in history</p>
            </div>
        </div>
    ),
)

const HistorySummaryCard = memo(
    ({
        id,
        status,
        startedOn,
        triggeredBy,
        triggeredByEmail,
        ciMaterials,
        gitTriggers,
        artifact,
        type,
        stage,
        dataTestId,
        renderRunSource,
        runSource,
        resourceId,
        podName,
        namespace,
        workflowExecutionStages,
    }: HistorySummaryCardType): JSX.Element => {
        const { path, params } = useRouteMatch()
        const { pathname } = useLocation()
        const currentTab = pathname.split('/').pop()
        const { envId, ...rest } = useParams<{ triggerId: string; envId: string }>()
        const isCDType: boolean = type === HistoryComponentType.CD || type === HistoryComponentType.GROUP_CD
        const idName = isCDType ? 'triggerId' : 'buildId'

        const isDeployedInThisResource = resourceId === runSource?.id

        const targetCardRef = useRef(null)

        const getPath = (): string => {
            const _params = {
                ...rest,
                envId,
                [idName]: id,
            }
            return `${generatePath(path, _params)}/${currentTab}`
        }

        const scrollToElement = () => {
            if (targetCardRef?.current) {
                targetCardRef.current.scrollIntoView({ behavior: 'smooth' })
            }
        }

        useEffect(() => {
            scrollToElement()
        }, [targetCardRef])

        const activeID = params[idName]

        const assignTargetCardRef = (el) => {
            if (+activeID === +id) {
                targetCardRef.current = el
            }
        }

        const areWorkerStatusSeparated =
            stage !== DeploymentStageType.DEPLOY && Object.keys(workflowExecutionStages || {}).length > 0

        return (
            <ConditionalWrap
                condition={Array.isArray(ciMaterials)}
                // eslint-disable-next-line react/no-unstable-nested-components
                wrap={(children) => (
                    <TippyHeadless
                        placement="right"
                        interactive
                        render={() =>
                            // Adding check for workflowExecutionStages to cater backward compatibility
                            areWorkerStatusSeparated ? (
                                <BuildAndTaskSummaryTooltipCard
                                    workflowExecutionStages={workflowExecutionStages}
                                    triggeredByEmail={triggeredByEmail}
                                    namespace={namespace}
                                    podName={podName}
                                    stage={stage}
                                    gitTriggers={gitTriggers}
                                    ciMaterials={ciMaterials}
                                />
                            ) : (
                                <DeploymentSummaryTooltipCard
                                    status={status}
                                    startedOn={startedOn}
                                    triggeredBy={triggeredBy}
                                    triggeredByEmail={triggeredByEmail}
                                    ciMaterials={ciMaterials}
                                    gitTriggers={gitTriggers}
                                />
                            )
                        }
                    >
                        {children}
                    </TippyHeadless>
                )}
            >
                <NavLink
                    to={getPath}
                    className="w-100 deployment-history-card-container p-8 br-4"
                    data-testid={dataTestId}
                    activeClassName="active"
                    ref={assignTargetCardRef}
                >
                    <div className="w-100 deployment-history-card">
                        {areWorkerStatusSeparated
                            ? getHistoryItemStatusIconFromWorkflowStages(workflowExecutionStages)
                            : getTriggerStatusIcon(status)}
                        <div className="flexbox-col dc__gap-8">
                            <div className="flex column left">
                                <div className="cn-9 fs-13 lh-20">
                                    {moment(startedOn).format(DATE_TIME_FORMATS.TWELVE_HOURS_FORMAT)}
                                </div>
                                <div className="flex left cn-7 fs-12">
                                    {isCDType && (
                                        <>
                                            <div className="dc__first-letter-capitalize dc__no-shrink">
                                                {['pre', 'post'].includes(stage?.toLowerCase())
                                                    ? `${stage}-deploy`
                                                    : stage}
                                            </div>
                                            <span className="dc__bullet dc__bullet--d2 ml-4 mr-4" />
                                            {artifact && (
                                                <div className="dc__app-commit__hash dc__app-commit__hash--no-bg dc__no-shrink">
                                                    <ICDocker className="commit-hash__icon grayscale" />
                                                    {artifact.split(':')[1].slice(-12)}
                                                </div>
                                            )}
                                            <span className="dc__bullet dc__bullet--d2 ml-4 mr-4" />
                                        </>
                                    )}
                                    <div className="cn-7 fs-12 dc__truncate">
                                        {triggeredBy === 1 ? 'auto trigger' : triggeredByEmail}
                                    </div>
                                </div>
                            </div>
                            {runSource && renderRunSource && renderRunSource(runSource, isDeployedInThisResource)}
                        </div>
                    </div>
                </NavLink>
            </ConditionalWrap>
        )
    },
)

const Sidebar = React.memo(
    ({
        type,
        filterOptions,
        triggerHistory,
        hasMore,
        setPagination,
        fetchIdData,
        handleViewAllHistory,
        children,
        renderRunSource,
        resourceId,
    }: SidebarType) => {
        const { pipelineId, appId, envId } = useParams<{ appId: string; envId: string; pipelineId: string }>()
        const { push } = useHistory()
        const { path } = useRouteMatch()

        const handleFilterChange = (selectedFilter: CICDSidebarFilterOptionType): void => {
            if (type === HistoryComponentType.CI) {
                setPagination({ offset: 0, size: 20 })
                push(generatePath(path, { appId, pipelineId: selectedFilter.value }))
            } else if (type === HistoryComponentType.GROUP_CI) {
                setPagination({ offset: 0, size: 20 })
                push(generatePath(path, { envId, pipelineId: selectedFilter.pipelineId }))
            } else if (type === HistoryComponentType.GROUP_CD) {
                setPagination({ offset: 0, size: 20 })
                push(generatePath(path, { envId, appId: selectedFilter.value, pipelineId: selectedFilter.pipelineId }))
            } else {
                setPagination({ offset: 0, size: 20 })
                push(generatePath(path, { appId, envId: selectedFilter.value, pipelineId: selectedFilter.pipelineId }))
            }
        }
        const reloadNextAfterBottom = () => {
            ReactGA.event({
                category: 'pagination',
                action: 'auto',
                label: `${type.toLowerCase()}-history`,
                value: triggerHistory.size,
            })
            setPagination({ offset: triggerHistory.size, size: 20 })
        }

        const filterOptionType = () => {
            if (type === HistoryComponentType.CI || type === HistoryComponentType.GROUP_CI) {
                return pipelineId
            }
            if (type === HistoryComponentType.GROUP_CD) {
                return appId
            }
            return envId
        }

        const selectedFilter = filterOptions?.find((filterOption) => filterOption.value === filterOptionType()) ?? null
        filterOptions?.sort((a, b) => (a.label > b.label ? 1 : -1))
        const _filterOptions = filterOptions?.filter((filterOption) => !filterOption.deploymentAppDeleteRequest)

        const selectLabel = () => {
            if (type === HistoryComponentType.GROUP_CI || type === HistoryComponentType.GROUP_CD) {
                return HISTORY_LABEL.APPLICATION
            }
            if (type === HistoryComponentType.CI) {
                return HISTORY_LABEL.PIPELINE
            }
            return HISTORY_LABEL.ENVIRONMENT
        }

        const ciPipelineBuildTypeOption = (props): JSX.Element => {
            // eslint-disable-next-line no-param-reassign
            props.selectProps.styles.option = getCustomOptionSelectionStyle()
            return (
                <components.Option {...props}>
                    <div style={{ display: 'flex' }}>
                        {(type === HistoryComponentType.CI || type === HistoryComponentType.GROUP_CI) && (
                            <div
                                className={
                                    `dc__ci-pipeline-type-icon mr-5 ${props.data.pipelineType?.toLowerCase()}` || ''
                                }
                            />
                        )}
                        {props.label}
                    </div>
                </components.Option>
            )
        }

        return (
            <>
                {children || (
                    <div className="select-pipeline-wrapper w-100 pl-16 pr-16 dc__overflow-hidden dc__border-bottom-n1">
                        <label
                            htmlFor="history-pipeline-selector"
                            className="form__label"
                            data-testid="select-history-heading"
                        >
                            Select {selectLabel()}
                        </label>
                        <ReactSelect
                            classNamePrefix="history-pipeline-dropdown"
                            value={selectedFilter}
                            options={
                                type === HistoryComponentType.CI || type === HistoryComponentType.GROUP_CI
                                    ? filterOptions
                                    : _filterOptions
                            }
                            onChange={handleFilterChange}
                            components={{
                                IndicatorSeparator: null,
                                Option: ciPipelineBuildTypeOption,
                                DropdownIndicator,
                            }}
                            styles={FILTER_STYLE}
                            menuPosition="fixed"
                            inputId="history-pipeline-selector"
                        />
                    </div>
                )}

                <div className="flex column top left flex-grow-1 dc__overflow-auto p-8">
                    {fetchIdData === FetchIdDataStatus.SUCCESS && (
                        <ViewAllCardsTile handleViewAllHistory={handleViewAllHistory} />
                    )}
                    {Array.from(triggerHistory)
                        .sort(([a], [b]) => b - a)
                        .map(([triggerId, triggerDetails], index) => (
                            <HistorySummaryCard
                                dataTestId={`deployment-history-${index}`}
                                key={triggerId}
                                id={triggerId}
                                status={triggerDetails.status}
                                startedOn={triggerDetails.startedOn}
                                triggeredBy={triggerDetails.triggeredBy}
                                triggeredByEmail={triggerDetails.triggeredByEmail}
                                ciMaterials={triggerDetails.ciMaterials}
                                gitTriggers={triggerDetails.gitTriggers}
                                artifact={triggerDetails.artifact}
                                stage={triggerDetails.stage}
                                type={type}
                                runSource={triggerDetails.runSource}
                                renderRunSource={renderRunSource}
                                resourceId={resourceId}
                                workflowExecutionStages={triggerDetails.workflowExecutionStages}
                                podName={triggerDetails.podName}
                                namespace={triggerDetails.namespace}
                            />
                        ))}
                    {hasMore && (fetchIdData === FetchIdDataStatus.SUSPEND || !fetchIdData) && (
                        <DetectBottom callback={reloadNextAfterBottom} />
                    )}
                </div>
            </>
        )
    },
)

export default Sidebar
