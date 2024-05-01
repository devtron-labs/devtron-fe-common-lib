import { ReactNode } from 'react'

export interface ButtonWithSelectorProps {
    content: ReactNode
    onClick: () => void
    children: ReactNode
}
