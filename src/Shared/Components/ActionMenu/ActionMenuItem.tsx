import { LegacyRef, Ref } from 'react'
import { Link } from 'react-router-dom'

import { Tooltip } from '@Common/Tooltip'

import { Icon } from '../Icon'
import { getTooltipProps } from '../SelectPicker/common'
import { ActionMenuItemProps } from './types'

export const ActionMenuItem = ({
    item,
    itemRef,
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
                <Icon {...iconProps} color={iconProps.color || 'N800'} />
            </div>
        )

    const renderContent = () => (
        <>
            <Tooltip content={label} placement="right">
                <span className={`m-0 fs-13 fw-4 lh-20 dc__truncate ${isNegativeType ? 'cr-5' : 'cn-9'}`}>{label}</span>
            </Tooltip>
            {description &&
                (typeof description === 'string' ? (
                    <span
                        className={`m-0 fs-12 fw-4 lh-18 cn-7 ${!disableDescriptionEllipsis ? 'dc__ellipsis-right__2nd-line' : 'dc__word-break'}`}
                    >
                        {description}
                    </span>
                ) : (
                    description
                ))}
        </>
    )

    const renderComponent = () => {
        switch (item.componentType) {
            case 'anchor':
                return (
                    <a
                        ref={itemRef as LegacyRef<HTMLAnchorElement>}
                        className="flex-grow-1"
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {renderContent()}
                    </a>
                )
            case 'link':
                return (
                    <Link ref={itemRef as Ref<HTMLAnchorElement>} className="flex-grow-1" to={item.to}>
                        {renderContent()}
                    </Link>
                )
            case 'button':
            default:
                return (
                    <button
                        ref={itemRef as LegacyRef<HTMLButtonElement>}
                        type="button"
                        className="dc__transparent p-0 flex-grow-1"
                    >
                        {renderContent()}
                    </button>
                )
        }
    }

    return (
        <Tooltip {...getTooltipProps(tooltipProps)}>
            <li
                ref={ref}
                role="menuitem"
                data-testid={`action-menu-item-${item.value}`}
                onMouseEnter={onMouseEnter}
                tabIndex={-1}
                // Intentionally added margin to the left and right to have the gap on the edges of the options
                className={`action-menu__option br-4 flex left top dc__gap-8 mr-4 ml-4 py-6 px-8 ${isDisabled ? 'dc__disabled' : 'cursor'} ${isNegativeType ? 'dc__hover-r50' : 'dc__hover-n50'} ${isFocused ? `action-menu__option--focused${isNegativeType ? '-negative' : ''}` : ''}`}
                onClick={!isDisabled ? handleClick : undefined}
                aria-disabled={isDisabled}
            >
                {renderIcon(startIcon)}
                {renderComponent()}
                {renderIcon(endIcon)}
            </li>
        </Tooltip>
    )
}
