import { ReactNode } from 'react'

export interface ImagePathTippyContentProps {
    imagePath: string
    registryName: string
}

export interface MaterialInfoProps {
    imagePath: string
    registryName: string
    registryType: string
    image: string
    deployedTime: string
    excludedImagePath?: ReactNode
    approvalChecks?: ReactNode
}
