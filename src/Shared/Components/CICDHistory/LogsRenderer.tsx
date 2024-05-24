import { useParams } from 'react-router'
import { useEffect, useRef, useState } from 'react'
import AnsiUp from 'ansi_up'
import { Progressing, Host, useInterval, DOCUMENTATION, ROUTES } from '../../../Common'
import { DeploymentHistoryBaseParamsType, HistoryComponentType, LogsRendererType } from './types'
import { ReactComponent as Info } from '../../../Assets/Icon/ic-info-filled.svg'
import { ReactComponent as HelpIcon } from '../../../Assets/Icon/ic-help.svg'
import { ReactComponent as OpenInNew } from '../../../Assets/Icon/ic-arrow-out.svg'
import { EVENT_STREAM_EVENTS_MAP, LOGS_RETRY_COUNT, POD_STATUS } from './constants'

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

    return triggerDetails.podStatus !== POD_STATUS.PENDING &&
        logsNotAvailable &&
        (!isBlobStorageConfigured || !triggerDetails.blobStorageEnabled) ? (
        renderConfigurationError(isBlobStorageConfigured)
    ) : (
        <div className="logs__body" data-testid="check-logs-detail">
            {logs.map((log: string, index: number) => (
                // eslint-disable-next-line react/no-array-index-key
                <div className="flex top left mb-10 lh-24" key={`logs-${index}`}>
                    <span className="cn-4 col-2 pr-10">{index + 1}</span>
                    {/* eslint-disable-next-line react/no-danger */}
                    <p className="mono fs-14 mb-0-imp" dangerouslySetInnerHTML={createMarkup(log)} />
                </div>
            ))}
            {(triggerDetails.podStatus === POD_STATUS.PENDING || (eventSource && eventSource.readyState <= 1)) && (
                <div className="flex left event-source-status">
                    <Progressing />
                </div>
            )}
        </div>
    )
}

export default LogsRenderer
