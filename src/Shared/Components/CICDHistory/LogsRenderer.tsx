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

import { useHistory, useParams } from 'react-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import moment from 'moment'
import AnsiUp from 'ansi_up'
import {
    Progressing,
    Host,
    useInterval,
    DOCUMENTATION,
    ROUTES,
    showError,
    SearchBar,
    useSearchString,
    UseSearchString,
} from '../../../Common'
import { EVENT_STREAM_EVENTS_MAP, LOGS_RETRY_COUNT, POD_STATUS } from './constants'
import { DeploymentHistoryBaseParamsType, HistoryComponentType, LogsRendererType } from './types'
import { DEPLOYMENT_STATUS } from '../../constants'
import { ReactComponent as Info } from '../../../Assets/Icon/ic-info-filled.svg'
import { ReactComponent as HelpIcon } from '../../../Assets/Icon/ic-help.svg'
import { ReactComponent as OpenInNew } from '../../../Assets/Icon/ic-arrow-out.svg'
import { ReactComponent as ICCaretDown } from '../../../Assets/Icon/ic-caret-down.svg'
import { ReactComponent as ICCheck } from '../../../Assets/Icon/ic-check.svg'
import { ReactComponent as ICInProgress } from '../../../Assets/Icon/ic-in-progress.svg'
import { ReactComponent as ICClose } from '../../../Assets/Icon/ic-close.svg'
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

function useCIEventSource(url: string, maxLength?: number) {
    const [dataVal, setDataVal] = useState([])
    let retryCount = LOGS_RETRY_COUNT
    const [logsNotAvailableError, setLogsNotAvailableError] = useState<boolean>(false)
    const [interval, setInterval] = useState(1000)
    const buffer = useRef([])
    const eventSourceRef = useRef(null)

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
    const [logs, eventSource, logsNotAvailable] = useCIEventSource(
        triggerDetails.podStatus && triggerDetails.podStatus !== POD_STATUS.PENDING && logsURL,
    )
    // TODO: Add type
    const [parsedLogs, setParsedLogs] = useState([])

    const history = useHistory()
    const { searchParams } = useSearchString()
    const { logsQuery } = searchParams

    // Would open all the stages containing logsQuery and close all other stages iff logsQuery is present
    // Have not mindfully changed index since need the same index to be used for setting parsedLogs
    const manipulatedParsedLogs = useMemo(() => {
        if (!logsQuery) {
            return parsedLogs
        }

        return parsedLogs.map((stage) => {
            if (stage.logs.some((log) => log.includes(logsQuery))) {
                return {
                    ...stage,
                    isOpen: true,
                }
            }

            return {
                ...stage,
                isOpen: false,
            }
        })
    }, [JSON.stringify(parsedLogs), logsQuery])

    useEffect(() => {
        // If initially parsedLogs are empty, and initialStatus is Success then would set opened as false on each
        // If initialStatus is not success and parsedLogs are empty then would set opened as false on each except the last
        if (parsedLogs.length === 0) {
            const newLogs = logs.reduce((acc, log: string, index) => {
                if (log.startsWith('STAGE_INFO')) {
                    try {
                        const stageInfo = JSON.parse(log.split('|')[1])
                        acc.push({
                            stage: stageInfo.stage,
                            startTime: stageInfo.startTime,
                            endTime: stageInfo.endTime,
                            isOpen: triggerDetails.status === 'Success' ? false : acc.length === logs.length - 1,
                            logs: [],
                        })
                        return acc
                    } catch (e) {
                        showError('Error while parsing logs stage')
                        acc.push({
                            stage: `'Error ${index}'`,
                            startTime: '',
                            endTime: '',
                            isOpen: false,
                            logs: [],
                        })
                        return acc
                    }
                }

                if (acc.length > 0) {
                    acc[acc.length - 1].logs.push(log)
                }

                return acc
            }, [])

            setParsedLogs(newLogs)
            return
        }

        // First would get the total length of logs including stage heading then would start injecting logs from above logic
        const totalLength = logs.reduce((acc, logsStage) => acc + logsStage.logs.length + 1, 0)
        const newLogs = structuredClone(parsedLogs)
        for (let i = totalLength; i < logs.length; i++) {
            if (logs[i].startsWith('STAGE_INFO')) {
                try {
                    const stageInfo = JSON.parse(logs[i].split('|')[1])
                    newLogs.push({
                        stage: stageInfo.stage,
                        startTime: stageInfo.startTime,
                        endTime: stageInfo.endTime,
                        isOpen: true,
                        logs: [],
                    })
                } catch (e) {
                    showError('Error while parsing logs stage')
                    newLogs.push({
                        stage: 'Error',
                        startTime: '',
                        endTime: '',
                        isOpen: false,
                        logs: [],
                    })
                }
            } else {
                newLogs[newLogs.length - 1].logs.push(logs[i])
            }
        }
        setParsedLogs(newLogs)
    }, [JSON.stringify(logs)])

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
        const newParams: UseSearchString['searchParams'] = {
            ...searchParams,
            logsQuery: searchText,
        }

        if (!searchText) {
            delete newParams.logsQuery
        }

        history.replace({
            search: new URLSearchParams(newParams).toString(),
        })
    }

    const renderStageStatusIcon = (isLastIndex: boolean, endTime: string) => {
        const lowerCaseStatus = triggerDetails.status.toLowerCase()
        const isDeploymentSuccessful =
            lowerCaseStatus === DEPLOYMENT_STATUS.SUCCEEDED || lowerCaseStatus === DEPLOYMENT_STATUS.HEALTHY

        if (!isLastIndex || isDeploymentSuccessful) {
            return <ICCheck className="dc__no-shrink icon-dim-16 scg-5" />
        }

        if (!endTime) {
            return <ICInProgress className="dc__no-shrink icon-dim-16 ic-in-progress-orange" />
        }

        return <ICClose className="dc__no-shrink icon-dim-16 fcr-5" />
    }

    const closeLogsStage = (index: number) => {
        const newLogs = structuredClone(parsedLogs)
        newLogs[index].isOpen = false
        setParsedLogs(newLogs)
    }

    const openLogsStage = (index: number) => {
        const newLogs = structuredClone(parsedLogs)
        newLogs[index].isOpen = true
        setParsedLogs(newLogs)
    }

    // TODO: Re-look
    const renderTimeDiff = (endTime: string, startTime: string) => {
        const seconds = moment(endTime).diff(moment(startTime), 'seconds')
        const minutes = moment(endTime).diff(moment(startTime), 'minutes') % 60
        const hours = moment(endTime).diff(moment(startTime), 'hours', true).toFixed(2)
        if (seconds < 60) {
            return `${seconds} s`
        }
        if (minutes < 60) {
            return `${minutes} m ${seconds % 60} s`
        }
        return `${hours} h ${minutes % 60} m ${seconds % 60} s`
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
            <div className="flexbox logs-renderer__search-bar logs-renderer__filters-border-bottom">
                <SearchBar
                    noBackgroundAndBorder
                    containerClassName="w-100"
                    inputProps={{
                        placeholder: 'Search logs',
                    }}
                    handleSearchChange={handleSearchChange}
                    initialSearchText={logsQuery || ''}
                />
            </div>

            <div className="flexbox-col px-12 dc__gap-8">
                {manipulatedParsedLogs.map(({ stage, isOpen, logs: stageLogs, endTime, startTime }, index) => (
                    <div key={stage} className="flexbox-col dc__gap-8">
                        <div
                            className="flexbox dc__content-space py-6 px-8 br-4"
                            style={{
                                backgroundColor: isOpen ? '#2C3354' : '#0C1021',
                            }}
                        >
                            <div className="flexbox dc__gap-8">
                                {/* TODO: Make whole row clickable */}
                                {isOpen ? (
                                    <button
                                        type="button"
                                        aria-label={`Close ${stage}`}
                                        data-testid={`close-logs-stage-${index}`}
                                        className="p-0 flex dc__no-border dc__no-background dc__outline-none-imp dc__tab-focus icon-dim-16 dc__tab-focus"
                                        onClick={() => closeLogsStage(index)}
                                    >
                                        <ICCaretDown className="icon-dim-16 dc__no-shrink" />
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        aria-label={`Open ${stage}`}
                                        data-testid={`open-logs-stage-${index}`}
                                        className="p-0 flex dc__no-border dc__no-background dc__outline-none-imp dc__tab-focus icon-dim-16 dc__tab-focus"
                                        onClick={() => openLogsStage(index)}
                                    >
                                        <ICCaretDown className="icon-dim-16 dc__no-shrink dc__flip-270 dc__opacity-0_5" />
                                    </button>
                                )}

                                <div className="flexbox dc__gap-12">
                                    {renderStageStatusIcon(index === parsedLogs.length - 1, endTime)}

                                    <h3 className="m-0 cn-0 fs-13 fw-6 lh-20 dc__truncate">{stage}</h3>
                                </div>
                            </div>

                            {endTime && (
                                <span className="cn-0 fs-13 fw-4 lh-20">{renderTimeDiff(endTime, startTime)}</span>
                            )}
                        </div>

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
