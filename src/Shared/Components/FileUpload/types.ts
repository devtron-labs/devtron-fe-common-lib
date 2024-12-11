export interface FileUploadProps {
    isLoading?: boolean
    fileName: string
    onUpload: (files: File[]) => void
    multiple?: boolean
    label?: string
    // Array of allowed MIME types (e.g., ["image/png", "image/jpeg"])
    fileTypes?: string[]
}
