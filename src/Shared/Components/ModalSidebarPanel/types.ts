import { ReactNode } from 'react'

export interface ModalSidebarPanelProps {
    rootClassName?: string
    heading: string
    icon?: JSX.Element
    children?: ReactNode
    documentationLink: string
}
