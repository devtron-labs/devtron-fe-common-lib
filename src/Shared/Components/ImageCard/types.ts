import { ReactNode } from 'react'
import { ImageTaggingContainerType } from '../../../Common'

export interface MaterialInfoProps {
    imagePath: string
    registryName: string
    registryType: string
    image: string
    deployedTime: string
    excludedImagePathNode: ReactNode
    approvalChecksNode?: ReactNode
}

export interface SequentialCDCardTitleProps {
    isLatest: boolean
    isRunningOnParentCD: boolean
    artifactStatus: string
    environmentName: string
    parentEnvironmentName: string
    stageType: string
    showLatestTag: boolean
}

export interface ImageCardProps {
    testIdLocator: string
    sequentialCDCardTitleProps: SequentialCDCardTitleProps
    cta: ReactNode
    materialInfoProps: MaterialInfoProps
    imageTagContainerProps: ImageTaggingContainerType
    rootClassName?: string
    materialInfoRootClassName?: string
}
