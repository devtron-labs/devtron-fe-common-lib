import { ReactNode } from "react"

export interface DeleteDialogProps {
    title: string
    description?: string
    closeDelete: () => void
    delete: () => any
    deletePrefix?: string
    deletePostfix?: string
    apiCallInProgress?: boolean
}

export interface ForceDeleteDialogType {
  onClickDelete: () => void
  closeDeleteModal: () => void
  forceDeleteDialogTitle: string
  forceDeleteDialogMessage: string
}
export interface ConfirmationDialogType {
    className?: string
    children: any
}
export interface ConfirmationDialogIconType {
    src: string
    className?: string
}
export interface ConfirmationDialogBodyType {
    title: string
    subtitle?: ReactNode
    children?: any
}
export interface ConfirmationDialogButtonGroupType {
    children: any
}
