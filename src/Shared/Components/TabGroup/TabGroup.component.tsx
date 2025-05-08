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

import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

import { Tooltip } from '@Common/Tooltip'
import { ComponentSizeType } from '@Shared/constants'

import { getTabBadge, getTabDescription, getTabIcon, getTabIndicator } from './TabGroup.helpers'
import { AdditionalTabProps, TabGroupProps, TabProps } from './TabGroup.types'
import { getClassNameBySizeMap, tabGroupClassMap } from './TabGroup.utils'

import './TabGroup.scss'

const MotionLayoutUnderline = ({ layoutId }: { layoutId: string }) => (
    <motion.div
        layout="position"
        transformTemplate={(_, generatedTransform) =>
            // Replace the y value in translate3d(x, y, z) with 0px to omit y axis transitions
            generatedTransform.replace(/translate3d\(([^,]+),\s*[^,]+,\s*([^)]+)\)/, 'translate3d($1, 0px, $2)')
        }
        layoutId={layoutId}
        className="underline bcb-5 w-100 dc__position-abs"
    />
)

const Tab = ({
    label,
    props,
    tabType,
    active,
    icon,
    size,
    badge = null,
    hideTopPadding,
    showIndicator,
    showError,
    showWarning,
    disabled,
    description,
    shouldWrapTooltip,
    tooltipProps,
    uniqueGroupId,
}: TabProps & Pick<TabGroupProps, 'size' | 'hideTopPadding'> & AdditionalTabProps) => {
    const { pathname, search } = useLocation()
    const ref = useRef<HTMLAnchorElement>(null)
    const [isTabActive, setIsTabActive] = useState(tabType === 'button' && active)

    useEffect(() => {
        if (tabType === 'navLink') {
            setIsTabActive(ref.current?.classList.contains('active') || false)
            return
        }
        setIsTabActive(active)
    }, [active, tabType, pathname, search])

    const { tabClassName, iconClassName, badgeClassName } = getClassNameBySizeMap({
        hideTopPadding,
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
                <span className="m-0 flexbox dc__align-items-center dc__gap-6">
                    {getTabIcon({ className: iconClassName, icon, showError, showWarning, size, active })}
                    <Tooltip content={label}>
                        <span className="dc__truncate">{label}</span>
                    </Tooltip>
                    {getTabBadge(badge, badgeClassName)}
                    {getTabIndicator(showIndicator)}
                </span>
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
                        ref={ref}
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
            className={`tab-group__tab lh-20 ${active ? 'cb-5 fw-6' : 'cn-9 fw-4'} ${tabType === 'block' ? 'tab-group__tab--block' : ''} ${disabled ? 'dc__disabled' : 'cursor'}`}
        >
            {getTabComponent()}
            {isTabActive && <MotionLayoutUnderline layoutId={uniqueGroupId} />}
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
    hideTopPadding,
}: TabGroupProps) => {
    // Unique layoutId for motion.div to handle multiple tab groups on same page
    // Using tab labels so that id remains same on re mount as well
    const uniqueGroupId = useMemo(() => tabs.map((tab) => tab.label).join('-'), [])

    return (
        <div className="flexbox dc__align-items-center dc__content-space">
            <ul role="tablist" className={`tab-group flexbox dc__align-items-center p-0 m-0 ${tabGroupClassMap[size]}`}>
                {tabs.map(({ id, ...resProps }) => (
                    <Tab
                        key={id}
                        id={id}
                        size={size}
                        hideTopPadding={hideTopPadding}
                        uniqueGroupId={uniqueGroupId}
                        {...resProps}
                    />
                ))}
            </ul>
            {rightComponent || null}
        </div>
    )
}
