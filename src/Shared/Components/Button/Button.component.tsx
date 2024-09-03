import { Progressing } from '@Common/Progressing'
import { Tooltip } from '@Common/Tooltip'
import { ComponentSizeType } from '@Shared/constants'
import { ButtonProps, ButtonStyleType, ButtonVariantType } from './types'
import { BUTTON_SIZE_TO_ICON_CLASS_NAME_MAP, BUTTON_SIZE_TO_LOADER_SIZE_MAP } from './constants'
import { getButtonDerivedClass } from './utils'
import './button.scss'

const Button = ({
    variant = ButtonVariantType.primary,
    size = ComponentSizeType.large,
    style = ButtonStyleType.default,
    text,
    startIcon,
    endIcon,
    disabled,
    isLoading,
    showTippy,
    tippyContent,
    type = 'button',
    ...props
}: ButtonProps) => {
    const isDisabled = disabled || isLoading
    const iconClass = `dc__no-shrink flex dc__fill-available-space ${BUTTON_SIZE_TO_ICON_CLASS_NAME_MAP[size]}`

    return (
        <Tooltip content={tippyContent} alwaysShowTippyOnHover={showTippy && !!tippyContent}>
            <div>
                <button
                    {...props}
                    disabled={isDisabled}
                    // eslint-disable-next-line react/button-has-type
                    type={type}
                    className={`br-4 flex cursor dc__mnw-100 dc__tab-focus dc__position-rel dc__capitalize ${getButtonDerivedClass({ size, variant, style, isLoading })} ${isDisabled ? 'dc__disabled' : ''}`}
                >
                    {startIcon && <span className={iconClass}>{startIcon}</span>}
                    <span className="dc__mxw-150 dc__align-left dc__truncate">{text}</span>
                    {endIcon && <span className={iconClass}>{endIcon}</span>}
                    {isLoading && <Progressing size={BUTTON_SIZE_TO_LOADER_SIZE_MAP[size]} />}
                </button>
            </div>
        </Tooltip>
    )
}

export default Button
