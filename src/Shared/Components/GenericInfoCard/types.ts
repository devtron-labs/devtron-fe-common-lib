import { MouseEventHandler, ReactElement } from 'react'
import { LinkProps } from 'react-router-dom'

type BaseGenericInfoCardProps = {
    title: string
    description: string
    author: string
    Icon: ReactElement
} & (
    | {
          onClick?: never
          linkProps?: Pick<LinkProps, 'to' | 'target' | 'rel'>
      }
    | {
          onClick?: MouseEventHandler<HTMLButtonElement>
          linkProps?: never
      }
)

export enum GenericInfoCardBorderVariant {
    ROUNDED = 'rounded',
    NONE = 'none',
}

export type GenericInfoCardProps = { borderVariant: GenericInfoCardBorderVariant } & (
    | ({
          isLoading: true
      } & Partial<Record<keyof BaseGenericInfoCardProps, never>>)
    | ({
          isLoading?: boolean
      } & BaseGenericInfoCardProps)
)
