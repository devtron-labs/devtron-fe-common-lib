export interface DeleteComponentProps {
    setDeleting: (boolean) => void
    toggleConfirmation: any
    deleteComponent: (any) => Promise<any>
    title: string
    component: string
    payload: any
    confirmationDialogDescription?: string
    redirectTo?: boolean
    url?: string
    reload?: () => void
    configuration?: string
    dataTestid?: string
    closeCustomComponent?: () => void
}
