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

/* eslint-disable no-param-reassign */
import { findRight, handleUTCTime, logExceptionToSentry } from '@Common/Helper'
import { DeploymentAppTypes } from '@Common/Types'
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
    PHYSICAL_ENV_DEPLOYMENT_TIMELINE_ORDER_ARGO,
    PHYSICAL_ENV_DEPLOYMENT_TIMELINE_ORDER_FLUX,
    PROGRESSING_DEPLOYMENT_STATUS,
    SUCCESSFUL_DEPLOYMENT_STATUS,
    WFR_STATUS_DTO_TO_DEPLOYMENT_STATUS_MAP,
} from './constants'
import { ProcessUnableToFetchOrTimedOutStatusType } from './types'

const getDefaultDeploymentStatusTimeline = (
    deploymentAppType: DeploymentAppTypes,
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

    const deploymentStatus = WFR_STATUS_DTO_TO_DEPLOYMENT_STATUS_MAP[data?.wfrStatus] || DEPLOYMENT_STATUS.INPROGRESS
    // Incase of git commit failed or argocd sync failed, DEPLOYMENT_STATUS.FAILED won't come from BE
    const deploymentErrorMessage =
        deploymentStatus === DEPLOYMENT_STATUS.FAILED
            ? data?.timelines?.find((timeline) => timeline.status === TIMELINE_STATUS.DEPLOYMENT_FAILED)
                  ?.statusDetail || ''
            : ''

    return {
        deploymentStatus,
        deploymentAppType,
        deploymentTriggerTime: data?.deploymentStartedOn || '',
        deploymentEndTime: data?.deploymentFinishedOn || '',
        triggeredBy: data?.triggeredBy || '',
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
            ...(deploymentAppType === DeploymentAppTypes.ARGO
                ? {
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
                  }
                : {}),
            [TIMELINE_STATUS.APP_HEALTH]: {
                ...commonProps,
                displayText:
                    deploymentAppType === DeploymentAppTypes.FLUX
                        ? 'Synced with Flux CD'
                        : 'Propagate manifest to Kubernetes resources',
            },
        },
        errorBarConfig: deploymentErrorMessage
            ? {
                  deploymentErrorMessage,
                  nextTimelineToProcess: TIMELINE_STATUS.GIT_COMMIT,
              }
            : null,
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
                return [TIMELINE_STATUS.HEALTHY, TIMELINE_STATUS.DEGRADED].includes(timelineItem.status)

            default:
                return false
        }
    }

const processUnableToFetchOrTimedOutStatus = ({
    timelineData,
    timelineStatusType,
    deploymentStatus,
    statusLastFetchedAt,
    statusFetchCount,
}: ProcessUnableToFetchOrTimedOutStatusType) => {
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
        currentPhase: DeploymentPhaseType | null
        currentTableData: DeploymentStatusBreakdownItemType['subSteps']
    } = {
        currentPhase: null,
        currentTableData: [{ icon: 'success', message: 'Started by Argo CD' }],
    }

    // Resource details are present in KUBECTL_APPLY_STARTED timeline alone
    const resourceDetails = data.timelines.find(
        (item) => item.status === TIMELINE_STATUS.KUBECTL_APPLY_STARTED,
    )?.resourceDetails

    if (resourceDetails) {
        // Used to parse resource details base struct with current phase as last phase
        DEPLOYMENT_PHASES.forEach((phase) => {
            const resourceWithSamePhase = resourceDetails.find((item) => item.resourcePhase === phase)
            if (resourceWithSamePhase) {
                tableData.currentPhase = phase
                tableData.currentTableData.push({
                    icon: 'success',
                    phase,
                    message: `${phase}: Create and update resources based on manifest`,
                })
            }
        })
    }

    if (element.status === TIMELINE_STATUS.KUBECTL_APPLY_STARTED) {
        timelineData.resourceDetails = (element.resourceDetails || []).filter(
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
            processUnableToFetchOrTimedOutStatus({
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

/**
 * @description
 * This function processes the deployment status details data and returns a breakdown of the deployment status.
 * Cases it handles:
 * 1. If timelines are not present, say the case of helm deployment, we will parse the wfrStatus and put the status and basic deployment info [triggeredBy, deploymentStartedOn, deploymentFinishedOn] into the breakdown data and return it.
 * 2. In case of argo_cd:
 *  - There are five timelines in chronological order:
 *    - Deployment Initiated
 *    - Git commit
 *    - ArgoCD Sync
 *    - Kubectl Apply
 *    - App Health
 *    In case of flux_cd
 *    - Deployment Initiated
 *    - Git commit
 *    - App Health
 *  - Basic flow is we traverse the timelines in order, if find the last status for that specific timeline from response by traversing the timelines in reverse order.
 *  - If element is found, we will parse the status and set the icon, display text, time, etc. for that timeline and set the next timeline to inprogress.
 *  - If element is not found, we will parse on basis of factors like:
 *   - If this timeline is not inprogress and deploymentStatus is progressing, we will set the current timeline to waiting.
 *   - In similar fashion based on the deploymentStatus we will set the icon and display text for the timeline.
 */
export const processDeploymentStatusDetailsData = (
    deploymentAppType: DeploymentAppTypes,
    data?: DeploymentStatusDetailsType,
): DeploymentStatusDetailsBreakdownDataType => {
    if (data && !WFR_STATUS_DTO_TO_DEPLOYMENT_STATUS_MAP[data.wfrStatus]) {
        logExceptionToSentry(new Error(`New WFR status found: ${data?.wfrStatus}`))
    }
    const deploymentData = getDefaultDeploymentStatusTimeline(deploymentAppType, data)

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

    if (!data.timelines.length) {
        return deploymentData
    }

    const isProgressing = PROGRESSING_DEPLOYMENT_STATUS.includes(deploymentStatus)
    const hasDeploymentFailed = deploymentStatus === DEPLOYMENT_STATUS.FAILED
    // This key will be used since argocd sync is manual or auto based on flag on BE.
    // And in old data as well this timeline won't be present so in KUBECTL_APPLY timeline we will set the icon to success
    const isArgoCDSyncAvailable = data.timelines.some((timeline) =>
        timeline.status.includes(TIMELINE_STATUS.ARGOCD_SYNC),
    )

    // Only keep 3 steps in case of flux
    const timelineOrder =
        deploymentAppType === DeploymentAppTypes.FLUX
            ? PHYSICAL_ENV_DEPLOYMENT_TIMELINE_ORDER_FLUX
            : PHYSICAL_ENV_DEPLOYMENT_TIMELINE_ORDER_ARGO

    timelineOrder.forEach((timelineStatusType, index) => {
        const element = findRight(data.timelines, getPredicate(timelineStatusType))
        const timelineData = deploymentData.deploymentStatusBreakdown[timelineStatusType]

        if (!element) {
            // This means the the last timeline is progressing or waiting so obviously this timeline is also waiting
            if (isProgressing && timelineData.icon !== 'inprogress') {
                timelineData.icon = ''
                timelineData.displaySubText = 'Waiting'
            }

            // We don't even need to clean this in final loop since deployment status won't be in progress if next timeline is progressing
            if (isProgressing && timelineStatusType === TIMELINE_STATUS.KUBECTL_APPLY) {
                timelineData.subSteps = [
                    { icon: '', message: 'Waiting to be started by Argo CD' },
                    { icon: '', message: 'Create and update resources based on manifest' },
                ]
                timelineData.isCollapsed = false
            }

            if (hasDeploymentFailed) {
                const hasCurrentTimelineFailed =
                    timelineStatusType === TIMELINE_STATUS.APP_HEALTH &&
                    deploymentData.deploymentStatusBreakdown[
                        deploymentAppType === DeploymentAppTypes.FLUX
                            ? TIMELINE_STATUS.GIT_COMMIT
                            : TIMELINE_STATUS.KUBECTL_APPLY
                    ].icon === 'success'

                timelineData.displaySubText = hasCurrentTimelineFailed ? 'Failed' : ''
                timelineData.icon = hasCurrentTimelineFailed ? 'failed' : 'unreachable'
            }

            if (
                (deploymentStatus === DEPLOYMENT_STATUS.UNABLE_TO_FETCH ||
                    deploymentStatus === DEPLOYMENT_STATUS.TIMED_OUT) &&
                timelineData.icon === 'inprogress'
            ) {
                processUnableToFetchOrTimedOutStatus({
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
                if ([TIMELINE_STATUS.GIT_COMMIT_FAILED, TIMELINE_STATUS.ARGOCD_SYNC_FAILED].includes(element.status)) {
                    timelineData.displaySubText = 'Failed'
                    timelineData.icon = 'failed'
                    timelineData.isCollapsed = false
                    timelineData.timelineStatus = element.statusDetail
                    // Not handling the next timelines here since would be handled in the next iteration through deploymentStatus;
                    // So Assumption is deploymentStatus is going to Failed in this case
                }
                break

            case TIMELINE_STATUS.KUBECTL_APPLY: {
                if (!isArgoCDSyncAvailable) {
                    deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.icon = 'success'
                    deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.displaySubText = ''
                    deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.time = element.statusTime
                    deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.isCollapsed = true
                }

                processKubeCTLApply(timelineData, element, deploymentStatus, data)
                break
            }

            case TIMELINE_STATUS.APP_HEALTH:
                timelineData.time = element.statusTime
                timelineData.icon = 'success'
                timelineData.displaySubText = element.status === TIMELINE_STATUS.HEALTHY ? '' : 'Degraded'
                break

            default:
                break
        }

        // Moving the next timeline to inprogress
        if (timelineData.icon === 'success' && index !== timelineOrder.length - 1) {
            const nextTimelineStatus = timelineOrder[index + 1]
            const nextTimeline = deploymentData.deploymentStatusBreakdown[nextTimelineStatus]

            if (deploymentData.errorBarConfig) {
                deploymentData.errorBarConfig.nextTimelineToProcess = nextTimelineStatus
            }

            nextTimeline.icon = 'inprogress'
            nextTimeline.displaySubText = 'In progress'
        }
    })

    // Traversing the timeline in reverse order so that if any status is there which is inprogress or success then we will mark all the previous steps as success
    for (let i = timelineOrder.length - 1; i >= 0; i -= 1) {
        const timelineStatusType = timelineOrder[i]
        const timelineData = deploymentData.deploymentStatusBreakdown[timelineStatusType]

        if (timelineData.icon === 'inprogress' || timelineData.icon === 'success') {
            for (let j = i - 1; j >= 0; j -= 1) {
                const prevTimelineStatusType = timelineOrder[j]
                const prevTimelineData = deploymentData.deploymentStatusBreakdown[prevTimelineStatusType]
                prevTimelineData.icon = 'success'
                prevTimelineData.displaySubText = ''
                prevTimelineData.isCollapsed = true
                prevTimelineData.timelineStatus = ''
            }
            break
        }
    }

    return deploymentData
}
