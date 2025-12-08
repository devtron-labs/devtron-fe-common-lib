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

import { Fragment, memo, useMemo, useState } from 'react'
import { Link, useLocation, useParams, useRouteMatch } from 'react-router-dom'

import { ReactComponent as ICAborted } from '@Icons/ic-aborted.svg'
import { ReactComponent as ICArrowRight } from '@Icons/ic-arrow-right.svg'
import { ReactComponent as ICEnvironment } from '@Icons/ic-environment.svg'
import { ReactComponent as ICPulsateStatus } from '@Icons/ic-pulsate-status.svg'
import { createGitCommitUrl } from '@Common/Common.service'
import { ZERO_TIME_STRING } from '@Common/Constants'
import { CommitChipCell } from '@Shared/Components/CommitChipCell'
import { ImageChipCell } from '@Shared/Components/ImageChipCell'
import { getHandleOpenURL } from '@Shared/Helpers'
import { ToastManager, ToastVariantType } from '@Shared/Services'
import { getDeploymentStageTitle } from '@Pages/Applications'

import { ComponentSizeType, DeploymentStageType } from '../../constants'
import { GitTriggers } from '../../types'
import { Button, ButtonStyleType, ButtonVariantType } from '../Button'
import { ConfirmationModal, ConfirmationModalVariantType } from '../ConfirmationModal'
import { Icon } from '../Icon'
import { InfoBlock } from '../InfoBlock'
import {
    DEFAULT_CLUSTER_ID,
    DEFAULT_ENV,
    EXECUTION_FINISHED_TEXT_MAP,
    PROGRESSING_STATUS,
    PULSATING_STATUS_MAP,
    RESOURCE_CONFLICT_DEPLOY_ERROR,
    statusColor as colorMap,
    TERMINAL_STATUS_COLOR_CLASS_MAP,
} from './constants'
import ResourceConflictDeployDialog from './ResourceConflictDeployDialog'
import ResourceConflictDetailsModal from './ResourceConflictDetailsModal'
import { cancelCiTrigger, cancelPrePostCdTrigger } from './service'
import {
    CurrentStatusIconProps,
    CurrentStatusType,
    FinishedType,
    HistoryComponentType,
    ProgressingStatusType,
    ResourceConflictModalType,
    StartDetailsType,
    TriggerDetailsType,
    WorkflowStageStatusType,
} from './types'
import {
    getFormattedTriggerTime,
    getIconFromWorkflowStageStatusType,
    getWorkflowNodeStatusTitle,
    sanitizeWorkflowExecutionStages,
} from './utils'
import WorkerStatus from './WorkerStatus'

const Finished = memo(({ status, finishedOn, artifact, type, executionInfo }: FinishedType): JSX.Element => {
    const finishedOnTime = executionInfo?.finishedOn || finishedOn

    const renderTitle = () => {
        if (executionInfo) {
            return (
                <span className="cn-9 fs-13 fw-6 lh-20">
                    Execution&nbsp;{EXECUTION_FINISHED_TEXT_MAP[executionInfo.currentStatus] || 'finished'}
                </span>
            )
        }

        return (
            <div
                className={`${status} fs-13 fw-6 ${TERMINAL_STATUS_COLOR_CLASS_MAP[status.toLowerCase()] || 'cn-5'}`}
                data-testid="deployment-status-text"
            >
                {getWorkflowNodeStatusTitle(status)}
            </div>
        )
    }

    return (
        <div className="flexbox py-8 dc__gap-8 left dc__min-width-fit-content dc__align-items-center">
            {renderTitle()}

            {finishedOnTime && finishedOnTime !== ZERO_TIME_STRING && (
                <time className="dc__vertical-align-middle fs-13">{getFormattedTriggerTime(finishedOnTime)}</time>
            )}

            {type === HistoryComponentType.CI && artifact && (
                <>
                    <div className="dc__bullet" />
                    <ImageChipCell imagePath={artifact} placement="top" />
                </>
            )}
        </div>
    )
})

const ProgressingStatus = memo(({ stage, type, label = 'In progress' }: ProgressingStatusType): JSX.Element => {
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
    } else if (stage !== DeploymentStageType.DEPLOY) {
        abort = (isForceAbort: boolean) => cancelPrePostCdTrigger(pipelineId, triggerId, isForceAbort)
    }

    async function abortRunning() {
        setAborting(true)
        try {
            await abort(abortError.status)
            ToastManager.showToast({
                variant: ToastVariantType.success,
                description: 'Build Aborted',
            })
            setAbortError({
                status: false,
                message: '',
            })
        } catch (error) {
            if (error.code === 400) {
                // code 400 is for aborting a running build
                const { errors } = error
                setAbortError({
                    status: true,
                    message: errors[0].userMessage,
                })
            }
        } finally {
            setAborting(false)
            setAbortConfirmation(false)
        }
    }

    const toggleAbortConfiguration = (): void => {
        setAbortConfirmation(!abortConfirmation)
    }

    const closeForceAbortModal = (): void => {
        setAbortError({
            status: false,
            message: '',
        })
    }

    return (
        <>
            <div className="flex dc__gap-8 left py-8">
                <div className="dc__min-width-fit-content">
                    <div className="fs-13 fw-6 flex left inprogress-status-color">{label}</div>
                </div>

                {abort && (
                    <>
                        <span className="cn-5 fs-13 fw-4 lh-20">/</span>
                        <Button
                            dataTestId="abort-execution-button"
                            onClick={toggleAbortConfiguration}
                            startIcon={<ICAborted />}
                            text="Abort"
                            variant={ButtonVariantType.text}
                            style={ButtonStyleType.negative}
                            size={ComponentSizeType.small}
                        />
                    </>
                )}
            </div>
            {abortConfirmation && (
                <ConfirmationModal
                    variant={ConfirmationModalVariantType.warning}
                    title={
                        type === HistoryComponentType.CD ? `Abort ${stage.toLowerCase()}-deployment?` : 'Abort build?'
                    }
                    subtitle={
                        type === HistoryComponentType.CD
                            ? 'Are you sure you want to abort this stage?'
                            : 'Are you sure you want to abort this build?'
                    }
                    buttonConfig={{
                        secondaryButtonConfig: {
                            disabled: aborting,
                            onClick: toggleAbortConfiguration,
                            text: 'Cancel',
                        },
                        primaryButtonConfig: {
                            isLoading: aborting,
                            onClick: abortRunning,
                            text: 'Yes, Abort',
                        },
                    }}
                    handleClose={toggleAbortConfiguration}
                />
            )}
            {abortError.status && (
                <ConfirmationModal
                    variant={ConfirmationModalVariantType.warning}
                    title="Could not abort build!"
                    subtitle={`Error: ${abortError.message}`}
                    buttonConfig={{
                        secondaryButtonConfig: {
                            disabled: aborting,
                            onClick: closeForceAbortModal,
                            text: 'Cancel',
                        },
                        primaryButtonConfig: {
                            isLoading: aborting,
                            onClick: abortRunning,
                            text: 'Force Abort',
                        },
                    }}
                    handleClose={closeForceAbortModal}
                >
                    <div className="fs-13 fw-6 pt-12 cn-7 lh-1-54">
                        <span>Please try to force abort</span>
                    </div>
                    <div className="pt-4 fw-4 cn-7 lh-1-54">
                        <span>Some resource might get orphaned which will be cleaned up with Job-lifecycle</span>
                    </div>
                </ConfirmationModal>
            )}
        </>
    )
})

const CurrentStatus = memo(
    ({ status, finishedOn, artifact, stage, type, executionInfo }: CurrentStatusType): JSX.Element => {
        if (executionInfo) {
            if (executionInfo.finishedOn) {
                return <Finished executionInfo={executionInfo} artifact={artifact} type={type} />
            }

            if (executionInfo.currentStatus === WorkflowStageStatusType.RUNNING) {
                return (
                    <ProgressingStatus
                        stage={stage}
                        type={type}
                        {...(!executionInfo.executionStartedOn
                            ? {
                                  label: 'Waiting to start',
                              }
                            : {})}
                    />
                )
            }

            if (executionInfo.currentStatus === WorkflowStageStatusType.UNKNOWN) {
                return (
                    <div className="flex dc__gap-8 left py-8">
                        <span className="cn-9 fs-13 fw-6 lh-20">Unknown status</span>

                        {type === HistoryComponentType.CI && artifact && (
                            <>
                                <div className="dc__bullet" />
                                <ImageChipCell imagePath={artifact} placement="top" />
                            </>
                        )}
                    </div>
                )
            }

            return null
        }

        if (PROGRESSING_STATUS[status.toLowerCase()]) {
            return <ProgressingStatus stage={stage} type={type} />
        }
        return <Finished status={status} finishedOn={finishedOn} artifact={artifact} type={type} />
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
    renderTargetConfigInfo,
    stage,
}: StartDetailsType): JSX.Element => {
    const { url } = useRouteMatch()
    const { pathname } = useLocation()

    return (
        <div className="w-100 pr-20 flex column left">
            <div className="flexbox dc__gap-8 dc__align-items-center py-8 flex-wrap">
                <div className="flex left dc__gap-4 cn-9 fs-13 fw-6 lh-20">
                    <div className="flex left dc__no-shrink dc__gap-4" data-testid="deployment-history-start-heading">
                        <h3 className="m-0 cn-9 fs-13 fw-6 lh-20">Triggered</h3>
                        {stage && (
                            <>
                                <div className="dc__bullet" />
                                <div className="dc__first-letter-capitalize">{getDeploymentStageTitle(stage)}</div>
                            </>
                        )}
                    </div>
                    {environmentName && (
                        <>
                            <ICArrowRight className="icon-dim-14 scn-9 dc__no-shrink" />
                            <span className="dc__truncate">{environmentName}</span>
                        </>
                    )}
                    {renderTargetConfigInfo?.()}
                </div>

                <time className="cn-7 fs-13">{getFormattedTriggerTime(startedOn)}</time>

                <div className="dc__bullet" />

                <div className="trigger-details__trigger-by cn-7 fs-13 dc__word-break">
                    {triggeredBy === 1 ? 'auto trigger' : triggeredByEmail}
                </div>

                {/* Have to add a div, so add to convert the gap to 16 */}
                <div />

                {type === HistoryComponentType.CD ? (
                    // eslint-disable-next-line react/jsx-no-useless-fragment
                    <>{artifact && <ImageChipCell imagePath={artifact} placement="top" />}</>
                ) : (
                    Object.keys(gitTriggers ?? {}).length > 0 &&
                    ciMaterials?.map((ciMaterial) => {
                        const gitDetail: GitTriggers = gitTriggers[ciMaterial.id]
                        return gitDetail ? (
                            <Fragment key={ciMaterial.id}>
                                {ciMaterial.type !== 'WEBHOOK' && gitDetail.Commit && (
                                    <CommitChipCell
                                        commits={[gitDetail.Commit]}
                                        handleClick={getHandleOpenURL(
                                            createGitCommitUrl(ciMaterial.url, gitDetail.Commit),
                                        )}
                                    />
                                )}
                                {ciMaterial.type === 'WEBHOOK' &&
                                    gitDetail.WebhookData &&
                                    gitDetail.WebhookData.Data &&
                                    gitDetail.WebhookData.Data['target checkout'] && (
                                        <CommitChipCell
                                            commits={
                                                gitDetail.WebhookData.EventActionType === 'merged'
                                                    ? gitDetail.WebhookData.Data['target checkout'].substr(0, 7)
                                                    : gitDetail.WebhookData.Data['target checkout']
                                            }
                                        />
                                    )}
                            </Fragment>
                        ) : null
                    })
                )}

                {!pathname.includes('source-code') && (
                    <Link to={`${url}/source-code`} className="anchor fs-13" data-testid="commit-details-link">
                        Commit details
                    </Link>
                )}
            </div>
        </div>
    )
}

const renderBlockWithBorder = () => (
    <div className="flex flex-grow-1">
        <div className="dc__border-left--n3 h-100" />
    </div>
)

const renderDetailsSuccessIconBlock = () => (
    <>
        <div className="flex">
            <Icon size={20} name="ic-success" color={null} />
        </div>

        {renderBlockWithBorder()}
    </>
)

const NonProgressingStatus = memo(
    ({ status }: { status: string }): JSX.Element => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle
                cx="10"
                cy="10"
                r="5"
                fill={colorMap[status] || 'var(--N500'}
                stroke={colorMap[status] || 'var(--N500'}
                strokeOpacity="0.3"
                strokeWidth="10"
            />
        </svg>
    ),
)

const CurrentStatusIcon = memo(({ status, executionInfoCurrentStatus }: CurrentStatusIconProps): JSX.Element => {
    if (executionInfoCurrentStatus) {
        return getIconFromWorkflowStageStatusType(executionInfoCurrentStatus)
    }

    if (PULSATING_STATUS_MAP[status]) {
        return <ICPulsateStatus />
    }

    return <NonProgressingStatus status={status.toLowerCase()} />
})

const TriggerDetails = memo(
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
        renderTargetConfigInfo,
        workflowExecutionStages,
        namespace,
        isLatest,
        appName,
    }: TriggerDetailsType) => {
        const [resourceConflictModal, setResourceConflictModal] = useState<ResourceConflictModalType>(null)

        const executionInfo = useMemo(
            () => sanitizeWorkflowExecutionStages(workflowExecutionStages),
            [workflowExecutionStages],
        )

        const errorMessage = executionInfo?.workerDetails.message || message

        const showResourceConflictInfoBlock =
            isLatest &&
            (type === HistoryComponentType.CD || type === HistoryComponentType.GROUP_CD) &&
            stage === DeploymentStageType.DEPLOY &&
            errorMessage?.includes(RESOURCE_CONFLICT_DEPLOY_ERROR)

        const handleShowRedeployModal = () => {
            setResourceConflictModal(ResourceConflictModalType.DEPLOY_DIALOG)
        }

        const handleShowResourceConflictDetailsModal = () => {
            setResourceConflictModal(ResourceConflictModalType.RESOURCE_DETAIL_MODAL)
        }

        const handleCloseRedeployModal = () => {
            setResourceConflictModal(null)
        }

        const renderInfoBlockDescription = () => (
            <div className="flexbox">
                <Button
                    dataTestId="resource-conflicts-resource-info"
                    text="Some Resources"
                    variant={ButtonVariantType.text}
                    size={ComponentSizeType.medium}
                    onClick={handleShowResourceConflictDetailsModal}
                />
                &nbsp;
                <span className="cn-9 fw-4 fs-13 lh-20 dc__word-break">
                    have ownership conflict. Take resource ownership and re-deploy
                </span>
            </div>
        )

        const renderDialogs = () => {
            if (resourceConflictModal === ResourceConflictModalType.DEPLOY_DIALOG) {
                return (
                    <ResourceConflictDeployDialog
                        appName={appName}
                        environmentName={environmentName}
                        handleClose={handleCloseRedeployModal}
                    />
                )
            }

            if (resourceConflictModal === ResourceConflictModalType.RESOURCE_DETAIL_MODAL) {
                return (
                    <ResourceConflictDetailsModal
                        appName={appName}
                        environmentName={environmentName}
                        handleClose={handleCloseRedeployModal}
                    />
                )
            }

            return null
        }

        return (
            <>
                <div className="trigger-details flexbox-col">
                    <div className="flexbox-col py-8 trigger-details__summary lh-20">
                        <div className="display-grid trigger-details__grid">
                            <div className="flexbox dc__content-center">
                                <div className="flexbox-col dc__gap-4">
                                    <div className="flex flex-grow-1" />
                                    {renderDetailsSuccessIconBlock()}
                                </div>
                            </div>

                            <div className="flexbox-col flex-grow-1">
                                <StartDetails
                                    startedOn={executionInfo?.triggeredOn || startedOn}
                                    triggeredBy={triggeredBy}
                                    triggeredByEmail={triggeredByEmail}
                                    ciMaterials={ciMaterials}
                                    gitTriggers={gitTriggers}
                                    artifact={artifact}
                                    type={type}
                                    environmentName={environmentName}
                                    renderTargetConfigInfo={renderTargetConfigInfo}
                                    stage={stage}
                                />
                            </div>
                        </div>

                        {!!triggerMetadata && !!renderDeploymentHistoryTriggerMetaText && (
                            <div className="display-grid trigger-details__grid">
                                <div className="flexbox dc__content-center">
                                    <div className="flexbox-col dc__gap-4">
                                        {renderBlockWithBorder()}
                                        {renderDeploymentHistoryTriggerMetaText(triggerMetadata, true)}
                                        {renderBlockWithBorder()}
                                    </div>
                                </div>

                                {renderDeploymentHistoryTriggerMetaText(triggerMetadata)}
                            </div>
                        )}

                        {isJobView && (
                            <div className="display-grid trigger-details__grid">
                                <div className="flexbox dc__content-center">
                                    <div className="flexbox-col dc__gap-4">
                                        {renderBlockWithBorder()}
                                        <ICEnvironment className="icon-dim-20 dc__no-shrink scn-9" />
                                        {renderBlockWithBorder()}
                                    </div>
                                </div>

                                <div className="flexbox dc__align-items-center dc__gap-8 py-8">
                                    <span className="cn-9 fs-13 fw-6 lh-20">Env</span>
                                    <span className="fs-12 lh-20">
                                        {environmentName !== '' ? environmentName : DEFAULT_ENV}
                                    </span>
                                    {environmentName === '' && <i className="fw-4 fs-12 lh-20">(Default)</i>}
                                </div>
                            </div>
                        )}

                        {!!executionInfo?.executionStartedOn && (
                            <div className="display-grid trigger-details__grid">
                                <div className="flexbox dc__content-center">
                                    <div className="flexbox-col dc__gap-4">
                                        {renderBlockWithBorder()}
                                        {renderDetailsSuccessIconBlock()}
                                    </div>
                                </div>

                                <div className="w-100 pr-20 flexbox dc__gap-8 py-8">
                                    <h3 className="m-0 cn-9 fs-13 fw-6 lh-20">Execution started</h3>
                                    <time className="cn-7 fs-13">
                                        {getFormattedTriggerTime(executionInfo.executionStartedOn)}
                                    </time>
                                </div>
                            </div>
                        )}

                        <div className="display-grid trigger-details__grid">
                            <div className="flexbox dc__content-center">
                                <div className="flexbox-col dc__gap-4">
                                    {renderBlockWithBorder()}

                                    <CurrentStatusIcon
                                        status={status}
                                        executionInfoCurrentStatus={executionInfo?.currentStatus}
                                    />

                                    <div className="flex flex-grow-1" />
                                </div>
                            </div>

                            <CurrentStatus
                                executionInfo={executionInfo}
                                status={status}
                                finishedOn={finishedOn}
                                artifact={artifact}
                                stage={stage}
                                type={type}
                            />
                        </div>

                        <div className="display-grid trigger-details__grid py-4">
                            <WorkerStatus
                                message={executionInfo?.workerDetails.message || message}
                                podStatus={executionInfo?.workerDetails.status || podStatus}
                                stage={stage}
                                finishedOn={executionInfo?.workerDetails.endTime || finishedOn}
                                clusterId={executionInfo?.workerDetails.clusterId || DEFAULT_CLUSTER_ID}
                                workerPodName={workerPodName}
                                namespace={namespace}
                            >
                                {showResourceConflictInfoBlock && (
                                    <div className="py-12 pr-12">
                                        <InfoBlock
                                            description={renderInfoBlockDescription()}
                                            buttonProps={{
                                                dataTestId: 'resource-conflict-re-deploy',
                                                text: 'Re-deploy',
                                                startIcon: <Icon name="ic-rocket-launch" color={null} />,
                                                onClick: handleShowRedeployModal,
                                                variant: ButtonVariantType.text,
                                                size: ComponentSizeType.medium,
                                            }}
                                        />
                                    </div>
                                )}
                            </WorkerStatus>
                        </div>
                    </div>
                </div>

                {renderDialogs()}
            </>
        )
    },
)

export default TriggerDetails
