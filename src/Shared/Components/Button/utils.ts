import { BUTTON_SIZE_TO_CLASS_NAME_MAP } from './constants'
import { ButtonProps, ButtonStyleType, ButtonVariantType } from './types'

export const getButtonDerivedClass = ({
    size,
    variant,
    style,
    isLoading,
}: Pick<ButtonProps, 'variant' | 'size' | 'style' | 'isLoading'>) =>
    `button button__${ButtonVariantType[variant]}--${ButtonStyleType[style]} ${BUTTON_SIZE_TO_CLASS_NAME_MAP[size]} ${isLoading ? 'button--loading' : ''}`
