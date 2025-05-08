import { LegacyRef } from 'react'

import { Tooltip } from '@Common/Tooltip'

import { Icon } from '../Icon'
import { getTooltipProps } from '../SelectPicker/common'
import { ActionMenuItemProps } from './types'

export const ActionMenuItem = ({
    item,
    isFocused,
    onClick,
    onMouseEnter,
    disableDescriptionEllipsis = false,
}: ActionMenuItemProps) => {
    const { description, label, startIcon, endIcon, tooltipProps, type = 'neutral', isDisabled } = item

    // REFS
    const ref: LegacyRef<HTMLLIElement> = (el) => {
        if (isFocused && el) {
            el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
        }
    }

    // CONSTANTS
    const isNegativeType = type === 'negative'

    // HANDLERS
    const handleClick = () => {
        onClick(item)
    }

    // RENDERERS
    const renderIcon = (iconProps: typeof startIcon) =>
        iconProps && (
            <div className="mt-2 flex dc__no-shrink">
                <Icon {...iconProps} />
            </div>
        )

    return (
        <Tooltip {...getTooltipProps(tooltipProps)}>
            <li
                ref={ref}
                role="menuitem"
                onMouseEnter={onMouseEnter}
                tabIndex={-1}
                // Intentionally added margin to the left and right to have the gap on the edges of the options
                className={`action-menu__option br-4 flex left top dc__gap-8 mr-4 ml-4 py-6 px-8 ${isDisabled ? 'dc__disabled' : 'cursor'} ${isNegativeType ? 'dc__hover-r50' : 'dc__hover-n50'} ${isFocused ? `action-menu__option--focused${isNegativeType ? '-negative' : ''}` : ''}`}
                onClick={!isDisabled ? handleClick : undefined}
                aria-disabled={isDisabled}
            >
                {renderIcon(startIcon)}
                <div className="flex-grow-1">
                    <Tooltip content={label} placement="right">
                        <h5 className={`m-0 fs-13 fw-4 lh-20 dc__truncate ${isNegativeType ? 'cr-5' : 'cn-9'}`}>
                            {label}
                        </h5>
                    </Tooltip>
                    {description &&
                        (typeof description === 'string' ? (
                            <p
                                className={`m-0 fs-12 fw-4 lh-18 cn-7 ${!disableDescriptionEllipsis ? 'dc__ellipsis-right__2nd-line' : 'dc__word-break'}`}
                            >
                                {description}
                            </p>
                        ) : (
                            <div className="fs-12 lh-18 cn-7">{description}</div>
                        ))}
                </div>
                {renderIcon(endIcon)}
            </li>
        </Tooltip>
    )
}
