import { useMemo, useState } from 'react'
import { generatePath, Route, Switch, useLocation, useRouteMatch } from 'react-router-dom'

import { getAppEnvDeploymentConfigList } from '@Shared/Components/DeploymentConfigDiff'
import { useAsync } from '@Common/Helper'
import { EnvResourceType, getAppEnvDeploymentConfig } from '@Shared/Services'
import { groupArrayByObjectKey } from '@Shared/Helpers'
import ErrorScreenManager from '@Common/ErrorScreenManager'
import { Progressing } from '@Common/Progressing'
import { useUrlFilters } from '@Common/Hooks'
import { GenericEmptyState } from '@Common/index'

import { DeploymentHistoryConfigDiffCompare } from './DeploymentHistoryConfigDiffCompare'
import { DeploymentHistoryConfigDiffProps, DeploymentHistoryConfigDiffQueryParams } from './types'
import {
    getPipelineDeploymentsWfrIds,
    getPipelineDeployments,
    parseDeploymentHistoryDiffSearchParams,
    isDeploymentHistoryConfigDiffNotFoundError,
    getDeploymentHistoryConfigDiffError,
} from './utils'
import { renderDeploymentHistoryConfig } from './helpers'

export const DeploymentHistoryConfigDiff = ({
    appName,
    envName,
    pipelineId,
    wfrId,
    triggerHistory,
    setFullScreenView,
    runSource,
    resourceId,
    renderRunSource,
}: DeploymentHistoryConfigDiffProps) => {
    // HOOKS
    const { path, params } = useRouteMatch()
    const { pathname, search } = useLocation()

    // CONSTANTS
    const pipelineDeployments = useMemo(() => getPipelineDeployments(triggerHistory), [triggerHistory])
    const { currentWfrId, previousWfrId } = useMemo(
        () => getPipelineDeploymentsWfrIds({ pipelineDeployments, wfrId }),
        [pipelineDeployments, wfrId],
    )
    const isPreviousDeploymentConfigAvailable = !!previousWfrId

    // URL FILTERS
    const { compareWfrId } = useUrlFilters<string, DeploymentHistoryConfigDiffQueryParams>({
        parseSearchParams: parseDeploymentHistoryDiffSearchParams(previousWfrId),
    })

    // STATES
    const [convertVariables, setConvertVariables] = useState(false)

    // ASYNC CALLS
    // Load comparison deployment data
    const [compareDeploymentConfigLoader, compareDeploymentConfig, , reloadCompareDeploymentConfig] = useAsync(
        () =>
            Promise.allSettled([
                getAppEnvDeploymentConfig({
                    params: {
                        appName,
                        envName,
                        configArea: 'DeploymentHistory',
                        pipelineId,
                        wfrId: currentWfrId,
                    },
                }),
                isPreviousDeploymentConfigAvailable
                    ? getAppEnvDeploymentConfig({
                          params: {
                              appName,
                              envName,
                              configArea: 'DeploymentHistory',
                              pipelineId,
                              wfrId: compareWfrId,
                          },
                      })
                    : null,
            ]),
        [currentWfrId, compareWfrId],
    )

    // METHODS
    const getNavItemHref = (resourceType: EnvResourceType, resourceName: string) =>
        `${generatePath(path, { ...params })}/${resourceType}${resourceName ? `/${resourceName}` : ''}${search}`

    // Generate the deployment history config list
    const deploymentConfigList = useMemo(() => {
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

            const configData = getAppEnvDeploymentConfigList({
                currentList,
                compareList,
                getNavItemHref,
                convertVariables,
            })
            return configData
        }

        return null
    }, [isPreviousDeploymentConfigAvailable, compareDeploymentConfigLoader, compareDeploymentConfig, convertVariables])

    const compareDeploymentConfigErr = useMemo(
        () =>
            !compareDeploymentConfigLoader && compareDeploymentConfig
                ? getDeploymentHistoryConfigDiffError(compareDeploymentConfig[0]) ||
                  getDeploymentHistoryConfigDiffError(compareDeploymentConfig[1])
                : null,
        [compareDeploymentConfigLoader, compareDeploymentConfig],
    )

    const groupedDeploymentConfigList = useMemo(
        () => (deploymentConfigList ? groupArrayByObjectKey(deploymentConfigList.configList, 'groupHeader') : []),
        [deploymentConfigList],
    )

    /** Hide diff state if the previous deployment config is unavailable or returns a 404 error. */
    const hideDiffState =
        !isPreviousDeploymentConfigAvailable ||
        (compareDeploymentConfig && isDeploymentHistoryConfigDiffNotFoundError(compareDeploymentConfig[1]))
    // LOADING
    const isLoading = compareDeploymentConfigLoader || (!compareDeploymentConfigErr && !deploymentConfigList)
    // ERROR CONFIG
    const errorConfig = {
        code: compareDeploymentConfigErr?.code,
        error: compareDeploymentConfigErr && !compareDeploymentConfigLoader,
        reload: reloadCompareDeploymentConfig,
    }

    // TODO: get null state from Utkarsh
    if (compareDeploymentConfig && isDeploymentHistoryConfigDiffNotFoundError(compareDeploymentConfig[0])) {
        return (
            <div className="flex bcn-0 h-100">
                <GenericEmptyState title="No Configuration Found" />
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
                    previousWfrId={previousWfrId}
                    pipelineDeployments={pipelineDeployments}
                    setFullScreenView={setFullScreenView}
                    convertVariables={convertVariables}
                    setConvertVariables={setConvertVariables}
                    runSource={runSource}
                    resourceId={resourceId}
                    renderRunSource={renderRunSource}
                    hideDiffState={hideDiffState}
                />
            </Route>
            <Route>
                {compareDeploymentConfigErr && !compareDeploymentConfigLoader ? (
                    <ErrorScreenManager code={errorConfig.code} reload={errorConfig.reload} />
                ) : (
                    <div className="p-16 flexbox-col dc__gap-16 bcn-0 h-100">
                        {isLoading ? (
                            <Progressing fullHeight size={48} />
                        ) : (
                            <>
                                <h3 className="fs-13 lh-20 fw-6 cn-9 m-0">
                                    Showing configuration change with respect to previous deployment
                                </h3>
                                <div className="flexbox-col dc__gap-12 dc__mxw-800">
                                    {Object.keys(groupedDeploymentConfigList).map((groupHeader) =>
                                        renderDeploymentHistoryConfig(
                                            groupedDeploymentConfigList[groupHeader],
                                            groupHeader !== 'UNGROUPED' ? groupHeader : null,
                                            pathname,
                                            hideDiffState,
                                        ),
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
