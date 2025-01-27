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

import { Fragment, useEffect, useState } from 'react'

import { ReactComponent as ICSortArrowDown } from '@Icons/ic-sort-arrow-down.svg'
import { ReactComponent as ICSort } from '@Icons/ic-arrow-up-down.svg'
import { Progressing } from '@Common/Progressing'
import { SortingOrder } from '@Common/Constants'
import ErrorScreenManager from '@Common/ErrorScreenManager'
import { ComponentSizeType } from '@Shared/constants'
import { DiffViewer } from '@Shared/Components/DiffViewer'

import { Button, ButtonStyleType, ButtonVariantType } from '../Button'
import { SelectPicker } from '../SelectPicker'
import { DeploymentHistoryDiffView } from '../CICDHistory'
import { DeploymentConfigDiffAccordion } from './DeploymentConfigDiffAccordion'
import {
    DeploymentConfigDiffMainProps,
    DeploymentConfigDiffSelectPickerProps,
    DeploymentConfigDiffState,
    DeploymentConfigDiffAccordionProps,
} from './DeploymentConfigDiff.types'
import { renderDiffViewNoDifferenceState } from './DeploymentConfigDiff.utils'
import { ToggleResolveScopedVariables } from '../ToggleResolveScopedVariables'

export const DeploymentConfigDiffMain = ({
    isLoading,
    errorConfig,
    headerText = 'Compare With',
    configList = [],
    selectorsConfig,
    sortingConfig,
    scrollIntoViewId,
    scopeVariablesConfig,
    showDetailedDiffState,
    hideDiffState,
}: DeploymentConfigDiffMainProps) => {
    // STATES
    const [expandedView, setExpandedView] = useState<Record<string | number, boolean>>({})

    const handleAccordionClick = (id: string) => () => {
        setExpandedView({
            ...expandedView,
            [id]: !expandedView[id],
        })
    }

    const onTransitionEnd =
        (id: string): DeploymentConfigDiffAccordionProps['onTransitionEnd'] =>
        (e) => {
            if (scrollIntoViewId === id && e.target === e.currentTarget) {
                // Using setTimeout to ensure React state updates and DOM rendering are complete before scrolling to element.
                setTimeout(() => {
                    const element = document.querySelector(`#${scrollIntoViewId}`)
                    element?.scrollIntoView({ block: 'start' })
                })
            }
        }

    useEffect(() => {
        if (!isLoading) {
            setExpandedView(
                configList.reduce(
                    (acc, curr) => ({
                        ...acc,
                        [curr.id]: scrollIntoViewId === curr.id || curr.diffState !== DeploymentConfigDiffState.NO_DIFF,
                    }),
                    {},
                ),
            )
        }
    }, [isLoading])

    useEffect(() => {
        if (scrollIntoViewId) {
            setExpandedView((prev) => ({ ...prev, [scrollIntoViewId]: true }))
        }
    }, [scrollIntoViewId])

    const renderHeaderSelectors = (list: DeploymentConfigDiffSelectPickerProps[]) =>
        list.map((configItem, index) => {
            if (configItem.type === 'string') {
                return (
                    <Fragment key={configItem.id}>
                        {typeof configItem.text === 'string' ? (
                            <p className="m-0 cn-9 fs-13 lh-20 fw-6">{configItem.text}</p>
                        ) : (
                            configItem.text
                        )}
                        {!selectorsConfig?.hideDivider && index !== list.length - 1 && (
                            <span className="cn-9 fs-13 lh-20">/</span>
                        )}
                    </Fragment>
                )
            }

            const { selectPickerProps } = configItem

            return (
                <Fragment key={configItem.id}>
                    <div className="dc__mxw-300">
                        <SelectPicker<string | number, false>
                            {...selectPickerProps}
                            isDisabled={isLoading || selectPickerProps?.isDisabled}
                        />
                    </div>
                    {!selectorsConfig?.hideDivider && index !== list.length - 1 && (
                        <span className="cn-9 fs-13 lh-20">/</span>
                    )}
                </Fragment>
            )
        })

    const renderSortButton = () => {
        if (sortingConfig) {
            const { handleSorting, sortBy, sortOrder } = sortingConfig

            return (
                <Button
                    dataTestId="config-diff-sort-button"
                    text="Sort keys"
                    variant={ButtonVariantType.borderLess}
                    style={ButtonStyleType.neutral}
                    size={ComponentSizeType.small}
                    startIcon={
                        sortBy ? (
                            <ICSortArrowDown
                                className="rotate"
                                style={{
                                    ['--rotateBy' as string]: sortOrder === SortingOrder.ASC ? '0deg' : '180deg',
                                }}
                            />
                        ) : (
                            <ICSort />
                        )
                    }
                    onClick={handleSorting}
                    disabled={isLoading}
                />
            )
        }

        return null
    }

    const renderScopeVariablesButton = () => {
        if (scopeVariablesConfig) {
            const { convertVariables, onConvertVariablesClick } = scopeVariablesConfig

            return (
                <ToggleResolveScopedVariables
                    resolveScopedVariables={convertVariables}
                    handleToggleScopedVariablesView={onConvertVariablesClick}
                    throttleOnChange
                />
            )
        }

        return null
    }

    const renderDiffs = () =>
        configList.map(({ id, primaryConfig, secondaryConfig, title, diffState, singleView }) => {
            const { heading: primaryHeading, list: primaryList } = primaryConfig
            const { heading: secondaryHeading, list: secondaryList } = secondaryConfig

            return (
                <DeploymentConfigDiffAccordion
                    key={`${id}-${title}`}
                    id={id}
                    title={title}
                    isExpanded={expandedView[id]}
                    diffState={diffState}
                    onClick={handleAccordionClick(id)}
                    onTransitionEnd={onTransitionEnd(id)}
                    showDetailedDiffState={showDetailedDiffState}
                    hideDiffState={hideDiffState}
                >
                    {singleView ? (
                        <DiffViewer
                            oldValue={primaryList.codeEditorValue.value}
                            newValue={secondaryList.codeEditorValue.value}
                            // Need to hide the title since the null state is controlled explicitly
                            {...(primaryList.codeEditorValue.value !== secondaryList.codeEditorValue.value && {
                                leftTitle: primaryHeading,
                                rightTitle: secondaryHeading,
                            })}
                            codeFoldMessageRenderer={renderDiffViewNoDifferenceState(
                                primaryList.codeEditorValue.value,
                                secondaryList.codeEditorValue.value,
                            )}
                        />
                    ) : (
                        <div className="p-16">
                            {primaryHeading && secondaryHeading && (
                                <div className="bcn-1 deployment-diff__upper dc__top-radius-4 dc__border-right dc__border-left dc__border-top">
                                    <div className="px-12 py-6">{primaryHeading}</div>
                                    <div className="px-12 py-6">{secondaryHeading}</div>
                                </div>
                            )}
                            <DeploymentHistoryDiffView
                                codeEditorKey={`${sortingConfig?.sortBy}-${sortingConfig?.sortOrder}-${scopeVariablesConfig?.convertVariables}`}
                                baseTemplateConfiguration={secondaryList}
                                currentConfiguration={primaryList}
                                previousConfigAvailable
                                rootClassName={`${primaryHeading && secondaryHeading ? 'dc__no-top-radius dc__no-top-border' : ''}`}
                            />
                        </div>
                    )}
                </DeploymentConfigDiffAccordion>
            )
        })

    const renderContent = () => {
        if (isLoading) {
            return <Progressing fullHeight pageLoader />
        }

        if (errorConfig?.error) {
            return (
                <ErrorScreenManager
                    code={errorConfig.code}
                    subtitle={errorConfig.message}
                    redirectURL={errorConfig.redirectURL}
                    reload={errorConfig.reload}
                />
            )
        }

        return <div className="flexbox-col dc__gap-12 p-12">{renderDiffs()}</div>
    }

    return (
        <div className="bg__primary deployment-config-diff__main-top flexbox-col min-h-100">
            <div className="dc__border-bottom-n1 flexbox dc__align-items-center dc__position-sticky dc__top-0 bg__primary w-100 dc__zi-11">
                <div className="flexbox dc__align-items-center p-12 dc__gap-8 deployment-config-diff__main-top__header">
                    {!!headerText && <p className="m-0 cn-9 fs-13 lh-20">{headerText}</p>}
                    {renderHeaderSelectors(selectorsConfig.primaryConfig)}
                </div>
                <div className="dc__border-left flexbox dc__align-items-center deployment-config-diff__main-top__header">
                    <div className="flex-grow-1 flexbox dc__align-items-center dc__gap-8 p-12">
                        {renderHeaderSelectors(selectorsConfig.secondaryConfig)}
                    </div>
                    {(sortingConfig || scopeVariablesConfig) && (
                        <div className="dc__border-left flex dc__gap-8 pr-12 pl-8 py-8">
                            {renderSortButton()}
                            {renderScopeVariablesButton()}
                        </div>
                    )}
                </div>
            </div>
            <div className="deployment-config-diff__main-content dc__overflow-auto">{renderContent()}</div>
        </div>
    )
}
