import { ButtonProps } from '@Shared/Components'
import { ReactElement } from 'react'

export enum ToastVariantType {
    info = 'info',
    success = 'success',
    error = 'error',
    warn = 'warn',
    notAuthorized = 'notAuthorized',
}

export interface ToastProps {
    title?: string
    description: string
    icon?: ReactElement
    variant?: ToastVariantType
    buttonProps?: ButtonProps
    progressBarBg?: `var(--${string})`
}
