import { Progressing } from '@Common/Progressing'
import { ComponentSizeType } from '@Shared/constants'
import { ButtonProps, ButtonStyleType, ButtonVariantType } from './types'
import { BUTTON_SIZE_TO_ICON_CLASS_NAME_MAP, BUTTON_SIZE_TO_LOADER_SIZE_MAP } from './constants'
import { getButtonDerivedClass } from './utils'
import './button.scss'

const Button = ({
    buttonProps = {},
    variant = ButtonVariantType.primary,
    size = ComponentSizeType.large,
    style = ButtonStyleType.default,
    text,
    startIcon,
    endIcon,
    disabled,
    isLoading,
}: ButtonProps) => {
    const visibilityClass = isLoading ? 'dc__visibility-hidden' : ''
    const iconClass = `dc__no-shrink flex dc__fill-available-space ${BUTTON_SIZE_TO_ICON_CLASS_NAME_MAP[size]} ${visibilityClass}`

    return (
        <button
            {...buttonProps}
            disabled={disabled || isLoading}
            // eslint-disable-next-line react/button-has-type
            type={buttonProps.type || 'button'}
            className={`br-4 flex cursor dc__mnw-100 dc__tab-focus dc__position-rel dc__capitalize ${getButtonDerivedClass({ size, variant, style })} ${disabled ? 'dc__disabled' : ''} ${buttonProps.className || ''}`}
        >
            {startIcon && <span className={iconClass}>{startIcon}</span>}
            <span className={`dc__mxw-150 dc__align-left dc__truncate ${visibilityClass}`}>{text}</span>
            {endIcon && <span className={iconClass}>{endIcon}</span>}
            {isLoading && <Progressing size={BUTTON_SIZE_TO_LOADER_SIZE_MAP[size]} />}
        </button>
    )
}

export default Button
