import { FormFieldInfoProps, FormFieldLabelProps, FormFieldWrapperProps } from './types'

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

export const getFormFieldBorderClassName = (borderRadiusConfig: FormFieldWrapperProps['borderRadiusConfig'] = {}) => {
    const { top = true, right = true, bottom = true, left = true } = borderRadiusConfig

    return `${!top ? 'dc__no-top-radius' : ''} ${!right ? 'dc__no-right-radius' : ''} ${!bottom ? 'dc__no-bottom-radius' : ''} ${!left ? 'dc__no-left-radius' : ''}`
}
