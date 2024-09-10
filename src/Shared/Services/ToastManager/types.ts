import { ButtonProps } from '@Shared/Components'

export enum ToastVariantType {
    info = 'info',
    success = 'success',
    error = 'error',
    warn = 'warn',
    notAuthorized = 'notAuthorized',
    updateAvailable = 'updateAvailable',
}

export interface ToastProps {
    title: string
    description?: string
    variant?: ToastVariantType
    buttonProps?: ButtonProps
}
