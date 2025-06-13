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

import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactElement } from 'react'
import { LinkProps } from 'react-router-dom'

import { TooltipProps } from '@Common/Tooltip/types'
import { ComponentSizeType } from '@Shared/constants'

// Using the same for BEM class elements
export enum ButtonVariantType {
    primary = 'primary',
    secondary = 'secondary',
    borderLess = 'border-less',
    text = 'text',
}

export enum ButtonStyleType {
    default = 'default',
    negative = 'negative',
    negativeGrey = 'negative-grey',
    positive = 'positive',
    warning = 'warning',
    neutral = 'neutral',
    neutralN0 = 'neutral-n0',
    neutralWhite = 'neutral-white',
}

export enum ButtonComponentType {
    button = 'button',
    link = 'link',
    anchor = 'anchor',
}

export type ButtonProps<ComponentType extends ButtonComponentType = ButtonComponentType.button> =
    (ComponentType extends ButtonComponentType.link
        ? {
              component: ButtonComponentType.link
              /**
               * Props for the link component
               */
              linkProps: Omit<LinkProps, 'children' | 'styles' | 'className' | 'onClick'>
              buttonProps?: never
              anchorProps?: never
              onClick?: LinkProps['onClick']
          }
        : ComponentType extends ButtonComponentType.anchor
          ? {
                component: ButtonComponentType.anchor
                linkProps?: never
                buttonProps?: never
                /**
                 * Props for the anchor component
                 *
                 * Note: The target is '_blank' & rel is 'noopener noreferrer' by default.
                 */
                anchorProps: Omit<
                    AnchorHTMLAttributes<HTMLAnchorElement>,
                    'children' | 'styles' | 'className' | 'onClick'
                >
                onClick?: AnchorHTMLAttributes<HTMLAnchorElement>['onClick']
            }
          : {
                /**
                 * Component to be rendered from the available options
                 *
                 * @default ButtonComponentType.button
                 */
                component?: ComponentType | never
                /**
                 * Props for the button component
                 */
                buttonProps?: Omit<
                    ButtonHTMLAttributes<HTMLButtonElement>,
                    'children' | 'styles' | 'className' | 'disabled' | 'onClick'
                >
                linkProps?: never
                anchorProps?: never
                onClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick']
            }) & {
        /**
         * Variant of the button
         *
         * @default ButtonVariantType.primary
         */
        variant?: ButtonVariantType
        /**
         * Size of the button
         *
         * @default ComponentSizeType.large
         */
        size?: Exclude<ComponentSizeType, 'xxxs'>
        /**
         * Style to be applied on the button
         *
         * @default ButtonStyleType.default
         */
        style?: ButtonStyleType
        /**
         * If true, the loading state is shown for the button with disabled
         */
        isLoading?: boolean
        /**
         * Test id for the component
         */
        dataTestId: string
        /**
         * If true, the button is disabled
         *
         * @default false
         */
        disabled?: boolean
        /**
         * Determines if the button should expand to fill the full width of its container.
         *
         * @default false
         */
        fullWidth?: boolean
        /**
         * If true, the opacity is turned as 1 on hover of class with dc__opacity-hover--parent
         *
         * @default false
         */
        isOpacityHoverChild?: boolean
        /**
         * If provided, the button is clicked automatically after the pre-defined time
         *
         * Use from useTriggerAutoClickTimestamp hook
         */
        triggerAutoClickTimestamp?: number | null
    } & (
            | {
                  /**
                   * If true, the tooltip is shown for the button
                   */
                  showTooltip: boolean
                  /**
                   * Props for tooltip
                   */
                  tooltipProps:
                      | Omit<Extract<TooltipProps, { alwaysShowTippyOnHover: boolean }>, 'alwaysShowTippyOnHover'>
                      | Omit<Extract<TooltipProps, { alwaysShowTippyOnHover?: boolean }>, 'alwaysShowTippyOnHover'>
                      | Omit<Extract<TooltipProps, { alwaysShowTippyOnHover?: never }>, 'alwaysShowTippyOnHover'>
              }
            | {
                  showTooltip?: never
                  tooltipProps?: never
              }
        ) &
        (
            | {
                  icon?: never
                  ariaLabel?: never
                  showAriaLabelInTippy?: never
                  /**
                   * Text to be displayed in the button
                   */
                  text: string
                  /**
                   * If provided, icon to be displayed at the start of the button
                   */
                  startIcon?: ReactElement
                  /**
                   * If provided, icon to be displayed at the end of the button
                   */
                  endIcon?: ReactElement
                  /**
                   * Controls the font weight of the button text
                   *
                   * @default 'bold'
                   */
                  fontWeight?: 'bold' | 'normal'
              }
            | {
                  /**
                   * If provided, icon button is rendered
                   */
                  icon: ReactElement
                  /**
                   * If false, the ariaLabel is not shown in tippy
                   *
                   * @default true
                   */
                  showAriaLabelInTippy?: boolean
                  /**
                   * Label for the icon button for accessibility.
                   * Shown on hover in tooltip if tippy is not provided explicitly
                   */
                  ariaLabel: string
                  text?: never
                  startIcon?: never
                  endIcon?: never
                  fontWeight?: never
              }
        )
