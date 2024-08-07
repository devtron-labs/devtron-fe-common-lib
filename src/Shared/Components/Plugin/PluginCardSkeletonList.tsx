import { PluginCardSkeletonListProps } from './types'

const PluginCardSkeleton = () => (
    <div className="p-12 flexbox dc__gap-16 w-100">
        <div className="p-4 dc__no-shrink icon-dim-40 shimmer-loading" />

        <div className="flexbox-col dc__gap-12 w-100">
            <div className="flexbox-col dc__gap-8 w-100">
                <div className="h-20 w-150 shimmer-loading" />

                <div className="flexbox-col dc__gap-4">
                    <div className="h-12 w-100 shimmer-loading" />
                    <div className="h-12 w-120 shimmer-loading" />
                </div>
            </div>

            <div className="h-20 w-60 shimmer-loading" />
        </div>
    </div>
)

const PluginCardSkeletonList = ({ count = 3 }: PluginCardSkeletonListProps) => (
    <>
        {Array(count)
            .fill(0)
            .map((_, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <PluginCardSkeleton key={index} />
            ))}
    </>
)

export default PluginCardSkeletonList
