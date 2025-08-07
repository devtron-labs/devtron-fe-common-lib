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

import { AriaAttributes, useRef } from 'react'
import { motion } from 'framer-motion'

import { Tooltip } from '@Common/Tooltip'
import { ComponentSizeType } from '@Shared/constants'
import { getUniqueId } from '@Shared/Helpers'

import { Icon } from '../Icon'
import { LOADING_COLOR_MAP } from './constants'
import { DTSwitchProps } from './types'
import {
    getSwitchContainerClass,
    getSwitchIconColor,
    getSwitchThumbClass,
    getSwitchTrackColor,
    getSwitchTrackHoverColor,
    getThumbPadding,
    getThumbPosition,
} from './utils'

import './switch.scss'

const Switch = ({
    ariaLabel,
    isDisabled,
    isLoading,
    isChecked,
    tooltipContent,
    shape = 'rounded',
    variant = 'positive',
    iconColor,
    iconName,
    indeterminate = false,
    size = ComponentSizeType.medium,
    name,
    dataTestId = name,
    onChange,
    autoFocus = false,
}: DTSwitchProps) => {
    const inputId = useRef(getUniqueId())

    const getAriaCheckedValue = (): AriaAttributes['aria-checked'] => {
        if (!isChecked) {
            return false
        }

        return indeterminate ? 'mixed' : true
    }

    const ariaCheckedValue = getAriaCheckedValue()

    const showIndeterminateIcon = ariaCheckedValue === 'mixed'

    const thumbPosition = getThumbPosition({ isChecked, shape, size, indeterminate, isLoading })

    const renderContent = () => (
        <span
            className={`flexbox flex-grow-1 ${!isLoading && showIndeterminateIcon ? 'dc__align-items-center' : ''} ${getThumbPadding({ shape, isLoading })}`}
        >
            {isLoading ? (
                <motion.span
                    transition={{ ease: 'easeInOut', duration: 0.2 }}
                    animate={{
                        x: thumbPosition,
                    }}
                    className="flexbox dc__fill-available-space"
                >
                    <Icon name="ic-circle-loader" color={LOADING_COLOR_MAP[variant]} size={null} />
                </motion.span>
            ) : (
                <motion.span
                    transition={{ ease: 'easeInOut', duration: 0.2 }}
                    animate={{
                        x: thumbPosition,
                    }}
                    className={getSwitchThumbClass({ shape, size, showIndeterminateIcon })}
                >
                    {iconName && !showIndeterminateIcon && (
                        <span className="icon-dim-12 flex dc__fill-available-space dc__no-shrink">
                            <Icon
                                name={iconName}
                                color={getSwitchIconColor({
                                    isChecked,
                                    iconColor,
                                    variant,
                                })}
                                size={null}
                            />
                        </span>
                    )}
                </motion.span>
            )}
        </span>
    )

    return (
        <Tooltip alwaysShowTippyOnHover={!!tooltipContent} content={tooltipContent}>
            <label
                htmlFor={inputId.current}
                className={`${getSwitchContainerClass({ shape, size })} flex dc__no-shrink py-2 m-0`}
            >
                <input
                    type="checkbox"
                    id={inputId.current}
                    name={name}
                    checked={isChecked}
                    disabled={isDisabled}
                    readOnly
                    hidden
                />

                <button
                    type="button"
                    role="checkbox"
                    // eslint-disable-next-line jsx-a11y/no-autofocus
                    autoFocus={autoFocus}
                    aria-checked={ariaCheckedValue}
                    aria-labelledby={inputId.current}
                    aria-label={isLoading ? 'Loading...' : ariaLabel}
                    data-testid={dataTestId}
                    disabled={isDisabled || isLoading}
                    aria-disabled={isDisabled}
                    className={`p-0-imp h-100 flex flex-grow-1 dc__no-border dt-switch__track ${shape === 'rounded' ? 'br-12' : 'br-4'} ${getSwitchTrackColor({ shape, variant, isChecked, isLoading })} ${isDisabled ? 'dc__disabled' : ''} dc__fill-available-space`}
                    onClick={onChange}
                    style={{
                        // Adding hover styles directly to the button
                        ['--switch-track-hover-color' as string]: getSwitchTrackHoverColor({
                            shape,
                            variant,
                            isChecked,
                            isLoading,
                        }),
                    }}
                >
                    {renderContent()}
                </button>
            </label>
        </Tooltip>
    )
}

export default Switch
