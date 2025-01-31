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
    /**
     * If true, the field is required and * is shown with the label
     */
    required?: boolean
    /**
     * Id of the input element
     */
    inputId: string
    /**
     * Layout of the field
     */
    layout?: 'row' | 'column'
}

export interface FormFieldInfoProps extends Pick<FormFieldLabelProps, 'inputId'> {
    /**
     * Error message for the field
     */
    error?: ReactNode
    /**
     * Helper text for the field
     */
    helperText?: ReactNode
    /**
     * Warning message for the field
     */
    warningText?: ReactNode
}

export interface FormInfoItemProps {
    id: FormFieldLabelProps['inputId']
    text: FormFieldInfoProps['error']
    textClass: string
    icon: ReactElement
}

export interface FormFieldWrapperProps
    extends Pick<FormFieldLabelProps, 'label' | 'required' | 'ariaLabel' | 'layout'>,
        FormFieldInfoProps {
    /**
     * If true, the field takes the full width of the parent
     */
    fullWidth?: boolean
    children: ReactElement
    borderRadiusConfig?: {
        /**
         * If false, the top border radius is not applied
         *
         * @default true
         */
        top?: boolean
        /**
         * If false, the right border radius is not applied
         *
         * @default true
         */
        right?: boolean
        /**
         * If false, the bottom border radius is not applied
         *
         * @default true
         */
        bottom?: boolean
        /**
         * If false, the left border radius is not applied
         *
         * @default true
         */
        left?: boolean
    }
}
