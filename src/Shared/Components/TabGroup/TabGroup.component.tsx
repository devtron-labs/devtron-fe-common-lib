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

import { Link, NavLink } from 'react-router-dom'

import { Tooltip } from '@Common/Tooltip'
import { ComponentSizeType } from '@Shared/constants'

import { getTabBadge, getTabDescription, getTabIcon, getTabIndicator } from './TabGroup.helpers'
import { TabGroupProps, TabProps } from './TabGroup.types'
import { getClassNameBySizeMap, tabGroupClassMap } from './TabGroup.utils'

import './TabGroup.scss'

const Tab = ({
    label,
    props,
    tabType,
    active,
    icon,
    size,
    badge = null,
    alignActiveBorderWithContainer,
    hideTopPadding,
    showIndicator,
    showError,
    showWarning,
    disabled,
    description,
    shouldWrapTooltip,
    tooltipProps,
    iconElement,
}: TabProps & Pick<TabGroupProps, 'size' | 'alignActiveBorderWithContainer' | 'hideTopPadding'>) => {
    const { tabClassName, iconClassName, badgeClassName } = getClassNameBySizeMap({
        hideTopPadding,
        alignActiveBorderWithContainer,
    })[size]

    const onClickHandler = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent> &
            React.MouseEvent<HTMLAnchorElement, MouseEvent> &
            React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => {
        if (active || e.currentTarget.classList.contains('active') || (tabType === 'navLink' && disabled)) {
            e.preventDefault()
        }
        props?.onClick?.(e)
    }

    const getTabComponent = () => {
        const content = (
            <>
                <p className="m-0 flexbox dc__align-items-center dc__gap-6">
                    {getTabIcon({ className: iconClassName, icon, showError, showWarning, size, active, iconElement })}
                    {label}
                    {getTabBadge(badge, badgeClassName)}
                    {getTabIndicator(showIndicator)}
                </p>
                {getTabDescription(description)}
            </>
        )

        switch (tabType) {
            case 'link':
                return (
                    <Link
                        className={`${tabClassName} dc__no-decor flexbox-col ${disabled ? 'cursor-not-allowed' : ''}`}
                        aria-disabled={disabled}
                        {...props}
                        onClick={onClickHandler}
                    >
                        {content}
                    </Link>
                )
            case 'navLink':
                return (
                    <NavLink
                        className={`${tabClassName} dc__no-decor flexbox-col tab-group__tab__nav-link ${disabled ? 'cursor-not-allowed' : ''}`}
                        aria-disabled={disabled}
                        {...props}
                        onClick={onClickHandler}
                    >
                        {content}
                    </NavLink>
                )
            case 'block':
                return (
                    <div
                        className={`flexbox-col fw-6 ${tabClassName} ${disabled ? 'cursor-not-allowed' : ''}`}
                        {...props}
                    >
                        {content}
                    </div>
                )
            default:
                return (
                    <button
                        type="button"
                        className={`dc__unset-button-styles flexbox-col ${tabClassName} ${disabled ? 'cursor-not-allowed' : ''}`}
                        disabled={disabled}
                        {...props}
                        onClick={onClickHandler}
                    >
                        {content}
                    </button>
                )
        }
    }

    const renderTabContainer = () => (
        <li
            className={`tab-group__tab lh-20 ${active ? 'tab-group__tab--active cb-5 fw-6' : 'cn-9 fw-4'} ${alignActiveBorderWithContainer ? 'tab-group__tab--align-active-border' : ''} ${tabType === 'block' ? 'tab-group__tab--block' : ''} ${disabled ? 'dc__disabled' : 'cursor'}`}
        >
            {getTabComponent()}
        </li>
    )

    if (shouldWrapTooltip) {
        return <Tooltip {...tooltipProps}>{renderTabContainer()}</Tooltip>
    }

    return renderTabContainer()
}

export const TabGroup = ({
    tabs = [],
    size = ComponentSizeType.large,
    rightComponent,
    alignActiveBorderWithContainer,
    hideTopPadding,
}: TabGroupProps) => (
    <div className="flexbox dc__align-items-center dc__content-space">
        <ul role="tablist" className={`tab-group flexbox dc__align-items-center p-0 m-0 ${tabGroupClassMap[size]}`}>
            {tabs.map(({ id, ...resProps }) => (
                <Tab
                    key={id}
                    id={id}
                    size={size}
                    alignActiveBorderWithContainer={alignActiveBorderWithContainer}
                    hideTopPadding={hideTopPadding}
                    {...resProps}
                />
            ))}
        </ul>
        {rightComponent || null}
    </div>
)
