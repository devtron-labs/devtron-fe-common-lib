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

import { LegacyRef, MouseEvent, Ref } from 'react'
import { Link } from 'react-router-dom'

import { Tooltip } from '@Common/Tooltip'
import { useMainContext } from '@Shared/Providers'

import { getUTMPathAppended } from '../DocLink/utils'
import { Icon } from '../Icon'
import { getTooltipProps } from '../SelectPicker/common'
import { TrailingItem } from '../TrailingItem'
import { ActionMenuItemProps } from './types'

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

    const { isEnterprise } = useMainContext()

    // REFS
    const ref: LegacyRef<HTMLLIElement> = (el) => {
        if (isFocused && el) {
            el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
        }
    }

    // CONSTANTS
    const isNegativeType = type === 'negative'
    const COMMON_ACTION_MENU_ITEM_CLASS = `w-100 flex left top dc__gap-8 py-6 px-8 ${isDisabled ? 'dc__disabled' : 'cursor'}`

    // HANDLERS
    const handleClick = (e: MouseEvent<HTMLAnchorElement> | MouseEvent<HTMLButtonElement>) => {
        if (isDisabled) {
            return
        }
        onClick(item, e)
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

        return <TrailingItem {...trailingItem} variant={type} />
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
                        href={getUTMPathAppended({ isEnterprise, link: item.href })}
                        target="_blank"
                        rel="noreferrer"
                        onClick={handleClick}
                        aria-disabled={isDisabled}
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
                        aria-disabled={isDisabled}
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
                        disabled={isDisabled}
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
                className={`action-menu__option br-4 mr-4 ml-4 ${(!isDisabled && (isNegativeType ? 'dc__hover-r50' : 'dc__hover-n50')) || ''} ${isFocused ? `action-menu__option--focused${isNegativeType ? '-negative' : ''}` : ''}`}
                aria-disabled={isDisabled}
            >
                {renderComponent()}
            </li>
        </Tooltip>
    )
}
