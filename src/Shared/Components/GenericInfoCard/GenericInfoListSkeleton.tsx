import GenericInfoCard from './GenericInfoCard.component'
import { GenericInfoListSkeletonProps } from './types'

export const GenericInfoListSkeleton = ({ borderVariant }: GenericInfoListSkeletonProps) => (
    <>
        <GenericInfoCard isLoading borderVariant={borderVariant} />
        <GenericInfoCard isLoading borderVariant={borderVariant} />
        <GenericInfoCard isLoading borderVariant={borderVariant} />
    </>
)
