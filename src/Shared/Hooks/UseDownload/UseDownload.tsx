import { showError } from '@Common/Helper'
import { ToastBody } from '@Common/ToastBody'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { getDownloadResponse } from './service'

export interface HandleDownloadProps {
    downloadUrl: string
    showFilePreparingToast?: boolean
    fileName?: string
}

const useDownload = () => {
    const [isDownloading, setIsDownloading] = useState<boolean>(false)

    /*
    downloadUrl: API url for downloading file
    showFilePreparingToast: Show toast 'Preparing file for download'
    fileName: fileName of the downloaded file
    */
    const handleDownload = async ({ downloadUrl, showFilePreparingToast = false, fileName = 'file.tgz' }) => {
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
            if (response.status === 200) {
                const data = await (response as any).blob()

                // Create a new URL object
                const blobUrl = URL.createObjectURL(data)

                // Create a link element
                const a = document.createElement('a')
                a.href = blobUrl
                a.download = fileName

                // Append the link element to the DOM
                document.body.appendChild(a)

                // Programmatically click the link to start the download
                a.click()

                // Clean up the URL object after the download is complete
                setTimeout(() => {
                    URL.revokeObjectURL(blobUrl)
                    document.body.removeChild(a)
                }, 0)

                toast.success('Downloaded Successfully')
            } else {
                const error = (await response.json()).errors[0].userMessage
                showError(error)
            }
        } catch (error) {
            toast.error(error)
        } finally {
            setIsDownloading(false)
        }
    }

    return { handleDownload, isDownloading }
}

export default useDownload
