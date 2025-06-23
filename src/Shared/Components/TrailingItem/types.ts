import { ReactElement } from 'react'

import { OmitNever } from '@Shared/types'

import { ButtonProps } from '../Button'
import { IconsProps } from '../Icon'
import { NumbersCountProps } from '../NumbersCount'
import { DTSwitchProps } from '../Switch'

export type ActionMenuItemIconType = Pick<IconsProps, 'name'> & {
    /** @default 'N800' */
    color?: IconsProps['color']
}

export type TrailingItemType =
    | {
          type: 'icon'
          config: ActionMenuItemIconType
      }
    | {
          type: 'text'
          config: {
              value: string
              icon?: ActionMenuItemIconType
          }
      }
    | {
          type: 'counter'
          config: {
              value: NumbersCountProps['count']
          }
      }
    | {
          type: 'switch'
          config: Pick<
              DTSwitchProps,
              | 'ariaLabel'
              | 'isChecked'
              | 'indeterminate'
              | 'isDisabled'
              | 'isLoading'
              | 'name'
              | 'onChange'
              | 'tooltipContent'
          >
      }
    | {
          type: 'button'
          config: OmitNever<Omit<Extract<ButtonProps, { icon: ReactElement }>, 'size' | 'variant'>>
      }

export type TrailingItemProps = TrailingItemType & {
    /**
     * @default 'neutral'
     */
    variant: 'neutral' | 'negative'
}
