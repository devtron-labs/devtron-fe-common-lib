import { TextareaHTMLAttributes } from 'react'
import { ComponentSizeType } from '@Shared/constants'
import { FormFieldWrapperProps } from '../FormFieldWrapper'

export interface TextareaProps
    extends Omit<FormFieldWrapperProps, 'children' | 'inputId'>,
        Pick<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onBlur' | 'disabled' | 'autoFocus' | 'onFocus'>,
        Required<Pick<TextareaHTMLAttributes<HTMLTextAreaElement>, 'placeholder' | 'onChange' | 'value' | 'name'>> {
    /**
     * Test id for the textarea
     */
    dataTestId: string
    /**
     * If false, the input is not trimmed on blur
     *
     * @default true
     */
    shouldTrim?: boolean
    /**
     * Size of the textarea
     *
     * @default ComponentSizeType.large
     */
    size?: Extract<ComponentSizeType, ComponentSizeType.medium | ComponentSizeType.large>
}
