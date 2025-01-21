import { ReactElement, ReactNode } from 'react'

export interface FormFieldLabelProps {
    label?: ReactNode
    required?: boolean
    inputId: string
}

export interface FormFieldInfoProps extends Pick<FormFieldLabelProps, 'inputId'> {
    error?: ReactNode
    helperText?: ReactNode
    warningText?: ReactNode
}

export interface FormInfoItemProps {
    id: string
    text: ReactNode
    textClass: string
    icon: ReactElement
}

export interface FormFieldWrapperProps extends Pick<FormFieldLabelProps, 'label' | 'required'>, FormFieldInfoProps {
    layout?: 'row' | 'column'
    fullWidth?: boolean
    children: ReactElement
}
