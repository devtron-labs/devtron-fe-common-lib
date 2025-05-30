import { AriaAttributes, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { Tooltip } from '@Common/Tooltip'
import { ComponentSizeType } from '@Shared/constants'
import { getUniqueId } from '@Shared/Helpers'

import { Icon } from '../Icon'
import { INDETERMINATE_ICON_WIDTH_MAP, LOADING_COLOR_MAP } from './constants'
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

    const renderContent = () => (
        <motion.span
            className={`flex flex-grow-1 ${getThumbPadding({ shape, isLoading })} ${getThumbPosition({ isChecked, isLoading })}`}
            layout
            transition={{ ease: 'easeInOut', duration: 0.2 }}
        >
            {isLoading ? (
                <motion.span
                    transition={{ ease: 'easeInOut', duration: 0.2 }}
                    layoutId={`${name}-loader`}
                    className="flex-grow-1 h-100 dc__fill-available-space dc__no-shrink"
                >
                    <Icon name="ic-circle-loader" color={LOADING_COLOR_MAP[variant]} size={null} />
                </motion.span>
            ) : (
                <motion.span
                    layoutId={`${name}-thumb`}
                    className={getSwitchThumbClass({ shape, size, showIndeterminateIcon })}
                    layout
                    transition={{ ease: 'easeInOut', duration: 0.2 }}
                >
                    <AnimatePresence>
                        {showIndeterminateIcon ? (
                            <motion.span
                                className={`${INDETERMINATE_ICON_WIDTH_MAP[size]} h-2 br-4 dc__no-shrink bg__white`}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                            />
                        ) : (
                            iconName && (
                                <motion.span
                                    className="icon-dim-12 flex dc__fill-available-space dc__no-shrink"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                >
                                    <Icon
                                        name={iconName}
                                        color={getSwitchIconColor({
                                            isChecked,
                                            iconColor,
                                            variant,
                                        })}
                                        size={null}
                                    />
                                </motion.span>
                            )
                        )}
                    </AnimatePresence>
                </motion.span>
            )}
        </motion.span>
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
                    data-testid={name}
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
