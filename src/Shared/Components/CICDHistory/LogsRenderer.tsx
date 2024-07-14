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

import { useParams } from 'react-router'
import { useEffect, useRef, useState } from 'react'
import AnsiUp from 'ansi_up'
import {
    Progressing,
    Host,
    useInterval,
    DOCUMENTATION,
    ROUTES,
    showError,
    SearchBar,
    ZERO_TIME_STRING,
    useUrlFilters,
    stopPropagation,
} from '../../../Common'
import LogStageAccordion from './LogStageAccordion'
import { EVENT_STREAM_EVENTS_MAP, LOGS_RETRY_COUNT, LOGS_STAGE_IDENTIFIER, POD_STATUS } from './constants'
import {
    DeploymentHistoryBaseParamsType,
    HistoryComponentType,
    LogsRendererType,
    StageDetailType,
    StageInfoDTO,
    StageStatusType,
} from './types'
import { ReactComponent as Info } from '../../../Assets/Icon/ic-info-filled.svg'
import { ReactComponent as HelpIcon } from '../../../Assets/Icon/ic-help.svg'
import { ReactComponent as OpenInNew } from '../../../Assets/Icon/ic-arrow-out.svg'
import './LogsRenderer.scss'

const renderLogsNotAvailable = (subtitle?: string): JSX.Element => (
    <div className="flexbox dc__content-center flex-align-center dc__height-inherit">
        <div>
            <div className="text-center">
                <Info className="icon-dim-20" />
            </div>
            <div className="text-center cn-0 fs-14 fw-6">Logs not available</div>
            <div className="text-center cn-0 fs-13 fw-4">
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
            <span className="fs-13 fw-4 mr-8 ml-8">Want to store logs to view later?</span>
            <a
                className="fs-13 fw-6 cb-5 dc__no-decor"
                href={DOCUMENTATION.BLOB_STORAGE}
                target="_blank"
                rel="noreferrer"
            >
                Configure blob storage
            </a>
            <OpenInNew className="icon-dim-20 ml-8" />
        </div>
    </>
)

const renderConfigurationError = (isBlobStorageConfigured: boolean): JSX.Element => (
    <div className="flexbox dc__content-center flex-align-center dc__height-inherit">
        {!isBlobStorageConfigured ? renderBlobNotConfigured() : renderLogsNotAvailable()}
    </div>
)

const useCIEventSource = (url: string, maxLength?: number): [string[], EventSource, boolean] => {
    const [dataVal, setDataVal] = useState([])
    let retryCount = LOGS_RETRY_COUNT
    const [logsNotAvailableError, setLogsNotAvailableError] = useState<boolean>(false)
    const [interval, setInterval] = useState(1000)
    const buffer = useRef([])
    const eventSourceRef = useRef<EventSource>(null)

    function populateData() {
        setDataVal((data) => [...data, ...buffer.current])
        buffer.current = []
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
        setDataVal((data) => [...data, ...buffer.current])
        buffer.current = []
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

export const LogsRenderer = ({
    triggerDetails,
    isBlobStorageConfigured,
    parentType,
}: LogsRendererType): JSX.Element => {
    const { pipelineId, envId, appId } = useParams<DeploymentHistoryBaseParamsType>()
    const logsURL =
        parentType === HistoryComponentType.CI
            ? `${Host}/${ROUTES.CI_CONFIG_GET}/${pipelineId}/workflow/${triggerDetails.id}/logs`
            : `${Host}/${ROUTES.CD_MATERIAL_GET}/workflow/logs/${appId}/${envId}/${pipelineId}/${triggerDetails.id}`
    const [streamDataList, eventSource, logsNotAvailable] = useCIEventSource(
        triggerDetails.podStatus && triggerDetails.podStatus !== POD_STATUS.PENDING && logsURL,
    )
    const [stageList, setStageList] = useState<StageDetailType[]>([])
    // State for logs list in case no stages are available
    const [logsList, setLogsList] = useState<string[]>([])
    const { searchKey, handleSearch } = useUrlFilters()

    const areStagesAvailable = streamDataList?.[0]?.startsWith(LOGS_STAGE_IDENTIFIER)

    function createMarkup(log: string): {
        __html: string
        isSearchKeyPresent: boolean
    } {
        let isSearchKeyPresent = false
        try {
            // eslint-disable-next-line no-param-reassign
            log = log.replace(/\[[.]*m/, (m) => `\x1B[${m}m`)

            if (searchKey && areStagesAvailable) {
                // Disallowing this rule since ansi specifically works with escape characters
                // eslint-disable-next-line no-control-regex
                const ansiRegex = /\x1B\[.*?m/g

                const logParts = log.split(ansiRegex)
                const availableEscapeCodes = log.match(ansiRegex)
                const parts = logParts.reduce((acc, part, index) => {
                    try {
                        acc.push(
                            part.replace(
                                new RegExp(searchKey, 'g'),
                                `\x1B[48;2;197;141;54m${searchKey}\x1B[0m${index > 0 ? availableEscapeCodes[index - 1] : ''}`,
                            ),
                        )
                        if (part.includes(searchKey)) {
                            isSearchKeyPresent = true
                        }
                    } catch (searchRegexError) {
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
            return { __html: ansiUp.ansi_to_html(log), isSearchKeyPresent }
        } catch (err) {
            return { __html: log, isSearchKeyPresent }
        }
    }

    // TODO: Look into code duplication later
    useEffect(() => {
        if (!streamDataList?.length) {
            return
        }

        if (!areStagesAvailable) {
            const newLogs = streamDataList.map((logItem) => createMarkup(logItem).__html)
            setLogsList(newLogs)
            return
        }

        // If initially parsedLogs are empty, and initialStatus is Success then would set opened as false on each
        // If initialStatus is not success and initial parsedLogs are empty then would set opened as false on each except the last
        if (stageList.length === 0) {
            const newStageList: StageDetailType[] = streamDataList.reduce((acc, streamItem: string, index) => {
                if (streamItem.startsWith(LOGS_STAGE_IDENTIFIER)) {
                    try {
                        const { stage, startTime, endTime, status }: StageInfoDTO = JSON.parse(streamItem.split('|')[1])
                        const existingStage = acc.find((item) => item.stage === stage && item.startTime === startTime)
                        if (existingStage) {
                            // Would update the existing stage with new endTime
                            existingStage.endTime = endTime
                            existingStage.status = status
                        } else {
                            acc.push({
                                stage: stage || `Untitled stage ${index + 1}`,
                                startTime: startTime || ZERO_TIME_STRING,
                                endTime: endTime || ZERO_TIME_STRING,
                                isOpen:
                                    status === StageStatusType.SUCCESS
                                        ? false
                                        : acc.length === streamDataList.length - 1,
                                logs: [],
                                status,
                            })
                        }
                        return acc
                    } catch (e) {
                        showError('Error while parsing logs stage')
                        acc.push({
                            stage: `Error ${index}`,
                            startTime: ZERO_TIME_STRING,
                            endTime: ZERO_TIME_STRING,
                            isOpen: false,
                            logs: [],
                            status: StageStatusType.FAILURE,
                        })
                        return acc
                    }
                }

                // Ideally in case of parallel build should receive stage name with logs
                // NOTE: For now would always append log to last stage, can show a loader on stage tiles till processed
                if (acc.length > 0) {
                    const { __html, isSearchKeyPresent } = createMarkup(streamItem)

                    acc[acc.length - 1].logs.push(__html)
                    if (isSearchKeyPresent) {
                        acc[acc.length - 1].isOpen = true
                    }
                }

                return acc
            }, [] as StageDetailType[])

            setStageList(newStageList)
            return
        }

        const newStageList = streamDataList.reduce((acc, streamItem: string, index) => {
            if (streamItem.startsWith(LOGS_STAGE_IDENTIFIER)) {
                try {
                    const { stage, startTime, endTime, status }: StageInfoDTO = JSON.parse(streamItem.split('|')[1])
                    const existingStage = acc.find((item) => item.stage === stage && item.startTime === startTime)
                    const previousExistingStage = stageList.find(
                        (item) => item.stage === stage && item.startTime === startTime,
                    )

                    if (existingStage) {
                        // Would update the existing stage with new endTime
                        existingStage.endTime = endTime
                        existingStage.status = status
                    } else {
                        acc.push({
                            stage: stage || `Untitled stage ${index + 1}`,
                            startTime: startTime || ZERO_TIME_STRING,
                            endTime: endTime || ZERO_TIME_STRING,
                            isOpen: previousExistingStage ? previousExistingStage.isOpen : true,
                            logs: [],
                            status,
                        })
                    }
                    return acc
                } catch (e) {
                    showError('Error while parsing logs stage')
                    acc.push({
                        stage: `Error ${index}`,
                        startTime: ZERO_TIME_STRING,
                        endTime: ZERO_TIME_STRING,
                        isOpen: false,
                        logs: [],
                        status: StageStatusType.FAILURE,
                    })
                    return acc
                }
            }

            // Ideally in case of parallel build should receive stage name with logs
            // NOTE: For now would always append log to last stage, can show a loader on stage tiles till processed
            if (acc.length > 0) {
                const { __html, isSearchKeyPresent } = createMarkup(streamItem)
                acc[acc.length - 1].logs.push(__html)
                if (isSearchKeyPresent) {
                    acc[acc.length - 1].isOpen = true
                }
            }

            return acc
        }, [] as StageDetailType[])

        setStageList(newStageList)
    }, [JSON.stringify(streamDataList), searchKey])

    const handleSearchEnter = (searchText: string) => {
        handleSearch(searchText)
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

    const areEventsProgressing =
        triggerDetails.podStatus === POD_STATUS.PENDING || (eventSource && eventSource.readyState <= 1)

    const renderLogs = () => {
        if (areStagesAvailable) {
            return (
                <div
                    className="flexbox-col dc__gap-8"
                    data-testid="check-logs-detail"
                    style={{
                        backgroundColor: '#0C1021',
                    }}
                >
                    <div
                        className="flexbox pl-12 logs-renderer__search-bar logs-renderer__filters-border-bottom dc__position-sticky dc__top-0 dc__zi-1"
                        onKeyDown={stopPropagation}
                        style={{
                            backgroundColor: '#0C1021',
                        }}
                    >
                        <SearchBar
                            noBackgroundAndBorder
                            containerClassName="w-100"
                            inputProps={{
                                placeholder: 'Search logs',
                            }}
                            handleEnter={handleSearchEnter}
                            initialSearchText={searchKey}
                        />
                    </div>

                    <div className="flexbox-col px-12 dc__gap-8">
                        {stageList.map(({ stage, isOpen, logs, endTime, startTime, status }, index) => (
                            <LogStageAccordion
                                key={`${stage}-${startTime}-log-stage-accordion`}
                                stage={stage}
                                isOpen={isOpen}
                                logs={logs}
                                endTime={endTime}
                                startTime={startTime}
                                status={status}
                                handleStageClose={handleStageClose}
                                handleStageOpen={handleStageOpen}
                                accordionIndex={index}
                            />
                        ))}
                    </div>

                    {areEventsProgressing && (
                        <div className="flex left event-source-status pl-24">
                            <Progressing />
                        </div>
                    )}
                </div>
            )
        }

        // Having a fallback for logs that already stored in blob storage
        return (
            <div className="logs__body" data-testid="check-logs-detail">
                {logsList.map((log: string, index: number) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <div className="flex top left mb-10 lh-24" key={`logs-${index}`}>
                        <span className="cn-4 col-2 pr-10">{index + 1}</span>
                        {/* eslint-disable-next-line react/no-danger */}
                        <p
                            className="mono fs-14 mb-0-imp"
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={{
                                __html: log,
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

    return triggerDetails.podStatus !== POD_STATUS.PENDING &&
        logsNotAvailable &&
        (!isBlobStorageConfigured || !triggerDetails.blobStorageEnabled)
        ? renderConfigurationError(isBlobStorageConfigured)
        : renderLogs()
}

export default LogsRenderer
