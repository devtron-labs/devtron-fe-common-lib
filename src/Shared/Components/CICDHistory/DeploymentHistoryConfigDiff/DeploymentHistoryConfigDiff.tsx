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

import { useMemo, useState } from 'react'
import { generatePath, Route, Switch, useLocation, useRouteMatch } from 'react-router-dom'

import { ReactComponent as ICError } from '@Icons/ic-error.svg'
import ErrorScreenManager from '@Common/ErrorScreenManager'
import { useAsync } from '@Common/Helper'
import { useUrlFilters } from '@Common/Hooks'
import { GenericEmptyState, InfoColourBar, SortingOrder } from '@Common/index'
import { Progressing } from '@Common/Progressing'
import { DEPLOYMENT_CONFIG_DIFF_SORT_KEY, getAppEnvDeploymentConfigList } from '@Shared/Components/DeploymentConfigDiff'
import { groupArrayByObjectKey } from '@Shared/Helpers'
import { useMainContext } from '@Shared/Providers'
import { EnvResourceType, getAppEnvDeploymentConfig, getCompareSecretsData } from '@Shared/Services'

import { DeploymentHistoryConfigDiffCompare } from './DeploymentHistoryConfigDiffCompare'
import { renderDeploymentHistoryConfig } from './helpers'
import { DeploymentHistoryConfigDiffProps, DeploymentHistoryConfigDiffQueryParams } from './types'
import {
    getDeploymentHistoryConfigDiffError,
    getPipelineDeployments,
    getPipelineDeploymentsWfrIds,
    isDeploymentHistoryConfigDiffNotFoundError,
    parseDeploymentHistoryDiffSearchParams,
} from './utils'

export const DeploymentHistoryConfigDiff = ({
    appName,
    envName,
    pipelineId,
    wfrId,
    triggerHistory,
    setFullScreenView,
    resourceId,
    renderRunSource,
}: DeploymentHistoryConfigDiffProps) => {
    // HOOKS
    const { path, params } = useRouteMatch()
    const { pathname, search } = useLocation()
    const { isSuperAdmin } = useMainContext()

    // CONSTANTS
    const pipelineDeployments = useMemo(() => getPipelineDeployments(triggerHistory), [triggerHistory])
    const { currentWfrId, previousWfrId } = useMemo(
        () => getPipelineDeploymentsWfrIds({ pipelineDeployments, wfrId }),
        [pipelineDeployments, wfrId],
    )
    const isPreviousDeploymentConfigAvailable = !!previousWfrId

    // URL FILTERS
    const urlFilters = useUrlFilters<string, DeploymentHistoryConfigDiffQueryParams>({
        parseSearchParams: parseDeploymentHistoryDiffSearchParams(previousWfrId),
    })
    const { compareWfrId, sortBy, sortOrder } = urlFilters

    // STATES
    const [convertVariables, setConvertVariables] = useState(false)

    // ASYNC CALLS
    // Load comparison deployment data
    const [compareDeploymentConfigLoader, compareDeploymentConfig, , reloadCompareDeploymentConfig] =
        useAsync(async () => {
            const payloads = [
                {
                    appName,
                    envName,
                    configArea: 'DeploymentHistory',
                    pipelineId,
                    wfrId: currentWfrId,
                } as const,
                isPreviousDeploymentConfigAvailable
                    ? ({
                          appName,
                          envName,
                          configArea: 'DeploymentHistory',
                          pipelineId,
                          wfrId: compareWfrId,
                      } as const)
                    : null,
            ] as const

            const [secretsData, ...configDatas] = await Promise.allSettled([
                !isSuperAdmin ? getCompareSecretsData([...payloads]) : null,
                ...payloads.map(
                    (payload) =>
                        payload && getAppEnvDeploymentConfig({ params: payload, appId: null, isTemplateView: false }),
                ),
            ])

            if (secretsData.status !== 'fulfilled' || !secretsData.value) {
                return configDatas
            }

            secretsData.value.forEach((data, index) => {
                if (
                    configDatas[index].status !== 'fulfilled' ||
                    !configDatas[index].value ||
                    configDatas[index].value.result.isAppAdmin
                ) {
                    return
                }
                configDatas[index].value.result.secretsData = data.secretsData
            })

            return configDatas
        }, [currentWfrId, compareWfrId])

    // METHODS
    const getNavItemHref = (resourceType: EnvResourceType, resourceName: string) =>
        `${generatePath(path, { ...params })}/${resourceType}${resourceName ? `/${resourceName}` : ''}${search}`

    // Generate the deployment history config list
    const { deploymentConfigList, sortedDeploymentConfigList } = useMemo(() => {
        if (!compareDeploymentConfigLoader && compareDeploymentConfig) {
            const compareList =
                isPreviousDeploymentConfigAvailable && compareDeploymentConfig[1].status === 'fulfilled'
                    ? compareDeploymentConfig[1].value.result
                    : {
                          configMapData: null,
                          deploymentTemplate: null,
                          secretsData: null,
                          isAppAdmin: false,
                      }

            const currentList =
                compareDeploymentConfig[0].status === 'fulfilled' ? compareDeploymentConfig[0].value.result : null

            // This data is displayed on the deployment history diff view page.
            // It requires dynamic sorting based on the current sortBy and sortOrder, which the user can modify using the Sort Button.
            const configData = getAppEnvDeploymentConfigList({
                currentList,
                compareList,
                getNavItemHref,
                convertVariables,
                sortingConfig: { sortBy, sortOrder },
            })

            // Sorting is hardcoded here because this data is displayed on the deployment history configuration tab.
            // The diff needs to be shown on sorted data, and no additional sorting will be applied.
            const sortedConfigData = getAppEnvDeploymentConfigList({
                currentList,
                compareList,
                getNavItemHref,
                convertVariables,
                sortingConfig: { sortBy: DEPLOYMENT_CONFIG_DIFF_SORT_KEY, sortOrder: SortingOrder.ASC },
            })

            return { deploymentConfigList: configData, sortedDeploymentConfigList: sortedConfigData }
        }

        return { deploymentConfigList: null, sortedDeploymentConfigList: null }
    }, [
        isPreviousDeploymentConfigAvailable,
        compareDeploymentConfigLoader,
        compareDeploymentConfig,
        convertVariables,
        sortBy,
        sortOrder,
    ])

    const compareDeploymentConfigErr = useMemo(
        () =>
            !compareDeploymentConfigLoader && compareDeploymentConfig
                ? getDeploymentHistoryConfigDiffError(compareDeploymentConfig[0]) ||
                  getDeploymentHistoryConfigDiffError(compareDeploymentConfig[1])
                : null,
        [compareDeploymentConfigLoader, compareDeploymentConfig],
    )

    const groupedDeploymentConfigList = useMemo(
        () =>
            sortedDeploymentConfigList
                ? groupArrayByObjectKey(sortedDeploymentConfigList.configList, 'groupHeader')
                : [],
        [sortedDeploymentConfigList],
    )

    /** Previous deployment config has 404 error. */
    const hasPreviousDeploymentConfigNotFoundError =
        compareDeploymentConfig && isDeploymentHistoryConfigDiffNotFoundError(compareDeploymentConfig[1])
    /** Hide diff state if the previous deployment config is unavailable or returns a 404 error. */
    const hideDiffState = !isPreviousDeploymentConfigAvailable || hasPreviousDeploymentConfigNotFoundError
    // LOADING
    const isLoading = compareDeploymentConfigLoader || (!compareDeploymentConfigErr && !deploymentConfigList)
    // ERROR CONFIG
    const errorConfig = {
        code: compareDeploymentConfigErr?.code,
        error: compareDeploymentConfigErr && !compareDeploymentConfigLoader,
        reload: reloadCompareDeploymentConfig,
    }

    if (compareDeploymentConfig && isDeploymentHistoryConfigDiffNotFoundError(compareDeploymentConfig[0])) {
        return (
            <div className="flex bg__primary h-100">
                <GenericEmptyState
                    title="Data not available"
                    subTitle="Configurations used for this deployment execution is not available"
                />
            </div>
        )
    }

    return (
        <Switch>
            <Route path={`${path}/:resourceType(${Object.values(EnvResourceType).join('|')})/:resourceName?`}>
                <DeploymentHistoryConfigDiffCompare
                    {...deploymentConfigList}
                    isLoading={isLoading}
                    errorConfig={errorConfig}
                    envName={envName}
                    wfrId={wfrId}
                    urlFilters={urlFilters}
                    pipelineDeployments={pipelineDeployments}
                    setFullScreenView={setFullScreenView}
                    convertVariables={convertVariables}
                    setConvertVariables={setConvertVariables}
                    triggerHistory={triggerHistory}
                    resourceId={resourceId}
                    renderRunSource={renderRunSource}
                    hideDiffState={hideDiffState}
                    isCompareDeploymentConfigNotAvailable={hasPreviousDeploymentConfigNotFoundError}
                />
            </Route>
            <Route>
                {compareDeploymentConfigErr && !compareDeploymentConfigLoader ? (
                    <ErrorScreenManager code={errorConfig.code} reload={errorConfig.reload} />
                ) : (
                    <div className="p-16 flexbox-col dc__gap-16 bg__primary h-100">
                        {isLoading ? (
                            <Progressing fullHeight size={48} />
                        ) : (
                            <>
                                <h3 className="fs-13 lh-20 fw-6 cn-9 m-0">
                                    {hideDiffState
                                        ? 'Configurations used for this deployment trigger'
                                        : 'Showing configuration change with respect to previous deployment'}
                                </h3>
                                <div className="flexbox-col dc__gap-16 dc__mxw-800">
                                    <div className="flexbox-col dc__gap-12">
                                        {Object.keys(groupedDeploymentConfigList).map((groupHeader) =>
                                            renderDeploymentHistoryConfig(
                                                groupedDeploymentConfigList[groupHeader],
                                                groupHeader !== 'UNGROUPED' ? groupHeader : null,
                                                pathname,
                                                hideDiffState,
                                            ),
                                        )}
                                    </div>
                                    {hasPreviousDeploymentConfigNotFoundError && (
                                        <InfoColourBar
                                            classname="error_bar cn-9 fs-13 lh-20"
                                            Icon={ICError}
                                            message="Diff unavailable: Configurations for previous deployment not found."
                                        />
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </Route>
        </Switch>
    )
}
