import { Redirect, Route, Switch, useLocation, useParams, useRouteMatch } from 'react-router'
import React, { useEffect, useMemo, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import moment from 'moment'
import { toast } from 'react-toastify'
import Tippy from '@tippyjs/react'
import {
    ConfirmationDialog,
    DATE_TIME_FORMATS,
    DeploymentAppTypes,
    GenericEmptyState,
    Progressing,
    Reload,
    createGitCommitUrl,
    useAsync,
    not,
    TippyTheme,
    ZERO_TIME_STRING,
    extractImage,
    useInterval,
    UserApprovalMetadataType,
    useScrollable,
    URLS,
} from '../../../Common'
import {
    CurrentStatusType,
    DeploymentTemplateList,
    FetchIdDataStatus,
    FinishedType,
    HistoryComponentType,
    PROGRESSING_STATUS,
    ProgressingStatusType,
    StartDetailsType,
    TERMINAL_STATUS_COLOR_CLASS_MAP,
    TriggerDetailsStatusIconType,
    TriggerDetailsType,
    TriggerOutputProps,
    WorkerStatusType,
    statusSet,
    terminalStatus,
    History,
    DeploymentStatusDetailsType,
    DeploymentStatusDetailsBreakdownDataType,
    RenderCIListHeaderProps,
    VirtualHistoryArtifactProps,
    RunSourceType,
} from './types'
import { getTagDetails, getTriggerDetails, cancelCiTrigger, cancelPrePostCdTrigger, getCDBuildReport } from './service'
import {
    DEFAULT_ENV,
    EMPTY_STATE_STATUS,
    TIMEOUT_VALUE,
    WORKER_POD_BASE_URL,
    statusColor as colorMap,
} from './constants'
import { GitTriggers } from '../../types'
import warn from '../../../Assets/Icon/ic-warning.svg'
import docker from '../../../Assets/Icon/ic-docker.svg'
import LogsRenderer from './LogsRenderer'
import DeploymentDetailSteps from './DeploymentDetailSteps'
import { DeploymentHistoryDetailedView, DeploymentHistoryConfigList } from './DeploymentHistoryDiff'
import { GitChanges, Scroller } from './History.components'
import Artifacts from './Artifacts'
import './cicdHistory.scss'

const Finished = React.memo(
    ({ status, finishedOn, artifact, type }: FinishedType): JSX.Element => (
        <div className="flex column left dc__min-width-fit-content">
            <div
                className={`${status} fs-14 fw-6 ${TERMINAL_STATUS_COLOR_CLASS_MAP[status.toLowerCase()] || 'cn-5'}`}
                data-testid="deployment-status-text"
            >
                {status && status.toLowerCase() === 'cancelled' ? 'ABORTED' : status}
            </div>
            <div className="flex left">
                {finishedOn && finishedOn !== ZERO_TIME_STRING && (
                    <time className="dc__vertical-align-middle">
                        {moment(finishedOn, 'YYYY-MM-DDTHH:mm:ssZ').format(DATE_TIME_FORMATS.TWELVE_HOURS_FORMAT)}
                    </time>
                )}
                {type === HistoryComponentType.CI && artifact && (
                    <>
                        <div className="dc__bullet mr-6 ml-6" />
                        <div className="dc__app-commit__hash ">
                            <img src={docker} alt="docker" className="commit-hash__icon grayscale" />
                            {extractImage(artifact)}
                        </div>
                    </>
                )}
            </div>
        </div>
    ),
)

const WorkerStatus = React.memo(
    ({ message, podStatus, stage, workerPodName, finishedOn }: WorkerStatusType): JSX.Element | null => {
        if (!message && !podStatus) {
            return null
        }
        // check if finishedOn time is timed out or not
        const isTimedOut = moment(finishedOn).isBefore(moment().subtract(TIMEOUT_VALUE, 'hours'))
        // finishedOn is 0001-01-01T00:00:00Z when the worker is still running
        const showLink = workerPodName && (finishedOn === ZERO_TIME_STRING || !isTimedOut)

        const getViewWorker = () =>
            showLink ? (
                <NavLink to={`${WORKER_POD_BASE_URL}/${workerPodName}/logs`} target="_blank" className="anchor">
                    <div className="mr-10">View worker pod</div>
                </NavLink>
            ) : (
                <div className="mr-10">Worker</div>
            )

        return (
            <>
                <span style={{ height: '80%', borderRight: '1px solid var(--N100)', margin: '0 16px' }} />
                <div className="flex left column">
                    <div className="flex left fs-14">
                        {stage === 'DEPLOY' ? <div className="mr-10">Message</div> : getViewWorker()}
                        {podStatus && (
                            <div className="fw-6" style={{ color: colorMap[podStatus.toLowerCase()] }}>
                                {podStatus}
                            </div>
                        )}
                    </div>
                    {message && (
                        <Tippy
                            theme={TippyTheme.black}
                            className="default-tt"
                            arrow={false}
                            placement="bottom-start"
                            animation="shift-toward-subtle"
                            content={message}
                        >
                            <div className="fs-12 cn-7 dc__ellipsis-right__2nd-line">{message}</div>
                        </Tippy>
                    )}
                </div>
            </>
        )
    },
)

const ProgressingStatus = React.memo(
    ({ status, message, podStatus, stage, type, finishedOn, workerPodName }: ProgressingStatusType): JSX.Element => {
        const [aborting, setAborting] = useState(false)
        const [abortConfirmation, setAbortConfirmation] = useState(false)
        const [abortError, setAbortError] = useState<{
            status: boolean
            message: string
        }>({
            status: false,
            message: '',
        })
        const { buildId, triggerId, pipelineId } = useParams<{
            buildId: string
            triggerId: string
            pipelineId: string
        }>()
        let abort = null
        if (type === HistoryComponentType.CI) {
            abort = (isForceAbort: boolean) => cancelCiTrigger({ pipelineId, workflowId: buildId }, isForceAbort)
        } else if (stage !== 'DEPLOY') {
            abort = () => cancelPrePostCdTrigger(pipelineId, triggerId)
        }

        async function abortRunning() {
            setAborting(true)
            try {
                await abort(abortError.status)
                toast.success('Build Aborted')
                setAbortConfirmation(false)
                setAbortError({
                    status: false,
                    message: '',
                })
            } catch (error) {
                setAborting(false)
                setAbortConfirmation(false)
                if (error.code === 400) {
                    // code 400 is for aborting a running build
                    const { errors } = error
                    setAbortError({
                        status: true,
                        message: errors[0].userMessage,
                    })
                }
            }
        }

        const toggleAbortConfiguration = (): void => {
            setAbortConfirmation(not)
        }
        const closeForceAbortModal = (): void => {
            setAbortError({
                status: false,
                message: '',
            })
        }
        return (
            <>
                <div className="flex left mb-24">
                    <div className="dc__min-width-fit-content">
                        <div className={`${status} fs-14 fw-6 flex left inprogress-status-color`}>In progress</div>
                    </div>

                    {abort && (
                        <button
                            type="button"
                            className="flex cta delete er-5 bw-1 fw-6 fs-13 h-28 ml-16"
                            onClick={toggleAbortConfiguration}
                        >
                            Abort
                        </button>
                    )}
                    <WorkerStatus
                        message={message}
                        podStatus={podStatus}
                        stage={stage}
                        finishedOn={finishedOn}
                        workerPodName={workerPodName}
                    />
                </div>
                {abortConfirmation && (
                    <ConfirmationDialog>
                        <ConfirmationDialog.Icon src={warn} />
                        <ConfirmationDialog.Body
                            title={
                                type === HistoryComponentType.CD
                                    ? `Abort ${stage.toLowerCase()}-deployment?`
                                    : 'Abort build?'
                            }
                        />
                        <p className="fs-13 cn-7 lh-1-54">
                            {type === HistoryComponentType.CD
                                ? 'Are you sure you want to abort this stage?'
                                : 'Are you sure you want to abort this build?'}
                        </p>
                        <ConfirmationDialog.ButtonGroup>
                            <button type="button" className="cta cancel" onClick={toggleAbortConfiguration}>
                                Cancel
                            </button>
                            <button type="button" className="cta delete" onClick={abortRunning}>
                                {aborting ? <Progressing /> : 'Yes, Abort'}
                            </button>
                        </ConfirmationDialog.ButtonGroup>
                    </ConfirmationDialog>
                )}
                {abortError.status && (
                    <ConfirmationDialog>
                        <ConfirmationDialog.Icon src={warn} />
                        <ConfirmationDialog.Body title="Could not abort build!" />
                        <div className="w-100 bc-n50 h-36 flexbox dc__align-items-center">
                            <span className="pl-12">Error: {abortError.message}</span>
                        </div>
                        <div className="fs-13 fw-6 pt-12 cn-7 lh-1-54">
                            <span>Please try to force abort</span>
                        </div>
                        <div className="pt-4 fw-4 cn-7 lh-1-54">
                            <span>Some resource might get orphaned which will be cleaned up with Job-lifecycle</span>
                        </div>
                        <ConfirmationDialog.ButtonGroup>
                            <button type="button" className="cta cancel" onClick={closeForceAbortModal}>
                                Cancel
                            </button>
                            <button type="button" className="cta delete" onClick={abortRunning}>
                                {aborting ? <Progressing /> : 'Force Abort'}
                            </button>
                        </ConfirmationDialog.ButtonGroup>
                    </ConfirmationDialog>
                )}
            </>
        )
    },
)

const CurrentStatus = React.memo(
    ({
        status,
        finishedOn,
        artifact,
        message,
        podStatus,
        stage,
        type,
        isJobView,
        workerPodName,
    }: CurrentStatusType): JSX.Element => {
        if (PROGRESSING_STATUS[status.toLowerCase()]) {
            return (
                <ProgressingStatus
                    status={status}
                    message={message}
                    podStatus={podStatus}
                    stage={stage}
                    type={type}
                    finishedOn={finishedOn}
                    workerPodName={workerPodName}
                />
            )
        }
        return (
            <div className={`flex left ${isJobView ? 'mb-24' : ''}`}>
                <Finished status={status} finishedOn={finishedOn} artifact={artifact} type={type} />
                <WorkerStatus
                    message={message}
                    podStatus={podStatus}
                    stage={stage}
                    finishedOn={finishedOn}
                    workerPodName={workerPodName}
                />
            </div>
        )
    },
)

const StartDetails = ({
    startedOn,
    triggeredBy,
    triggeredByEmail,
    ciMaterials,
    gitTriggers,
    artifact,
    type,
    environmentName,
    isJobView,
    triggerMetadata,
    renderDeploymentHistoryTriggerMetaText,
}: StartDetailsType): JSX.Element => {
    const { url } = useRouteMatch()
    const { pathname } = useLocation()
    return (
        <div className={`trigger-details__start flex column left ${isJobView ? 'mt-4' : ''}`}>
            <div className="cn-9 fs-14 fw-6" data-testid="deployment-history-start-heading">
                Start
            </div>
            <div className="flex left">
                <time className="cn-7 fs-12">
                    {moment(startedOn, 'YYYY-MM-DDTHH:mm:ssZ').format(DATE_TIME_FORMATS.TWELVE_HOURS_FORMAT)}
                </time>
                <div className="dc__bullet mr-6 ml-6" />
                <div className="trigger-details__trigger-by cn-7 fs-12 mr-12">
                    {triggeredBy === 1 ? 'auto trigger' : triggeredByEmail}
                </div>
                {type === HistoryComponentType.CD ? (
                    // eslint-disable-next-line react/jsx-no-useless-fragment
                    <>
                        {artifact && (
                            <div className="dc__app-commit__hash" data-testid="docker-image-hash">
                                <img src={docker} alt="docker" className="commit-hash__icon grayscale" />
                                {artifact.split(':')[1]}
                            </div>
                        )}
                    </>
                ) : (
                    Object.keys(gitTriggers ?? {}).length > 0 &&
                    ciMaterials?.map((ciMaterial) => {
                        const gitDetail: GitTriggers = gitTriggers[ciMaterial.id]
                        return gitDetail ? (
                            <React.Fragment key={ciMaterial.id}>
                                {ciMaterial.type !== 'WEBHOOK' && (
                                    <a
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href={createGitCommitUrl(ciMaterial.url, gitDetail.Commit)}
                                        className="dc__app-commit__hash mr-12 bcn-1 cn-7"
                                    >
                                        {gitDetail.Commit?.substr(0, 8)}
                                    </a>
                                )}
                                {ciMaterial.type === 'WEBHOOK' &&
                                    gitDetail.WebhookData &&
                                    gitDetail.WebhookData.Data && (
                                        <span className="dc__app-commit__hash">
                                            {gitDetail.WebhookData.EventActionType === 'merged'
                                                ? gitDetail.WebhookData.Data['target checkout']?.substr(0, 8)
                                                : gitDetail.WebhookData.Data['target checkout']}
                                        </span>
                                    )}
                            </React.Fragment>
                        ) : null
                    })
                )}
                {!pathname.includes('source-code') && (
                    <Link to={`${url}/source-code`} className="anchor ml-8" data-testid="commit-details-link">
                        Commit details
                    </Link>
                )}
            </div>

            {triggerMetadata &&
                renderDeploymentHistoryTriggerMetaText &&
                renderDeploymentHistoryTriggerMetaText(triggerMetadata)}
            {isJobView && (
                <div className="pt-4 pb-4 pr-0 pl-0">
                    <span className="fw-6 fs-14">Env</span>
                    <span className="fs-12 mb-4 ml-8">{environmentName !== '' ? environmentName : DEFAULT_ENV}</span>
                    {environmentName === '' && <span className="fw-4 fs-11 ml-4 dc__italic-font-style">(Default)</span>}
                </div>
            )}
        </div>
    )
}

const TriggerDetailsStatusIcon = React.memo(
    ({ status, isDeploymentWindowInfo }: TriggerDetailsStatusIconType): JSX.Element => {
        let viewBox = '0 0 25 87'
        let height = '87'
        let cyEndCircle = '74.5'
        let y2Line = '69'
        if (isDeploymentWindowInfo) {
            viewBox = '0 0 25 118'
            height = '118'
            cyEndCircle = '105'
            y2Line = '100'
        }
        return (
            <svg width="25" height={height} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12.5" cy="6.5" r="6" fill="white" stroke="#3B444C" />
                <circle
                    cx="12.5"
                    cy={cyEndCircle}
                    r="6"
                    fill={colorMap[status]}
                    stroke={colorMap[status]}
                    strokeWidth="12"
                    strokeOpacity="0.3"
                />
                <line x1="12.5" y1="11.9997" x2="12.5362" y2={y2Line} stroke="#3B444C" />
            </svg>
        )
    },
)

export const TriggerDetails = React.memo(
    ({
        status,
        startedOn,
        finishedOn,
        triggeredBy,
        triggeredByEmail,
        ciMaterials,
        gitTriggers,
        message,
        podStatus,
        type,
        stage,
        artifact,
        environmentName,
        isJobView,
        workerPodName,
        triggerMetadata,
        renderDeploymentHistoryTriggerMetaText,
    }: TriggerDetailsType): JSX.Element => (
        <div className="trigger-details">
            <div className="flex">
                <TriggerDetailsStatusIcon status={status?.toLowerCase()} isDeploymentWindowInfo={!!triggerMetadata} />
            </div>
            <div className="trigger-details__summary">
                <StartDetails
                    startedOn={startedOn}
                    triggeredBy={triggeredBy}
                    triggeredByEmail={triggeredByEmail}
                    ciMaterials={ciMaterials}
                    gitTriggers={gitTriggers}
                    artifact={artifact}
                    type={type}
                    environmentName={environmentName}
                    isJobView={isJobView}
                    triggerMetadata={triggerMetadata}
                    renderDeploymentHistoryTriggerMetaText={renderDeploymentHistoryTriggerMetaText}
                />
                <CurrentStatus
                    status={status}
                    finishedOn={finishedOn}
                    artifact={artifact}
                    message={message}
                    podStatus={podStatus}
                    stage={stage}
                    type={type}
                    isJobView={isJobView}
                    workerPodName={workerPodName}
                />
            </div>
        </div>
    ),
)

const HistoryLogs: React.FC<{
    triggerDetails: History
    loading: boolean
    setFullScreenView: React.Dispatch<React.SetStateAction<boolean>>
    deploymentHistoryList: DeploymentTemplateList[]
    setDeploymentHistoryList: React.Dispatch<React.SetStateAction<DeploymentTemplateList[]>>
    deploymentAppType: DeploymentAppTypes
    isBlobStorageConfigured: boolean
    userApprovalMetadata: UserApprovalMetadataType
    triggeredByEmail: string
    artifactId: number
    ciPipelineId: number
    appReleaseTags: string[]
    tagsEditable: boolean
    hideImageTaggingHardDelete: boolean
    selectedEnvironmentName?: string
    resourceId?: number
    renderRunSource: (runSource: RunSourceType, isDeployedInThisResource: boolean) => JSX.Element
    processVirtualEnvironmentDeploymentData: (
        data?: DeploymentStatusDetailsType,
    ) => DeploymentStatusDetailsBreakdownDataType
    renderDeploymentApprovalInfo: (userApprovalMetadata: UserApprovalMetadataType) => JSX.Element
    renderCIListHeader: (renderCIListHeaderProps: RenderCIListHeaderProps) => JSX.Element
    renderVirtualHistoryArtifacts: (virtualHistoryArtifactProps: VirtualHistoryArtifactProps) => JSX.Element
}> = ({
    triggerDetails,
    loading,
    setFullScreenView,
    deploymentHistoryList,
    setDeploymentHistoryList,
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

    const [ref, scrollToTop, scrollToBottom] = useScrollable({
        autoBottomScroll: triggerDetails.status.toLowerCase() !== 'succeeded',
    })

    return (
        <>
            <div className="trigger-outputs-container">
                {loading ? (
                    <Progressing pageLoader />
                ) : (
                    <Switch>
                        {triggerDetails.stage !== 'DEPLOY' ? (
                            !triggerDetails.IsVirtualEnvironment && (
                                <Route path={`${path}/logs`}>
                                    <div ref={ref} style={{ height: '100%', overflow: 'auto', background: '#0b0f22' }}>
                                        <LogsRenderer
                                            triggerDetails={triggerDetails}
                                            isBlobStorageConfigured={isBlobStorageConfigured}
                                            parentType={HistoryComponentType.CD}
                                        />
                                    </div>
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
                            />
                        </Route>
                        {triggerDetails.stage === 'DEPLOY' && (
                            <Route path={`${path}/configuration`} exact>
                                <DeploymentHistoryConfigList
                                    setDeploymentHistoryList={setDeploymentHistoryList}
                                    deploymentHistoryList={deploymentHistoryList}
                                    setFullScreenView={setFullScreenView}
                                />
                            </Route>
                        )}
                        {triggerDetails.stage === 'DEPLOY' && (
                            <Route
                                path={`${path}${URLS.DEPLOYMENT_HISTORY_CONFIGURATIONS}/:historyComponent/:baseConfigurationId(\\d+)/:historyComponentName?`}
                            >
                                <DeploymentHistoryDetailedView
                                    setDeploymentHistoryList={setDeploymentHistoryList}
                                    deploymentHistoryList={deploymentHistoryList}
                                    setFullScreenView={setFullScreenView}
                                    renderRunSource={renderRunSource}
                                    resourceId={resourceId}
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
                                        ciPipelineId={triggerDetails.ciPipelineId}
                                        artifactId={triggerDetails.artifactId}
                                        imageComment={triggerDetails?.imageComment}
                                        imageReleaseTags={triggerDetails?.imageReleaseTags}
                                        tagsEditable={tagsEditable}
                                        appReleaseTagNames={appReleaseTags}
                                        hideImageTaggingHardDelete={hideImageTaggingHardDelete}
                                        getArtifactPromise={() => getCDBuildReport(appId, envId, pipelineId, triggerId)}
                                        type={HistoryComponentType.CD}
                                        renderCIListHeader={renderCIListHeader}
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
            {(scrollToTop || scrollToBottom) && (
                <Scroller
                    style={{ position: 'fixed', bottom: '25px', right: '32px' }}
                    {...{ scrollToTop, scrollToBottom }}
                />
            )}
        </>
    )
}

const TriggerOutput = ({
    fullScreenView,
    syncState,
    triggerHistory,
    setFullScreenView,
    setDeploymentHistoryList,
    deploymentHistoryList,
    deploymentAppType,
    isBlobStorageConfigured,
    appReleaseTags,
    tagsEditable,
    hideImageTaggingHardDelete,
    fetchIdData,
    selectedEnvironmentName,
    renderRunSource,
    renderCIListHeader,
    renderDeploymentApprovalInfo,
    processVirtualEnvironmentDeploymentData,
    renderVirtualHistoryArtifacts,
    renderDeploymentHistoryTriggerMetaText,
    resourceId,
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
            <div
                className={`trigger-details-container ${triggerDetails.triggerMetadata ? 'with-trigger-metadata' : ''}`}
            >
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
                        />
                        <ul className="pl-20 tab-list tab-list--nodes dc__border-bottom">
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
            </div>
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
                setDeploymentHistoryList={setDeploymentHistoryList}
                deploymentHistoryList={deploymentHistoryList}
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
            />
        </>
    )
}

export default TriggerOutput
