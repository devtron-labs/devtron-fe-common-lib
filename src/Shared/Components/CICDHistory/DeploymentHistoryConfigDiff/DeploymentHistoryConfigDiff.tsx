import { useMemo, useState } from 'react'
import { generatePath, Route, Switch, useLocation, useRouteMatch } from 'react-router-dom'

import { getAppEnvDeploymentConfigList } from '@Shared/Components/DeploymentConfigDiff'
import { useAsync } from '@Common/Helper'
import { EnvResourceType, getAppEnvDeploymentConfig } from '@Shared/Services'
import { groupArrayByObjectKey } from '@Shared/Helpers'
import ErrorScreenManager from '@Common/ErrorScreenManager'
import { Progressing } from '@Common/Progressing'
import { useUrlFilters } from '@Common/Hooks'

import { DeploymentHistoryConfigDiffCompare } from './DeploymentHistoryConfigDiffCompare'
import { DeploymentHistoryConfigDiffProps, DeploymentHistoryConfigDiffQueryParams } from './types'
import { getPipelineDeploymentsWfrIds, getPipelineDeployments, parseDeploymentHistoryDiffSearchParams } from './utils'
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
    const [
        compareDeploymentConfigLoader,
        compareDeploymentConfig,
        compareDeploymentConfigErr,
        reloadCompareDeploymentConfig,
    ] = useAsync(
        () =>
            Promise.all([
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
            const compareList = isPreviousDeploymentConfigAvailable
                ? compareDeploymentConfig[1].result
                : {
                      configMapData: null,
                      deploymentTemplate: null,
                      secretsData: null,
                      isAppAdmin: false,
                  }
            const currentList = compareDeploymentConfig[0].result

            const configData = getAppEnvDeploymentConfigList({
                currentList,
                compareList,
                getNavItemHref,
                convertVariables,
            })
            return configData
        }

        return null
    }, [isPreviousDeploymentConfigAvailable, compareDeploymentConfigErr, compareDeploymentConfig, convertVariables])

    const groupedDeploymentConfigList = useMemo(
        () => (deploymentConfigList ? groupArrayByObjectKey(deploymentConfigList.configList, 'groupHeader') : []),
        [deploymentConfigList],
    )

    const isLoading = compareDeploymentConfigLoader || (!compareDeploymentConfigErr && !deploymentConfigList)
    return (
        <Switch>
            <Route path={`${path}/:resourceType(${Object.values(EnvResourceType).join('|')})/:resourceName?`}>
                <DeploymentHistoryConfigDiffCompare
                    {...deploymentConfigList}
                    isLoading={isLoading}
                    errorConfig={{
                        code: compareDeploymentConfigErr?.code,
                        error: compareDeploymentConfigErr && !compareDeploymentConfigLoader,
                        reload: reloadCompareDeploymentConfig,
                    }}
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
                />
            </Route>
            <Route>
                {compareDeploymentConfigErr && !compareDeploymentConfigLoader ? (
                    <ErrorScreenManager
                        code={compareDeploymentConfigErr?.code}
                        reload={reloadCompareDeploymentConfig}
                    />
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
