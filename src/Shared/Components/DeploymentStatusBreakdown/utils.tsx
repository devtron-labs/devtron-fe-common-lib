/* eslint-disable no-param-reassign */
import { findRight, handleUTCTime, logExceptionToSentry } from '@Common/Helper'
import { DEPLOYMENT_STATUS } from '@Shared/constants'
import {
    DeploymentPhaseType,
    DeploymentStatusBreakdownItemType,
    DeploymentStatusDetailsBreakdownDataType,
    DeploymentStatusDetailsTimelineType,
    DeploymentStatusDetailsType,
    DeploymentStatusTimelineType,
    TIMELINE_STATUS,
} from '@Shared/types'

import {
    DEPLOYMENT_PHASES,
    FAILED_DEPLOYMENT_STATUS,
    PHYSICAL_ENV_DEPLOYMENT_TIMELINE_ORDER,
    PROGRESSING_DEPLOYMENT_STATUS,
    SUCCESSFUL_DEPLOYMENT_STATUS,
    WFR_STATUS_DTO_TO_DEPLOYMENT_STATUS_MAP,
} from './constants'
import { HandleUpdateTimelineDataForTimedOutOrUnableToFetchStatusParamsType } from './types'

const getDefaultDeploymentStatusTimeline = (
    data?: DeploymentStatusDetailsType,
): DeploymentStatusDetailsBreakdownDataType => {
    const commonProps: Pick<
        DeploymentStatusBreakdownItemType,
        'displaySubText' | 'time' | 'isCollapsed' | 'timelineStatus' | 'icon'
    > = {
        icon: '',
        displaySubText: '',
        timelineStatus: '',
        time: '',
        isCollapsed: true,
    }

    return {
        deploymentStatus: WFR_STATUS_DTO_TO_DEPLOYMENT_STATUS_MAP[data?.wfrStatus] || DEPLOYMENT_STATUS.INPROGRESS,
        deploymentTriggerTime: data?.deploymentStartedOn || '',
        deploymentEndTime: data?.deploymentFinishedOn || '',
        triggeredBy: data?.triggeredBy || '',
        lastFailedStatusType: '',
        deploymentStatusBreakdown: {
            [TIMELINE_STATUS.DEPLOYMENT_INITIATED]: {
                ...commonProps,
                icon: 'success',
                displayText: `Deployment initiated ${data?.triggeredBy ? `by ${data.triggeredBy}` : ''}`,
            },
            [TIMELINE_STATUS.GIT_COMMIT]: {
                ...commonProps,
                displayText: 'Push manifest to Git',
            },
            [TIMELINE_STATUS.ARGOCD_SYNC]: {
                ...commonProps,
                displayText: 'Synced with Argo CD',
            },
            [TIMELINE_STATUS.KUBECTL_APPLY]: {
                ...commonProps,
                displayText: 'Apply manifest to Kubernetes',
                resourceDetails: [],
                subSteps: [],
            },
            [TIMELINE_STATUS.APP_HEALTH]: {
                ...commonProps,
                displayText: 'Propagate manifest to Kubernetes resources',
            },
        },
    }
}

const getPredicate =
    (timelineStatus: DeploymentStatusTimelineType) =>
    (timelineItem: DeploymentStatusDetailsTimelineType): boolean => {
        switch (timelineStatus) {
            case TIMELINE_STATUS.DEPLOYMENT_INITIATED:
                return timelineStatus === timelineItem.status

            case TIMELINE_STATUS.GIT_COMMIT:
                return timelineItem.status.includes(TIMELINE_STATUS.GIT_COMMIT)

            case TIMELINE_STATUS.ARGOCD_SYNC:
                return timelineItem.status.includes(TIMELINE_STATUS.ARGOCD_SYNC)

            case TIMELINE_STATUS.KUBECTL_APPLY:
                return timelineItem.status.includes(TIMELINE_STATUS.KUBECTL_APPLY)

            case TIMELINE_STATUS.APP_HEALTH:
                return [TIMELINE_STATUS.HEALTHY, TIMELINE_STATUS.DEGRADED, TIMELINE_STATUS.DEPLOYMENT_FAILED].includes(
                    timelineItem.status as TIMELINE_STATUS,
                )

            default:
                return false
        }
    }

const handleUpdateTimelineDataForTimedOutOrUnableToFetchStatus = ({
    timelineData,
    timelineStatusType,
    deploymentStatus,
    statusLastFetchedAt,
    statusFetchCount,
}: HandleUpdateTimelineDataForTimedOutOrUnableToFetchStatusParamsType) => {
    timelineData.icon = deploymentStatus === DEPLOYMENT_STATUS.UNABLE_TO_FETCH ? 'disconnect' : 'timed_out'
    timelineData.displaySubText = 'Unknown'
    timelineData.isCollapsed = false

    const lastFetchedTime = statusLastFetchedAt ? handleUTCTime(statusLastFetchedAt, true) : '--'
    const resourceError = `Below resources did not become healthy within 10 mins. Resource status shown below was last fetched ${lastFetchedTime}. ${statusFetchCount || '--'} retries failed.`
    timelineData.timelineStatus = [TIMELINE_STATUS.KUBECTL_APPLY, TIMELINE_STATUS.APP_HEALTH].includes(
        timelineStatusType,
    )
        ? resourceError
        : ''
}

const processKubeCTLApply = (
    timelineData: DeploymentStatusBreakdownItemType,
    element: DeploymentStatusDetailsTimelineType,
    deploymentStatus: DeploymentStatusDetailsBreakdownDataType['deploymentStatus'],
    data: DeploymentStatusDetailsType,
) => {
    const tableData: {
        currentPhase: DeploymentPhaseType | ''
        currentTableData: DeploymentStatusBreakdownItemType['subSteps']
    } = {
        currentPhase: '',
        currentTableData: [{ icon: 'success', message: 'Started by Argo CD' }],
    }

    // Resource details are present in KUBECTL_APPLY_STARTED timeline alone
    const resourceDetails = data.timelines.find(
        (item) => item.status === TIMELINE_STATUS.KUBECTL_APPLY_STARTED,
    )?.resourceDetails

    if (resourceDetails) {
        // Used to parse resource details base struct with current phase as last phase
        DEPLOYMENT_PHASES.forEach((phase) => {
            let breakPhase = false
            resourceDetails.forEach((item) => {
                if (breakPhase) {
                    return
                }

                if (phase === item.resourcePhase) {
                    tableData.currentPhase = phase
                    tableData.currentTableData.push({
                        icon: 'success',
                        phase,
                        message: `${phase}: Create and update resources based on manifest`,
                    })
                    breakPhase = true
                }
            })
        })
    }

    if (element.status === TIMELINE_STATUS.KUBECTL_APPLY_STARTED) {
        timelineData.resourceDetails = element.resourceDetails?.filter(
            (item) => item.resourcePhase === tableData.currentPhase,
        )

        if (PROGRESSING_DEPLOYMENT_STATUS.includes(deploymentStatus)) {
            timelineData.icon = 'inprogress'
            timelineData.displaySubText = 'In progress'
            timelineData.time = element.statusTime
            timelineData.timelineStatus = element.statusDetail
            timelineData.isCollapsed = false
            timelineData.subSteps = tableData.currentTableData.map((item) => ({
                icon: item.phase === tableData.currentPhase ? 'loading' : 'success',
                message: item.message,
            }))
            return
        }

        if (deploymentStatus === DEPLOYMENT_STATUS.FAILED) {
            timelineData.icon = 'unknown'
            timelineData.displaySubText = ': Unknown'
            return
        }

        if (
            deploymentStatus === DEPLOYMENT_STATUS.TIMED_OUT ||
            deploymentStatus === DEPLOYMENT_STATUS.UNABLE_TO_FETCH
        ) {
            handleUpdateTimelineDataForTimedOutOrUnableToFetchStatus({
                timelineData,
                timelineStatusType: TIMELINE_STATUS.KUBECTL_APPLY,
                deploymentStatus,
                statusLastFetchedAt: data?.statusLastFetchedAt,
                statusFetchCount: data?.statusFetchCount,
            })
            timelineData.subSteps = tableData.currentTableData.map((item) => ({
                icon: item.phase === tableData.currentPhase ? 'failed' : 'success',
                message: item.message,
            }))
            return
        }

        return
    }

    if (element.status === TIMELINE_STATUS.KUBECTL_APPLY_SYNCED) {
        timelineData.resourceDetails = []
        timelineData.displaySubText = ''
        timelineData.time = element.statusTime
        timelineData.icon = 'success'
        timelineData.subSteps = tableData.currentTableData
    }
}

export const processDeploymentStatusDetailsData = (
    data?: DeploymentStatusDetailsType,
): DeploymentStatusDetailsBreakdownDataType => {
    if (data && !WFR_STATUS_DTO_TO_DEPLOYMENT_STATUS_MAP[data.wfrStatus]) {
        logExceptionToSentry(new Error(`New WFR status found: ${data?.wfrStatus}`))
    }
    const deploymentData = getDefaultDeploymentStatusTimeline(data)

    const { deploymentStatus } = deploymentData

    if (!data?.timelines) {
        if (SUCCESSFUL_DEPLOYMENT_STATUS.includes(deploymentStatus)) {
            Object.values(deploymentData.deploymentStatusBreakdown).forEach((value) => {
                value.icon = 'success'
            })
        } else if (FAILED_DEPLOYMENT_STATUS.includes(deploymentStatus)) {
            deploymentData.deploymentStatusBreakdown.APP_HEALTH.displaySubText = 'Failed'
        }

        return deploymentData
    }

    // Would move for each timeline iteratively and if timeline is in terminal state then early return
    // If timeline is in non-terminal state then we mark it as waiting
    if (!data?.timelines?.length) {
        return deploymentData
    }

    const isProgressing = PROGRESSING_DEPLOYMENT_STATUS.includes(deploymentStatus)
    const isArgoCDAvailable = data.timelines.some((timeline) => timeline.status.includes(TIMELINE_STATUS.ARGOCD_SYNC))

    // After initial processing will mark all unavailable timelines [present before last invalid state] as success
    PHYSICAL_ENV_DEPLOYMENT_TIMELINE_ORDER.forEach((timelineStatusType, index) => {
        const element = findRight(data.timelines, getPredicate(timelineStatusType))

        const timelineData = deploymentData.deploymentStatusBreakdown[timelineStatusType]

        if (!element) {
            // This means the the last timeline is progressing or waiting so obviously this timeline is also waiting
            if (isProgressing && timelineData.icon !== 'inprogress') {
                timelineData.icon = ''
                timelineData.displaySubText = 'Waiting'
            }

            if (isProgressing && timelineStatusType === TIMELINE_STATUS.KUBECTL_APPLY) {
                timelineData.subSteps = [
                    { icon: '', message: 'Waiting to be started by Argo CD' },
                    { icon: '', message: 'Create and update resources based on manifest' },
                ]
                timelineData.isCollapsed = false
            }

            if (deploymentStatus === DEPLOYMENT_STATUS.FAILED) {
                timelineData.displaySubText = ''
                timelineData.icon = 'unreachable'
            }

            if (
                (deploymentStatus === DEPLOYMENT_STATUS.UNABLE_TO_FETCH ||
                    deploymentStatus === DEPLOYMENT_STATUS.TIMED_OUT) &&
                timelineData.icon === 'inprogress'
            ) {
                handleUpdateTimelineDataForTimedOutOrUnableToFetchStatus({
                    timelineData,
                    timelineStatusType,
                    deploymentStatus,
                    statusLastFetchedAt: data?.statusLastFetchedAt,
                    statusFetchCount: data?.statusFetchCount,
                })
            }

            return
        }

        switch (timelineStatusType) {
            case TIMELINE_STATUS.DEPLOYMENT_INITIATED:
            case TIMELINE_STATUS.GIT_COMMIT:
            case TIMELINE_STATUS.ARGOCD_SYNC:
                timelineData.time = element.statusTime
                timelineData.icon = 'success'
                timelineData.displaySubText = ''

                // These are singular events so either their success will come or failure
                if (
                    [TIMELINE_STATUS.GIT_COMMIT_FAILED, TIMELINE_STATUS.ARGOCD_SYNC_FAILED].includes(
                        element.status as TIMELINE_STATUS,
                    )
                ) {
                    timelineData.displaySubText = 'Failed'
                    timelineData.icon = 'failed'
                    timelineData.isCollapsed = false
                    timelineData.timelineStatus = element.statusDetail
                    // Not handling the next timelines here since would be handled in the next iteration through deploymentStatus;
                    // So Assumption is deploymentStatus is going to Failed in this case
                }
                break

            case TIMELINE_STATUS.KUBECTL_APPLY: {
                if (!isArgoCDAvailable) {
                    deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.icon = 'success'
                    deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.displaySubText = ''
                    deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.time = element.statusTime
                }

                processKubeCTLApply(timelineData, element, deploymentStatus, data)
                break
            }

            case TIMELINE_STATUS.APP_HEALTH:
                timelineData.time = element.statusTime
                if (element.status === TIMELINE_STATUS.DEPLOYMENT_FAILED) {
                    // TODO: Check why its icon is not failed in earlier implementation
                    timelineData.icon = 'failed'
                    timelineData.displaySubText = 'Failed'
                    timelineData.timelineStatus = element.statusDetail
                    break
                }

                if (element.status === TIMELINE_STATUS.HEALTHY || element.status === TIMELINE_STATUS.DEGRADED) {
                    timelineData.icon = 'success'
                    timelineData.displaySubText = element.status === TIMELINE_STATUS.HEALTHY ? '' : 'Degraded'
                }
                break

            default:
                break
        }

        if (timelineData.icon === 'success' && index !== PHYSICAL_ENV_DEPLOYMENT_TIMELINE_ORDER.length - 1) {
            // Moving the next timeline to inprogress
            const nextTimelineStatus = PHYSICAL_ENV_DEPLOYMENT_TIMELINE_ORDER[index + 1]
            const nextTimeline = deploymentData.deploymentStatusBreakdown[nextTimelineStatus]

            nextTimeline.icon = 'inprogress'
            nextTimeline.displaySubText = 'In progress'
        }
    })

    // Traversing the timeline in reverse order so that if any status is there which is inprogress or success then we will mark all the previous steps as success
    for (let i = PHYSICAL_ENV_DEPLOYMENT_TIMELINE_ORDER.length - 1; i >= 0; i -= 1) {
        const timelineStatusType = PHYSICAL_ENV_DEPLOYMENT_TIMELINE_ORDER[i]
        const timelineData = deploymentData.deploymentStatusBreakdown[timelineStatusType]

        if (timelineData.icon === 'inprogress' || timelineData.icon === 'success') {
            // If the timeline is in progress or success then we will mark all the previous steps as success
            for (let j = i - 1; j >= 0; j -= 1) {
                const prevTimelineStatusType = PHYSICAL_ENV_DEPLOYMENT_TIMELINE_ORDER[j]
                const prevTimelineData = deploymentData.deploymentStatusBreakdown[prevTimelineStatusType]
                prevTimelineData.icon = 'success'
                prevTimelineData.displaySubText = ''
            }
            break
        }
    }

    return deploymentData
}
