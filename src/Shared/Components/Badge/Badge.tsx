import { ComponentSizeType } from '@Shared/constants'
import { IconBaseColorType } from '@Shared/types'

import { Icon, IconsProps } from '../Icon'

type BadgeVariants = 'default' | 'negative' | 'negative-grey' | 'positive' | 'warning' | 'neutral' | 'custom'

export type BadgeProps = {
    size?: Extract<ComponentSizeType, ComponentSizeType.xs | ComponentSizeType.xxs | ComponentSizeType.xxxs>
    startIconProps?: Omit<IconsProps, 'color' | 'size'>
    endIconProps?: Omit<IconsProps, 'color' | 'size'>
    label: string
} & (
    | {
          variant?: Exclude<BadgeVariants, 'custom'>
          fontColor?: never
          bgColor?: never
      }
    | {
          variant: 'custom'
          fontColor: IconBaseColorType
          bgColor: IconBaseColorType
      }
)

const getClassNameAccToVariant = (variant: BadgeProps['variant']): { styles: string; iconColor: IconBaseColorType } => {
    switch (variant) {
        case 'custom':
            return { styles: '', iconColor: 'B700' }
        case 'negative':
            return { styles: 'bcr-1 cr-7', iconColor: 'R700' }
        case 'warning':
            return { styles: 'bcy-50 cy-7', iconColor: 'Y700' }
        case 'positive':
            return { styles: 'bcg-1 cg-7', iconColor: 'G700' }
        case 'neutral':
            return { styles: 'bg__secondary cn-700', iconColor: 'N700' }
        case 'default':
        default:
            return { styles: 'bcb-1 cb-7', iconColor: 'B700' }
    }
}

const getClassNameAccToSize = (size: BadgeProps['size']) => {
    switch (size) {
        case ComponentSizeType.xxxs:
            return 'fs-11 lh-16 px-4 py-1'
        case ComponentSizeType.xxs:
            return 'fs-12 lh-16 px-6 py-2'
        case ComponentSizeType.xs:
        default:
            return 'fs-13 lh-20 px-6 py-2'
    }
}

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
