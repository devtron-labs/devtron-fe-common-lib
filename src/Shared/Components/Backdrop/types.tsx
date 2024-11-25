import { ReactNode } from 'react'

export interface BackdropProps {
    children: ReactNode
    onEscape: () => void
}
