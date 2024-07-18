import { showError } from '@Common/Helper'
import { ToastBody } from '@Common/ToastBody'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { API_STATUS_CODES } from '@Common/Constants'
import { ServerErrors } from '@Common/ServerError'
import { getDownloadResponse } from './service'
import { HandleDownloadProps } from './types'

const useDownload = () => {
    const [isDownloading, setIsDownloading] = useState<boolean>(false)

    /**
     * @param downloadUrl - API url for downloading file
     * @param filterType - Show toast 'Preparing file for download'
     * @param fileName - fileName of the downloaded file
     * @param showSuccessfulToast - show toast on successful download
     * @param downloadSuccessToastContent - Content to show in toast on successful download
     */
    const handleDownload = async ({
        downloadUrl,
        showFilePreparingToast = false,
        fileName,
        showSuccessfulToast = true,
        downloadSuccessToastContent = 'Downloaded Successfully',
    }: HandleDownloadProps) => {
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
                const data = await (response as any).blob()

                // Create a new URL object
                const blobUrl = URL.createObjectURL(data)

                // Create a link element
                const a = document.createElement('a')
                a.href = blobUrl

                a.download =
                    fileName ||
                    response.headers // File name from response headers
                        ?.get('content-disposition')
                        ?.split(';')
                        ?.find((n) => n.includes('filename='))
                        ?.replace('filename=', '')
                        .trim() ||
                    'file.tgz'

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
            showError(error)
        } finally {
            setIsDownloading(false)
        }
    }

    return { handleDownload, isDownloading }
}

export default useDownload
