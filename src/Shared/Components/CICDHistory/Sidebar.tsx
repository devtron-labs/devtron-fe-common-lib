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

import React, { type JSX, memo, useEffect, useRef } from 'react'
import ReactGA from 'react-ga4'
import { generatePath, NavLink, useLocation, useNavigate, useParams } from 'react-router-dom'
import ReactSelect, { components } from 'react-select'
import TippyHeadless from '@tippyjs/react/headless'
import moment from 'moment'

import { ReactComponent as ICArrowBackward } from '@Icons/ic-arrow-backward.svg'
import { ReactComponent as ICDocker } from '@Icons/ic-docker.svg'
import { DeploymentStageType } from '@Shared/constants'

import { ConditionalWrap, DATE_TIME_FORMATS, DropdownIndicator, Tooltip } from '../../../Common'
import { DetectBottom } from '../DetectBottom'
import { Icon } from '../Icon'
import { getCustomOptionSelectionStyle } from '../ReactSelect'
import { DeploymentStatus } from '../StatusComponent'
import BuildAndTaskSummaryTooltipCard from './BuildAndTaskSummaryTooltipCard'
import { FILTER_STYLE, HISTORY_LABEL, statusColor as colorMap } from './constants'
import GitTriggerList from './GitTriggerList'
import {
    CICDSidebarFilterOptionType,
    DeploymentSummaryTooltipCardType,
    FetchIdDataStatus,
    HistoryComponentType,
    HistorySummaryCardType,
    SidebarType,
} from './types'
import {
    getHistoryItemStatusIconFromWorkflowStages,
    getSortedTriggerHistory,
    getTriggerStatusIcon,
    getWorkflowNodeStatusTitle,
} from './utils'

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
    }: DeploymentSummaryTooltipCardType): JSX.Element => {
        const triggeredByText = triggeredBy === 1 ? 'auto trigger' : triggeredByEmail

        return (
            <div className="shadow__overlay p-16 br-4 w-400 bg__overlay--primary border__primary mxh-300 dc__overflow-auto">
                <span className="fw-6 fs-16 mb-4" style={{ color: colorMap[status.toLowerCase()] }}>
                    {getWorkflowNodeStatusTitle(status)}
                </span>
                <div className="flex column left">
                    <div className="flex left fs-12 cn-7">
                        <div className="dc__no-shrink">
                            {moment(startedOn).format(DATE_TIME_FORMATS.TWELVE_HOURS_FORMAT)}
                        </div>

                        <div className="dc__bullet ml-6 mr-6 dc__no-shrink" />

                        <Tooltip content={triggeredByText}>
                            <span className="dc__truncate">{triggeredByText}</span>
                        </Tooltip>
                    </div>

                    <GitTriggerList addMarginTop ciMaterials={ciMaterials} gitTriggers={gitTriggers} />
                </div>
            </div>
        )
    },
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
        path,
    }: HistorySummaryCardType): JSX.Element => {
        const params = useParams()
        const { pathname } = useLocation()
        const currentTab = pathname.split('/').pop()
        const { envId, ...rest } = useParams<{ triggerId: string; envId: string }>()
        const isCDType: boolean = type === HistoryComponentType.CD || type === HistoryComponentType.GROUP_CD
        const idName = isCDType ? 'triggerId' : 'buildId'

        const isDeployedInThisResource = resourceId === runSource?.id

        const targetCardRef = useRef(null)

        const getPath = (): string =>
            `${generatePath(path, {
                ...rest,
                envId,
                [idName]: id,
            })}/${currentTab}`

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
                    to={getPath()}
                    className={({ isActive }) =>
                        `w-100 deployment-history-card-container p-8 br-4 ${isActive ? 'active' : ''}`
                    }
                    data-testid={dataTestId}
                    ref={assignTargetCardRef}
                >
                    <div className="w-100 deployment-history-card">
                        {areWorkerStatusSeparated ? (
                            getHistoryItemStatusIconFromWorkflowStages(workflowExecutionStages)
                        ) : (
                            <DeploymentStatus
                                status={getTriggerStatusIcon(status)}
                                hideMessage
                                hideIconTooltip
                                iconSize={20}
                            />
                        )}
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
        path,
    }: SidebarType) => {
        const { pipelineId, appId, envId } = useParams<{ appId: string; envId: string; pipelineId: string }>()
        const navigate = useNavigate()

        const handleFilterChange = (selectedFilter: CICDSidebarFilterOptionType): void => {
            if (type === HistoryComponentType.CI) {
                setPagination({ offset: 0, size: 20 })
                navigate(generatePath(path, { appId, pipelineId: selectedFilter.value }))
            } else if (type === HistoryComponentType.GROUP_CI) {
                setPagination({ offset: 0, size: 20 })
                navigate(generatePath(path, { envId, pipelineId: String(selectedFilter.pipelineId) }))
            } else if (type === HistoryComponentType.GROUP_CD) {
                setPagination({ offset: 0, size: 20 })
                navigate(
                    generatePath(path, {
                        envId,
                        appId: selectedFilter.value,
                        pipelineId: String(selectedFilter.pipelineId),
                    }),
                )
            } else {
                setPagination({ offset: 0, size: 20 })
                navigate(
                    generatePath(path, {
                        appId,
                        envId: selectedFilter.value,
                        pipelineId: String(selectedFilter.pipelineId),
                    }),
                )
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
                    <div className="flexbox dc dc__gap-4">
                        {(type === HistoryComponentType.CI || type === HistoryComponentType.GROUP_CI) && (
                            <Icon
                                name={
                                    props.data.pipelineType?.toLowerCase() === 'ci_job'
                                        ? 'ic-job-color'
                                        : 'ic-build-color'
                                }
                                size={20}
                                color={null}
                            />
                        )}
                        <span>{props.label}</span>
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
                    {getSortedTriggerHistory(triggerHistory).map(([triggerId, triggerDetails], index) => (
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
                            path={path}
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
