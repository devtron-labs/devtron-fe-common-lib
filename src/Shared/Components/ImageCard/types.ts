import { ReactNode } from 'react'
import { ImageTaggingContainerType } from '../../../Common'

export interface MaterialInfoProps {
    imagePath: string
    registryName: string
    registryType: string
    image: string
    deployedTime: string
    excludedImagePath?: ReactNode
    approvalChecks?: ReactNode
}

export interface SequentialCDCardTitleProps {
    isLatest: boolean
    isRunningOnParentCD: boolean
    artifactStatus: string
    environmentName: string
    parentEnvironmentName: string
}

export interface ImageCardProps {
    testIdLocator: string
    sequentialCDCardTitleProps: SequentialCDCardTitleProps
    cta: ReactNode
    materialInfoProps: MaterialInfoProps
    imageTagContainerProps: ImageTaggingContainerType
}
