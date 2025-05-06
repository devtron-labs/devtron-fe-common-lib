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

import { useEffect, useState } from 'react'
import { generatePath, useRouteMatch } from 'react-router-dom'

import { DEFAULT_BASE_PAGE_SIZE, SortingOrder } from '@Common/Constants'
import { Button, ButtonVariantType } from '@Shared/Components/Button'
import {
    DEPLOYMENT_CONFIG_DIFF_SORT_KEY,
    DeploymentConfigDiff,
    DeploymentConfigDiffProps,
} from '@Shared/Components/DeploymentConfigDiff'
import {
    getSelectPickerOptionByValue,
    SelectPickerOptionType,
    SelectPickerVariantType,
} from '@Shared/Components/SelectPicker'
import { ComponentSizeType } from '@Shared/constants'

import { getTriggerHistory } from '../service'
import { DeploymentHistoryConfigDiffRouteParams, DeploymentHistoryDiffDetailedProps } from './types'
import { getPipelineDeployments, getPipelineDeploymentsOptions } from './utils'

export const DeploymentHistoryConfigDiffCompare = ({
    envName,
    setFullScreenView,
    pipelineDeployments: initialPipelineDeployments,
    wfrId,
    urlFilters,
    convertVariables,
    setConvertVariables,
    triggerHistory: initialTriggerHistory,
    renderRunSource,
    resourceId,
    isCompareDeploymentConfigNotAvailable,
    ...props
}: DeploymentHistoryDiffDetailedProps) => {
    // HOOKS
    const { path, params } = useRouteMatch<DeploymentHistoryConfigDiffRouteParams>()
    const { resourceType, resourceName, appId, envId } = params

    // URL FILTERS
    const { compareWfrId, updateSearchParams, sortBy, sortOrder, handleSorting } = urlFilters

    // STATES
    const [triggerHistory, setTriggerHistory] = useState({
        isLoading: false,
        data: initialTriggerHistory,
        hasMore: initialTriggerHistory.size >= DEFAULT_BASE_PAGE_SIZE,
    })
    const [pipelineDeployments, setPipelineDeployments] = useState(initialPipelineDeployments)

    useEffect(() => {
        // Default Search Params Update
        updateSearchParams({ compareWfrId })
        // Set fullscreen for comparing deployment history config
        setFullScreenView(true)
        // Set default initial sorting
        if (sortBy !== DEPLOYMENT_CONFIG_DIFF_SORT_KEY) {
            handleSorting(DEPLOYMENT_CONFIG_DIFF_SORT_KEY)
        }

        return () => {
            setConvertVariables(false)
            setFullScreenView(false)
        }
    }, [])

    // METHODS
    const fetchDeploymentHistory = async (paginationOffset: number) => {
        setTriggerHistory({ ...triggerHistory, isLoading: true })

        try {
            const { result } = await getTriggerHistory({
                appId: +appId,
                envId: +envId,
                pagination: { offset: paginationOffset, size: DEFAULT_BASE_PAGE_SIZE },
            })
            const nextTriggerHistory = new Map((result.cdWorkflows || []).map((item) => [item.id, item]))
            const updatedTriggerHistory = new Map([...triggerHistory.data, ...nextTriggerHistory])

            setTriggerHistory({
                isLoading: false,
                data: updatedTriggerHistory,
                hasMore: result.cdWorkflows?.length === DEFAULT_BASE_PAGE_SIZE,
            })
            setPipelineDeployments(getPipelineDeployments(updatedTriggerHistory))
        } catch {
            setTriggerHistory({ ...triggerHistory, isLoading: false })
        }
    }

    const handleLoadMore = () => fetchDeploymentHistory(triggerHistory.data.size)

    // RENDERERS
    const renderOptionsFooter = () =>
        triggerHistory.hasMore ? (
            <div className="px-4">
                <Button
                    isLoading={triggerHistory.isLoading}
                    onClick={handleLoadMore}
                    dataTestId="load-more-previous-deployments"
                    variant={ButtonVariantType.borderLess}
                    text="Load more"
                    size={ComponentSizeType.small}
                    fullWidth
                />
            </div>
        ) : null

    // DEPLOYMENT_CONFIG_DIFF_PROPS
    const { currentDeployment, pipelineDeploymentsOptions } = getPipelineDeploymentsOptions({
        pipelineDeployments,
        wfrId,
        triggerHistory: triggerHistory.data,
        renderRunSource,
        resourceId,
    })
    const previousDeployment = pipelineDeploymentsOptions.find(({ value }) => value === compareWfrId)
    const isPreviousDeploymentConfigAvailable = !!pipelineDeploymentsOptions.length

    const deploymentSelectorOnChange = ({ value }: SelectPickerOptionType<number>) => {
        updateSearchParams({ compareWfrId: value })
    }

    const selectorsConfig: DeploymentConfigDiffProps['selectorsConfig'] = {
        primaryConfig: isPreviousDeploymentConfigAvailable
            ? [
                  {
                      id: 'deployment-config-diff-deployment-selector',
                      type: 'selectPicker',
                      selectPickerProps: {
                          name: 'deployment-config-diff-deployment-selector',
                          inputId: 'deployment-config-diff-deployment-selector',
                          classNamePrefix: 'deployment-config-diff-deployment-selector',
                          variant: SelectPickerVariantType.COMPACT,
                          options: pipelineDeploymentsOptions,
                          placeholder: 'Select Deployment',
                          value: getSelectPickerOptionByValue(pipelineDeploymentsOptions, compareWfrId, null),
                          onChange: deploymentSelectorOnChange,
                          showSelectedOptionIcon: false,
                          menuSize: ComponentSizeType.large,
                          renderOptionsFooter,
                      },
                  },
              ]
            : [
                  {
                      id: 'no-previous-deployment',
                      type: 'string',
                      text: 'No previous deployment',
                  },
              ],
        secondaryConfig: [
            {
                id: 'base-configuration',
                type: 'string',
                text: `Deployed on ${currentDeployment}`,
            },
        ],
    }

    const getNavHelpText = () => {
        if (isPreviousDeploymentConfigAvailable) {
            return isCompareDeploymentConfigNotAvailable
                ? `Diff unavailable: Configurations for deployment execution ‘${previousDeployment?.label || 'N/A'}’ not found`
                : `Showing diff in configuration deployed on: ${previousDeployment?.label || 'N/A'} & ${currentDeployment}`
        }

        return null
    }

    const onSorting = () => handleSorting(sortOrder !== SortingOrder.DESC ? DEPLOYMENT_CONFIG_DIFF_SORT_KEY : '')

    const sortingConfig: DeploymentConfigDiffProps['sortingConfig'] = {
        handleSorting: onSorting,
        sortBy,
        sortOrder,
    }

    const scopeVariablesConfig: DeploymentConfigDiffProps['scopeVariablesConfig'] = {
        convertVariables,
        onConvertVariablesClick: () => setConvertVariables(!convertVariables),
    }

    return (
        <DeploymentConfigDiff
            {...props}
            showDetailedDiffState
            navHeading={`Comparing ${envName}`}
            headerText={!isPreviousDeploymentConfigAvailable ? '' : undefined} // using `undefined` to ensure component picks default value
            scrollIntoViewId={`${resourceType}${resourceName ? `-${resourceName}` : ''}`}
            navHelpText={getNavHelpText()}
            isNavHelpTextShowingError={isCompareDeploymentConfigNotAvailable}
            goBackURL={generatePath(path.split('/:resourceType')[0], { ...params })}
            selectorsConfig={selectorsConfig}
            sortingConfig={sortingConfig}
            scopeVariablesConfig={scopeVariablesConfig}
        />
    )
}
