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

import { ChangeEvent, useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Tippy from '@tippyjs/react'

import { ReactComponent as ICClose } from '@Icons/ic-close.svg'
import { ReactComponent as ICError } from '@Icons/ic-error.svg'
import { ReactComponent as ICInfoOutlined } from '@Icons/ic-info-outlined.svg'
import { StyledRadioGroup } from '@Common/index'

import { CollapsibleList, CollapsibleListConfig } from '../CollapsibleList'
import { diffStateIconMap, diffStateTooltipTextMap } from './DeploymentConfigDiff.constants'
import { DeploymentConfigDiffNavigationProps, DeploymentConfigDiffState } from './DeploymentConfigDiff.types'

// LOADING SHIMMER
const ShimmerText = ({ width }: { width: string }) => (
    <div className={`p-8 h-32 w-${width}`}>
        <div className="shimmer-loading w-100 h-100" />
    </div>
)

export const DeploymentConfigDiffNavigation = ({
    isLoading,
    collapsibleNavList,
    navList,
    goBackURL,
    navHeading,
    navHelpText,
    isNavHelpTextShowingError,
    tabConfig,
    errorConfig,
    showDetailedDiffState,
    hideDiffState,
}: DeploymentConfigDiffNavigationProps) => {
    // STATES
    const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({})

    useEffect(() => {
        setExpandedIds(collapsibleNavList.reduce((acc, curr) => ({ ...acc, [curr.id]: !!curr.items.length }), {}))
    }, [collapsibleNavList])

    /** Collapsible List Config. */
    const collapsibleListConfig = collapsibleNavList.map<CollapsibleListConfig<'navLink'>>(
        ({ items, ...resListItem }) => ({
            ...resListItem,
            isExpanded: expandedIds[resListItem.id],
            items: items.map<CollapsibleListConfig<'navLink'>['items'][0]>(({ diffState, ...resItem }) => ({
                ...resItem,
                strikeThrough: showDetailedDiffState && diffState === DeploymentConfigDiffState.DELETED,
                ...(!hideDiffState && diffState !== DeploymentConfigDiffState.NO_DIFF
                    ? {
                          iconConfig: {
                              Icon: showDetailedDiffState ? diffStateIconMap[diffState] : diffStateIconMap.hasDiff,
                              tooltipProps: {
                                  content: showDetailedDiffState
                                      ? diffStateTooltipTextMap[diffState]
                                      : diffStateTooltipTextMap.hasDiff,
                                  arrow: false,
                                  placement: 'right' as const,
                              },
                          },
                      }
                    : {}),
            })),
        }),
    )

    // METHODS
    /** Handles collapse button click. */
    const onCollapseBtnClick = (id: string) => {
        setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }))
    }

    /** Handles tab click. */
    const onTabClick = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        if (tabConfig?.activeTab !== value) {
            tabConfig?.onClick?.(value)
        }
    }

    // RENDERERS
    const renderTopContent = () => (
        <div className="p-12 flexbox dc__align-items-center dc__gap-8 dc__border-bottom-n1">
            {goBackURL && (
                <Link to={goBackURL}>
                    <span className="dc__border br-4 p-1 flex dc__hover-n50">
                        <ICClose className="icon-dim-16 fcn-6" />
                    </span>
                </Link>
            )}
            <span className="fs-13 lh-20 fw-6 cn-9 dc__truncate">{navHeading}</span>
        </div>
    )

    const renderTabConfig = () => {
        const { tabs, activeTab } = tabConfig

        return (
            <div className="p-12">
                <StyledRadioGroup
                    name="deployment-config-diff-tab-list"
                    initialTab={activeTab}
                    onChange={onTabClick}
                    disabled={isLoading}
                    className="gui-yaml-switch deployment-config-diff__tab-list"
                >
                    {tabs.map((tab) => (
                        <StyledRadioGroup.Radio key={tab} value={tab} className="fs-12 lh-20 cn-7 fw-6">
                            {tab}
                        </StyledRadioGroup.Radio>
                    ))}
                </StyledRadioGroup>
            </div>
        )
    }

    const renderNavigation = () => (
        <>
            {navList.map(({ title, href, onClick, diffState, Icon }) => {
                const DiffIcon = showDetailedDiffState ? diffStateIconMap[diffState] : diffStateIconMap.hasDiff
                return (
                    <NavLink
                        key={title}
                        data-testid="env-deployment-template"
                        className="dc__nav-item cursor dc__gap-8 fs-13 lh-32 cn-7 w-100 br-4 px-8 flexbox dc__align-items-center dc__no-decor"
                        to={href}
                        onClick={onClick}
                    >
                        {Icon && <Icon className="icon-dim-16 dc__nav-item__start-icon dc__no-shrink" />}
                        <span className="dc__truncate flex-grow-1">{title}</span>
                        {!hideDiffState && diffState !== DeploymentConfigDiffState.NO_DIFF && (
                            <Tippy
                                className="default-tt"
                                content={
                                    showDetailedDiffState
                                        ? diffStateTooltipTextMap[diffState]
                                        : diffStateTooltipTextMap.hasDiff
                                }
                                arrow={false}
                                placement="right"
                            >
                                <div className="flex">
                                    <DiffIcon className="icon-dim-20 p-2 dc__no-shrink" />
                                </div>
                            </Tippy>
                        )}
                    </NavLink>
                )
            })}
            <CollapsibleList config={collapsibleListConfig} tabType="navLink" onCollapseBtnClick={onCollapseBtnClick} />
            {navHelpText && (
                <div className="mt-8 py-6 px-8 flexbox dc__align-items-center dc__gap-8">
                    <span className="flex p-2 dc__align-self-start">
                        {isNavHelpTextShowingError ? (
                            <ICError className="icon-dim-16 dc__no-shrink" />
                        ) : (
                            <ICInfoOutlined className="icon-dim-16 fcn-7 dc__no-shrink" />
                        )}
                    </span>
                    <p className={`m-0 fs-12 lh-1-5 ${isNavHelpTextShowingError ? 'cr-5' : 'cn-9'}`}>{navHelpText}</p>
                </div>
            )}
        </>
    )

    const renderContent = () => {
        if (isLoading) {
            return ['90', '70', '50'].map((item) => <ShimmerText key={item} width={item} />)
        }

        if (errorConfig?.error) {
            return (
                <div className="mt-8 py-6 px-8 flexbox dc__align-items-center dc__gap-8">
                    <span className="flex p-2 dc__align-self-start">
                        <ICInfoOutlined className="icon-dim-16 fcn-7" />
                    </span>
                    <p className="m-0 fs-12 lh-1-5 cn-9">
                        Failed to load files. Please reload or select a different reference to compare with.
                    </p>
                </div>
            )
        }

        return renderNavigation()
    }

    return (
        <div className="bg__primary dc__border-right flexbox-col dc__overflow-hidden">
            {renderTopContent()}
            {!!tabConfig?.tabs.length && renderTabConfig()}
            <div className="mw-none p-8 flex-grow-1 dc__overflow-auto">{renderContent()}</div>
        </div>
    )
}
