import { useState } from 'react'
import { DEFAULT_SECRET_PLACEHOLDER } from '@Shared/constants'
import { ReactComponent as ICVisibilityOn } from '@Icons/ic-visibility-on.svg'
import { ReactComponent as ICVisibilityOff } from '@Icons/ic-visibility-off.svg'
import CustomInput from './CustomInput'
import { CustomInputProps, PasswordFieldProps } from './types'

const PasswordField = ({ onFocus, onBlur, shouldShowDefaultPlaceholderOnBlur, ...props }: PasswordFieldProps) => {
    const [fieldType, setFieldType] = useState<CustomInputProps['type']>('password')

    const isFieldTypePassword = fieldType === 'password'

    const handleFocus: CustomInputProps['onFocus'] = (event) => {
        if (event.target.value === DEFAULT_SECRET_PLACEHOLDER) {
            // eslint-disable-next-line no-param-reassign
            event.target.value = ''
        }

        onFocus?.(event)
    }

    const handleBlur: CustomInputProps['onBlur'] = (event) => {
        if (shouldShowDefaultPlaceholderOnBlur && event.target.value === '') {
            // eslint-disable-next-line no-param-reassign
            event.target.value = DEFAULT_SECRET_PLACEHOLDER
        }
        setFieldType('password')
        onBlur?.(event)
    }

    return (
        <CustomInput
            {...props}
            onFocus={handleFocus}
            onBlur={handleBlur}
            type={fieldType}
            endIconButtonConfig={
                props.value && props.value !== DEFAULT_SECRET_PLACEHOLDER
                    ? {
                          icon: isFieldTypePassword ? <ICVisibilityOn /> : <ICVisibilityOff />,
                          onClick: () => {
                              setFieldType((prevFieldType) => (prevFieldType === 'password' ? 'text' : 'password'))
                          },
                          ariaLabel: isFieldTypePassword ? 'Show password' : 'Hide password',
                      }
                    : null
            }
        />
    )
}

export default PasswordField
