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

import { forwardRef, MutableRefObject, PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { Progressing } from '@Common/Progressing'
import { Tooltip, TooltipProps } from '@Common/Tooltip'
import { ComponentSizeType } from '@Shared/constants'

import { ButtonComponentType, ButtonProps, ButtonStyleType, ButtonVariantType } from './types'
import { getButtonDerivedClass, getButtonIconClassName, getButtonLoaderSize } from './utils'

import './button.scss'

const ButtonElement = forwardRef<
    HTMLButtonElement | HTMLAnchorElement,
    PropsWithChildren<
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
    >
>(
    (
        { component = ButtonComponentType.button, anchorProps, linkProps, buttonProps, onClick, elementRef, ...props },
        forwardedRef,
    ) => {
        // Added the specific class to ensure that the link override is applied
        const linkOrAnchorClassName = `${props.className} button__link ${props.disabled ? 'dc__disable-click' : ''}`

        // NOTE: If the ref callback is re-created every render (i.e., not wrapped in useCallback),
        // it will be invoked on every render: first with null, then with the new node.
        const refCallback = useCallback((el: HTMLButtonElement | HTMLAnchorElement) => {
            if (!el) {
                return
            }

            // eslint-disable-next-line no-param-reassign
            elementRef.current = el

            if (forwardedRef && typeof forwardedRef === 'object' && Object.hasOwn(forwardedRef, 'current')) {
                // eslint-disable-next-line no-param-reassign
                forwardedRef.current = el
            } else if (typeof forwardedRef === 'function') {
                forwardedRef(el)
            }
        }, [])

        if (component === ButtonComponentType.link) {
            return (
                <Link
                    {...linkProps}
                    {...props}
                    className={linkOrAnchorClassName}
                    onClick={onClick as ButtonProps<typeof component>['onClick']}
                    ref={refCallback}
                />
            )
        }

        if (component === ButtonComponentType.anchor) {
            return (
                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    {...anchorProps}
                    {...props}
                    className={linkOrAnchorClassName}
                    onClick={onClick as ButtonProps<typeof component>['onClick']}
                    ref={refCallback}
                >
                    {props.children}
                </a>
            )
        }

        return (
            <button
                {...buttonProps}
                {...props}
                // eslint-disable-next-line react/button-has-type
                type={buttonProps?.type || 'button'}
                onClick={onClick as ButtonProps<typeof component>['onClick']}
                ref={refCallback}
            />
        )
    },
)

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
const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps<ButtonComponentType>>(
    (
        {
            dataTestId,
            text,
            variant = ButtonVariantType.primary,
            size = ComponentSizeType.large,
            style = ButtonStyleType.default,
            fontWeight = 'bold',
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
        },
        forwardedRef,
    ) => {
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
                        // This is 5ms less than the duration of the transition in CSS
                        // Make sure to update the same in CSS if this is changed
                    }, 1495)
                }, 100)
            }

            return () => {
                setIsAutoClickActive(false)
                clearTimeout(autoClickTimeoutRef.current)
            }
        }, [triggerAutoClickTimestamp])

        const handleClick: ButtonProps<ButtonComponentType>['onClick'] = (e) => {
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
                return tooltipProps as TooltipProps
            }

            return {
                alwaysShowTippyOnHover: showTooltip && !!tooltipProps?.content,
                ...tooltipProps,
            } as TooltipProps
        }

        return (
            <Tooltip {...getTooltipProps()}>
                <div className={`dc__inline-block ${fullWidth ? 'w-100' : ''}`}>
                    <ButtonElement
                        ref={forwardedRef}
                        {...props}
                        disabled={isDisabled}
                        className={`br-4 flex cursor dc__tab-focus dc__position-rel dc__capitalize ${isOpacityHoverChild ? 'dc__opacity-hover--child' : ''} ${getButtonDerivedClass({ size, variant, style, isLoading, icon, isAutoTriggerActive: isAutoClickActive, fontWeight })} ${isDisabled ? 'dc__disabled' : ''} ${fullWidth ? 'w-100' : ''}`}
                        data-testid={dataTestId}
                        aria-label={ariaLabel || (isLoading ? text : undefined)}
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
    },
)

export default Button
