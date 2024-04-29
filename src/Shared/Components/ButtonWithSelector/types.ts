import { ReactNode } from 'react'

export interface ButtonWithSelectorProps {
    buttonContent: ReactNode
    buttonClickHandler: () => void
    menuItems: JSX.Element
}
