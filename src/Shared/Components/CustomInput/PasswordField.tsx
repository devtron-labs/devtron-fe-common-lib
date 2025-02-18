import { useMemo, useState } from 'react'
import { DEFAULT_SECRET_PLACEHOLDER } from '@Shared/constants'
import { ReactComponent as ICVisibilityOn } from '@Icons/ic-visibility-on.svg'
import { ReactComponent as ICVisibilityOff } from '@Icons/ic-visibility-off.svg'
import CustomInput from './CustomInput'
import { CustomInputProps, PasswordFieldProps } from './types'

const PasswordField = ({ onFocus, onBlur, shouldShowDefaultPlaceholderOnBlur, ...props }: PasswordFieldProps) => {
    const [fieldType, setFieldType] = useState<CustomInputProps['type']>('password')
    const [isFocussed, setIsFocussed] = useState(false)

    const isFieldTypePassword = fieldType === 'password'
    const value = useMemo(() => {
        if (shouldShowDefaultPlaceholderOnBlur && isFocussed && props.value === DEFAULT_SECRET_PLACEHOLDER) {
            return ''
        }

        return !shouldShowDefaultPlaceholderOnBlur ||
            isFocussed ||
            (typeof props.value === 'string' && props.value?.length > 0)
            ? props.value
            : DEFAULT_SECRET_PLACEHOLDER
    }, [shouldShowDefaultPlaceholderOnBlur, isFocussed, props.value])

    const handleFocus: CustomInputProps['onFocus'] = (event) => {
        setIsFocussed(true)
        onFocus?.(event)
    }

    const handleBlur: CustomInputProps['onBlur'] = (event) => {
        setIsFocussed(false)
        setFieldType('password')
        onBlur?.(event)
    }

    return (
        <CustomInput
            {...props}
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            type={fieldType}
            endIconButtonConfig={
                value && value !== DEFAULT_SECRET_PLACEHOLDER
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
