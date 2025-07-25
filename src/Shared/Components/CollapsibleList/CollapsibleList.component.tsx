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

import React, { Fragment } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import Tippy, { TippyProps } from '@tippyjs/react'

import { ReactComponent as ICExpand } from '@Icons/ic-expand.svg'
import { ConditionalWrap } from '@Common/Helper'
import { Tooltip } from '@Common/Tooltip'

import { Collapse } from '../Collapse'
import { CollapsibleListItem, CollapsibleListProps, TabOptions } from './CollapsibleList.types'

import './CollapsibleList.scss'

const renderWithTippy = (tippyProps: TippyProps) => (children: React.ReactElement) => (
    <Tippy {...tippyProps} className={`default-tt ${tippyProps?.className || ''}`}>
        <div className="flex dc__align-self-start">{children}</div>
    </Tippy>
)

/**
 * @deprecated - Please use `TreeView` component instead.
 */
export const CollapsibleList = <TabType extends TabOptions>({
    config,
    tabType,
    onCollapseBtnClick,
}: CollapsibleListProps<TabType>) => {
    const { pathname } = useLocation()

    const getTabContent = (item: CollapsibleListItem<TabOptions>) => {
        const { title, subtitle, strikeThrough, iconConfig } = item
        return (
            <>
                <div className="flexbox-col flex-grow-1 mw-none">
                    <Tooltip content={title} placement="right">
                        <span
                            className={`collapsible__item__title dc__truncate fs-13 lh-20 ${strikeThrough ? 'dc__strike-through' : ''}`}
                        >
                            {title}
                        </span>
                    </Tooltip>
                    {subtitle && (
                        <Tooltip content={subtitle} placement="right">
                            <span className="dc__truncate fw-4 lh-1-5 cn-7">{subtitle}</span>
                        </Tooltip>
                    )}
                </div>
                {iconConfig && (
                    <ConditionalWrap
                        condition={!!iconConfig.tooltipProps}
                        wrap={renderWithTippy(iconConfig.tooltipProps)}
                    >
                        <iconConfig.Icon
                            {...iconConfig.props}
                            className={`icon-dim-20 p-2 dc__no-shrink cursor ${iconConfig.props?.className || ''}`}
                        />
                    </ConditionalWrap>
                )}
            </>
        )
    }

    const getButtonTabItem = (item: CollapsibleListItem<'button'>) => {
        const { title, isActive, onClick, id } = item
        return (
            <button
                key={id || title}
                className={`collapsible__item flexbox dc__align-start dc__gap-8 dc__no-decor br-4 py-6 px-8 cursor ${isActive ? 'active' : ''} dc__unset-button-styles w-100 dc__align-left`}
                onClick={(e) => {
                    // Prevent navigation to the same page
                    if (isActive) {
                        e.preventDefault()
                    }
                    onClick?.(e)
                }}
                type="button"
            >
                {getTabContent(item)}
            </button>
        )
    }

    const getNavLinkTabItem = (item: CollapsibleListItem<'navLink'>) => {
        const { title, href, onClick, isActive, clearQueryParamsOnNavigation = false } = item
        return (
            <NavLink
                key={title}
                to={clearQueryParamsOnNavigation ? { pathname: href, search: '' } : href}
                className="collapsible__item flexbox dc__align-items-center dc__gap-8 dc__no-decor br-4 py-6 px-8 cursor"
                onClick={(e) => {
                    // Prevent navigation to the same page
                    if (href === pathname) {
                        e.preventDefault()
                    }
                    onClick?.(e)
                }}
                isActive={isActive}
            >
                {getTabContent(item)}
            </NavLink>
        )
    }

    return (
        <div className="mw-none bg__primary">
            {config.map(({ id, header, headerIconConfig, items, noItemsText, isExpanded }) => (
                <Fragment key={id}>
                    <div className="flexbox dc__align-items-center dc__gap-4 py-6 px-8 br-4 dc__hover-n50">
                        <button
                            type="button"
                            className="dc__unset-button-styles mw-none flexbox dc__align-items-center flex-grow-1 p-0 cn-9 fs-13 lh-1-5 fw-6 dc__gap-4"
                            onClick={(e) => onCollapseBtnClick(id, e)}
                        >
                            <ICExpand
                                className="icon-dim-20 fcn-6 dc__no-shrink cursor rotate"
                                style={{ ['--rotateBy' as string]: isExpanded ? '0deg' : '-90deg' }}
                            />
                            <Tooltip content={header} placement="right">
                                <span className="flex-grow-1 dc__align-left dc__truncate">{header}</span>
                            </Tooltip>
                        </button>
                        {headerIconConfig && (
                            <ConditionalWrap
                                condition={!!headerIconConfig.tooltipProps}
                                wrap={renderWithTippy(headerIconConfig.tooltipProps)}
                            >
                                <button
                                    {...headerIconConfig.btnProps}
                                    type="button"
                                    className={`dc__unset-button-styles dc__no-shrink cursor br-4 bg__primary flex ${headerIconConfig.btnProps?.className || ''}`}
                                >
                                    <headerIconConfig.Icon
                                        {...headerIconConfig.props}
                                        className={`icon-dim-20 ${headerIconConfig.props?.className || ''}`}
                                    />
                                </button>
                            </ConditionalWrap>
                        )}
                    </div>
                    <Collapse expand={isExpanded}>
                        <div className="collapsible ml-18 pl-4 dc__border-left">
                            {!items.length ? (
                                <div className="collapsible__item flexbox dc__gap-8 dc__no-decor no-hover br-4 py-6 px-8">
                                    <span className="collapsible__item__title dc__truncate fs-13 lh-20 cn-5">
                                        {noItemsText || 'No items found.'}
                                    </span>
                                </div>
                            ) : (
                                items.map((item) =>
                                    tabType === 'button'
                                        ? getButtonTabItem(item as CollapsibleListItem<'button'>)
                                        : getNavLinkTabItem(item as CollapsibleListItem<'navLink'>),
                                )
                            )}
                        </div>
                    </Collapse>
                </Fragment>
            ))}
        </div>
    )
}
