import { showError } from '@Common/Helper'
import { ToastBody } from '@Common/ToastBody'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { API_STATUS_CODES } from '@Common/Constants'
import { ServerErrors } from '@Common/ServerError'
import { getFileNameFromHeaders } from '@Shared/Helpers'
import { getDownloadResponse } from './service'
import { HandleDownloadProps } from './types'

const useDownload = () => {
    const [isDownloading, setIsDownloading] = useState<boolean>(false)
    const [progress, setProgress] = useState<number>(null)

    const getChunksDataFromResponse = async (response: Response) => {
        const contentLength = +response.headers.get('Content-Length')
        if (!contentLength) {
            throw new Error('Invalid content length')
        }
        const reader = response.body.getReader()
        const chunks = []
        let receivedLength = 0

        // eslint-disable-next-line no-constant-condition
        while (true) {
            // eslint-disable-next-line no-await-in-loop
            const { done, value } = await reader.read()
            if (done) break

            chunks.push(value)
            receivedLength += value.length
            setProgress(receivedLength / contentLength)
        }
    }

    /**
     * @param downloadUrl - API url for downloading file
     * @param showFilePreparingToast - Show toast 'Preparing file for download'
     * @param fileName - fileName of the downloaded file
     * @param showSuccessfulToast - show toast on successful download
     * @param downloadSuccessToastContent - Content to show in toast on successful download
     * @param showProgress - show download progress, default false, returns null if false, else returns percentage downloaded
     */
    const handleDownload = async ({
        downloadUrl,
        showFilePreparingToast = false,
        fileName,
        showSuccessfulToast = true,
        downloadSuccessToastContent = 'Downloaded Successfully',
        showProgress = false,
    }: HandleDownloadProps): Promise<Error | ServerErrors> => {
        setIsDownloading(true)
        if (showFilePreparingToast) {
            toast.info(
                <ToastBody
                    title="Preparing file for download"
                    subtitle="File will be downloaded when it is available."
                />,
            )
        }
        try {
            const response = await getDownloadResponse(downloadUrl)
            if (response.status === API_STATUS_CODES.OK) {
                const data = showProgress ? getChunksDataFromResponse(response) : await (response as any).blob()

                const blob = showProgress ? new Blob(data) : data

                // Create a new URL object
                const blobUrl = URL.createObjectURL(blob)

                // Create a link element
                const a = document.createElement('a')
                a.href = blobUrl

                a.download = fileName || getFileNameFromHeaders(response.headers) || 'file.tgz'

                // Append the link element to the DOM
                document.body.appendChild(a)

                // Programmatically click the link to start the download
                a.click()

                // Clean up the URL object after the download is complete
                setTimeout(() => {
                    URL.revokeObjectURL(blobUrl)
                    document.body.removeChild(a)
                }, 0)

                if (showSuccessfulToast) {
                    toast.success(downloadSuccessToastContent)
                }
            } else if (response.status === API_STATUS_CODES.NO_CONTENT) {
                throw new Error('No content to download')
            } else {
                const jsonResponseError: ServerErrors = await response?.json()
                throw new ServerErrors(jsonResponseError)
            }
        } catch (error) {
            setIsDownloading(false)
            showError(error)
            return error
        }
        setIsDownloading(false)
        return null
    }

    // progress will be null if showProgress is false
    return { handleDownload, isDownloading, progress }
}

export default useDownload
