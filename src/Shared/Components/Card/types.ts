import { ReactNode } from 'react'

import { ComponentLayoutType } from '@Shared/types'

export type CardProps = {
    children: ReactNode
    onClick?: () => void
    /**
     * @default primary--outlined
     */
    variant?: 'primary--outlined' | 'secondary--outlined'
    /**
     * @default 'column'
     */
    flexDirection?: ComponentLayoutType
    /**
     * @default 0px
     */
    flexGap?: 0 | 2 | 4 | 6 | 8 | 12 | 16 | 20 | 24 | 32
    padding?: 0 | 2 | 4 | 6 | 8 | 12 | 16 | 20 | 24 | 32
} & (
    | {
          isLoading: boolean
          shimmerVariant: 'A' | 'B' | 'C'
      }
    | {
          isLoading?: never
          shimmerVariant?: never
      }
)
