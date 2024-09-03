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
    /**
     * Variant of the button
     *
     * @default 'ButtonVariantType.primary'
     */
    variant?: ButtonVariantType
    /**
     * Size of the button
     *
     * @default 'ComponentSizeType.large'
     */
    size?: ComponentSizeType
    /**
     * Style to be applied on the button
     *
     * @default 'ButtonStyleType.default'
     */
    style?: ButtonStyleType
    /**
     * Text to be displayed in the button
     */
    text: string
    /**
     * If provided, icon to be displayed at the start of the button
     */
    startIcon?: ReactElement
    /**
     * If provided, icon to be displayed at the end of the button
     */
    endIcon?: ReactElement
    /**
     * If true, the loading state is shown for the button with disabled
     */
    isLoading?: boolean
    dataTestId: string
} & (
        | {
              /**
               * If true, the tippy is shown for the button
               */
              showTippy: boolean
              /**
               * Tippy content to be shown for use cases like disabled etc
               */
              tippyContent: TooltipProps['content']
          }
        | {
              showTippy?: never
              tippyContent?: never
          }
    )
