import { ReactElement, ReactNode } from 'react'

export type LabelOrAriaLabelType =
    | {
          label: ReactNode
          ariaLabel?: never
      }
    | {
          label?: never
          ariaLabel: string
      }

export type FormFieldLabelProps = LabelOrAriaLabelType & {
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

export interface FormFieldWrapperProps
    extends Pick<FormFieldLabelProps, 'label' | 'required' | 'ariaLabel'>,
        FormFieldInfoProps {
    layout?: 'row' | 'column'
    fullWidth?: boolean
    children: ReactElement
}
