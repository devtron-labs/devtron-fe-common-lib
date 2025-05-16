import { AriaAttributes, HTMLAttributes } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { Tooltip } from '@Common/Tooltip'

import { Icon } from '../Icon'
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
    handleChange,
}: SwitchProps) => {
    const getAriaChecked = (): AriaAttributes['aria-checked'] => {
        if (!isChecked) {
            return false
        }

        return indeterminate ? 'mixed' : true
    }

    const ariaChecked = getAriaChecked()

    const showIndeterminateIcon = ariaChecked === 'mixed'
    const role: HTMLAttributes<HTMLButtonElement>['role'] = showIndeterminateIcon ? 'checkbox' : 'switch'

    const renderContent = () => {
        if (isLoading) {
            return <Icon name="ic-circle-loader" color={null} />
        }

        return (
            <motion.span
                className={`p-1 flex flex-grow-1 ${shape === 'rounded' ? 'br-12' : 'br-4'} ${isChecked ? 'right' : 'left'}`}
                layout
                animate={{
                    backgroundColor: getSwitchTrackColor({ shape, variant, isChecked }),
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
                <motion.span
                    className={getSwitchThumbClass({ indeterminate, shape, isChecked })}
                    layout
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                >
                    <AnimatePresence>
                        {showIndeterminateIcon ? (
                            <motion.span
                                key="dash"
                                className="w-8 h-2 br-4 dc__no-shrink bg__white"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                            />
                        ) : (
                            iconName && (
                                <motion.span
                                    key="icon"
                                    className="flex icon-dim-12 dc__fill-available-space dc__no-shrink"
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
                                        size={12}
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
            <div className={`${getSwitchContainerClass({ shape })} flex dc__no-shrink`}>
                <button
                    type="button"
                    role={role}
                    aria-checked={ariaChecked}
                    aria-label={isLoading ? 'Loading...' : ariaLabel}
                    data-testid={dataTestId}
                    disabled={isDisabled || isLoading}
                    className={`p-0-imp h-100 flex flex-grow-1 dc__transparent ${isDisabled ? 'dc__disabled' : ''} dc__fill-available-space`}
                    onClick={handleChange}
                >
                    {renderContent()}
                </button>
            </div>
        </Tooltip>
    )
}

export default Switch
