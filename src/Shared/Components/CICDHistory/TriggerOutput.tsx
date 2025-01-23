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

import { Redirect, Route, Switch, useParams, useRouteMatch, NavLink } from 'react-router-dom'
import React, { useEffect, useMemo } from 'react'
import { sanitizeTargetPlatforms } from '@Shared/Helpers'
import {
    DeploymentAppTypes,
    GenericEmptyState,
    Progressing,
    Reload,
    useAsync,
    useInterval,
    URLS,
    ServerError,
    mapByKey,
} from '../../../Common'
import {
    FetchIdDataStatus,
    HistoryComponentType,
    TriggerOutputProps,
    statusSet,
    terminalStatus,
    History,
    HistoryLogsProps,
} from './types'
import { getTagDetails, getTriggerDetails } from './service'
import LogsRenderer from './LogsRenderer'
import DeploymentDetailSteps from './DeploymentDetailSteps'
import { DeploymentHistoryConfigDiff } from './DeploymentHistoryConfigDiff'
import { GitChanges, Scroller } from './History.components'
import Artifacts from './Artifacts'
import { EMPTY_STATE_STATUS } from '../../constants'
import './cicdHistory.scss'
import TriggerDetails from './TriggerDetails'

const HistoryLogs: React.FC<HistoryLogsProps> = ({
    triggerDetails,
    loading,
    setFullScreenView,
    deploymentAppType,
    isBlobStorageConfigured,
    userApprovalMetadata,
    triggeredByEmail,
    artifactId,
    ciPipelineId,
    appReleaseTags,
    tagsEditable,
    hideImageTaggingHardDelete,
    selectedEnvironmentName,
    resourceId,
    renderRunSource,
    processVirtualEnvironmentDeploymentData,
    renderDeploymentApprovalInfo,
    renderCIListHeader,
    renderVirtualHistoryArtifacts,
    scrollToTop,
    scrollToBottom,
    fullScreenView,
    appName,
    triggerHistory,
    targetPlatforms,
}) => {
    const { path } = useRouteMatch()
    const { appId, pipelineId, triggerId, envId } = useParams<{
        appId: string
        pipelineId: string
        triggerId: string
        envId: string
    }>()

    const paramsData = {
        appId,
        envId,
        appName: `${triggerDetails.helmPackageName}.tgz`,
        workflowId: triggerDetails.id,
    }

    const CDBuildReportUrl = `app/cd-pipeline/workflow/download/${appId}/${envId}/${pipelineId}/${triggerId}`

    return (
        <div className="trigger-outputs-container flexbox-col flex-grow-1 h-100">
            {loading ? (
                <Progressing pageLoader />
            ) : (
                <Switch>
                    {triggerDetails.stage !== 'DEPLOY' ? (
                        !triggerDetails.IsVirtualEnvironment && (
                            <Route path={`${path}/logs`}>
                                <LogsRenderer
                                    triggerDetails={triggerDetails}
                                    isBlobStorageConfigured={isBlobStorageConfigured}
                                    parentType={HistoryComponentType.CD}
                                    fullScreenView={fullScreenView}
                                />

                                {(scrollToTop || scrollToBottom) && (
                                    <Scroller
                                        style={{ position: 'fixed', bottom: '52px', right: '12px', zIndex: '4' }}
                                        {...{ scrollToTop, scrollToBottom }}
                                    />
                                )}
                            </Route>
                        )
                    ) : (
                        <Route path={`${path}/deployment-steps`}>
                            <DeploymentDetailSteps
                                deploymentStatus={triggerDetails.status}
                                deploymentAppType={deploymentAppType}
                                userApprovalMetadata={userApprovalMetadata}
                                isGitops={
                                    deploymentAppType === DeploymentAppTypes.GITOPS ||
                                    deploymentAppType === DeploymentAppTypes.MANIFEST_DOWNLOAD ||
                                    deploymentAppType === DeploymentAppTypes.MANIFEST_PUSH
                                }
                                isHelmApps={false}
                                isVirtualEnvironment={triggerDetails.IsVirtualEnvironment}
                                processVirtualEnvironmentDeploymentData={processVirtualEnvironmentDeploymentData}
                                renderDeploymentApprovalInfo={renderDeploymentApprovalInfo}
                            />
                        </Route>
                    )}
                    <Route path={`${path}/source-code`}>
                        <GitChanges
                            gitTriggers={triggerDetails.gitTriggers}
                            ciMaterials={triggerDetails.ciMaterials}
                            artifact={triggerDetails.artifact}
                            userApprovalMetadata={userApprovalMetadata}
                            triggeredByEmail={triggeredByEmail}
                            artifactId={artifactId}
                            ciPipelineId={ciPipelineId}
                            imageComment={triggerDetails?.imageComment}
                            imageReleaseTags={triggerDetails?.imageReleaseTags}
                            appReleaseTagNames={appReleaseTags}
                            tagsEditable={tagsEditable}
                            hideImageTaggingHardDelete={hideImageTaggingHardDelete}
                            appliedFilters={triggerDetails.appliedFilters ?? []}
                            appliedFiltersTimestamp={triggerDetails.appliedFiltersTimestamp}
                            selectedEnvironmentName={selectedEnvironmentName}
                            promotionApprovalMetadata={triggerDetails?.promotionApprovalMetadata}
                            renderCIListHeader={renderCIListHeader}
                            targetPlatforms={targetPlatforms}
                        />
                    </Route>
                    {triggerDetails.stage === 'DEPLOY' && (
                        <Route path={`${path}${URLS.DEPLOYMENT_HISTORY_CONFIGURATIONS}`}>
                            <DeploymentHistoryConfigDiff
                                appName={appName}
                                envName={selectedEnvironmentName}
                                pipelineId={+pipelineId}
                                wfrId={+triggerId}
                                triggerHistory={triggerHistory}
                                setFullScreenView={setFullScreenView}
                                resourceId={resourceId}
                                renderRunSource={renderRunSource}
                            />
                        </Route>
                    )}
                    {(triggerDetails.stage !== 'DEPLOY' || triggerDetails.IsVirtualEnvironment) && (
                        <Route path={`${path}/artifacts`}>
                            {triggerDetails.IsVirtualEnvironment && renderVirtualHistoryArtifacts ? (
                                renderVirtualHistoryArtifacts({
                                    status: triggerDetails.status,
                                    title: triggerDetails.helmPackageName,
                                    params: { ...paramsData, appId: Number(appId), envId: Number(envId) },
                                })
                            ) : (
                                <Artifacts
                                    status={triggerDetails.status}
                                    artifact={triggerDetails.artifact}
                                    blobStorageEnabled={triggerDetails.blobStorageEnabled}
                                    isArtifactUploaded={triggerDetails.isArtifactUploaded}
                                    ciPipelineId={triggerDetails.ciPipelineId}
                                    artifactId={triggerDetails.artifactId}
                                    imageComment={triggerDetails?.imageComment}
                                    imageReleaseTags={triggerDetails?.imageReleaseTags}
                                    tagsEditable={tagsEditable}
                                    appReleaseTagNames={appReleaseTags}
                                    hideImageTaggingHardDelete={hideImageTaggingHardDelete}
                                    downloadArtifactUrl={CDBuildReportUrl}
                                    renderCIListHeader={renderCIListHeader}
                                    targetPlatforms={targetPlatforms}
                                    rootClassName="p-16 flex-grow-1"
                                />
                            )}
                        </Route>
                    )}
                    <Redirect
                        to={`${path}/${
                            // eslint-disable-next-line no-nested-ternary
                            triggerDetails.stage === 'DEPLOY'
                                ? `deployment-steps`
                                : triggerDetails.status.toLowerCase() === 'succeeded' ||
                                    triggerDetails.IsVirtualEnvironment
                                  ? `artifacts`
                                  : `logs`
                        }`}
                    />
                </Switch>
            )}
        </div>
    )
}

const TriggerOutput = ({
    fullScreenView,
    triggerHistory,
    setTriggerHistory,
    setFullScreenView,
    deploymentAppType,
    isBlobStorageConfigured,
    appReleaseTags,
    tagsEditable,
    hideImageTaggingHardDelete,
    fetchIdData,
    setFetchTriggerIdData,
    selectedEnvironmentName,
    deploymentHistoryResult,
    renderRunSource,
    renderCIListHeader,
    renderDeploymentApprovalInfo,
    processVirtualEnvironmentDeploymentData,
    renderVirtualHistoryArtifacts,
    renderDeploymentHistoryTriggerMetaText,
    resourceId,
    scrollToTop,
    scrollToBottom,
    renderTargetConfigInfo,
    appName,
}: TriggerOutputProps) => {
    const { appId, triggerId, envId, pipelineId } = useParams<{
        appId: string
        triggerId: string
        envId: string
        pipelineId: string
    }>()
    const triggerDetails = triggerHistory.get(+triggerId)
    const [triggerDetailsLoading, triggerDetailsResult, triggerDetailsError, reloadTriggerDetails] = useAsync(
        () => getTriggerDetails({ appId, envId, pipelineId, triggerId, fetchIdData }),
        // TODO: Ask if fetchIdData is required here as dependency
        [triggerId, appId, envId],
        !!triggerId && !!pipelineId,
    )

    const targetPlatforms = sanitizeTargetPlatforms(triggerDetails?.targetPlatforms)

    // Function to sync the trigger details as trigger details is also fetched with another api
    const syncState = (syncTriggerId: number, syncTriggerDetail: History, syncTriggerDetailsError: ServerError) => {
        if (syncTriggerDetailsError) {
            if (deploymentHistoryResult?.result?.cdWorkflows?.length) {
                setTriggerHistory(mapByKey(deploymentHistoryResult.result.cdWorkflows, 'id'))
            }
            setFetchTriggerIdData(FetchIdDataStatus.SUSPEND)
            return
        }
        if (syncTriggerId === syncTriggerDetail?.id) {
            const appliedFilters = triggerHistory.get(syncTriggerId)?.appliedFilters ?? []
            const appliedFiltersTimestamp = triggerHistory.get(syncTriggerId)?.appliedFiltersTimestamp
            const promotionApprovalMetadata = triggerHistory.get(syncTriggerId)?.promotionApprovalMetadata
            const runSource = triggerHistory.get(syncTriggerId)?.runSource
            const targetConfig = triggerHistory.get(syncTriggerId)?.targetConfig
            const userApprovalMetadata = triggerHistory.get(syncTriggerId)?.userApprovalMetadata

            // These changes are not subject to change after refresh, add data which will not change
            const additionalDataObject = {
                ...(appliedFilters.length ? { appliedFilters } : {}),
                ...(appliedFiltersTimestamp ? { appliedFiltersTimestamp } : {}),
                ...(promotionApprovalMetadata ? { promotionApprovalMetadata } : {}),
                ...(runSource ? { runSource } : {}),
                ...(targetConfig ? { targetConfig } : {}),
                ...(userApprovalMetadata ? { userApprovalMetadata } : {}),
            }
            setTriggerHistory((newTriggerHistory) => {
                newTriggerHistory.set(syncTriggerId, { ...syncTriggerDetail, ...additionalDataObject })
                return new Map(newTriggerHistory)
            })
            if (fetchIdData === FetchIdDataStatus.FETCHING) {
                setFetchTriggerIdData(FetchIdDataStatus.SUCCESS)
            }
        }
    }

    let areTagDetailsRequired = !!fetchIdData && fetchIdData !== FetchIdDataStatus.SUSPEND
    if (triggerDetailsResult?.result?.artifactId === 0 || triggerDetails?.artifactId === 0) {
        areTagDetailsRequired = false
    }

    const [tagDetailsLoading, tagDetailsResult, tagDetailsError] = useAsync(
        () =>
            getTagDetails({
                pipelineId,
                artifactId: triggerDetailsResult?.result?.artifactId || triggerDetails?.artifactId,
            }),
        [pipelineId, triggerId],
        areTagDetailsRequired &&
            !!pipelineId &&
            (!!triggerDetailsResult?.result?.artifactId || !!triggerDetails?.artifactId),
    )

    useEffect(() => {
        if (triggerDetailsLoading) {
            return
        }
        let triggerDetailsWithTags = {
            ...triggerDetailsResult?.result,
            imageComment: triggerDetails?.imageComment,
            imageReleaseTags: triggerDetails?.imageReleaseTags,
        }

        if (areTagDetailsRequired) {
            triggerDetailsWithTags = null
        }
        syncState(+triggerId, triggerDetailsWithTags, triggerDetailsError)
    }, [triggerDetailsLoading, triggerDetailsResult, triggerDetailsError])

    useEffect(() => {
        if (tagDetailsLoading || !triggerDetailsResult || !areTagDetailsRequired) {
            return
        }
        const triggerDetailsWithTags = {
            ...triggerDetailsResult?.result,
            imageReleaseTags: tagDetailsResult?.result?.imageReleaseTags,
            imageComment: tagDetailsResult?.result?.imageComment,
        }
        syncState(+triggerId, triggerDetailsWithTags, tagDetailsError)
    }, [tagDetailsLoading, tagDetailsResult, tagDetailsError])

    const timeout = useMemo(() => {
        if (
            !triggerDetails ||
            terminalStatus.has(triggerDetails.podStatus?.toLowerCase() || triggerDetails.status?.toLowerCase())
        ) {
            return null
        } // no interval
        if (statusSet.has(triggerDetails.status?.toLowerCase() || triggerDetails.podStatus?.toLowerCase())) {
            // 10s because progressing
            return 10000
        }
        return 30000 // 30s for normal
    }, [triggerDetails])

    useInterval(reloadTriggerDetails, timeout)

    if (
        (!areTagDetailsRequired && triggerDetailsLoading && !triggerDetails) ||
        !triggerId ||
        (areTagDetailsRequired && (tagDetailsLoading || triggerDetailsLoading) && !triggerDetails)
    ) {
        return <Progressing pageLoader />
    }
    if (triggerDetailsError?.code === 404) {
        return (
            <GenericEmptyState
                title={EMPTY_STATE_STATUS.TRIGGER_NOT_FOUND.TITLE}
                subTitle={EMPTY_STATE_STATUS.TRIGGER_NOT_FOUND.SUBTITLE}
            />
        )
    }
    if (!areTagDetailsRequired && !triggerDetailsLoading && !triggerDetails) {
        return <Reload />
    }
    if (areTagDetailsRequired && !(tagDetailsLoading || triggerDetailsLoading) && !triggerDetails) {
        return <Reload />
    }
    if (triggerDetails?.id !== +triggerId) {
        return null
    }

    return (
        <>
            {!fullScreenView && (
                <>
                    <TriggerDetails
                        type={HistoryComponentType.CD}
                        status={triggerDetails.status}
                        startedOn={triggerDetails.startedOn}
                        finishedOn={triggerDetails.finishedOn}
                        triggeredBy={triggerDetails.triggeredBy}
                        triggeredByEmail={triggerDetails.triggeredByEmail}
                        ciMaterials={triggerDetails.ciMaterials}
                        gitTriggers={triggerDetails.gitTriggers}
                        message={triggerDetails.message}
                        podStatus={triggerDetails.podStatus}
                        stage={triggerDetails.stage}
                        artifact={triggerDetails.artifact}
                        triggerMetadata={triggerDetails.triggerMetadata}
                        renderDeploymentHistoryTriggerMetaText={renderDeploymentHistoryTriggerMetaText}
                        environmentName={selectedEnvironmentName}
                        renderTargetConfigInfo={renderTargetConfigInfo}
                        workflowExecutionStages={triggerDetails.workflowExecutionStages}
                        namespace={triggerDetails.namespace}
                    />
                    <ul className="pl-50 pr-20 pt-8 tab-list tab-list--nodes dc__border-bottom dc__position-sticky dc__top-0 bg__primary dc__zi-3">
                        {triggerDetails.stage === 'DEPLOY' && deploymentAppType !== DeploymentAppTypes.HELM && (
                            <li className="tab-list__tab" data-testid="deployment-history-steps-link">
                                <NavLink
                                    replace
                                    className="tab-list__tab-link fs-13-imp pb-8 pt-0-imp"
                                    activeClassName="active"
                                    to="deployment-steps"
                                >
                                    Steps
                                </NavLink>
                            </li>
                        )}
                        {!(triggerDetails.stage === 'DEPLOY' || triggerDetails.IsVirtualEnvironment) && (
                            <li className="tab-list__tab" data-testid="deployment-history-logs-link">
                                <NavLink
                                    replace
                                    className="tab-list__tab-link fs-13-imp pb-8 pt-0-imp"
                                    activeClassName="active"
                                    to="logs"
                                >
                                    Logs
                                </NavLink>
                            </li>
                        )}
                        <li className="tab-list__tab" data-testid="deployment-history-source-code-link">
                            <NavLink
                                replace
                                className="tab-list__tab-link fs-13-imp pb-8 pt-0-imp"
                                activeClassName="active"
                                to="source-code"
                            >
                                Source
                            </NavLink>
                        </li>
                        {triggerDetails.stage === 'DEPLOY' && (
                            <li className="tab-list__tab" data-testid="deployment-history-configuration-link">
                                <NavLink
                                    replace
                                    className="tab-list__tab-link fs-13-imp pb-8 pt-0-imp"
                                    activeClassName="active"
                                    to="configuration"
                                >
                                    Configuration
                                </NavLink>
                            </li>
                        )}
                        {(triggerDetails.stage !== 'DEPLOY' || triggerDetails.IsVirtualEnvironment) && (
                            <li className="tab-list__tab" data-testid="deployment-history-artifacts-link">
                                <NavLink
                                    replace
                                    className="tab-list__tab-link fs-13-imp pb-8 pt-0-imp"
                                    activeClassName="active"
                                    to="artifacts"
                                >
                                    Artifacts
                                </NavLink>
                            </li>
                        )}
                    </ul>
                </>
            )}
            <HistoryLogs
                key={triggerDetails.id}
                triggerDetails={triggerDetails}
                loading={
                    (triggerDetailsLoading && !triggerDetailsResult) ||
                    !triggerDetails ||
                    (areTagDetailsRequired && !tagDetailsResult)
                }
                userApprovalMetadata={triggerDetailsResult?.result?.userApprovalMetadata}
                triggeredByEmail={triggerDetailsResult?.result?.triggeredByEmail}
                setFullScreenView={setFullScreenView}
                deploymentAppType={deploymentAppType}
                isBlobStorageConfigured={isBlobStorageConfigured}
                artifactId={triggerDetailsResult?.result?.artifactId}
                ciPipelineId={triggerDetailsResult?.result?.ciPipelineId}
                appReleaseTags={appReleaseTags}
                tagsEditable={tagsEditable}
                hideImageTaggingHardDelete={hideImageTaggingHardDelete}
                selectedEnvironmentName={selectedEnvironmentName}
                resourceId={resourceId}
                renderRunSource={renderRunSource}
                processVirtualEnvironmentDeploymentData={processVirtualEnvironmentDeploymentData}
                renderDeploymentApprovalInfo={renderDeploymentApprovalInfo}
                renderCIListHeader={renderCIListHeader}
                renderVirtualHistoryArtifacts={renderVirtualHistoryArtifacts}
                scrollToTop={scrollToTop}
                scrollToBottom={scrollToBottom}
                fullScreenView={fullScreenView}
                appName={appName}
                triggerHistory={triggerHistory}
                targetPlatforms={targetPlatforms}
            />
        </>
    )
}

export default TriggerOutput
