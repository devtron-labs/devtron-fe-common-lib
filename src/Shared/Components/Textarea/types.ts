import { TextareaHTMLAttributes } from 'react'
import { ComponentSizeType } from '@Shared/constants'
import { FormFieldWrapperProps } from '../FormFieldWrapper'

export interface TextareaProps
    extends Omit<FormFieldWrapperProps, 'children' | 'inputId'>,
        Pick<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onBlur' | 'disabled' | 'autoFocus'>,
        Required<Pick<TextareaHTMLAttributes<HTMLTextAreaElement>, 'placeholder' | 'onChange' | 'value'>> {
    name: string
    dataTestId: string
    /**
     * @default true
     */
    shouldTrim?: boolean
    /**
     * @default ComponentSizeType.large
     */
    size?: Extract<ComponentSizeType, ComponentSizeType.medium | ComponentSizeType.large>
}
