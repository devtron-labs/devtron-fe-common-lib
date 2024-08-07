export interface HandleDownloadProps {
    downloadUrl: string
    showFilePreparingToast?: boolean
    fileName?: string
    showSuccessfulToast?: boolean
    downloadSuccessToastContent?: string
    showProgress?: boolean
}
