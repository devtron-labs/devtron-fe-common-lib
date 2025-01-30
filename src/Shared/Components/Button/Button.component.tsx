/*
 * Copyright (c) 2024. Devtron Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ButtonHTMLAttributes, MutableRefObject, PropsWithChildren, useEffect, useRef, useState } from 'react'
import { Link, LinkProps } from 'react-router-dom'
import { Progressing } from '@Common/Progressing'
import { Tooltip } from '@Common/Tooltip'
import { TooltipProps } from '@Common/Tooltip/types'
import { ComponentSizeType } from '@Shared/constants'
import { ButtonComponentType, ButtonProps, ButtonStyleType, ButtonVariantType } from './types'
import { getButtonDerivedClass, getButtonIconClassName, getButtonLoaderSize } from './utils'
import './button.scss'

const ButtonElement = ({
    component = ButtonComponentType.button,
    linkProps,
    buttonProps,
    onClick,
    elementRef,
    ...props
}: PropsWithChildren<
    Omit<
        ButtonProps<ButtonComponentType>,
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
        | 'ariaLabel'
        | 'showAriaLabelInTippy'
    > & {
        className: string
        'data-testid': ButtonProps['dataTestId']
        'aria-label': ButtonProps['ariaLabel']
        elementRef: MutableRefObject<HTMLButtonElement | HTMLAnchorElement>
    }
>) => {
    if (component === ButtonComponentType.link) {
        return (
            <Link
                {...linkProps}
                {...props}
                // Added the specific class to ensure that the link override is applied
                className={`${props.className} button__link ${props.disabled ? 'dc__disable-click' : ''}`}
                onClick={onClick as LinkProps['onClick']}
                ref={elementRef as MutableRefObject<HTMLAnchorElement>}
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
            ref={elementRef as MutableRefObject<HTMLButtonElement>}
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
 * @example With onClick
 * ```tsx
 * <Button text="Hello World" onClick={noop}  />
 * ```
 *
 * @example Link component
 * ```tsx
 * <Button component={ButtonComponentType.link} linkProps={{ to: '#' }} />
 * ```
 *
 * @example Icon button
 * ```tsx
 * <Button icon={<ICCube />} ariaLabel="Label" />
 * ```
 */
const Button = <ComponentType extends ButtonComponentType>({
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
    icon = null,
    ariaLabel = null,
    showAriaLabelInTippy = true,
    fullWidth = false,
    isOpacityHoverChild = false,
    triggerAutoClickTimestamp,
    ...props
}: ButtonProps<ComponentType>) => {
    const [isAutoClickActive, setIsAutoClickActive] = useState(false)
    const autoClickTimeoutRef = useRef<number>()
    const elementRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null)

    const isDisabled = disabled || isLoading
    const iconClass = `dc__no-shrink flex dc__fill-available-space ${getButtonIconClassName({
        size,
        icon,
    })}`

    useEffect(() => {
        if (triggerAutoClickTimestamp) {
            // Adding after timeout to ensure the transition is triggered after the button is rendered
            setTimeout(() => {
                setIsAutoClickActive(true)

                autoClickTimeoutRef.current = setTimeout(() => {
                    elementRef.current.click()
                    // This is 100ms less than the duration of the transition in CSS
                    // Make sure to update the same in CSS if this is changed
                }, 2400)
            }, 100)
        }

        return () => {
            setIsAutoClickActive(false)
            clearTimeout(autoClickTimeoutRef.current)
        }
    }, [triggerAutoClickTimestamp])

    const handleClick: ButtonProps<ComponentType>['onClick'] = (e) => {
        setIsAutoClickActive(false)
        clearTimeout(autoClickTimeoutRef.current)

        props.onClick?.(e)
    }

    const getTooltipProps = (): TooltipProps => {
        // Show the aria label as tippy only if the action based tippy is not to be shown
        if (!showTooltip && showAriaLabelInTippy && icon && ariaLabel) {
            return {
                alwaysShowTippyOnHover: true,
                content: ariaLabel,
            }
        }

        if (Object.hasOwn(tooltipProps, 'shortcutKeyCombo') && 'shortcutKeyCombo' in tooltipProps) {
            return tooltipProps
        }

        return {
            // TODO: using some typing somersaults here, clean it up later
            alwaysShowTippyOnHover: showTooltip && !!(tooltipProps as Required<Pick<TooltipProps, 'content'>>)?.content,
            ...(tooltipProps as Required<Pick<TooltipProps, 'content'>>),
        }
    }

    return (
        <Tooltip {...getTooltipProps()}>
            <div>
                <ButtonElement
                    {...props}
                    disabled={isDisabled}
                    className={`br-4 flex cursor dc__tab-focus dc__position-rel dc__capitalize ${isOpacityHoverChild ? 'dc__opacity-hover--child' : ''} ${getButtonDerivedClass({ size, variant, style, isLoading, icon, isAutoTriggerActive: isAutoClickActive })} ${isDisabled ? 'dc__disabled' : ''} ${fullWidth ? 'w-100' : ''}`}
                    data-testid={dataTestId}
                    aria-label={ariaLabel}
                    elementRef={elementRef}
                    onClick={handleClick}
                >
                    {icon ? (
                        <span className={iconClass}>{icon}</span>
                    ) : (
                        <>
                            {startIcon && <span className={iconClass}>{startIcon}</span>}
                            <span className="dc__align-left">{text}</span>
                            {endIcon && <span className={iconClass}>{endIcon}</span>}
                        </>
                    )}
                    {isLoading && (
                        <Progressing
                            size={getButtonLoaderSize({
                                size,
                                icon,
                            })}
                        />
                    )}
                </ButtonElement>
            </div>
        </Tooltip>
    )
}

export default Button
