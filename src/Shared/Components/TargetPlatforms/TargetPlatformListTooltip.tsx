import { TargetPlatformListTooltipProps } from './types'

const TargetPlatformListTooltip = ({ targetPlatforms }: TargetPlatformListTooltipProps) => (
    <div className="flexbox-col dc__gap-2 fs-12 lh-18 cn-0 w-200">
        <h6 className="m-0 fw-6">Target platforms</h6>

        <ul className="pl-12 m-0">
            {targetPlatforms.map(({ name }) => (
                <li key={name} className="dc__word-break">
                    {name}
                </li>
            ))}
        </ul>
    </div>
)

export default TargetPlatformListTooltip
