import { AriaAttributes, HTMLAttributes } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { Tooltip } from '@Common/Tooltip'
import { ComponentSizeType } from '@Shared/constants'

import { Icon } from '../Icon'
import { INDETERMINATE_ICON_WIDTH_MAP, LOADING_COLOR_MAP, SQUARE_ICON_DIMENSION_MAP } from './constants'
import { SwitchProps } from './types'
import { getSwitchContainerClass, getSwitchIconColor, getSwitchThumbClass, getSwitchTrackColor } from './utils'

const Switch = ({
    ariaLabel,
    dataTestId,
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
    onChange,
}: SwitchProps) => {
    const getAriaCheckedValue = (): AriaAttributes['aria-checked'] => {
        if (!isChecked) {
            return false
        }

        return indeterminate ? 'mixed' : true
    }

    const ariaCheckedValue = getAriaCheckedValue()

    const showIndeterminateIcon = ariaCheckedValue === 'mixed'
    const role: HTMLAttributes<HTMLButtonElement>['role'] = showIndeterminateIcon ? 'checkbox' : 'switch'

    const renderContent = () => {
        if (isLoading) {
            return <Icon name="ic-circle-loader" color={LOADING_COLOR_MAP[variant]} />
        }

        return (
            <motion.span
                className={`flex flex-grow-1 ${shape === 'rounded' ? 'p-2 br-12' : 'p-1 br-4'} ${isChecked ? 'right' : 'left'}`}
                layout
                animate={{
                    backgroundColor: getSwitchTrackColor({ shape, variant, isChecked }),
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
                <motion.span
                    className={getSwitchThumbClass({ shape, size, showIndeterminateIcon })}
                    layout
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                >
                    <AnimatePresence>
                        {showIndeterminateIcon ? (
                            <motion.span
                                key="dash"
                                className={`${INDETERMINATE_ICON_WIDTH_MAP[size]} h-2 br-4 dc__no-shrink bg__white`}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                            />
                        ) : (
                            iconName && (
                                <motion.span
                                    key="icon"
                                    className={`${SQUARE_ICON_DIMENSION_MAP[size]} flex dc__fill-available-space dc__no-shrink`}
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
                                    />
                                </motion.span>
                            )
                        )}
                    </AnimatePresence>
                </motion.span>
            </motion.span>
        )
    }

    // TODO: Can add hidden input for accessibility in case name [for forms] is given
    return (
        <Tooltip alwaysShowTippyOnHover={!!tooltipContent} content={tooltipContent}>
            <div className={`${getSwitchContainerClass({ shape, size })} flex dc__no-shrink py-2`}>
                <button
                    type="button"
                    role={role}
                    aria-checked={ariaCheckedValue}
                    aria-label={isLoading ? 'Loading...' : ariaLabel}
                    data-testid={dataTestId}
                    disabled={isDisabled || isLoading}
                    className={`p-0-imp h-100 flex flex-grow-1 dc__transparent ${isDisabled ? 'dc__disabled' : ''} dc__fill-available-space`}
                    onClick={onChange}
                >
                    {renderContent()}
                </button>
            </div>
        </Tooltip>
    )
}

export default Switch
