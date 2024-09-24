import { useMemo, useRef, useState } from 'react'
import { generatePath, Route, Switch, useLocation, useRouteMatch } from 'react-router-dom'

import { getAppEnvDeploymentConfigList, getDeploymentTemplateValues } from '@Shared/Components/DeploymentConfigDiff'
import { useAsync } from '@Common/Helper'
import { EnvResourceType, getAppEnvDeploymentConfig } from '@Shared/Services'
import { groupArrayByObjectKey } from '@Shared/Helpers'
import ErrorScreenManager from '@Common/ErrorScreenManager'
import { Progressing } from '@Common/Progressing'
import { useUrlFilters } from '@Common/Hooks'

import { abortPreviousRequests, getIsRequestAborted } from '@Common/Api'
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

    // REFS
    const deploymentTemplateResolvedDataAbortControllerRef = useRef(new AbortController())

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

    const [
        deploymentTemplateResolvedDataLoader,
        deploymentTemplateResolvedData,
        deploymentTemplateResolvedDataErr,
        reloadDeploymentTemplateResolvedData,
    ] = useAsync(
        () =>
            abortPreviousRequests(
                () =>
                    Promise.all([
                        getAppEnvDeploymentConfig({
                            params: {
                                configArea: 'ResolveData',
                                appName,
                                envName,
                            },
                            payload: {
                                values: getDeploymentTemplateValues(
                                    compareDeploymentConfig[0].result?.deploymentTemplate,
                                ),
                            },
                            signal: deploymentTemplateResolvedDataAbortControllerRef.current?.signal,
                        }),
                        getAppEnvDeploymentConfig({
                            params: {
                                configArea: 'ResolveData',
                                appName,
                                envName,
                            },
                            payload: {
                                values: getDeploymentTemplateValues(
                                    compareDeploymentConfig[1].result?.deploymentTemplate,
                                ),
                            },
                            signal: deploymentTemplateResolvedDataAbortControllerRef.current?.signal,
                        }),
                    ]),
                deploymentTemplateResolvedDataAbortControllerRef,
            ),
        [convertVariables, compareDeploymentConfig],
        convertVariables && !!compareDeploymentConfig,
    )

    // METHODS
    const reload = () => {
        reloadCompareDeploymentConfig()
        reloadDeploymentTemplateResolvedData()
    }

    const getNavItemHref = (resourceType: EnvResourceType, resourceName: string) =>
        `${generatePath(path, { ...params })}/${resourceType}${resourceName ? `/${resourceName}` : ''}${search}`

    // Generate the deployment history config list
    const deploymentConfigList = useMemo(() => {
        const isDeploymentTemplateLoaded = !deploymentTemplateResolvedDataLoader && deploymentTemplateResolvedData
        const isComparisonDataLoaded = !compareDeploymentConfigLoader && compareDeploymentConfig

        const shouldLoadData = convertVariables
            ? isComparisonDataLoaded && isDeploymentTemplateLoaded
            : isComparisonDataLoaded

        if (shouldLoadData) {
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
                ...(convertVariables
                    ? {
                          currentDeploymentTemplateResolvedData: deploymentTemplateResolvedData[0].result,
                          compareDeploymentTemplateResolvedData: deploymentTemplateResolvedData[1].result,
                      }
                    : {}),
            })
            return configData
        }

        return null
    }, [
        isPreviousDeploymentConfigAvailable,
        compareDeploymentConfigErr,
        compareDeploymentConfig,
        convertVariables,
        deploymentTemplateResolvedDataLoader,
        deploymentTemplateResolvedData,
    ])

    const groupedDeploymentConfigList = useMemo(
        () => (deploymentConfigList ? groupArrayByObjectKey(deploymentConfigList.configList, 'groupHeader') : []),
        [deploymentConfigList],
    )

    const isLoading = compareDeploymentConfigLoader || deploymentTemplateResolvedDataLoader
    const isError =
        compareDeploymentConfigErr ||
        (deploymentTemplateResolvedDataErr && !getIsRequestAborted(deploymentTemplateResolvedDataErr))

    return (
        <Switch>
            <Route path={`${path}/:resourceType(${Object.values(EnvResourceType).join('|')})/:resourceName?`}>
                <DeploymentHistoryConfigDiffCompare
                    {...deploymentConfigList}
                    isLoading={isLoading || (!isError && !deploymentConfigList)}
                    errorConfig={{
                        code: compareDeploymentConfigErr?.code || deploymentTemplateResolvedDataErr?.code,
                        error: isError && !isLoading,
                        reload,
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
                {isError && !isLoading ? (
                    <ErrorScreenManager code={compareDeploymentConfigErr?.code} reload={reload} />
                ) : (
                    <div className="p-16 flexbox-col dc__gap-16 bcn-0 h-100">
                        {isLoading || (!isError && !deploymentConfigList) ? (
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
