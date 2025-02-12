import { ComponentSizeType } from '@Shared/constants'
import { BorderConfigType, ComponentLayoutType } from '@Shared/types'
import { ReactElement, ReactNode } from 'react'
import { ButtonProps } from '../Button'

export type InfoBlockProps = {
    /**
     * @default 'row'
     */
    layout?: ComponentLayoutType
    /**
     * @default 'information'
     */
    variant?: 'error' | 'help' | 'information' | 'success' | 'warning'
    /**
     * @default ComponentSizeType.medium
     */
    size?: Extract<ComponentSizeType, ComponentSizeType.large | ComponentSizeType.medium>
    /**
     * If given would override the default icon derived from type
     */
    customIcon?: ReactElement
    buttonProps?: ButtonProps
    borderConfig?: BorderConfigType
    borderRadiusConfig?: BorderConfigType
    /**
     * @default true
     */
    fullWidth?: boolean
} & (
    | {
          /**
           * If string, would apply h tag with necessary classes
           */
          heading: ReactNode
          /**
           * If string, would apply p tag with necessary classes
           */
          description: ReactNode
      }
    | {
          heading?: never
          description: ReactNode
      }
    | {
          heading: ReactNode
          description?: never
      }
)
