import { TooltipProps } from '@Common/Tooltip/types'
import { TargetPlatformsDTO } from '@Shared/types'

export interface TargetPlatformBadgeListProps extends Required<Pick<TargetPlatformsDTO, 'targetPlatforms'>> {}
export interface TargetPlatformListTooltipProps extends Pick<TargetPlatformsDTO, 'targetPlatforms'> {
    children: TooltipProps['children']
}
