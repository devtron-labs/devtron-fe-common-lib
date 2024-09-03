import { TooltipProps } from '@Common/Tooltip/types'
import { ComponentSizeType } from '@Shared/constants'
import { ButtonHTMLAttributes, ReactElement } from 'react'

export enum ButtonVariantType {
    primary = 'primary',
    secondary = 'secondary',
    text = 'text',
    link = 'link',
}

export enum ButtonStyleType {
    default = 'default',
    negative = 'negative',
    positive = 'positive',
    warning = 'warning',
    neutral = 'neutral',
}

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'styles' | 'className'> & {
    variant?: ButtonVariantType
    size?: ComponentSizeType
    style?: ButtonStyleType
    text: string
    startIcon?: ReactElement
    endIcon?: ReactElement
    isLoading?: boolean
} & (
        | {
              showTippy: boolean
              tippyContent: TooltipProps['content']
          }
        | {
              showTippy?: never
              tippyContent?: never
          }
    )
