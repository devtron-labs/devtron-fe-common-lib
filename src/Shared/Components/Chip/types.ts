import type { MouseEvent, PropsWithChildren } from 'react'

import { ComponentSizeType } from '@Shared/constants'

import { IconsProps } from '../Icon'
import { SelectPickerOptionType } from '../SelectPicker'

export type ChipProps = {
    /**
     * The label to be displayed on the chip.
     * This is a required field and should be a string.
     */
    label: string
    /**
     * The size of the chip, which determines its padding and icon size.
     * @default ComponentSizeType.xs
     */
    size?: Extract<ComponentSizeType, ComponentSizeType.xs | ComponentSizeType.xxs>
    /**
     * If style is 'error', an error icon will be displayed.
     * If style is 'neutral', a start icon can be provided.
     * @default 'neutral'
     */
    style?: 'neutral' | 'error'
    capitalizeLabel?: boolean
} & (
    | {
          type: 'button'
          href?: never
          onClick: (event: MouseEvent<HTMLButtonElement>) => void
          value?: never
          onRemove?: () => void
      }
    | {
          type: 'link'
          href: string
          onClick?: never
          value?: never
          onRemove?: never
      }
    | {
          /**
           * The type of the chip, which can be 'button', 'link', or 'non-interactive'.
           * This determines the behavior of the chip when clicked.
           * @default 'non-interactive'
           */
          type?: 'non-interactive'
          href?: never
          onClick?: never
          /**
           * The value to be displayed in the chip, if any.
           * This is optional and can be used to show additional information.
           * @default undefined
           */
          value?: string | number
          /**
           * A function that will be called when the remove button is clicked.
           * This is optional and can be used to handle the removal of the chip.
           */
          onRemove?: (event: MouseEvent<HTMLButtonElement>) => void
      }
) &
    (
        | {
              startIconProps?: Pick<IconsProps, 'name' | 'color'>
              startIcon?: never
          }
        | {
              startIconProps?: never
              startIcon?: SelectPickerOptionType['startIcon']
          }
    )

export interface GetIconPropsType extends Pick<ChipProps, 'style' | 'startIconProps' | 'size'> {}

export type ChipWrapperProps = PropsWithChildren<
    Required<Pick<ChipProps, 'type' | 'style' | 'onClick' | 'href' | 'size'>>
>
