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
import { getTimeDifference } from '@Shared/Helpers'
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
import { EVENT_STREAM_EVENTS_MAP, LOGS_RETRY_COUNT, LOGS_STAGE_IDENTIFIER, POD_STATUS } from './constants'
import {
    DeploymentHistoryBaseParamsType,
    HistoryComponentType,
    LogsRendererType,
    StageDetailType,
    StageInfoDTO,
    StageStatusType,
} from './types'
import { getStageStatusIcon } from './utils'
import { ReactComponent as Info } from '../../../Assets/Icon/ic-info-filled.svg'
import { ReactComponent as HelpIcon } from '../../../Assets/Icon/ic-help.svg'
import { ReactComponent as OpenInNew } from '../../../Assets/Icon/ic-arrow-out.svg'
import { ReactComponent as ICCaretDown } from '../../../Assets/Icon/ic-caret-down.svg'
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
    const { searchKey, handleSearch } = useUrlFilters()

    // TODO: Look into code duplication
    // TODO: Handle backward compatibility
    useEffect(() => {
        if (!streamDataList?.length) {
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
                    acc[acc.length - 1].logs.push(streamItem)
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
                acc[acc.length - 1].logs.push(streamItem)
            }

            return acc
        }, [] as StageDetailType[])

        setStageList(newStageList)
    }, [JSON.stringify(streamDataList)])

    function createMarkup(log: string): {
        __html: string
    } {
        try {
            // eslint-disable-next-line no-param-reassign
            log = log.replace(/\[[.]*m/, (m) => `\x1B[${m}m`)
            const ansiUp = new AnsiUp()
            return { __html: ansiUp.ansi_to_html(log) }
        } catch (err) {
            return { __html: log }
        }
    }

    const handleSearchChange = (searchText: string) => {
        handleSearch(searchText)
    }

    const closeLogsStage = (index: number) => {
        const newLogs = structuredClone(stageList)
        newLogs[index].isOpen = false
        setStageList(newLogs)
    }

    const openLogsStage = (index: number) => {
        const newLogs = structuredClone(stageList)
        newLogs[index].isOpen = true
        setStageList(newLogs)
    }

    return triggerDetails.podStatus !== POD_STATUS.PENDING &&
        logsNotAvailable &&
        (!isBlobStorageConfigured || !triggerDetails.blobStorageEnabled) ? (
        renderConfigurationError(isBlobStorageConfigured)
    ) : (
        <div
            className="flexbox-col dc__gap-8"
            data-testid="check-logs-detail"
            style={{
                backgroundColor: '#0C1021',
            }}
        >
            <div
                className="flexbox logs-renderer__search-bar logs-renderer__filters-border-bottom"
                onKeyDown={stopPropagation}
            >
                <SearchBar
                    noBackgroundAndBorder
                    containerClassName="w-100"
                    inputProps={{
                        placeholder: 'Search logs',
                    }}
                    handleSearchChange={handleSearchChange}
                    initialSearchText={searchKey}
                />
            </div>

            <div className="flexbox-col px-12 dc__gap-8">
                {stageList.map(({ stage, isOpen, logs: stageLogs, endTime, startTime, status }, index) => (
                    <div key={stage} className="flexbox-col dc__gap-8">
                        <button
                            className="flexbox dc__transparent dc__content-space py-6 px-8 br-4 dc__align-items-center"
                            style={{
                                backgroundColor: isOpen ? '#2C3354' : '#0C1021',
                            }}
                            type="button"
                            role="tab"
                            // TODO: Make a component
                            onClick={isOpen ? () => closeLogsStage(index) : () => openLogsStage(index)}
                        >
                            <div className="flexbox dc__gap-8 dc__transparent dc__align-items-center">
                                {isOpen ? (
                                    <ICCaretDown className="icon-dim-16 dc__no-shrink" />
                                ) : (
                                    <ICCaretDown className="icon-dim-16 dc__no-shrink dc__flip-270 dc__opacity-0_5" />
                                )}

                                <div className="flexbox dc__gap-12 dc__align-items-center">
                                    {getStageStatusIcon(status)}

                                    <h3 className="m-0 cn-0 fs-13 fw-6 lh-20 dc__truncate">{stage}</h3>
                                </div>
                            </div>

                            {endTime !== ZERO_TIME_STRING && (
                                <span className="cn-0 fs-13 fw-4 lh-20">{getTimeDifference(startTime, endTime)}</span>
                            )}
                        </button>

                        {isOpen &&
                            stageLogs.map((log: string, logsIndex: number) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <div className="flex top left pl-24 dc__gap-10 lh-24" key={`logs-${logsIndex}`}>
                                    <span className="cn-4 col-2">{logsIndex + 1}</span>
                                    <p
                                        className="mono fs-14 mb-0-imp cn-0"
                                        // eslint-disable-next-line react/no-danger
                                        dangerouslySetInnerHTML={createMarkup(log)}
                                    />
                                </div>
                            ))}
                    </div>
                ))}
            </div>

            {(triggerDetails.podStatus === POD_STATUS.PENDING || (eventSource && eventSource.readyState <= 1)) && (
                <div className="flex left event-source-status">
                    <Progressing />
                </div>
            )}
        </div>
    )
}

export default LogsRenderer
