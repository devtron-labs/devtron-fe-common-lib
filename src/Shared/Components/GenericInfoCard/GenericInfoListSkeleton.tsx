import GenericInfoCard from './GenericInfoCard.component'

export const GenericInfoListSkeleton = (borderVariant) => (
    <>
        <GenericInfoCard isLoading borderVariant={borderVariant} />
        <GenericInfoCard isLoading borderVariant={borderVariant} />
        <GenericInfoCard isLoading borderVariant={borderVariant} />
    </>
)
