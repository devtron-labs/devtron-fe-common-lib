import React, { Fragment } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import Tippy, { TippyProps } from '@tippyjs/react'

import { ConditionalWrap } from '@Common/Helper'
import { ReactComponent as ICExpand } from '@Icons/ic-expand.svg'

import { Collapse } from '../Collapse'
import { CollapsibleListItem, CollapsibleListProps } from './CollapsibleList.types'
import './CollapsibleList.scss'

const renderWithTippy = (tippyProps: TippyProps) => (children: React.ReactElement) => (
    <Tippy {...tippyProps} className={`default-tt ${tippyProps?.className || ''}`}>
        <div className="flex dc__align-self-start">{children}</div>
    </Tippy>
)

export const CollapsibleList = ({ config, onCollapseBtnClick }: CollapsibleListProps) => {
    const { pathname } = useLocation()

    const getTabContent = (item: CollapsibleListItem) => {
        const { title, subtitle, iconConfig } = item
        return (
            <>
                <div className="flexbox-col flex-grow-1 mw-none dc__align-start">
                    <span className="collapsible__item__title dc__truncate fs-13 lh-20">{title}</span>
                    {subtitle && <span className="dc__truncate fw-4 lh-1-5 cn-7">{subtitle}</span>}
                </div>
                {iconConfig && (
                    <ConditionalWrap
                        condition={!!iconConfig.tooltipProps}
                        wrap={renderWithTippy(iconConfig.tooltipProps)}
                    >
                        <iconConfig.Icon
                            {...iconConfig.props}
                            className={`icon-dim-20 dc__no-shrink cursor ${iconConfig.props?.className || ''}`}
                        />
                    </ConditionalWrap>
                )}
            </>
        )
    }

    const getTabItem = (item: CollapsibleListItem) => {
        const { title, href, isActive, onClick, tabType } = item
        if (tabType === 'navLink') {
            return (
                <NavLink
                    key={title}
                    to={href}
                    className="collapsible__item flexbox dc__align-items-center dc__gap-8 dc__no-decor br-4 py-6 px-8 cursor"
                    onClick={(e) => {
                        // Prevent navigation to the same page
                        if (href === pathname) {
                            e.preventDefault()
                        }
                        onClick?.(e)
                    }}
                >
                    {getTabContent(item)}
                </NavLink>
            )
        }
        // Since is active is boolean we need to explicitly handle for null
        return (
            <button
                key={title}
                className={`collapsible__item flexbox dc__align-items-center dc__gap-8 dc__no-decor br-4 py-6 px-8 cursor ${isActive ? 'active' : ''} dc__unset-button-styles w-100`}
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

    return (
        <div className="mw-none bcn-0">
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
                                style={{ ['--rotateBy' as string]: isExpanded ? '90deg' : '0deg' }}
                            />
                            <span className="flex-grow-1 dc__align-left dc__truncate">{header}</span>
                        </button>
                        {headerIconConfig && (
                            <ConditionalWrap
                                condition={!!headerIconConfig.tooltipProps}
                                wrap={renderWithTippy(headerIconConfig.tooltipProps)}
                            >
                                <button
                                    {...headerIconConfig.btnProps}
                                    type="button"
                                    className={`dc__unset-button-styles dc__no-shrink cursor br-4 bcn-0 flex ${headerIconConfig.btnProps?.className || ''}`}
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
                                items.map((item) => getTabItem(item))
                            )}
                        </div>
                    </Collapse>
                </Fragment>
            ))}
        </div>
    )
}
