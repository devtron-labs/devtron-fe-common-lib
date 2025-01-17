import { Tooltip } from '@Common/Tooltip'
import { TargetPlatformListTooltipProps } from './types'

const TooltipContent = ({ targetPlatforms }: Pick<TargetPlatformListTooltipProps, 'targetPlatforms'>) => (
    <div className="flexbox-col dc__gap-4">
        <h6 className="m-0 fw-6 lh-18 fs-12">Target platforms</h6>

        <ul className="pl-12 m-0 dc__overflow-auto mxh-140">
            {targetPlatforms.map(({ name }) => (
                <li key={name} className="dc__word-break lh-18">
                    {name}
                </li>
            ))}
        </ul>
    </div>
)

const TargetPlatformListTooltip = ({ targetPlatforms, children }: TargetPlatformListTooltipProps) => (
    <Tooltip content={<TooltipContent targetPlatforms={targetPlatforms} />} alwaysShowTippyOnHover interactive>
        {children}
    </Tooltip>
)

export default TargetPlatformListTooltip
