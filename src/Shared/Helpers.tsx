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
import { animate } from 'framer-motion'
import moment from 'moment'
import { nanoid } from 'nanoid'
import { Pair, parse } from 'yaml'

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
    ManualApprovalType,
    mapByKey,
    MaterialInfo,
    noop,
    PATTERNS,
    shallowEqual,
    SortingOrder,
    SourceTypeMap,
    TOKEN_COOKIE_NAME,
    URLS,
    UserApprovalConfigType,
    UserApprovalInfo,
    ZERO_TIME_STRING,
} from '../Common'
import { getAggregator } from '../Pages'
import { AggregatedNodes, PodMetadatum } from './Components'
import { CUBIC_BEZIER_CURVE, UNSAVED_CHANGES_PROMPT_MESSAGE } from './constants'
import {
    AggregationKeys,
    BorderConfigType,
    GetTimeDifferenceParamsType,
    GitTriggers,
    IntersectionChangeHandler,
    IntersectionOptions,
    Node,
    Nodes,
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

export const dateComparatorBySortOrder = (
    a: string | number | Date,
    b: string | number | Date,
    sortOrder: SortingOrder = SortingOrder.ASC,
): number => (sortOrder === SortingOrder.ASC ? moment(b).diff(moment(a)) : moment(a).diff(moment(b)))

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

    const start = moment(startTime)
    const end = moment(endTime)
    if (!start.isValid() || !end.isValid()) {
        return fallbackString
    }

    const diff = Math.abs(end.diff(start))
    const duration = moment.duration(diff)

    const units = [
        { label: 'd', value: duration.days() },
        { label: 'h', value: duration.hours() },
        { label: 'm', value: duration.minutes() },
        { label: 's', value: duration.seconds() },
    ]

    // Filter out zero values and take the first two non-zero units
    const nonZeroUnits = units.filter((unit) => unit.value > 0).slice(0, 2)

    // If all units are zero, show "0s"
    if (nonZeroUnits.length === 0) {
        return '0s'
    }

    return nonZeroUnits.map((unit) => `${unit.value}${unit.label}`).join(' ')
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

export const getAppDetailsURL = (appId: number | string, envId?: number | string): string => {
    const baseURL = `${URLS.APPLICATION_MANAGEMENT_APP}/${appId}/${URLS.APP_DETAILS}`
    if (envId) {
        return `${baseURL}/${envId}`
    }
    return baseURL
}

export const smoothScrollToTop = (scrollContainer: HTMLElement, targetPosition: number) => {
    const start = scrollContainer.scrollTop

    const controls = animate(start, targetPosition, {
        ease: CUBIC_BEZIER_CURVE,
        onUpdate: (value) => {
            scrollContainer.scrollTop = value
        },
    })

    return controls
}

export const getGroupVersionFromApiVersion = (apiVersion: string): Pick<Node, 'group' | 'version'> => {
    if (!apiVersion || apiVersion === '/') {
        return { group: '', version: '' }
    }

    const parts = apiVersion.split('/')

    if (parts.length === 1) {
        return { group: '', version: parts[0] }
    }

    if (parts.length === 2) {
        return { group: parts[0], version: parts[1] }
    }

    // If the apiVersion has more than two parts, we consider the first part as group and the rest as version
    return { group: parts[0], version: parts.slice(1).join('/') }
}

export const YAMLtoJSON = (yamlString: string) => {
    try {
        const obj = parse(yamlString)
        const jsonStr = JSON.stringify(obj)
        return jsonStr
    } catch {
        return ''
    }
}
