import { Progressing } from '@Common/Progressing'
import { Tooltip } from '@Common/Tooltip'
import { ComponentSizeType } from '@Shared/constants'
import { ButtonProps, ButtonStyleType, ButtonVariantType } from './types'
import { BUTTON_SIZE_TO_ICON_CLASS_NAME_MAP, BUTTON_SIZE_TO_LOADER_SIZE_MAP } from './constants'
import { getButtonDerivedClass } from './utils'
import './button.scss'

/**
 * Generic component for Button.
 * Should be used in combination of variant, size and style.
 *
 * @example Default button
 * ```tsx
 * <Button text="Hello World"  />
 * ```
 *
 * @example Custom variant
 * ```tsx
 * <Button text="Hello World" variant={ButtonVariantType.secondary}  />
 * ```
 *
 * @example Custom size
 * ```tsx
 * <Button text="Hello World" size={ComponentSizeType.medium}  />
 * ```
 *
 * @example Custom style
 * ```tsx
 * <Button text="Hello World" style={ButtonStyleType.positive}  />
 * ```
 *
 * @example Disabled state
 * ```tsx
 * <Button text="Hello World" disabled  />
 * ```
 *
 * @example Loading state
 * ```tsx
 * <Button text="Hello World" isLoading  />
 * ```
 *
 * @example With start icon
 * ```tsx
 * <Button text="Hello World" startIcon={<ICCube />}  />
 * ```
 *
 * @example With end icon
 * ```tsx
 * <Button text="Hello World" endIcon={<ICCube />}  />
 * ```
 *
 * @example With tippy
 * ```tsx
 * <Button text="Hello World" showTippy tippyContent="Tippy content"  />
 * ```
 *
 */
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
    dataTestId,
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
                    data-testid={dataTestId}
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
