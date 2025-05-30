import { LegacyRef, MouseEvent, Ref } from 'react'
import { Link } from 'react-router-dom'

import { Tooltip } from '@Common/Tooltip'
import { ComponentSizeType } from '@Shared/constants'

import { Button, ButtonProps, ButtonVariantType } from '../Button'
import { Icon } from '../Icon'
import { NumbersCount } from '../NumbersCount'
import { getTooltipProps } from '../SelectPicker/common'
import { DTSwitch, DTSwitchProps } from '../Switch'
import { ActionMenuItemProps, ActionMenuItemType } from './types'

const COMMON_ACTION_MENU_ITEM_CLASS = 'w-100 flex left top dc__gap-8 py-6 px-8'

export const ActionMenuItem = <T extends string | number>({
    item,
    itemRef,
    isFocused,
    onClick,
    onMouseEnter,
    disableDescriptionEllipsis = false,
}: ActionMenuItemProps<T>) => {
    const {
        id,
        description,
        label,
        startIcon,
        trailingItem,
        tooltipProps,
        type = 'neutral',
        isDisabled,
        componentType = 'button',
    } = item

    // REFS
    const ref: LegacyRef<HTMLLIElement> = (el) => {
        if (isFocused && el) {
            el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
        }
    }

    // CONSTANTS
    const isNegativeType = type === 'negative'

    // HANDLERS
    const handleClick = (e: MouseEvent<HTMLAnchorElement> | MouseEvent<HTMLButtonElement>) => {
        onClick(item, e)
    }

    const handleTrailingSwitchChange =
        ({ type: trailingItemType, config }: ActionMenuItemType<T>['trailingItem']): DTSwitchProps['onChange'] =>
        (e) => {
            if (trailingItemType === 'switch') {
                e.stopPropagation()
                config.onChange(e)
            }
        }

    const handleTrailingButtonClick =
        ({ type: trailingItemType, config }: ActionMenuItemType<T>['trailingItem']): ButtonProps['onClick'] =>
        (e) => {
            e.stopPropagation()
            if (trailingItemType === 'button' && config.onClick) {
                config.onClick(e)
            }
        }

    // RENDERERS
    const renderIcon = (iconProps: typeof startIcon) =>
        iconProps && (
            <span className="mt-2 flex dc__no-shrink">
                <Icon {...iconProps} color={iconProps.color || (isNegativeType ? 'R500' : 'N800')} />
            </span>
        )

    const renderTrailingItem = () => {
        if (!trailingItem) {
            return null
        }

        const { type: trailingItemType, config } = trailingItem

        switch (trailingItemType) {
            case 'icon':
                return renderIcon(config)
            case 'text': {
                const { value, icon } = config
                return (
                    <span className="flex dc__gap-2 mt-2">
                        <span className="fs-12 lh-1-5 fw-4 cn-7">{value}</span>
                        {icon && <Icon name={icon.name} color={icon.color || (isNegativeType ? 'R500' : 'N700')} />}
                    </span>
                )
            }
            case 'counter':
                return <NumbersCount count={config.value} />
            case 'switch':
                return (
                    <DTSwitch
                        {...config}
                        onChange={handleTrailingSwitchChange(trailingItem)}
                        size={ComponentSizeType.small}
                    />
                )
            case 'button':
                return (
                    <Button
                        {...(config as ButtonProps)}
                        onClick={handleTrailingButtonClick(trailingItem)}
                        variant={ButtonVariantType.borderLess}
                        size={ComponentSizeType.xxs}
                    />
                )
            default:
                return null
        }
    }

    const renderContent = () => (
        <>
            {renderIcon(startIcon)}
            <span className="flex-grow-1">
                <Tooltip content={label} placement="right">
                    <span className={`m-0 fs-13 fw-4 lh-20 dc__truncate ${isNegativeType ? 'cr-5' : 'cn-9'}`}>
                        {label}
                    </span>
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
            </span>
            {renderTrailingItem()}
        </>
    )

    const renderComponent = () => {
        switch (componentType) {
            case 'anchor':
                return (
                    <a
                        ref={itemRef as LegacyRef<HTMLAnchorElement>}
                        className={COMMON_ACTION_MENU_ITEM_CLASS}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        onClick={handleClick}
                    >
                        {renderContent()}
                    </a>
                )
            case 'link':
                return (
                    <Link
                        ref={itemRef as Ref<HTMLAnchorElement>}
                        className={COMMON_ACTION_MENU_ITEM_CLASS}
                        to={item.to}
                        onClick={handleClick}
                    >
                        {renderContent()}
                    </Link>
                )
            case 'button':
            default:
                return (
                    <button
                        ref={itemRef as LegacyRef<HTMLButtonElement>}
                        type="button"
                        className={`dc__transparent ${COMMON_ACTION_MENU_ITEM_CLASS}`}
                        onClick={handleClick}
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
                data-testid={`action-menu-item-${id}`}
                onMouseEnter={onMouseEnter}
                tabIndex={-1}
                // Intentionally added margin to the left and right to have the gap on the edges of the options
                className={`action-menu__option br-4 mr-4 ml-4 ${isDisabled ? 'dc__disabled' : 'cursor'} ${isNegativeType ? 'dc__hover-r50' : 'dc__hover-n50'} ${isFocused ? `action-menu__option--focused${isNegativeType ? '-negative' : ''}` : ''}`}
                aria-disabled={isDisabled}
            >
                {renderComponent()}
            </li>
        </Tooltip>
    )
}
