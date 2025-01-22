import { FormFieldInfoProps, FormFieldLabelProps } from './types'

export const getFormErrorElementId = (inputId: FormFieldLabelProps['inputId']) => `${inputId}-error-msg`

export const getFormLabelElementId = (inputId: FormFieldLabelProps['inputId']) => `${inputId}-label`

export const getFormHelperTextElementId = (inputId: FormFieldLabelProps['inputId']) => `${inputId}-helper-text`

export const getFormFieldAriaAttributes = ({
    inputId,
    label,
    ariaLabel,
    required,
    error,
    helperText,
}: Required<
    Pick<FormFieldLabelProps, 'label' | 'ariaLabel' | 'required' | 'inputId'> &
        Pick<FormFieldInfoProps, 'error' | 'helperText'>
>) => ({
    'aria-required': required,
    ...(helperText
        ? {
              'aria-describedby': getFormHelperTextElementId(inputId),
          }
        : {}),
    ...(error
        ? {
              'aria-errormessage': getFormErrorElementId(inputId),
              'aria-invalid': !!error,
          }
        : {}),
    ...(label
        ? {
              'aria-labelledby': getFormLabelElementId(inputId),
          }
        : {
              'aria-label': ariaLabel,
          }),
})
