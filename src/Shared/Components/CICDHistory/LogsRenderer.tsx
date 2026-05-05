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

import { type JSX, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { defaultRangeExtractor, useVirtualizer } from '@tanstack/react-virtual'
import { AnsiUp } from 'ansi_up'
import DOMPurify from 'dompurify'

import ICArrow from '@Icons/ic-caret-down.svg?react'
import ICCollapseAll from '@Icons/ic-collapse-all.svg?react'
import ICExpandAll from '@Icons/ic-expand-all.svg?react'
import { ANSI_UP_REGEX, ComponentSizeType } from '@Shared/constants'
import { escapeRegExp, sanitizeTargetPlatforms } from '@Shared/Helpers'
import { AppThemeType, getComponentSpecificThemeClass } from '@Shared/Providers'

import OpenInNew from '../../../Assets/Icon/ic-arrow-out.svg?react'
import HelpIcon from '../../../Assets/Icon/ic-help.svg?react'
import Info from '../../../Assets/Icon/ic-info-filled.svg?react'
import {
    Host,
    Progressing,
    ROUTES,
    SearchBar,
    Tooltip,
    useInterval,
    useRegisterShortcut,
    useUrlFilters,
} from '../../../Common'
import { DocLink } from '../DocLink'
import {
    EVENT_STREAM_EVENTS_MAP,
    LOGS_RETRY_COUNT,
    LOGS_STAGE_IDENTIFIER,
    LOGS_STAGE_STREAM_SEPARATOR,
    POD_STATUS,
} from './constants'
import LogStageHeader from './LogStageHeader'
import {
    CreateMarkupPropsType,
    CreateMarkupReturnType,
    DeploymentHistoryBaseParamsType,
    HistoryComponentType,
    LogsRendererType,
    LogVirtualItem,
    StageDetailType,
    StageInfoDTO,
    StageStatusType,
} from './types'
import { findScrollableAncestor, getLogSearchIndex } from './utils'

import './LogsRenderer.scss'

const renderLogsNotAvailable = (subtitle?: string): JSX.Element => (
    <div className="flexbox dc__content-center flex-align-center dc__height-inherit">
        <div>
            <div className="text-center">
                <Info className="icon-dim-20" />
            </div>
            <div className="text-center text__white fs-14 fw-6">Logs not available</div>
            <div className="text-center text__white fs-13 fw-4">
                {subtitle || 'Blob storage was not configured at pipeline run.'}
            </div>
        </div>
    </div>
)

const renderBlobNotConfigured = (): JSX.Element => (
    <>
        {renderLogsNotAvailable('Logs are available only at runtime.')}
        <div className="flexbox configure-blob-container pt-8 pr-12 pb-8 pl-12 bcv-1 br-4">
            <HelpIcon className="icon-dim-20 fcv-5" />
            <span className="fs-13 fw-4 mr-8 ml-8 text__white">Want to store logs to view later?</span>

            <DocLink docLinkKey="BLOB_STORAGE" text="Configure blob storage" dataTestId="configure-blob-storage" />
            <OpenInNew className="icon-dim-20 ml-8" />
        </div>
    </>
)

const renderConfigurationError = (isBlobStorageConfigured: boolean): JSX.Element => (
    <div className="flexbox dc__content-center flex-grow-1 flex-align-center dc__height-inherit dark-background">
        {!isBlobStorageConfigured ? renderBlobNotConfigured() : renderLogsNotAvailable()}
    </div>
)

const useCIEventSource = (url: string, maxLength?: number): [string[], EventSource, boolean] => {
    const [dataVal, setDataVal] = useState([])
    let retryCount = LOGS_RETRY_COUNT
    const [logsNotAvailableError, setLogsNotAvailableError] = useState<boolean>(false)
    const [interval, setInterval] = useState(1000)
    const buffer = useRef([])
    const eventSourceRef = useRef<EventSource | null>(null)

    function populateData() {
        const bufferedData = buffer.current
        buffer.current = []
        setDataVal((data) => [...data, ...bufferedData])
    }

    useInterval(populateData, interval)

    function closeEventSource() {
        if (eventSourceRef.current && eventSourceRef.current.close) {
            eventSourceRef.current.close()
        }
    }

    function handleMessage(event) {
        if (event.type === 'message') {
            retryCount = LOGS_RETRY_COUNT
            buffer.current.push(event.data)
        }
    }

    function handleStreamStart() {
        retryCount = LOGS_RETRY_COUNT
        buffer.current = []
        setDataVal([])
    }

    function handleStreamEnd() {
        retryCount = LOGS_RETRY_COUNT
        const bufferedData = buffer.current
        buffer.current = []
        setDataVal((data) => [...data, ...bufferedData])
        eventSourceRef.current.close()
        setInterval(null)
    }

    function getData() {
        buffer.current = []
        eventSourceRef.current = new EventSource(url, { withCredentials: true })
        eventSourceRef.current.addEventListener(EVENT_STREAM_EVENTS_MAP.MESSAGE, handleMessage)
        eventSourceRef.current.addEventListener(EVENT_STREAM_EVENTS_MAP.START_OF_STREAM, handleStreamStart)
        eventSourceRef.current.addEventListener(EVENT_STREAM_EVENTS_MAP.END_OF_STREAM, handleStreamEnd)
        // eslint-disable-next-line no-use-before-define
        eventSourceRef.current.addEventListener(EVENT_STREAM_EVENTS_MAP.ERROR, handleError)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function handleError(error: any) {
        retryCount -= 1
        if (eventSourceRef.current) {
            eventSourceRef.current.close()
        }
        if (retryCount > 0) {
            getData()
        } else {
            setLogsNotAvailableError(true)
            setInterval(null)
        }
    }

    useEffect(() => {
        if (url) {
            getData()
        }
        return closeEventSource
    }, [url, maxLength])

    return [dataVal, eventSourceRef.current, logsNotAvailableError]
}

const STAGE_OVERHEAD_HEIGHT = 36
// lh-20(20) + paddingBottom(4)
const LOG_HEIGHT = 24
const OVERSCAN_COUNT = 50

const LogLine = ({ log, logIndex }: { log: string; logIndex: number }) => (
    <div className="display-grid dc__column-gap-10 dc__align-start logs-renderer__log-item">
        <span className="cn-5 col-2 lh-20 dc__text-align-end dc__word-break mono fs-14 dc__user-select-none">
            {logIndex + 1}
        </span>
        <pre
            className="mono fs-14 mb-0-imp text__white dc__word-break lh-20 dc__unset-pre dc__transparent--imp"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(log) }}
        />
    </div>
)

const LogsRenderer = ({ triggerDetails, isBlobStorageConfigured, parentType, fullScreenView }: LogsRendererType) => {
    const { pipelineId, envId, appId } = useParams<DeploymentHistoryBaseParamsType>()
    const logsRendererRef = useRef<HTMLDivElement | null>(null)
    const listContainerRef = useRef<HTMLDivElement | null>(null)
    const scrollElementRef = useRef<HTMLElement | null>(null)
    const [scrollMargin, setScrollMargin] = useState(0)
    const [scrollTrigger, setScrollTrigger] = useState(false)

    const logsURL =
        parentType === HistoryComponentType.CI
            ? `${Host}/${ROUTES.CI_CONFIG_GET}/${pipelineId}/workflow/${triggerDetails.id}/logs`
            : `${Host}/${ROUTES.CD_MATERIAL_GET}/workflow/logs/${appId}/${envId}/${pipelineId}/${triggerDetails.id}`
    const [streamDataList, eventSource, logsNotAvailable] = useCIEventSource(
        triggerDetails.podStatus && triggerDetails.podStatus !== POD_STATUS.PENDING && logsURL,
    )
    const [stageList, setStageList] = useState<StageDetailType[]>([])
    const [searchResults, setSearchResults] = useState<string[]>([])
    const [currentSearchIndex, setCurrentSearchIndex] = useState<number>(0)
    // State for logs list in case no stages are available
    const [logsList, setLogsList] = useState<string[]>([])
    const { searchKey, handleSearch } = useUrlFilters()

    const hasSearchResults = searchResults.length > 0

    const areAllStagesExpanded = useMemo(() => stageList.every((item) => item.isOpen), [stageList])
    const shortcutTippyText = areAllStagesExpanded ? 'Collapse all stages' : 'Expand all stages'

    const { registerShortcut, unregisterShortcut } = useRegisterShortcut()

    const areStagesAvailable = streamDataList[0]?.startsWith(LOGS_STAGE_IDENTIFIER) || false

    function createMarkup({
        log,
        currentIndex = -1,
        targetSearchKey = searchKey,
        searchMatchResults = null,
        searchIndex = '',
    }: CreateMarkupPropsType): CreateMarkupReturnType {
        let isSearchKeyPresent = false
        try {
            // eslint-disable-next-line no-param-reassign
            log = log.replace(/\[[.]*m/, (m) => `\x1B[${m}m`)

            // This piece of code, would highlight the search key in the logs
            // We will remove color through [0m and add background color of y6, till searchKey is present and then revert back to original color
            // While reverting if index is 0, would not add any escape code since it is the start of the log
            if (targetSearchKey && areStagesAvailable) {
                // Search is working on assumption that color codes are not nested for words.
                const logParts = log.split(ANSI_UP_REGEX)
                const availableEscapeCodes = log.match(ANSI_UP_REGEX) || []
                const searchRegex = new RegExp(`(${escapeRegExp(targetSearchKey)})`, 'ig')
                const parts = logParts.reduce((acc, part, index) => {
                    try {
                        // Question: Can we directly set it as true inside the replace function?
                        isSearchKeyPresent = isSearchKeyPresent || searchRegex.test(part)
                        acc.push(
                            part.replace(searchRegex, (match) => {
                                if (searchIndex) {
                                    searchMatchResults?.push(searchIndex)
                                }
                                return `\x1B[0m\x1B[48;2;${searchMatchResults && currentIndex === searchMatchResults.length - 1 ? '0;102;204' : '197;141;54'}m${match}\x1B[0m${index > 0 ? availableEscapeCodes[index - 1] : ''}`
                            }),
                        )
                    } catch {
                        acc.push(part)
                    }

                    if (index < logParts.length - 1) {
                        acc.push(availableEscapeCodes[index])
                    }
                    return acc
                }, [])
                // eslint-disable-next-line no-param-reassign
                log = parts.join('')
            }
            const ansiUp = new AnsiUp()
            return {
                __html: ansiUp.ansi_to_html(log),
                isSearchKeyPresent,
            }
        } catch {
            return { __html: log, isSearchKeyPresent }
        }
    }

    /**
     *
     * @param status - status of the stage
     * @param lastUserActionState - If true, user had opened the stage else closed the stage
     * @param isSearchKeyPresent - If search key is present in the logs of that stage
     * @param isFromSearchAction - If the action is from search action
     * @returns
     */
    const getIsStageOpen = (
        status: StageStatusType,
        lastUserActionState: boolean | undefined,
        isSearchKeyPresent: boolean,
        isFromSearchAction: boolean,
    ): boolean => {
        const isInitialState = stageList.length === 0
        const lastActionState = lastUserActionState ?? true

        // In case of search action, would open the stage if search key is present
        // If search key is not present would return the last action state, if no action taken would return true(that is stage is new or being loaded)
        if (isFromSearchAction) {
            return isSearchKeyPresent || lastActionState
        }

        if (isInitialState) {
            return status !== StageStatusType.SUCCESS || isSearchKeyPresent
        }

        return lastActionState
    }

    const areEventsProgressing =
        triggerDetails.podStatus === POD_STATUS.PENDING || !!(eventSource && eventSource.readyState <= 1)

    /**
     * If initially parsedLogs are empty, and initialStatus is Success then would set opened as false on each
     * If initialStatus is not success and initial parsedLogs are empty then would set opened as false on each except the last
     * In case data is already present we will just find user's last action else would open the stage
     */
    const getStageListFromStreamData = (currentIndex: number, targetSearchKey?: string): StageDetailType[] => {
        // Would be using this to get last user action on stage
        const previousStageMap: Readonly<Record<string, Readonly<Record<string, StageDetailType>>>> = stageList.reduce(
            (acc, stageDetails) => {
                if (!acc[stageDetails.stage]) {
                    acc[stageDetails.stage] = {}
                }
                acc[stageDetails.stage][stageDetails.startTime] = stageDetails
                return acc
            },
            {} as Record<string, Record<string, StageDetailType>>,
        )

        // Map of stage as key and value as object with key as start time and value as boolean depicting if search key is present or not
        const searchKeyStatusMap: Record<string, Record<string, boolean>> = {}

        const searchMatchResults = []

        const newStageList = streamDataList.reduce((acc, streamItem: string, index) => {
            if (streamItem.startsWith(LOGS_STAGE_IDENTIFIER)) {
                try {
                    const { stage, startTime, endTime, status, metadata }: StageInfoDTO = JSON.parse(
                        streamItem.split(LOGS_STAGE_STREAM_SEPARATOR)[1],
                    )
                    const existingStage = acc.find((item) => item.stage === stage && item.startTime === startTime)
                    const previousExistingStage = previousStageMap[stage]?.[startTime] ?? ({} as StageDetailType)

                    if (existingStage) {
                        // Would update the existing stage with new endTime
                        existingStage.endTime = endTime
                        existingStage.status = status
                        existingStage.isOpen = getIsStageOpen(
                            status,
                            previousExistingStage.isOpen,
                            !!searchKeyStatusMap[stage]?.[startTime],
                            !!targetSearchKey,
                        )
                    } else {
                        const derivedStatus: StageStatusType = areEventsProgressing
                            ? StageStatusType.PROGRESSING
                            : StageStatusType.FAILURE

                        acc.push({
                            stage: stage || `Untitled stage ${index + 1}`,
                            startTime: startTime || '',
                            endTime: endTime || '',
                            // Would be defining the state when we receive the end status, otherwise it is loading and would be open
                            isOpen: getIsStageOpen(
                                derivedStatus,
                                previousExistingStage.isOpen,
                                // Wont be present in case of start stage since no logs are present yet
                                !!searchKeyStatusMap[stage]?.[startTime],
                                !!targetSearchKey,
                            ),
                            status: derivedStatus,
                            targetPlatforms: sanitizeTargetPlatforms(metadata?.targetPlatforms),
                            logs: [],
                        })
                    }
                    return acc
                } catch {
                    // In case of error would not create
                    return acc
                }
            }

            // Ideally in case of parallel build should receive stage name with logs
            // NOTE: For now would always append log to last stage, can show a loader on stage tiles till processed
            if (acc.length > 0) {
                const lastStage = acc[acc.length - 1]

                const searchIndex = getLogSearchIndex({
                    stageIndex: acc.length - 1,
                    lineNumberInsideStage: lastStage.logs.length,
                })

                // In case targetSearchKey is not present createMarkup will internally fallback to searchKey
                const { __html, isSearchKeyPresent } = createMarkup({
                    log: streamItem,
                    currentIndex,
                    searchMatchResults,
                    targetSearchKey,
                    searchIndex,
                })

                lastStage.logs.push(__html)
                if (isSearchKeyPresent) {
                    lastStage.isOpen = getIsStageOpen(
                        lastStage.status,
                        previousStageMap[lastStage.stage]?.[lastStage.startTime]?.isOpen,
                        true,
                        !!targetSearchKey,
                    )

                    if (!searchKeyStatusMap[lastStage.stage]) {
                        searchKeyStatusMap[lastStage.stage] = {}
                    }

                    searchKeyStatusMap[lastStage.stage][lastStage.startTime] = true
                }
            }

            return acc
        }, [] as StageDetailType[])

        setSearchResults(searchMatchResults)

        return newStageList
    }

    useEffect(() => {
        if (!streamDataList?.length) {
            return
        }

        if (!areStagesAvailable) {
            const newLogs = streamDataList.map((logItem) => createMarkup({ log: logItem }).__html)
            setLogsList(newLogs)
            return
        }

        const newStageList = getStageListFromStreamData(currentSearchIndex)
        setStageList(newStageList)
        // NOTE: Not adding searchKey as dependency since on mount we would already have searchKey
        // And for other cases we would use handleSearchEnter
    }, [streamDataList, areEventsProgressing])

    const handleToggleOpenAllStages = useCallback(() => {
        setStageList((prev) =>
            prev.map((stage) => ({
                ...stage,
                isOpen: !areAllStagesExpanded,
            })),
        )
    }, [areAllStagesExpanded])

    useEffect(() => {
        registerShortcut({ callback: handleToggleOpenAllStages, keys: ['E'] })

        return () => {
            unregisterShortcut(['E'])
        }
    }, [handleToggleOpenAllStages])

    const handleCycleSearchResult = (type: 'prev' | 'next' | 'reset', searchText = searchKey) => {
        if (searchResults.length > 0 || type === 'reset') {
            let currentIndex = 0
            if (type === 'next') {
                currentIndex = (currentSearchIndex + 1) % searchResults.length
            } else if (type === 'prev') {
                currentIndex = currentSearchIndex > 0 ? currentSearchIndex - 1 : searchResults.length - 1
            }
            setCurrentSearchIndex(currentIndex)
            setScrollTrigger((prev) => !prev)
            setStageList(getStageListFromStreamData(currentIndex, searchText))
        }
    }

    const handleNextSearchResult = () => {
        handleCycleSearchResult('next')
    }

    const handlePrevSearchResult = () => {
        handleCycleSearchResult('prev')
    }

    const handleSearchEnter = (searchText: string) => {
        handleSearch(searchText)
        if (searchKey === searchText) {
            handleNextSearchResult()
        } else {
            handleCycleSearchResult('reset', searchText)
        }
    }

    const handleStageClose = (index: number) => {
        const newLogs = structuredClone(stageList)
        newLogs[index].isOpen = false
        setStageList(newLogs)
    }

    const handleStageOpen = (index: number) => {
        const newLogs = structuredClone(stageList)
        newLogs[index].isOpen = true
        setStageList(newLogs)
    }

    /**
     * Flattens stageList into a single ordered array for the virtualizer.
     * Each stage contributes one 'header' item, followed by one 'log' item per line (only when open).
     *
     * headerFlatIndexSet  — Set of flat-array positions that hold a header.
     *                       Used by rangeExtractor to always keep the active sticky header rendered.
     *
     * stageIndexToHeaderFlatIndex — Maps stageIndex → that stage's position in flatItems.
     *                               Used to scroll to the correct log line when navigating search results.
     */
    const { flatItems, headerFlatIndexSet, stageIndexToHeaderFlatIndex } = useMemo(() => {
        const items: LogVirtualItem[] = []
        const headerIndexSet = new Set<number>()
        const headerMap = new Map<number, number>()

        stageList.forEach((stage, stageIndex) => {
            const headerFlatIdx = items.length
            items.push({ type: 'header', stageIndex })
            headerIndexSet.add(headerFlatIdx)
            headerMap.set(stageIndex, headerFlatIdx)

            if (stage.isOpen) {
                stage.logs.forEach((_, logIndex) => {
                    items.push({ type: 'log', stageIndex, logIndex })
                })
            }
        })

        return { flatItems: items, headerFlatIndexSet: headerIndexSet, stageIndexToHeaderFlatIndex: headerMap }
    }, [stageList])

    // Find the scrollable ancestor once and measure the list container's offset within it.
    // This is needed because the scroll container is a div (not window), so we use useVirtualizer
    // with a custom getScrollElement, and scrollMargin = distance from scroll container top to list top.
    useLayoutEffect(() => {
        if (!listContainerRef.current) {
            return
        }
        const scrollEl = findScrollableAncestor(listContainerRef.current)
        scrollElementRef.current = scrollEl
        if (scrollEl) {
            const listRect = listContainerRef.current.getBoundingClientRect()
            const containerRect = scrollEl.getBoundingClientRect()
            setScrollMargin(listRect.top - containerRect.top + scrollEl.scrollTop)
        }
    }, [areStagesAvailable, fullScreenView])

    const estimateSize = useCallback(
        (index: number) => {
            const item = flatItems[index]
            if (!item) {
                return LOG_HEIGHT
            }
            return item.type === 'header' ? STAGE_OVERHEAD_HEIGHT : LOG_HEIGHT
        },
        [flatItems],
    )

    const getItemKey = useCallback(
        (index: number) => {
            const item = flatItems[index]
            if (!item) {
                return `item-${index}`
            }
            return item.type === 'header' ? `header-${item.stageIndex}` : `log-${item.stageIndex}-${item.logIndex}`
        },
        [flatItems],
    )

    /**
     * Extends TanStack's default visible range to always include the active sticky header —
     * the last header whose flat index is <= the first visible row. Without this, the virtualizer
     * would unmount that header as the user scrolls past it, breaking the sticky effect.
     */
    const rangeExtractor = useCallback(
        (range: { startIndex: number; endIndex: number; overscan: number; count: number }) => {
            const base = defaultRangeExtractor(range)
            // NOTE: This can also be a binary search since headerFlatIndexSet is sorted, but in practice the number of stages (headers) is small so it doesn't matter
            const activeStickyIdx = Array.from(headerFlatIndexSet).reduce(
                (last, idx) => (idx <= range.startIndex ? idx : last),
                -1,
            )
            if (activeStickyIdx === -1) {
                return base
            }
            const next = new Set(base)
            next.add(activeStickyIdx)
            return Array.from(next).sort((a, b) => a - b)
        },
        [headerFlatIndexSet],
    )

    const virtualizer = useVirtualizer({
        count: flatItems.length,
        estimateSize,
        overscan: OVERSCAN_COUNT,
        scrollMargin,
        getScrollElement: () => scrollElementRef.current,
        getItemKey,
        rangeExtractor,
    })

    /**
     * Scrolls to the active search result whenever the user navigates matches.
     * scrollTrigger toggles on every navigation so cycling back to the same
     * result index still re-triggers the effect.
     *
     * targetSearchIdx encodes the match as "<stageIndex>-<logIndexInsideStage>".
     * We look up the stage's header flat index, then offset by 1 (skip the header)
     * plus the log's position within the stage to get its absolute flat index.
     */
    useEffect(() => {
        const targetSearchIdx = searchResults[currentSearchIndex]
        if (!targetSearchIdx || !areStagesAvailable) {
            return
        }

        const [stageIdxStr, logIdxStr] = targetSearchIdx.split('-')
        const headerFlatIdx = stageIndexToHeaderFlatIndex.get(Number(stageIdxStr))

        if (headerFlatIdx === undefined) {
            return
        }

        virtualizer.scrollToIndex(headerFlatIdx + 1 + Number(logIdxStr), { align: 'center', behavior: 'smooth' })
    }, [currentSearchIndex, scrollTrigger])

    const renderVirtualLogs = () => {
        const stickyTop = fullScreenView ? 44 : 80
        const scrollTop = scrollElementRef.current?.scrollTop ?? 0
        const virtualItems = virtualizer.getVirtualItems()

        // vItem.start already includes scrollMargin (TanStack adds it), so
        // vItem.start - scrollTop = item's viewport position from the scroll container top.
        //
        // Active sticky = last header whose viewport position has gone above stickyTop.
        // Next sticky   = first header below stickyTop after the active one.
        //
        // We track nextStickyFlatIdx so the active sticky can be pushed upward as the next
        // header slides in — preventing both headers from being visible at the top simultaneously.
        let activeStickyFlatIdx = -1
        let nextStickyFlatIdx = -1
        const vItemByIndex = new Map<number, (typeof virtualItems)[number]>()

        virtualItems.forEach((vItem) => {
            vItemByIndex.set(vItem.index, vItem)
            if (flatItems[vItem.index]?.type !== 'header') {
                return
            }
            const viewportTop = vItem.start - scrollTop
            if (viewportTop < stickyTop) {
                activeStickyFlatIdx = vItem.index
                nextStickyFlatIdx = -1 // reset each time a newer active is found
            } else if (nextStickyFlatIdx === -1) {
                nextStickyFlatIdx = vItem.index
            }
        })

        return virtualItems.map((virtualItem) => {
            const item = flatItems[virtualItem.index]
            if (!item) {
                return null
            }

            const isActiveSticky = virtualItem.index === activeStickyFlatIdx

            // Push-up: reduce the sticky top offset as the next header enters the sticky zone,
            // so the active header slides off the top at the same rate the next one arrives.
            let computedStickyTop = stickyTop
            if (isActiveSticky && nextStickyFlatIdx !== -1) {
                const activeHeight = vItemByIndex.get(activeStickyFlatIdx)?.size ?? STAGE_OVERHEAD_HEIGHT
                const nextViewportTop = (vItemByIndex.get(nextStickyFlatIdx)?.start ?? Infinity) - scrollTop
                computedStickyTop = stickyTop - Math.max(0, stickyTop + activeHeight - nextViewportTop)
            }

            const baseStyle: React.CSSProperties = isActiveSticky
                ? {
                      position: 'sticky',
                      top: computedStickyTop,
                      zIndex: 1,
                      width: '100%',
                      paddingLeft: 12,
                      paddingRight: 12,
                  }
                : {
                      position: 'absolute',
                      top: 0,
                      width: '100%',
                      // item.start includes scrollMargin; subtract to get container-relative position
                      transform: `translateY(${virtualItem.start - scrollMargin}px)`,
                      paddingLeft: 12,
                      paddingRight: 12,
                  }

            if (item.type === 'header') {
                return (
                    <div
                        key={virtualItem.key as React.Key}
                        data-index={virtualItem.index}
                        ref={virtualizer.measureElement}
                        style={{
                            ...baseStyle,
                            paddingBottom: 0,
                        }}
                    >
                        <LogStageHeader
                            {...stageList[item.stageIndex]}
                            stageIndex={item.stageIndex}
                            fullScreenView={fullScreenView}
                            handleStageClose={handleStageClose}
                            handleStageOpen={handleStageOpen}
                            logsRendererRef={logsRendererRef}
                            applySticky={false}
                        />
                    </div>
                )
            }

            return (
                <div
                    key={virtualItem.key as React.Key}
                    data-index={virtualItem.index}
                    ref={virtualizer.measureElement}
                    style={{ ...baseStyle, paddingBottom: 4 }}
                >
                    <LogLine log={stageList[item.stageIndex].logs[item.logIndex]} logIndex={item.logIndex} />
                </div>
            )
        })
    }

    const renderLogs = () => {
        if (areStagesAvailable) {
            return (
                <div
                    className="flexbox-col pb-20 logs-renderer-container flex-grow-1"
                    data-testid="check-logs-detail"
                    style={{
                        backgroundColor: 'var(--terminal-bg)',
                    }}
                >
                    <div
                        className={`flexbox-col pb-7 dc__position-sticky dc__zi-2 ${fullScreenView ? 'dc__top-0' : 'dc__top-36'}`}
                        style={{
                            backgroundColor: 'var(--terminal-bg)',
                        }}
                    >
                        <div className="flexbox logs-renderer__search-bar logs-renderer__filters-border-bottom pl-12">
                            <SearchBar
                                noBackgroundAndBorder
                                containerClassName="w-100"
                                inputProps={{
                                    placeholder: 'Search logs',
                                }}
                                handleEnter={handleSearchEnter}
                                initialSearchText={searchKey}
                                size={ComponentSizeType.large}
                            />
                            {!!searchKey && (
                                <div className="flexbox px-10 py-6 dc__gap-8 dc__align-items-center">
                                    <span className="fs-13 fw-4 lh-20 text__white">
                                        {hasSearchResults ? currentSearchIndex + 1 : 0}/{searchResults.length}
                                        &nbsp;results
                                    </span>
                                    <div className="flexbox dc__gap-4">
                                        <button
                                            type="button"
                                            className={`dc__unset-button-styles flex p-6 br-4 dc__bg-n0--opacity-0_2 ${!hasSearchResults ? 'dc__disabled' : ''}`}
                                            onClick={handlePrevSearchResult}
                                            data-testid="logs-previous-search-match"
                                            aria-label="Focus the previous search result match"
                                            disabled={!hasSearchResults}
                                        >
                                            <ICArrow className="icon-stroke__white dc__flip-180 icon-dim-14 dc__no-shrink" />
                                        </button>
                                        <button
                                            type="button"
                                            className={`dc__unset-button-styles flex p-6 br-4 dc__bg-n0--opacity-0_2 ${!hasSearchResults ? 'dc__disabled' : ''}`}
                                            onClick={handleNextSearchResult}
                                            data-testid="logs-next-search-match"
                                            aria-label="Focus the next search result match"
                                            disabled={!hasSearchResults}
                                        >
                                            <ICArrow className="icon-stroke__white icon-dim-14 dc__no-shrink" />
                                        </button>
                                    </div>
                                </div>
                            )}
                            <Tooltip
                                shortcutKeyCombo={{
                                    text: shortcutTippyText,
                                    combo: ['E'] as const,
                                }}
                                className="dc__mxw-500"
                                placement="left"
                            >
                                <button
                                    type="button"
                                    className="dc__unset-button-styles px-10 flex dc__bg-n0--opacity-0_2"
                                    onClick={handleToggleOpenAllStages}
                                    aria-label={shortcutTippyText}
                                >
                                    {areAllStagesExpanded ? (
                                        <ICCollapseAll className="icon-dim-16 dc__no-shrink dc__transition--transform icon-stroke__white" />
                                    ) : (
                                        <ICExpandAll className="icon-dim-16 dc__no-shrink dc__transition--transform icon-stroke__white" />
                                    )}
                                </button>
                            </Tooltip>
                        </div>
                    </div>

                    <div
                        ref={listContainerRef}
                        style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative', width: '100%' }}
                    >
                        {renderVirtualLogs()}
                    </div>
                    {areEventsProgressing && (
                        <div className="px-12">
                            <div className="display-grid dc__column-gap-10 dc__align-start logs-renderer__log-item">
                                <span />
                                <div className="dc__loading-dots text__white" />
                            </div>
                        </div>
                    )}
                </div>
            )
        }

        // Having a fallback for logs that already stored in blob storage
        return (
            <div className="logs__body dark-background flex-grow-1" data-testid="check-logs-detail">
                {logsList.map((log: string, index: number) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <div className="flex top left mb-10 lh-24" key={`logs-${index}`}>
                        <span className="cn-4 col-2 pr-10">{index + 1}</span>
                        {/* eslint-disable-next-line react/no-danger */}
                        <p
                            className="mono fs-14 mb-0-imp"
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(log),
                            }}
                        />
                    </div>
                ))}

                {areEventsProgressing && (
                    <div className="flex left event-source-status">
                        <Progressing />
                    </div>
                )}
            </div>
        )
    }

    return (
        <div
            className={`flexbox-col flex-grow-1 ${getComponentSpecificThemeClass(AppThemeType.dark)}`}
            ref={logsRendererRef}
        >
            {triggerDetails.podStatus !== POD_STATUS.PENDING &&
            logsNotAvailable &&
            (!isBlobStorageConfigured || !triggerDetails.blobStorageEnabled)
                ? renderConfigurationError(isBlobStorageConfigured)
                : renderLogs()}
        </div>
    )
}

export default LogsRenderer
