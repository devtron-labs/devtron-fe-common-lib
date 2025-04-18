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
import { ReactElement, useEffect, useRef, useState } from 'react'
import { PromptProps } from 'react-router-dom'
import { StrictRJSFSchema } from '@rjsf/utils'
import Tippy from '@tippyjs/react'
import moment from 'moment'
import { nanoid } from 'nanoid'
import { Pair } from 'yaml'

import { ReactComponent as ICAWSCodeCommit } from '@Icons/ic-aws-codecommit.svg'
import { ReactComponent as ICBitbucket } from '@Icons/ic-bitbucket.svg'
import { ReactComponent as ICGit } from '@Icons/ic-git.svg'
import { ReactComponent as ICGithub } from '@Icons/ic-github.svg'
import { ReactComponent as ICGitlab } from '@Icons/ic-gitlab.svg'
import { ReactComponent as ICPullRequest } from '@Icons/ic-pull-request.svg'
import { ReactComponent as ICTag } from '@Icons/ic-tag.svg'
import { ReactComponent as ICWebhook } from '@Icons/ic-webhook.svg'
import { MaterialHistoryType } from '@Shared/Services/app.types'

import {
    ApprovalConfigDataType,
    DATE_TIME_FORMATS,
    handleUTCTime,
    ManualApprovalType,
    mapByKey,
    MaterialInfo,
    noop,
    PATTERNS,
    shallowEqual,
    SortingOrder,
    SourceTypeMap,
    TOKEN_COOKIE_NAME,
    UserApprovalConfigType,
    UserApprovalInfo,
    ZERO_TIME_STRING,
} from '../Common'
import { getAggregator } from '../Pages'
import {
    AggregatedNodes,
    DeploymentStatusDetailsBreakdownDataType,
    DeploymentStatusDetailsType,
    PodMetadatum,
} from './Components'
import { DEPLOYMENT_STATUS, TIMELINE_STATUS, UNSAVED_CHANGES_PROMPT_MESSAGE } from './constants'
import {
    AggregationKeys,
    BorderConfigType,
    GetTimeDifferenceParamsType,
    GitTriggers,
    IntersectionChangeHandler,
    IntersectionOptions,
    Nodes,
    PreventOutsideFocusProps,
    TargetPlatformItemDTO,
    TargetPlatformsDTO,
    WebhookEventNameType,
} from './types'

interface HighlightSearchTextProps {
    /**
     * The text to be highlighted
     */
    searchText: string
    /**
     * The whole text string
     */
    text: string
    /**
     * The classes to be applied to the highlighted text
     */
    highlightClasses?: string
}

export const escapeRegExp = (text: string): string => text.replace(PATTERNS.ESCAPED_CHARACTERS, '\\$&')

export const highlightSearchText = ({ searchText, text, highlightClasses }: HighlightSearchTextProps): string => {
    if (!searchText) {
        return text
    }

    try {
        const regex = new RegExp(searchText, 'gi')
        return text.replace(regex, (match) => `<span class="${highlightClasses}">${match}</span>`)
    } catch {
        return text
    }
}

export const preventBodyScroll = (lock: boolean): void => {
    if (lock) {
        document.body.style.overflowY = 'hidden'
        document.body.style.height = '100vh'
        document.documentElement.style.overflow = 'initial'
    } else {
        document.body.style.overflowY = null
        document.body.style.height = null
        document.documentElement.style.overflow = null
    }
}

export const preventOutsideFocus = ({ identifier, preventFocus }: PreventOutsideFocusProps) => {
    const identifierElement = document.getElementById(identifier)
    if (!identifierElement) {
        return
    }
    if (preventFocus) {
        identifierElement.setAttribute('inert', 'true')
    } else {
        identifierElement.removeAttribute('inert')
    }
}

const getIsMaterialInfoValid = (materialInfo: MaterialInfo): boolean =>
    !!(
        materialInfo.webhookData ||
        materialInfo.author ||
        materialInfo.message ||
        materialInfo.modifiedTime ||
        materialInfo.revision
    )

export const getIsMaterialInfoAvailable = (materialInfo: MaterialInfo[]) =>
    !!materialInfo?.every(getIsMaterialInfoValid)

export const getGitCommitInfo = (materialInfo: MaterialInfo): GitTriggers => ({
    Commit: materialInfo.revision,
    Author: materialInfo.author,
    Date: materialInfo.modifiedTime,
    Message: materialInfo.message,
    WebhookData: JSON.parse(materialInfo.webhookData),
    Changes: [],
    GitRepoUrl: '',
    GitRepoName: '',
    CiConfigureSourceType: '',
    CiConfigureSourceValue: '',
})

export const stringComparatorBySortOrder = (
    a: string,
    b: string,
    sortOrder: SortingOrder = SortingOrder.ASC,
    isCaseSensitive: boolean = true,
): number => {
    if (isCaseSensitive) {
        return sortOrder === SortingOrder.ASC ? a.localeCompare(b) : b.localeCompare(a)
    }

    return sortOrder === SortingOrder.ASC
        ? a.toLowerCase().localeCompare(b.toLowerCase())
        : b.toLowerCase().localeCompare(a.toLowerCase())
}

export const numberComparatorBySortOrder = (
    a: number,
    b: number,
    sortOrder: SortingOrder = SortingOrder.ASC,
): number => (sortOrder === SortingOrder.ASC ? a - b : b - a)

export function versionComparatorBySortOrder(a: string, b: string, orderBy = SortingOrder.ASC) {
    if (orderBy === SortingOrder.DESC) {
        return a?.localeCompare(b, undefined, { numeric: true }) ?? 1
    }

    return b?.localeCompare(a, undefined, { numeric: true }) ?? 1
}

export const getWebhookEventIcon = (eventName: WebhookEventNameType) => {
    switch (eventName) {
        case WebhookEventNameType.PULL_REQUEST:
            return <ICPullRequest className="icon-dim-12" />
        case WebhookEventNameType.TAG_CREATION:
            return <ICTag className="icon-dim-12" />
        default:
            return <ICWebhook className="icon-dim-12" />
    }
}

export const yamlComparatorBySortOrder = (a: Pair, b: Pair, sortOrder: SortingOrder = SortingOrder.ASC) => {
    let orderMultiplier = 0
    if (sortOrder === SortingOrder.DESC) {
        orderMultiplier = -1
    } else if (sortOrder === SortingOrder.ASC) {
        orderMultiplier = 1
    }
    if (a.key < b.key) {
        return -1 * orderMultiplier
    }
    if (a.key > b.key) {
        return 1 * orderMultiplier
    }
    return 0
}

export const useIntersection = (
    target: React.RefObject<Element> | Element | null,
    // eslint-disable-next-line default-param-last
    options: IntersectionOptions = {},
    callback?: IntersectionChangeHandler,
) => {
    const { defaultIntersecting, once, ...opts } = options
    const optsRef = useRef(opts)
    const [intersecting, setIntersecting] = useState(defaultIntersecting === true)
    const intersectedRef = useRef(false)

    useEffect(() => {
        if (!shallowEqual(optsRef.current, opts)) {
            optsRef.current = opts
        }
    })

    useEffect(() => {
        if (target == null) {
            return
        }

        const element = target instanceof Element ? target : target.current
        if (element == null) {
            return
        }

        if (once && intersectedRef.current) {
            return
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIntersecting(entry.isIntersecting)

                if (callback != null) {
                    callback(entry)
                }

                if (entry.isIntersecting) {
                    intersectedRef.current = true
                }

                if (once && entry.isIntersecting && element != null) {
                    observer.unobserve(element)
                }
            },
            {
                ...optsRef.current,
                root: optsRef.current.root != null ? optsRef.current.root.current : null,
            },
        )

        observer.observe(element)

        // eslint-disable-next-line consistent-return
        return () => {
            if (once && intersectedRef.current) {
                return
            }

            if (element != null) {
                observer.unobserve(element)
            }
        }
    }, [optsRef.current, target])

    return intersecting
}
export const isNullOrUndefined = (value: unknown): boolean => value === null || value === undefined

export const handleDisableSubmitOnEnter = (event: React.KeyboardEvent<HTMLFormElement>) => {
    const isTextArea = event.target instanceof HTMLTextAreaElement

    if (event.key === 'Enter' && !isTextArea) {
        event.preventDefault()
    }
}

export const getKeyToBooleanMapFromArray = <T extends string | number>(arr: T[] = []) =>
    arr.reduce<Record<T, boolean>>(
        (acc, key) => {
            acc[key] = true
            return acc
        },
        {} as Record<T, boolean>,
    )

export const renderValidInputButtonTippy = (children: ReactElement) => (
    <Tippy
        content="Valid input is required for all mandatory fields."
        placement="top"
        className="default-tt"
        arrow={false}
    >
        {children}
    </Tippy>
)

// NOTE: Need to improve logic since in some cases the unknown status would leak to previous entites, can do that by not setting deploymentStatus as Failed by ourselves and let backend be source of truth of that
export const processDeploymentStatusDetailsData = (
    data?: DeploymentStatusDetailsType,
): DeploymentStatusDetailsBreakdownDataType => {
    const deploymentData = {
        deploymentStatus: 'inprogress',
        deploymentStatusText: 'In progress',
        deploymentTriggerTime: data?.deploymentStartedOn || '',
        deploymentEndTime: data?.deploymentFinishedOn || '',
        deploymentError: '',
        triggeredBy: data?.triggeredBy || '',
        nonDeploymentError: '',
        deploymentStatusBreakdown: {
            DEPLOYMENT_INITIATED: {
                icon: 'success',
                displayText: `Deployment initiated ${data?.triggeredBy ? `by ${data?.triggeredBy}` : ''}`,
                displaySubText: '',
                time: '',
            },
            GIT_COMMIT: {
                icon: '',
                displayText: 'Push manifest to Git',
                displaySubText: '',
                timelineStatus: '',
                time: '',
                isCollapsed: true,
            },
            ARGOCD_SYNC: {
                icon: '',
                displayText: 'Synced with Argo CD',
                displaySubText: '',
                timelineStatus: '',
                time: '',
                isCollapsed: true,
            },
            KUBECTL_APPLY: {
                icon: '',
                displayText: 'Apply manifest to Kubernetes',
                timelineStatus: '',
                displaySubText: '',
                time: '',
                resourceDetails: [],
                isCollapsed: true,
                kubeList: [],
            },
            APP_HEALTH: {
                icon: '',
                displayText: 'Propogate manifest to Kubernetes resources',
                timelineStatus: '',
                displaySubText: '',
                time: '',
                isCollapsed: true,
            },
        },
    }

    const lastFetchedTime = handleUTCTime(data?.statusLastFetchedAt, true)
    const deploymentPhases = ['PreSync', 'Sync', 'PostSync', 'Skip', 'SyncFail']
    const tableData: { currentPhase: string; currentTableData: { icon: string; phase?: string; message: string }[] } = {
        currentPhase: '',
        currentTableData: [{ icon: 'success', message: 'Started by Argo CD' }],
    }

    // data when timelines is available
    if (data?.timelines?.length) {
        // TO Support legacy data have to make sure that if ARGOCD_SYNC is not available then we fill it with dummy values
        const isArgoCDAvailable = data.timelines.some((timeline) =>
            timeline.status.includes(TIMELINE_STATUS.ARGOCD_SYNC),
        )

        for (let index = data.timelines.length - 1; index >= 0; index--) {
            const element = data.timelines[index]
            if (element.status === TIMELINE_STATUS.HEALTHY || element.status === TIMELINE_STATUS.DEGRADED) {
                deploymentData.deploymentStatus = DEPLOYMENT_STATUS.SUCCEEDED
                deploymentData.deploymentStatusText = 'Succeeded'
                deploymentData.deploymentStatusBreakdown.APP_HEALTH.displaySubText =
                    element.status === TIMELINE_STATUS.HEALTHY ? '' : 'Degraded'
                deploymentData.deploymentStatusBreakdown.APP_HEALTH.time = element.statusTime
                deploymentData.deploymentStatusBreakdown.APP_HEALTH.icon = 'success'
                deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.icon = 'success'
                deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.isCollapsed = true
                deploymentData.deploymentStatusBreakdown.APP_HEALTH.isCollapsed = true
                deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.icon = 'success'
                deploymentData.deploymentStatusBreakdown.GIT_COMMIT.icon = 'success'
            } else if (element.status === TIMELINE_STATUS.DEPLOYMENT_FAILED) {
                deploymentData.deploymentStatus = DEPLOYMENT_STATUS.FAILED
                deploymentData.deploymentStatusText = 'Failed'
                deploymentData.deploymentStatusBreakdown.APP_HEALTH.displaySubText = '   Failed'
                deploymentData.deploymentError = element.statusDetail
            } else if (element.status === TIMELINE_STATUS.DEPLOYMENT_SUPERSEDED) {
                deploymentData.deploymentStatus = DEPLOYMENT_STATUS.SUPERSEDED
            } else if (
                index === data.timelines.length - 1 &&
                (element.status === TIMELINE_STATUS.FETCH_TIMED_OUT ||
                    element.status === TIMELINE_STATUS.UNABLE_TO_FETCH_STATUS)
            ) {
                if (element.status === TIMELINE_STATUS.FETCH_TIMED_OUT) {
                    deploymentData.deploymentStatus = DEPLOYMENT_STATUS.TIMED_OUT
                    deploymentData.deploymentStatusText = 'Timed out'
                } else if (element.status === TIMELINE_STATUS.UNABLE_TO_FETCH_STATUS) {
                    deploymentData.deploymentStatus = DEPLOYMENT_STATUS.UNABLE_TO_FETCH
                    deploymentData.deploymentStatusText = 'Unable to fetch status'
                }
                deploymentData.deploymentError = `Below resources did not become healthy within 10 mins. Resource status shown below was last fetched ${lastFetchedTime}. ${data.statusFetchCount} retries failed.`
            } else if (element.status.includes(TIMELINE_STATUS.KUBECTL_APPLY)) {
                if (!isArgoCDAvailable) {
                    deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.icon = 'success'
                    deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.displaySubText = ''
                    deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.time = element.statusTime
                }

                if (element?.resourceDetails) {
                    deploymentPhases.forEach((phase) => {
                        // eslint-disable-next-line no-restricted-syntax
                        for (const item of element.resourceDetails) {
                            if (phase === item.resourcePhase) {
                                tableData.currentPhase = phase
                                // Seems else block was forgotten to add here, TODO: Sync for this later
                                // eslint-disable-next-line no-empty
                                if (item.resourceStatus === 'failed') {
                                }
                                tableData.currentTableData.push({
                                    icon: 'success',
                                    phase,
                                    message: `${phase}: Create and update resources based on manifest`,
                                })
                                return
                            }
                        }
                    })
                }
                if (
                    element.status === TIMELINE_STATUS.KUBECTL_APPLY_STARTED &&
                    deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.time === '' &&
                    deploymentData.deploymentStatus !== DEPLOYMENT_STATUS.SUCCEEDED
                ) {
                    deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.resourceDetails =
                        element.resourceDetails?.filter((item) => item.resourcePhase === tableData.currentPhase)
                    if (deploymentData.deploymentStatus === DEPLOYMENT_STATUS.FAILED) {
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.icon = 'unknown'
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.displaySubText = ': Unknown'
                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.icon = 'unknown'
                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.displaySubText = ': Unknown'
                    } else if (deploymentData.deploymentStatus === DEPLOYMENT_STATUS.SUCCEEDED) {
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.icon = 'success'
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.displaySubText = ''
                    } else if (
                        deploymentData.deploymentStatus === DEPLOYMENT_STATUS.TIMED_OUT ||
                        deploymentData.deploymentStatus === DEPLOYMENT_STATUS.UNABLE_TO_FETCH
                    ) {
                        if (deploymentData.deploymentStatus === DEPLOYMENT_STATUS.TIMED_OUT) {
                            deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.icon = 'unknown'
                            deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.isCollapsed = false
                        } else {
                            deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.icon = 'disconnect'
                        }
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.displaySubText = 'Unknown'
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.timelineStatus =
                            deploymentData.deploymentError
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.kubeList =
                            tableData.currentTableData.map((item) => ({
                                icon: item.phase === tableData.currentPhase ? 'failed' : 'success',
                                message: item.message,
                            }))
                    } else {
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.icon = 'inprogress'
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.displaySubText = 'In progress'
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.time = element.statusTime
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.timelineStatus = element.statusDetail
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.isCollapsed = false
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.kubeList =
                            tableData.currentTableData.map((item) => ({
                                icon: item.phase === tableData.currentPhase ? 'loading' : 'success',
                                message: item.message,
                            }))
                    }
                } else if (element.status === TIMELINE_STATUS.KUBECTL_APPLY_SYNCED) {
                    deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.resourceDetails = []
                    deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.displaySubText = ''
                    deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.time = element.statusTime
                    deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.icon = 'success'
                    deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.icon = 'success'
                    deploymentData.deploymentStatusBreakdown.GIT_COMMIT.icon = 'success'
                    deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.kubeList = tableData.currentTableData

                    if (deploymentData.deploymentStatus === DEPLOYMENT_STATUS.INPROGRESS) {
                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.icon = 'inprogress'
                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.isCollapsed = false
                    } else if (deploymentData.deploymentStatus === DEPLOYMENT_STATUS.FAILED) {
                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.icon = 'failed'
                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.displaySubText = 'Failed'
                    } else if (deploymentData.deploymentStatus === DEPLOYMENT_STATUS.TIMED_OUT) {
                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.icon = 'timed_out'
                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.displaySubText = 'Unknown'
                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.timelineStatus =
                            deploymentData.deploymentError
                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.isCollapsed = false
                    } else if (deploymentData.deploymentStatus === DEPLOYMENT_STATUS.UNABLE_TO_FETCH) {
                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.icon = 'disconnect'
                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.displaySubText = 'Unknown'
                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.timelineStatus =
                            deploymentData.deploymentError
                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.isCollapsed = false
                    }
                }
            } else if (element.status.includes(TIMELINE_STATUS.ARGOCD_SYNC)) {
                deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.time = element.statusTime

                if (element.status === TIMELINE_STATUS.ARGOCD_SYNC_FAILED) {
                    deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.displaySubText = 'Failed'
                    deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.icon = 'failed'

                    deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.displaySubText = ''
                    deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.icon = 'unreachable'

                    deploymentData.deploymentStatusBreakdown.APP_HEALTH.displaySubText = ''
                    deploymentData.deploymentStatusBreakdown.APP_HEALTH.icon = 'unreachable'

                    deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.isCollapsed = false
                    deploymentData.deploymentStatus = DEPLOYMENT_STATUS.FAILED
                    deploymentData.deploymentStatusText = 'Failed'
                    deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.timelineStatus = element.statusDetail
                } else {
                    deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.icon = 'success'
                    if (deploymentData.deploymentStatus === DEPLOYMENT_STATUS.FAILED) {
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.displaySubText = ''
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.icon = 'unreachable'

                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.displaySubText = ''
                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.icon = 'unreachable'

                        if (deploymentData.nonDeploymentError === '') {
                            deploymentData.nonDeploymentError = TIMELINE_STATUS.KUBECTL_APPLY
                        }
                    } else if (
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.time === '' &&
                        deploymentData.deploymentStatus === DEPLOYMENT_STATUS.INPROGRESS
                    ) {
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.icon = ''
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.displaySubText = 'Waiting'
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.kubeList = [
                            { icon: '', message: 'Waiting to be started by Argo CD' },
                            { icon: '', message: 'Create and update resources based on manifest' },
                        ]
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.isCollapsed = false
                    }
                }
            } else if (element.status.includes(TIMELINE_STATUS.GIT_COMMIT)) {
                deploymentData.deploymentStatusBreakdown.GIT_COMMIT.time = element.statusTime
                if (element.status === TIMELINE_STATUS.GIT_COMMIT_FAILED) {
                    deploymentData.deploymentStatusBreakdown.GIT_COMMIT.displaySubText = 'Failed'
                    deploymentData.deploymentStatusBreakdown.GIT_COMMIT.icon = 'failed'

                    deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.displaySubText = ''
                    deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.icon = 'unreachable'

                    deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.displaySubText = ''
                    deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.icon = 'unreachable'

                    deploymentData.deploymentStatusBreakdown.APP_HEALTH.displaySubText = ''
                    deploymentData.deploymentStatusBreakdown.APP_HEALTH.icon = 'unreachable'

                    deploymentData.deploymentStatusBreakdown.GIT_COMMIT.isCollapsed = false
                    deploymentData.deploymentStatus = DEPLOYMENT_STATUS.FAILED
                    deploymentData.deploymentStatusText = 'Failed'
                    deploymentData.deploymentStatusBreakdown.GIT_COMMIT.timelineStatus = element.statusDetail
                } else {
                    deploymentData.deploymentStatusBreakdown.GIT_COMMIT.icon = 'success'
                    if (deploymentData.deploymentStatus === DEPLOYMENT_STATUS.FAILED) {
                        if (deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.icon === '') {
                            deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.displaySubText = ''
                            deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.icon = 'unreachable'
                        }

                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.displaySubText = ''
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.icon = 'unreachable'

                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.displaySubText = ''
                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.icon = 'unreachable'

                        if (deploymentData.nonDeploymentError === '') {
                            deploymentData.nonDeploymentError = TIMELINE_STATUS.ARGOCD_SYNC
                        }
                    } else if (
                        deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.time === '' &&
                        deploymentData.deploymentStatus === DEPLOYMENT_STATUS.INPROGRESS
                    ) {
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.icon = ''
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.displaySubText = 'Waiting'
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.kubeList = [
                            { icon: '', message: 'Waiting to be started by Argo CD' },
                            { icon: '', message: 'Create and update resources based on manifest' },
                        ]
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.isCollapsed = false
                        deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.icon = 'inprogress'
                        deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.displaySubText = 'In progress'
                    }
                }
            } else if (element.status === TIMELINE_STATUS.DEPLOYMENT_INITIATED) {
                deploymentData.deploymentStatusBreakdown.DEPLOYMENT_INITIATED.time = element.statusTime
                if (
                    deploymentData.deploymentStatusBreakdown.GIT_COMMIT.time === '' &&
                    deploymentData.deploymentStatus === DEPLOYMENT_STATUS.INPROGRESS
                ) {
                    deploymentData.deploymentStatusBreakdown.GIT_COMMIT.icon = 'inprogress'

                    deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.icon = ''
                    deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.displaySubText = 'Waiting'

                    deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.icon = ''
                    deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.displaySubText = 'Waiting'
                    deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.kubeList = [
                        { icon: '', message: 'Waiting to be started by Argo CD' },
                        { icon: '', message: 'Create and update resources based on manifest' },
                    ]
                    deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.isCollapsed = false
                }
                if (deploymentData.deploymentStatus === DEPLOYMENT_STATUS.FAILED) {
                    if (deploymentData.deploymentStatusBreakdown.GIT_COMMIT.time === '') {
                        deploymentData.deploymentStatusBreakdown.GIT_COMMIT.displaySubText = ''
                        deploymentData.deploymentStatusBreakdown.GIT_COMMIT.icon = 'unreachable'

                        deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.displaySubText = ''
                        deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.icon = 'unreachable'

                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.displaySubText = ''
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.icon = 'unreachable'

                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.displaySubText = ''
                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.icon = 'unreachable'

                        deploymentData.nonDeploymentError = TIMELINE_STATUS.GIT_COMMIT
                    } else if (deploymentData.deploymentStatusBreakdown.GIT_COMMIT.icon !== 'failed') {
                        if (deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.time === '') {
                            deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.displaySubText = 'Unknown'
                            deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.icon = 'unknown'

                            deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.displaySubText = 'Unknown'
                            deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.icon = 'unknown'

                            deploymentData.deploymentStatusBreakdown.APP_HEALTH.displaySubText = ': Unknown'
                            deploymentData.deploymentStatusBreakdown.APP_HEALTH.icon = 'unknown'
                        } else if (deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.icon !== 'failed') {
                            deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.displaySubText = 'Unknown'
                            deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.icon = 'unknown'

                            deploymentData.deploymentStatusBreakdown.APP_HEALTH.displaySubText = ': Unknown'
                            deploymentData.deploymentStatusBreakdown.APP_HEALTH.icon = 'unknown'
                        }
                    } else {
                        deploymentData.deploymentStatusBreakdown.GIT_COMMIT.displaySubText = ''
                        deploymentData.deploymentStatusBreakdown.GIT_COMMIT.icon = 'unreachable'

                        deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.displaySubText = ''
                        deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.icon = 'unreachable'

                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.displaySubText = ''
                        deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.icon = 'unreachable'

                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.displaySubText = ''
                        deploymentData.deploymentStatusBreakdown.APP_HEALTH.icon = 'unreachable'

                        deploymentData.nonDeploymentError = TIMELINE_STATUS.GIT_COMMIT
                    }
                }
            }
        }
    } else if (!data?.timelines) {
        // data when timelines is not available in case of the previously deployed app(deployment-status/timline api) )
        if (data?.wfrStatus === 'Healthy' || data?.wfrStatus === 'Succeeded') {
            deploymentData.deploymentStatus = DEPLOYMENT_STATUS.SUCCEEDED
            deploymentData.deploymentStatusText = 'Succeeded'
            deploymentData.deploymentStatusBreakdown.APP_HEALTH.icon = 'success'
            deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.icon = 'success'
            deploymentData.deploymentStatusBreakdown.KUBECTL_APPLY.isCollapsed = true
            deploymentData.deploymentStatusBreakdown.APP_HEALTH.isCollapsed = true
            deploymentData.deploymentStatusBreakdown.ARGOCD_SYNC.icon = 'success'
            deploymentData.deploymentStatusBreakdown.GIT_COMMIT.icon = 'success'
        } else if (data?.wfrStatus === 'Failed' || data?.wfrStatus === 'Degraded') {
            deploymentData.deploymentStatus = DEPLOYMENT_STATUS.FAILED
            deploymentData.deploymentStatusText = 'Failed'
            deploymentData.deploymentStatusBreakdown.APP_HEALTH.displaySubText = 'Failed'
        } else if (data?.wfrStatus === 'Progressing') {
            deploymentData.deploymentStatus = DEPLOYMENT_STATUS.INPROGRESS
            deploymentData.deploymentStatusText = 'In progress'
        } else if (data?.wfrStatus === 'TimedOut') {
            deploymentData.deploymentStatus = DEPLOYMENT_STATUS.TIMED_OUT
            deploymentData.deploymentStatusText = 'Timed out'
        }
    }
    return deploymentData
}

export function aggregateNodes(nodes: any[], podMetadata: PodMetadatum[]): AggregatedNodes {
    const podMetadataMap = mapByKey(podMetadata, 'name')
    // group nodes
    const nodesGroup = nodes.reduce((agg, curr) => {
        agg[curr.kind] = agg[curr.kind] || new Map()
        if (curr.kind === Nodes.Pod) {
            curr.info?.forEach(({ name, value }) => {
                if (name === 'Status Reason') {
                    curr.status = value.toLowerCase()
                } else if (name === 'Containers') {
                    curr.ready = value
                }
            })
            const podMeta = podMetadataMap.has(curr.name) ? podMetadataMap.get(curr.name) : {}
            agg[curr.kind].set(curr.name, { ...curr, ...podMeta })
        } else if (curr.kind === Nodes.Service) {
            curr.url = `${curr.name}.${curr.namespace}: { portnumber }`
            agg[curr.kind].set(curr.name, curr)
        } else {
            agg[curr.kind].set(curr.name, curr)
        }
        return agg
    }, {})

    // populate parents
    return nodes.reduce(
        (agg, curr) => {
            const nodeKind = curr.kind
            const aggregator: AggregationKeys = getAggregator(nodeKind)
            agg.aggregation[aggregator] = agg.aggregation[aggregator] || {}
            agg.nodes[nodeKind] = nodesGroup[nodeKind]
            if (curr.health && curr.health.status) {
                agg.statusCount[curr.health.status] = (agg.statusCount[curr.health.status] || 0) + 1

                agg.nodeStatusCount[curr.kind] = agg.nodeStatusCount[curr.kind] || {}
                agg.nodeStatusCount[curr.kind][curr.health.status] =
                    (agg.nodeStatusCount[curr.kind][curr.health.status] || 0) + 1

                agg.aggregatorStatusCount[aggregator] = agg.aggregatorStatusCount[aggregator] || {}
                agg.aggregatorStatusCount[aggregator][curr.health.status] =
                    (agg.aggregatorStatusCount[aggregator][curr.health.status] || 0) + 1
            }
            if (Array.isArray(curr.parentRefs)) {
                curr.parentRefs.forEach(({ kind, name }) => {
                    if (nodesGroup[kind] && nodesGroup[kind].has(name)) {
                        const parentRef = nodesGroup[kind].get(name)
                        const children = parentRef.children || {}
                        children[nodeKind] = children[nodeKind] || []
                        children[nodeKind] = [...children[nodeKind], curr.name]
                        if (!agg.nodes[kind]) {
                            agg.nodes[kind] = new Map()
                        }
                        agg.nodes[kind].set(name, { ...parentRef, children })
                    }
                })
            }

            agg.aggregation[aggregator][nodeKind] = agg.nodes[nodeKind]
            return agg
        },
        { nodes: {}, aggregation: {}, statusCount: {}, nodeStatusCount: {}, aggregatorStatusCount: {} },
    )
}

const getDecodedEncodedData = (data, isEncoded: boolean = false) => {
    if (isEncoded) {
        return btoa(data)
    }
    return atob(data)
}

export const decode = (data, isEncoded: boolean = false) =>
    Object.keys(data)
        .map((m) => ({ key: m, value: data[m] ? getDecodedEncodedData(data[m], isEncoded) : data[m] }))
        .reduce((agg, curr) => {
            // eslint-disable-next-line no-param-reassign
            agg[curr.key] = curr.value
            return agg
        }, {})

export const isTimeStringAvailable = (time: string): boolean => !!time && time !== ZERO_TIME_STRING

export const getTimeDifference = ({
    startTime,
    endTime,
    fallbackString = '-',
}: GetTimeDifferenceParamsType): string => {
    if (!isTimeStringAvailable(startTime) || !isTimeStringAvailable(endTime)) {
        return fallbackString
    }

    const seconds = moment(endTime).diff(moment(startTime), 'seconds')
    const minutes = moment(endTime).diff(moment(startTime), 'minutes')
    const hours = moment(endTime).diff(moment(startTime), 'hours')

    if (seconds < 60) {
        return `${seconds}s`
    }
    if (minutes < 60) {
        return `${minutes}m ${seconds % 60}s`
    }
    const leftOverMinutes = minutes - hours * 60
    const leftOverSeconds = seconds - minutes * 60
    return `${hours}h ${leftOverMinutes}m ${leftOverSeconds}s`
}

export const getFileNameFromHeaders = (headers: Headers) =>
    headers
        ?.get('content-disposition')
        ?.split(';')
        ?.find((n) => n.includes('filename='))
        ?.replace('filename=', '')
        .trim()

export const sanitizeUserApprovalList = (
    approverList: UserApprovalInfo['approverList'],
): UserApprovalInfo['approverList'] =>
    (approverList ?? []).map(({ hasApproved, identifier, canApprove }) => ({
        canApprove: canApprove ?? false,
        hasApproved: hasApproved ?? false,
        identifier,
    }))

const sanitizeUserApprovalInfo = (userApprovalInfo: UserApprovalInfo | null): UserApprovalInfo => ({
    currentCount: userApprovalInfo?.currentCount ?? 0,
    requiredCount: userApprovalInfo?.requiredCount ?? 0,
    approverList: sanitizeUserApprovalList(userApprovalInfo?.approverList),
})

export const sanitizeApprovalConfigData = (
    approvalConfigData: ApprovalConfigDataType | null,
): ApprovalConfigDataType => ({
    kind: approvalConfigData?.kind ?? null,
    requiredCount: approvalConfigData?.requiredCount ?? 0,
    currentCount: approvalConfigData?.currentCount ?? 0,
    anyUserApprovedInfo: sanitizeUserApprovalInfo(approvalConfigData?.anyUserApprovedInfo),
    specificUsersApprovedInfo: sanitizeUserApprovalInfo(approvalConfigData?.specificUsersApprovedInfo),
    userGroupsApprovedInfo: {
        currentCount: approvalConfigData?.userGroupsApprovedInfo?.currentCount ?? 0,
        requiredCount: approvalConfigData?.userGroupsApprovedInfo?.requiredCount ?? 0,
        userGroups: (approvalConfigData?.userGroupsApprovedInfo?.userGroups ?? []).map(
            ({ groupName, groupIdentifier, ...userApprovalInfo }) => ({
                ...sanitizeUserApprovalInfo(userApprovalInfo),
                groupName,
                groupIdentifier,
            }),
        ),
    },
    isExceptionUser: approvalConfigData?.isExceptionUser ?? false,
})

/**
 * Manual approval is considered configured only if the type is not notConfigured
 */
export const getIsManualApprovalConfigured = (userApprovalConfig?: Pick<UserApprovalConfigType, 'type'>) =>
    // Added null check for backward compatibility
    !!userApprovalConfig?.type && userApprovalConfig.type !== ManualApprovalType.notConfigured

export const getIsApprovalPolicyConfigured = (approvalConfigData: ApprovalConfigDataType): boolean =>
    approvalConfigData?.requiredCount > 0

/**
 * @description - Function to open a new tab with the given url
 * @param url - url to be opened in new tab
 */
export const getHandleOpenURL = (url: string) => () => {
    window.open(url, '_blank', 'noreferrer')
}

export const getDefaultValueFromType = (value: unknown) => {
    switch (typeof value) {
        case 'number':
            return 0
        case 'string':
            return ''
        case 'object':
            if (value === null) {
                return null
            }
            return Array.isArray(value) ? [] : {}
        case 'function':
            return noop
        default:
            return null
    }
}

/**
 * Groups an array of objects by a specified key.
 *
 * This function takes an array of objects and a key, and groups the objects in the array
 * based on the value of the specified key. If an object does not have the specified key,
 * it will be grouped under the `'UNGROUPED'` key.
 *
 * @param array - The array of objects to be grouped.
 * @param key - The key of the object used to group the array.
 * @returns An object where the keys are the unique values of the specified key in the array,
 * and the values are arrays of objects that share the same key value.
 */
export const groupArrayByObjectKey = <T extends Record<string, any>, K extends keyof T>(
    array: T[],
    key: K,
): Record<string, T[]> =>
    array.reduce(
        (result, currentValue) => {
            const groupKey = currentValue[key] ?? 'UNGROUPED'

            if (!result[groupKey]) {
                Object.assign(result, { [groupKey]: [] })
            }

            result[groupKey].push(currentValue)

            return result
        },
        {} as Record<string, T[]>,
    )

/**
 * This function returns a null/zero value corresponding to @type
 *
 * @param type - a RJSF supported type
 */
export const getNullValueFromType = (type: StrictRJSFSchema['type']) => {
    if (type && Array.isArray(type) && type.length > 0) {
        return getNullValueFromType(type[0])
    }

    switch (type) {
        case 'string':
            return ''
        case 'boolean':
            return false
        case 'object':
            return {}
        case 'array':
            return []
        case 'number':
        case 'integer':
        case 'null':
        default:
            return null
    }
}

/*
 * @description - Function to get the lower case object
 * @param input - The input object
 * @returns Record<string, any>
 */
export const getLowerCaseObject = (input): Record<string, any> => {
    if (!input || typeof input !== 'object') {
        return input
    }
    return Object.keys(input).reduce((acc, key) => {
        const modifiedKey = key.toLowerCase()
        const value = input[key]
        if (value && typeof value === 'object') {
            acc[modifiedKey] = getLowerCaseObject(value)
        } else {
            acc[modifiedKey] = value
        }
        return acc
    }, {})
}

/**
 * @description - Function to get the webhook date
 * @param materialSourceType - The type of material source (e.g., WEBHOOK)
 * @param history - The history object containing commit information
 * @returns - Formatted webhook date if available, otherwise an empty string
 */
export const getWebhookDate = (materialSourceType: string, history: MaterialHistoryType): string => {
    const lowerCaseCommitInfo = getLowerCaseObject(history)
    const isWebhook = materialSourceType === SourceTypeMap.WEBHOOK || lowerCaseCommitInfo?.webhookdata?.id !== 0
    const webhookData = isWebhook ? lowerCaseCommitInfo.webhookdata : {}

    const _moment = moment(webhookData.data.date, 'YYYY-MM-DDTHH:mm:ssZ')
    return _moment.isValid() ? _moment.format(DATE_TIME_FORMATS.TWELVE_HOURS_FORMAT) : webhookData.data.date
}

export const getUniqueId = (size?: number): string => nanoid(size)

/**
 * Checks if the provided pathname matches the current path.
 * If the paths do not match, returns a custom message or a default unsaved changes prompt.
 *
 * @param currentPathName - The current path to compare against.
 * @param customMessage - Optional custom message to display when the path does not match.
 * @returns A function that takes an object with a `pathname` property and performs the path match check.
 */
export const checkIfPathIsMatching =
    (currentPathName: string, customMessage = ''): PromptProps['message'] =>
    ({ pathname }: { pathname: string }) =>
        currentPathName === pathname || customMessage || UNSAVED_CHANGES_PROMPT_MESSAGE

export const sanitizeTargetPlatforms = (
    targetPlatforms: TargetPlatformsDTO['targetPlatforms'],
): TargetPlatformItemDTO[] => {
    if (!targetPlatforms?.length) {
        return []
    }

    const filteredPlatforms = targetPlatforms
        .filter(({ name }) => !!name)
        .sort(({ name: nameA }, { name: nameB }) => stringComparatorBySortOrder(nameA, nameB))

    // They should be unique
    const uniquePlatforms: TargetPlatformItemDTO[] = []
    const platformExistenceMap: Record<string, true> = {}

    filteredPlatforms.forEach(({ name }) => {
        if (!platformExistenceMap[name]) {
            platformExistenceMap[name] = true
            uniquePlatforms.push({ name })
        }
    })

    return uniquePlatforms
}

// Should contain git-codecommit.*.amazonaws.com
export const isAWSCodeCommitURL = (url: string = ''): boolean =>
    url.includes('git-codecommit.') && url.includes('.amazonaws.com')

export const renderMaterialIcon = (url: string = '') => {
    const baseClass = 'dc__vertical-align-middle icon-dim-20 dc__no-shrink'

    if (url.includes('gitlab')) {
        return <ICGitlab className={baseClass} />
    }

    if (url.includes('github')) {
        return <ICGithub className={`${baseClass} fcn-8`} />
    }

    if (url.includes('bitbucket')) {
        return <ICBitbucket className={baseClass} />
    }

    if (isAWSCodeCommitURL(url)) {
        return <ICAWSCodeCommit className="dc__vertical-align-middle icon-dim-18" />
    }

    return <ICGit className={baseClass} />
}

const getSanitizedBorderConfig = (borderConfig: BorderConfigType = {}): BorderConfigType => {
    const { top = true, right = true, bottom = true, left = true } = borderConfig
    return { top, right, bottom, left }
}

const deriveBorderRadiusClassFromConfig = (borderRadiusConfig: BorderConfigType = {}): string => {
    const { top, right, bottom, left } = getSanitizedBorderConfig(borderRadiusConfig)
    return `${!top ? 'dc__no-top-radius' : ''} ${!right ? 'dc__no-right-radius' : ''} ${!bottom ? 'dc__no-bottom-radius' : ''} ${!left ? 'dc__no-left-radius' : ''}`
}

const deriveBorderClassFromConfig = (borderConfig: BorderConfigType = {}): string => {
    const { top, right, bottom, left } = getSanitizedBorderConfig(borderConfig)
    return `${!top ? 'dc__no-border-top-imp' : ''} ${!right ? 'dc__no-border-right-imp' : ''} ${!bottom ? 'dc__no-border-bottom-imp' : ''} ${!left ? 'dc__no-border-left-imp' : ''}`
}

export const deriveBorderRadiusAndBorderClassFromConfig = ({
    borderConfig,
    borderRadiusConfig,
}: {
    borderConfig: BorderConfigType | undefined
    borderRadiusConfig: BorderConfigType | undefined
}): string => {
    const { top, right, bottom, left } = getSanitizedBorderConfig(borderRadiusConfig)
    return `${deriveBorderClassFromConfig(borderConfig)} ${deriveBorderRadiusClassFromConfig({ top, right, bottom, left })}`
}

export const getClassNameForStickyHeaderWithShadow = (isStuck: boolean, topClassName = 'dc__top-0') =>
    `dc__position-sticky ${topClassName} dc__transition--box-shadow ${isStuck ? 'dc__box-shadow--header' : ''}`

export const clearCookieOnLogout = () => {
    document.cookie = `${TOKEN_COOKIE_NAME}=; expires=Thu, 01-Jan-1970 00:00:01 GMT;path=/`
}
