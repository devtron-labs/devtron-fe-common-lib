import { HTMLAttributes } from 'react'

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
    container?: boolean
    spacing?: number
    item?: boolean
    xs?: number
    containerClass?: string
    itemClass?: string
    children?: React.ReactNode
}
