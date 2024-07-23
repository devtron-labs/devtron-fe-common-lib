import { ReactNode } from 'react'

export interface EditImageFormFieldProps {
    defaultIcon: ReactNode
    errorMessage: string
    handleError: (error: string) => void
    url: string
    handleURLChange: (url: string) => void
    altText: string
    ariaLabelPrefix: string
    dataTestIdPrefix: string
}

export interface FallbackImageProps extends Pick<EditImageFormFieldProps, 'defaultIcon'> {
    /**
     * @default - false
     */
    showEditIcon?: boolean
}
