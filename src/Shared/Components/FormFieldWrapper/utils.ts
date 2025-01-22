import { FormFieldInfoProps, FormFieldLabelProps } from './types'

export const getFormErrorElementId = (inputId: FormFieldLabelProps['inputId']) => `${inputId}-error-msg`

export const getFormLabelElementId = (inputId: FormFieldLabelProps['inputId']) => `${inputId}-label`

export const getFormFieldAriaAttributes = ({
    inputId,
    label,
    ariaLabel,
    required,
    error,
}: Required<
    Pick<FormFieldLabelProps, 'label' | 'ariaLabel' | 'required' | 'inputId'> & Pick<FormFieldInfoProps, 'error'>
>) => {
    const labelId = getFormLabelElementId(inputId)
    const errorElementId = getFormErrorElementId(inputId)

    return {
        'aria-describedby': errorElementId,
        'aria-required': required,
        ...(error
            ? {
                  'aria-errormessage': errorElementId,
                  'aria-invalid': !!error,
              }
            : {}),
        ...(label
            ? {
                  'aria-labelledby': labelId,
              }
            : {
                  'aria-label': ariaLabel,
              }),
    }
}
