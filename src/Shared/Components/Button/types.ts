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

export type ButtonProps = {
    buttonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'>
    variant?: ButtonVariantType
    size?: ComponentSizeType
    style?: ButtonStyleType
    text: string
    startIcon?: ReactElement
    endIcon?: ReactElement
    disabled?: boolean
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
