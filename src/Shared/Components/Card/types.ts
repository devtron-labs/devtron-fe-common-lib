import { MouseEventHandler, ReactNode } from 'react'

export type CardProps = {
    children: ReactNode
    onClick?: MouseEventHandler<HTMLDivElement>
    onHover?: MouseEventHandler<HTMLDivElement>
    borderConfig?: {
        /**
         * @default 'secondary'
         */
        colorVariant?: 'primary' | 'secondary' | 'primary--translucent' | 'secondary--translucent'
        /**
         * @default 8px
         */
        borderRadius?: number
    }
    /**
     * @default 20px
     */
    padding?: number
    /**
     * @default 'column'
     */
    flexDirection?: 'row' | 'column'
    /**
     * @default 16px
     */
    flexGap?: number
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
