import { ComponentSizeType } from '@Shared/constants'
import { ButtonProps, ButtonStyleType, ButtonVariantType } from './types'
import { BUTTON_SIZE_TO_CLASS_NAME_MAP, BUTTON_SIZE_TO_ICON_CLASS_NAME_MAP } from './constants'
import './button.scss'

export const getButtonDerivedClass = ({ size, variant, style }: Pick<ButtonProps, 'variant' | 'size' | 'style'>) =>
    `button button__${ButtonVariantType[variant]}--${ButtonStyleType[style]} ${BUTTON_SIZE_TO_CLASS_NAME_MAP[size]}`

const Button = ({
    buttonProps = {},
    variant = ButtonVariantType.primary,
    size = ComponentSizeType.large,
    style = ButtonStyleType.default,
    text,
    startIcon,
    endIcon,
}: ButtonProps) => {
    const iconClass = `dc__no-shrink flex dc__fill-available-space ${BUTTON_SIZE_TO_ICON_CLASS_NAME_MAP[size]}`

    return (
        <button
            {...buttonProps}
            // eslint-disable-next-line react/button-has-type
            type={buttonProps.type || 'button'}
            className={`br-4 flex cursor dc__mnw-100 ${getButtonDerivedClass({ size, variant, style })} ${buttonProps.className || ''}`}
        >
            {startIcon && <span className={iconClass}>{startIcon}</span>}
            <span className="dc__mxw-150 dc__align-left dc__truncate">{text}</span>
            {endIcon && <span className={iconClass}>{endIcon}</span>}
        </button>
    )
}

export default Button
