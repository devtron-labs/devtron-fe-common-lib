import { ButtonHTMLAttributes, PropsWithChildren } from 'react'
import { Link, LinkProps } from 'react-router-dom'
import { Progressing } from '@Common/Progressing'
import { Tooltip } from '@Common/Tooltip'
import { ComponentSizeType } from '@Shared/constants'
import { ButtonComponentType, ButtonProps, ButtonStyleType, ButtonVariantType } from './types'
import { BUTTON_SIZE_TO_ICON_CLASS_NAME_MAP, BUTTON_SIZE_TO_LOADER_SIZE_MAP } from './constants'
import { getButtonDerivedClass } from './utils'
import './button.scss'

const ButtonElement = ({
    component = ButtonComponentType.button,
    linkProps,
    buttonProps,
    onClick,
    ...props
}: PropsWithChildren<
    Omit<
        ButtonProps,
        | 'text'
        | 'variant'
        | 'size'
        | 'style'
        | 'startIcon'
        | 'endIcon'
        | 'showTooltip'
        | 'tooltipProps'
        | 'dataTestId'
        | 'isLoading'
    > & {
        className: string
        'data-testid': ButtonProps['dataTestId']
    }
>) => {
    if (component === ButtonComponentType.link) {
        return (
            <Link
                {...linkProps}
                {...props}
                className={`${props.className} ${props.disabled ? 'dc__disable-click' : ''}`}
                onClick={onClick as LinkProps['onClick']}
            />
        )
    }

    return (
        <button
            {...buttonProps}
            {...props}
            // eslint-disable-next-line react/button-has-type
            type={buttonProps?.type || 'button'}
            onClick={onClick as ButtonHTMLAttributes<HTMLButtonElement>['onClick']}
        />
    )
}

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
    dataTestId,
    text,
    variant = ButtonVariantType.primary,
    size = ComponentSizeType.large,
    style = ButtonStyleType.default,
    startIcon = null,
    endIcon = null,
    disabled = false,
    isLoading = false,
    showTooltip = false,
    tooltipProps = {},
    ...props
}: ButtonProps) => {
    const isDisabled = disabled || isLoading
    const iconClass = `dc__no-shrink flex dc__fill-available-space ${BUTTON_SIZE_TO_ICON_CLASS_NAME_MAP[size]}`

    return (
        <Tooltip {...tooltipProps} alwaysShowTippyOnHover={showTooltip && !!tooltipProps?.content}>
            <div>
                <ButtonElement
                    {...props}
                    disabled={isDisabled}
                    className={`br-4 flex cursor dc__mnw-100 dc__tab-focus dc__position-rel dc__capitalize ${getButtonDerivedClass({ size, variant, style, isLoading })} ${isDisabled ? 'dc__disabled' : ''}`}
                    data-testid={dataTestId}
                >
                    {startIcon && <span className={iconClass}>{startIcon}</span>}
                    <span className="dc__mxw-150 dc__align-left dc__truncate">{text}</span>
                    {endIcon && <span className={iconClass}>{endIcon}</span>}
                    {isLoading && <Progressing size={BUTTON_SIZE_TO_LOADER_SIZE_MAP[size]} />}
                </ButtonElement>
            </div>
        </Tooltip>
    )
}

export default Button
