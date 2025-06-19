import { ComponentSizeType } from '@Shared/constants'

import { Icon } from '../Icon'
import { BadgeProps } from './types'
import { getClassNameAccToSize, getClassNameAccToVariant } from './utils'

const Badge = ({
    label,
    bgColor,
    fontColor,
    endIconProps,
    startIconProps,
    variant = 'default',
    size = ComponentSizeType.xs,
}: BadgeProps) => {
    const { styles, iconColor } = getClassNameAccToVariant(variant)
    const iconSize = size === ComponentSizeType.xs ? 20 : 16

    return (
        <div
            className={`flex dc__gap-4 br-4 fw-5 dc__w-fit-content ${getClassNameAccToSize(size)} ${styles}`}
            {...(bgColor && fontColor
                ? {
                      style: {
                          backgroundColor: `var(--${bgColor})`,
                          color: `var(--${fontColor})`,
                      },
                  }
                : {})}
        >
            {startIconProps && <Icon {...startIconProps} size={iconSize} color={fontColor || iconColor} />}
            <span className="dc__truncate">{label}</span>
            {endIconProps && <Icon {...endIconProps} size={iconSize} color={fontColor || iconColor} />}
        </div>
    )
}

export default Badge
