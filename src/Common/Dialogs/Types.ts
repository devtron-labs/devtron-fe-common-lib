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
