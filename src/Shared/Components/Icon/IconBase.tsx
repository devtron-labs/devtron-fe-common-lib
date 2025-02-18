import { ConditionalWrap } from '@Common/Helper'
import { Tooltip } from '@Common/Tooltip'

import { IconBaseProps } from './types'

import './styles.scss'

const conditionalWrap = (tooltipProps: IconBaseProps['tooltipProps']) => (children: JSX.Element) => (
    <Tooltip {...tooltipProps}>
        <div className="flex">{children}</div>
    </Tooltip>
)

export const IconBase = ({ name, iconMap, size = 16, tooltipProps, color, strokeWidth }: IconBaseProps) => {
    const IconComponent = iconMap[name]

    if (!IconComponent) {
        throw new Error(`Icon with name "${name}" does not exist.`)
    }

    return (
        <ConditionalWrap condition={!!tooltipProps?.content} wrap={conditionalWrap(tooltipProps)}>
            <IconComponent
                className={`icon-dim-${size} ${color ? 'icon-component' : ''} dc__no-shrink`}
                style={color ? { ['--iconColor' as string]: `var(--${color})` } : {}}
                strokeWidth={strokeWidth}
            />
        </ConditionalWrap>
    )
}
