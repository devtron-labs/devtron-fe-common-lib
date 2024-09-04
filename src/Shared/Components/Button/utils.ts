import { BUTTON_SIZE_TO_CLASS_NAME_MAP } from './constants'
import { ButtonProps } from './types'

export const getButtonDerivedClass = ({
    size,
    variant,
    style,
    isLoading,
}: Pick<ButtonProps, 'variant' | 'size' | 'style' | 'isLoading'>) =>
    `button button__${variant}--${style} ${BUTTON_SIZE_TO_CLASS_NAME_MAP[size]} ${isLoading ? 'button--loading' : ''}`
