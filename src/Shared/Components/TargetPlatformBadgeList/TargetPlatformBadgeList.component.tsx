import { ReactComponent as ICStack } from '@Icons/ic-stack.svg'
import { Tooltip } from '@Common/Tooltip'
import { TargetPlatformBadgeListProps } from './types'

const TargetPlatformBadge = ({ name }: TargetPlatformBadgeListProps['targetPlatforms'][number]) => (
    <div className="bg__secondary py-2 px-6 dc__mxw-200">
        <Tooltip content={name}>
            <span className="dc__truncate cn-7 fs-13 fw-5 lh-20">{name}</span>
        </Tooltip>
    </div>
)

const TargetPlatformBadgeList = ({ targetPlatforms }: TargetPlatformBadgeListProps) => {
    if (!targetPlatforms?.length) {
        return null
    }

    return (
        <div className="flexbox dc__gap-8 dc__align-items-center">
            <ICStack className="icon-dim-16 dc__no-shrink scn-7" />

            <div className="flexbox dc__gap-8 flex-wrap">
                {targetPlatforms.map(({ name }) => (
                    <TargetPlatformBadge key={name} name={name} />
                ))}
            </div>
        </div>
    )
}

export default TargetPlatformBadgeList
