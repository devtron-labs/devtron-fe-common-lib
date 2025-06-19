import { ComponentSizeType } from '@Shared/constants'
import { IconBaseColorType } from '@Shared/types'

import { IconsProps } from '../Icon'

export type BadgeVariants = 'default' | 'negative' | 'negative-grey' | 'positive' | 'warning' | 'neutral' | 'custom'

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
