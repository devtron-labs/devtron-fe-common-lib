export interface FileUploadProps {
    fileName: string
    onUpload: (files: File[]) => void
    multiple?: boolean
    label?: string
    className?: string
    // Array of allowed MIME types (e.g., ["image/png", "image/jpeg"])
    fileTypes?: string[]
}
