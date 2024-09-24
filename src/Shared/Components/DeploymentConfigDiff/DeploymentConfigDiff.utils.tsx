import { FunctionComponent, SVGProps } from 'react'

import { ReactComponent as ICCheck } from '@Icons/ic-check.svg'
import { ReactComponent as ICStamp } from '@Icons/ic-stamp.svg'
import { ReactComponent as ICEditFile } from '@Icons/ic-edit-file.svg'
import { ReactComponent as ICDiffFileUpdated } from '@Icons/ic-diff-file-updated.svg'
import { ReactComponent as ICDiffFileAdded } from '@Icons/ic-diff-file-added.svg'
import { ReactComponent as ICDiffFileRemoved } from '@Icons/ic-diff-file-removed.svg'
import { stringComparatorBySortOrder } from '@Shared/Helpers'
import { DEPLOYMENT_HISTORY_CONFIGURATION_LIST_MAP } from '@Shared/constants'
import {
    AppEnvDeploymentConfigListParams,
    DeploymentConfigDiffProps,
    DeploymentConfigDiffState,
    DeploymentHistoryDetail,
    DiffHeadingDataType,
    prepareHistoryData,
} from '@Shared/Components'

import {
    ConfigMapSecretDataConfigDatumDTO,
    ConfigMapSecretDataDTO,
    ConfigResourceType,
    DeploymentTemplateDTO,
    DraftState,
    EnvResourceType,
    ManifestTemplateDTO,
    PipelineConfigDataDTO,
    TemplateListDTO,
    TemplateListType,
} from '../../Services/app.types'

export const getDeploymentTemplateData = (data: DeploymentTemplateDTO) => {
    const parsedDraftData = JSON.parse(data?.deploymentDraftData?.configData[0].draftMetadata.data || null)

    return (
        parsedDraftData?.envOverrideValues ||
        parsedDraftData?.valuesOverride ||
        parsedDraftData?.defaultAppOverride ||
        data?.data ||
        null
    )
}

/**
 * Retrieves the draft data from the given configuration data object.
 *
 * @param configData - The configuration data object.
 * @returns The draft data if available, otherwise the original data.
 */
export const getDraftData = (configData: ConfigMapSecretDataConfigDatumDTO): ConfigMapSecretDataConfigDatumDTO => {
    if (configData?.draftMetadata) {
        const parsedData = JSON.parse(configData.draftMetadata.data)
        return {
            ...(configData.draftMetadata.resourceName ? { name: configData.draftMetadata.resourceName } : {}),
            ...(parsedData.configData ? parsedData.configData[0] : { data: parsedData }),
            draftMetadata: configData.draftMetadata,
        }
    }

    return configData
}

/**
 * Combines two arrays of configuration data objects based on a 'name' key.
 *
 * @param primaryArray - The first array of configuration data objects.
 * @param secondaryArray - The second array of configuration data objects.
 * @returns The combined array of configuration data objects.
 */
export const mergeConfigDataArraysByName = (
    primaryArray: ConfigMapSecretDataConfigDatumDTO[],
    secondaryArray: ConfigMapSecretDataConfigDatumDTO[],
): ConfigMapSecretDataConfigDatumDTO[][] => {
    const dataMap = new Map<string, ConfigMapSecretDataConfigDatumDTO[]>()

    const sortedPrimaryArray = primaryArray
        .map(getDraftData)
        .sort((a, b) => stringComparatorBySortOrder(a.name, b.name))

    const sortedSecondaryArray = secondaryArray
        .map(getDraftData)
        .sort((a, b) => stringComparatorBySortOrder(a.name, b.name))

    sortedPrimaryArray.forEach((item) => dataMap.set(item.name, [item, null]))
    sortedSecondaryArray.forEach((item) => {
        const key = item.name
        if (dataMap.has(key)) {
            dataMap.set(key, [dataMap.get(key)[0], item])
        } else {
            dataMap.set(key, [null, item])
        }
    })

    return Array.from(dataMap.values())
}

/**
 * Retrieves data for a given configuration, depending on the type.
 *
 * @param cmSecretData - The configuration data containing secret and non-secret data.
 * @param type - The type of configuration resource (e.g., Secret or ConfigMap).
 * @returns The config data if found, otherwise null.
 */
const getConfigData = (
    cmSecretData: ConfigMapSecretDataConfigDatumDTO,
    type: ConfigResourceType,
): Record<string, string> => {
    if (!cmSecretData) {
        // Return undefined intentionally, as JSON.stringify converts null to "null" but keeps undefined as undefined.
        return undefined
    }

    const secretKeys = ['secretData', 'esoSecretData', 'defaultSecretData', 'defaultESOSecretData']

    if (type === ConfigResourceType.Secret) {
        const data = secretKeys.find((key) => Object.keys(cmSecretData?.[key] ?? {}).length > 0)
        if (data) {
            return cmSecretData[data]
        }
    }

    const configmapKeys = ['data', 'defaultData']
    const data = configmapKeys.find((key) => Object.keys(cmSecretData?.[key] ?? {}).length > 0)
    return cmSecretData[data]
}

/**
 * Obfuscates the data based on user roles and matching keys.
 *
 * @param compareToData - Data to compare against, in the format of a record with string keys and values.
 * @param compareWithData - Data to compare with, in the format of a record with string keys and values.
 * @param compareToIsAdmin - Boolean flag indicating if the first dataset belongs to an admin user.
 * @param compareWithIsAdmin - Boolean flag indicating if the second dataset belongs to an admin user.
 * @returns An object containing the obfuscated versions of both datasets.
 */
const getObfuscatedData = (
    compareToData: Record<string, string>,
    compareWithData: Record<string, string>,
    compareToIsAdmin = false,
    compareWithIsAdmin = false,
) => {
    // Identify keys with matching values in both datasets
    const sameKeys: Record<string, boolean> = Object.keys(compareToData).reduce((acc, key) => {
        if (compareWithData[key] && compareToData[key] === compareWithData[key]) {
            acc[key] = true
        }
        return acc
    }, {})

    // Function to obfuscate data based on same keys and admin status
    const obfuscateData = (
        data: Record<string, string>,
        isAdmin: boolean,
        checkSameKeys = false,
    ): Record<string, string> => {
        if (isAdmin) return data
        return Object.keys(data).reduce((acc, key) => {
            if (checkSameKeys) {
                acc[key] = sameKeys[key] ? '********' : '************'
            } else {
                acc[key] = '********'
            }
            return acc
        }, {})
    }

    const compareToObfuscatedData = obfuscateData(compareToData, compareToIsAdmin, true)
    const compareWithObfuscatedData = obfuscateData(compareWithData, compareWithIsAdmin)

    // Return undefined intentionally, as JSON.stringify converts null to "null" but keeps undefined as undefined.
    return {
        compareToObfuscatedData: Object.keys(compareToObfuscatedData).length ? compareToObfuscatedData : undefined,
        compareWithObfuscatedData: Object.keys(compareWithObfuscatedData).length
            ? compareWithObfuscatedData
            : undefined,
    }
}

/**
 * Retrieves code editor data, potentially obfuscating it based on user roles and resource type.
 *
 * @param compareToValue - The first dataset value to compare.
 * @param compareWithValue - The second dataset value to compare.
 * @param type - The type of the resource.
 * @param compareToIsAdmin - Boolean flag indicating if the first dataset belongs to an admin user.
 * @param compareWithIsAdmin - Boolean flag indicating if the second dataset belongs to an admin user.
 * @returns An object containing data for the code editor, with obfuscation applied if the type is Secret.
 */
const getCodeEditorData = (
    compareToValue: ConfigMapSecretDataConfigDatumDTO,
    compareWithValue: ConfigMapSecretDataConfigDatumDTO,
    type: ConfigResourceType,
    compareToIsAdmin: boolean,
    compareWithIsAdmin: boolean,
) => {
    const compareToConfigData = getConfigData(compareToValue, type)
    const compareWithConfigData = getConfigData(compareWithValue, type)

    let compareToCodeEditorData
    let compareWithCodeEditorData

    if (type === ConfigResourceType.Secret) {
        const { compareToObfuscatedData, compareWithObfuscatedData } = getObfuscatedData(
            compareToConfigData ?? {},
            compareWithConfigData ?? {},
            compareToIsAdmin,
            compareWithIsAdmin,
        )

        compareToCodeEditorData = {
            displayName: 'data',
            value: JSON.stringify(compareToObfuscatedData) || '',
        }

        compareWithCodeEditorData = {
            displayName: 'data',
            value: JSON.stringify(compareWithObfuscatedData) || '',
        }
    } else {
        compareToCodeEditorData = {
            displayName: 'data',
            value: JSON.stringify(compareToConfigData) || '',
        }

        compareWithCodeEditorData = {
            displayName: 'data',
            value: JSON.stringify(compareWithConfigData) || '',
        }
    }

    return { compareToCodeEditorData, compareWithCodeEditorData }
}

/**
 * Compares two string values and returns the appropriate deployment configuration difference state.
 *
 * @param compareToValue - The original value to compare.
 * @param compareWithValue - The new value to compare against the original.
 * @returns `DeploymentConfigDiffState` enum value indicating the difference between the two values
 */
const getDiffState = (compareToValue: string, compareWithValue: string) => {
    if (!compareToValue && compareWithValue) {
        return DeploymentConfigDiffState.DELETED
    }

    if (compareToValue && !compareWithValue) {
        return DeploymentConfigDiffState.ADDED
    }

    if (compareToValue !== compareWithValue) {
        return DeploymentConfigDiffState.HAS_DIFF
    }

    return DeploymentConfigDiffState.NO_DIFF
}

/**
 * Prepares the data for displaying the diff view between two configuration items.
 *
 * @param compareTo - The configuration item of compare to.
 * @param compareWith - The configuration item of compare with.
 * @param type - The type of the resource, indicating if it's a Secret or another type.
 * @param compareToIsAdmin - Boolean flag indicating if the compareTo item belongs to an admin user.
 * @param compareWithIsAdmin - Boolean flag indicating if the compareWith item belongs to an admin user.
 * @returns An object containing the diff data for both items and a boolean indicating if there is a difference.
 */
const getDiffViewData = (
    compareTo: ConfigMapSecretDataConfigDatumDTO,
    compareWith: ConfigMapSecretDataConfigDatumDTO,
    type: ConfigResourceType,
    compareToIsAdmin: boolean,
    compareWithIsAdmin: boolean,
) => {
    // Prepare the code editor data for compareTo and compareWith items
    const { compareToCodeEditorData, compareWithCodeEditorData } = getCodeEditorData(
        compareTo,
        compareWith,
        type,
        compareToIsAdmin,
        compareWithIsAdmin,
    )

    // Determine the history data map based on the type of resource
    const historyDataMap =
        type === ConfigResourceType.Secret
            ? DEPLOYMENT_HISTORY_CONFIGURATION_LIST_MAP.SECRET.VALUE
            : DEPLOYMENT_HISTORY_CONFIGURATION_LIST_MAP.CONFIGMAP.VALUE

    // Prepare the history data for the compareTo
    const compareToDiff = prepareHistoryData(
        { ...(compareTo || {}), codeEditorValue: compareToCodeEditorData },
        historyDataMap,
        type === ConfigResourceType.Secret && !compareToIsAdmin,
    )

    // Prepare the history data for the compareWith
    const compareWithDiff = prepareHistoryData(
        { ...(compareWith || {}), codeEditorValue: compareWithCodeEditorData },
        historyDataMap,
        type === ConfigResourceType.Secret && !compareWithIsAdmin,
    )

    // Return the combined diff data
    return {
        compareToDiff,
        compareWithDiff,
        diffState: getDiffState(compareToCodeEditorData.value, compareWithCodeEditorData.value),
    }
}

const getDeploymentTemplateDiffViewData = (data: DeploymentTemplateDTO | null) => {
    const _data = getDeploymentTemplateData(data)
    const codeEditorValue = {
        displayName: 'data',
        value: _data ? JSON.stringify(_data) : '',
    }

    const diffViewData = prepareHistoryData(
        {
            ...(data || {}),
            isAppMetricsEnabled: data ? data.isAppMetricsEnabled || false : null,
            codeEditorValue,
        },
        DEPLOYMENT_HISTORY_CONFIGURATION_LIST_MAP.DEPLOYMENT_TEMPLATE.VALUE,
    )

    return diffViewData
}

const getManifestDiffViewData = (data: ManifestTemplateDTO) => {
    const codeEditorValue = {
        displayName: 'data',
        value: data.data,
    }

    const diffViewData = prepareHistoryData(
        { codeEditorValue },
        DEPLOYMENT_HISTORY_CONFIGURATION_LIST_MAP.DEPLOYMENT_TEMPLATE.VALUE,
    )

    return diffViewData
}

const getPipelineConfigDiffViewData = (data: PipelineConfigDataDTO) => {
    const codeEditorValue = {
        displayName: 'data',
        value: data?.data ? JSON.stringify(data.data) : '',
    }

    const diffViewData = prepareHistoryData(
        { ...(data || {}), strategy: data?.Strategy, codeEditorValue },
        DEPLOYMENT_HISTORY_CONFIGURATION_LIST_MAP.PIPELINE_STRATEGY.VALUE,
    )

    return diffViewData
}

const getDiffHeading = <DeploymentTemplate extends boolean>(
    data: DiffHeadingDataType<DeploymentTemplate>,
    deploymentTemplate?: DeploymentTemplate,
) => {
    let doesNotExist = false
    let isDraft = false
    let isApprovalPending = false

    if (!data) {
        doesNotExist = true
    } else if (deploymentTemplate) {
        const _data = data as DeploymentTemplateDTO
        if (_data.deploymentDraftData?.configData[0].draftMetadata.draftState === DraftState.Init) {
            isDraft = true
        } else if (_data.deploymentDraftData?.configData[0].draftMetadata.draftState === DraftState.AwaitApproval) {
            isApprovalPending = true
        }
    } else {
        const _data = data as ConfigMapSecretDataConfigDatumDTO
        if (_data.draftMetadata?.draftState === DraftState.Init) {
            isDraft = true
        } else if (_data.draftMetadata?.draftState === DraftState.AwaitApproval) {
            isApprovalPending = true
        }
    }

    if (doesNotExist) {
        return <span className="fs-12 fw-6 cn-9">Does not exist</span>
    }

    if (isDraft) {
        return (
            <div className="flexbox dc__align-items-center dc__gap-8 ">
                <ICEditFile className="icon-dim-16 scr-5" />
                <span className="fs-12 fw-6 cr-5">Draft</span>
            </div>
        )
    }

    if (isApprovalPending) {
        return (
            <div className="flexbox dc__align-items-center dc__gap-8 ">
                <ICStamp className="icon-dim-16" />
                <span className="fs-12 fw-6 cv-5">Approval pending</span>
            </div>
        )
    }

    return (
        <div className="flexbox dc__align-items-center dc__gap-8 ">
            <ICCheck className="scn-9 icon-dim-16" />
            <span className="fs-12 fw-6 cn-9">Published</span>
        </div>
    )
}

const getConfigMapSecretResolvedValues = (configMapSecretData: ConfigMapSecretDataDTO, convertVariables: boolean) => {
    const resolvedData: ConfigMapSecretDataConfigDatumDTO[] =
        ((convertVariables && JSON.parse(configMapSecretData?.resolvedValue || null)) || configMapSecretData?.data)
            ?.configData || []

    const data =
        (convertVariables &&
            resolvedData.map((item, index) => {
                if (configMapSecretData.data.configData[index].draftMetadata) {
                    const resolvedDraftData =
                        configMapSecretData.data.configData[index].draftMetadata.draftResolvedValue ||
                        configMapSecretData.data.configData[index].draftMetadata.data

                    return {
                        ...configMapSecretData.data.configData[index],
                        draftMetadata: {
                            ...configMapSecretData.data.configData[index].draftMetadata,
                            data: resolvedDraftData,
                        },
                    }
                }

                return item
            })) ||
        resolvedData

    return data
}

const getConfigMapSecretData = (
    compareToList: ConfigMapSecretDataDTO,
    compareWithList: ConfigMapSecretDataDTO,
    resourceType: ConfigResourceType,
    compareToIsAdmin: boolean,
    compareWithIsAdmin: boolean,
    convertVariables: boolean,
) => {
    const combinedList = mergeConfigDataArraysByName(
        getConfigMapSecretResolvedValues(compareToList, convertVariables),
        getConfigMapSecretResolvedValues(compareWithList, convertVariables),
    )

    const deploymentConfig: DeploymentConfigDiffProps['configList'] = combinedList.map(([currentItem, compareItem]) => {
        const { compareToDiff, compareWithDiff, diffState } = getDiffViewData(
            currentItem,
            compareItem,
            resourceType,
            compareToIsAdmin,
            compareWithIsAdmin,
        )

        return {
            id: `${resourceType === ConfigResourceType.ConfigMap ? EnvResourceType.ConfigMap : EnvResourceType.Secret}-${currentItem?.name || compareItem?.name}`,
            pathType:
                resourceType === ConfigResourceType.ConfigMap ? EnvResourceType.ConfigMap : EnvResourceType.Secret,
            title: `${resourceType === ConfigResourceType.ConfigMap ? 'ConfigMap' : 'Secret'} / ${currentItem?.name || compareItem?.name}`,
            name: currentItem?.name || compareItem?.name,
            primaryConfig: {
                heading: getDiffHeading(compareItem),
                list: compareWithDiff,
            },
            secondaryConfig: {
                heading: getDiffHeading(currentItem),
                list: compareToDiff,
            },
            diffState,
            groupHeader: resourceType === ConfigResourceType.ConfigMap ? 'CONFIGMAPS' : 'SECRETS',
        }
    })

    return deploymentConfig
}

const getConfigDataWithResolvedDeploymentTemplate = (
    data: AppEnvDeploymentConfigListParams<false>['currentList'],
    resolvedData: AppEnvDeploymentConfigListParams<false>['currentDeploymentTemplateResolvedData'],
) =>
    data && resolvedData?.deploymentTemplate
        ? {
              ...data,
              deploymentTemplate: {
                  ...data.deploymentTemplate,
                  deploymentDraftData: null,
                  data: resolvedData.deploymentTemplate.resolvedValue,
              },
          }
        : data

/**
 * Generates a list of deployment configurations for application environments and identifies changes between the current and compare lists.
 *
 * @param params - An object containing the following properties:
 * @param params.currentList - The current deployment configuration list.
 * @param params.compareList - The deployment configuration list to compare against.
 * @param params.getNavItemHref - A function to generate navigation item URLs based on the resource type and resource name.
 * @param params.isManifestView - A boolean that, when true, modifies the output for a manifest view.
 * @param params.sortOrder - (Optional) The order in which to sort the deployment templates.
 *
 * @returns An object containing the combined deployment configuration list, a collapsible navigation list, and a navigation list.
 */
export const getAppEnvDeploymentConfigList = <ManifestView extends boolean = false>({
    currentList,
    compareList,
    getNavItemHref,
    isManifestView,
    convertVariables = false,
    currentDeploymentTemplateResolvedData,
    compareDeploymentTemplateResolvedData,
}: AppEnvDeploymentConfigListParams<ManifestView>): {
    configList: DeploymentConfigDiffProps['configList']
    navList: DeploymentConfigDiffProps['navList']
    collapsibleNavList: DeploymentConfigDiffProps['collapsibleNavList']
} => {
    if (!isManifestView) {
        const _currentList = getConfigDataWithResolvedDeploymentTemplate(
            currentList as AppEnvDeploymentConfigListParams<false>['currentList'],
            currentDeploymentTemplateResolvedData,
        )
        const _compareList = getConfigDataWithResolvedDeploymentTemplate(
            compareList as AppEnvDeploymentConfigListParams<false>['compareList'],
            compareDeploymentTemplateResolvedData,
        )
        const currentDeploymentData = getDeploymentTemplateDiffViewData(_currentList.deploymentTemplate)
        const compareDeploymentData = getDeploymentTemplateDiffViewData(_compareList.deploymentTemplate)

        const deploymentTemplateData = {
            id: EnvResourceType.DeploymentTemplate,
            pathType: EnvResourceType.DeploymentTemplate,
            title: 'Deployment Template',
            primaryConfig: {
                heading: getDiffHeading(_compareList.deploymentTemplate, true),
                list: compareDeploymentData,
            },
            secondaryConfig: {
                heading: getDiffHeading(_currentList.deploymentTemplate, true),
                list: currentDeploymentData,
            },
            diffState: getDiffState(
                currentDeploymentData.codeEditorValue.value,
                compareDeploymentData.codeEditorValue.value,
            ),
        }

        let currentPipelineConfigData: DeploymentHistoryDetail
        let comparePipelineConfigData: DeploymentHistoryDetail
        let pipelineConfigData: DeploymentConfigDiffProps['configList'][0]

        if (_currentList.pipelineConfigData || _compareList.pipelineConfigData) {
            currentPipelineConfigData = getPipelineConfigDiffViewData(_currentList.pipelineConfigData)
            comparePipelineConfigData = getPipelineConfigDiffViewData(_compareList.pipelineConfigData)
            pipelineConfigData = {
                id: EnvResourceType.PipelineStrategy,
                pathType: EnvResourceType.PipelineStrategy,
                title: 'Pipeline Configuration',
                primaryConfig: {
                    heading: null,
                    list: comparePipelineConfigData,
                },
                secondaryConfig: {
                    heading: null,
                    list: currentPipelineConfigData,
                },
                diffState: getDiffState(
                    currentPipelineConfigData.codeEditorValue.value,
                    comparePipelineConfigData.codeEditorValue.value,
                ),
            }
        }

        const cmData = getConfigMapSecretData(
            _currentList.configMapData,
            _compareList.configMapData,
            ConfigResourceType.ConfigMap,
            _currentList.isAppAdmin,
            _compareList.isAppAdmin,
            convertVariables,
        )

        const secretData = getConfigMapSecretData(
            _currentList.secretsData,
            _compareList.secretsData,
            ConfigResourceType.Secret,
            _currentList.isAppAdmin,
            _compareList.isAppAdmin,
            convertVariables,
        )

        const configList: DeploymentConfigDiffProps['configList'] = [
            deploymentTemplateData,
            ...(pipelineConfigData ? [pipelineConfigData] : []),
            ...cmData,
            ...secretData,
        ]

        const navList: DeploymentConfigDiffProps['navList'] = [
            {
                title: deploymentTemplateData.title,
                diffState: deploymentTemplateData.diffState,
                href: getNavItemHref(EnvResourceType.DeploymentTemplate, null),
                onClick: () => {
                    const element = document.querySelector(`#${deploymentTemplateData.id}`)
                    element?.scrollIntoView({ block: 'start' })
                },
            },
            ...(pipelineConfigData
                ? [
                      {
                          title: pipelineConfigData.title,
                          diffState: pipelineConfigData.diffState,
                          href: getNavItemHref(EnvResourceType.PipelineStrategy, null),
                          onClick: () => {
                              const element = document.querySelector(`#${pipelineConfigData.id}`)
                              element?.scrollIntoView({ block: 'start' })
                          },
                      },
                  ]
                : []),
        ]

        const collapsibleNavList: DeploymentConfigDiffProps['collapsibleNavList'] = [
            {
                header: 'ConfigMaps',
                id: EnvResourceType.ConfigMap,
                items: cmData.map(({ name, diffState, id }) => ({
                    title: name,
                    diffState,
                    href: getNavItemHref(EnvResourceType.ConfigMap, name),
                    onClick: () => {
                        const element = document.querySelector(`#${id}`)
                        element?.scrollIntoView({ block: 'start' })
                    },
                })),
                noItemsText: 'No configmaps',
            },
            {
                header: 'Secrets',
                id: EnvResourceType.Secret,
                items: secretData.map(({ name, diffState, id }) => ({
                    title: name,
                    diffState,
                    href: getNavItemHref(EnvResourceType.Secret, name),
                    onClick: () => {
                        const element = document.querySelector(`#${id}`)
                        element?.scrollIntoView({ block: 'start' })
                    },
                })),
                noItemsText: 'No secrets',
            },
        ]

        return {
            configList,
            collapsibleNavList,
            navList,
        }
    }

    const _currentList = currentList as AppEnvDeploymentConfigListParams<true>['currentList']
    const _compareList = compareList as AppEnvDeploymentConfigListParams<true>['compareList']

    const currentManifestData = getManifestDiffViewData(_currentList)
    const compareManifestData = getManifestDiffViewData(_compareList)

    const manifestData = {
        id: EnvResourceType.Manifest,
        pathType: EnvResourceType.Manifest,
        title: 'Manifest Output',
        primaryConfig: {
            heading: <span className="fs-12 fw-6 cn-9">Generated Manifest</span>,
            list: compareManifestData,
        },
        secondaryConfig: {
            heading: <span className="fs-12 fw-6 cn-9">Generated Manifest</span>,
            list: currentManifestData,
        },
        diffState: getDiffState(currentManifestData.codeEditorValue.value, compareManifestData.codeEditorValue.value),
        singleView: true,
    }

    const configList: DeploymentConfigDiffProps['configList'] = [manifestData]

    const navList: DeploymentConfigDiffProps['navList'] = [
        {
            title: manifestData.title,
            diffState: manifestData.diffState,
            href: getNavItemHref(EnvResourceType.Manifest, null),
            onClick: () => {
                const element = document.querySelector(`#${manifestData.id}`)
                element?.scrollIntoView({ block: 'start' })
            },
        },
    ]

    return {
        configList,
        collapsibleNavList: [],
        navList,
    }
}

export const getDeploymentTemplateValues = (deploymentTemplate: DeploymentTemplateDTO) => {
    try {
        const data = getDeploymentTemplateData(deploymentTemplate)
        return JSON.stringify(data)
    } catch {
        return null
    }
}

export const getDefaultVersionAndPreviousDeploymentOptions = (data: TemplateListDTO[]) =>
    data.reduce<{ previousDeployments: TemplateListDTO[]; defaultVersions: TemplateListDTO[] }>(
        (acc, curr) => ({
            ...acc,
            ...(curr.type === TemplateListType.DefaultVersions && curr.chartType === 'Deployment'
                ? {
                      defaultVersions: [...acc.defaultVersions, curr],
                  }
                : acc.defaultVersions),
            ...(curr.type === TemplateListType.DeployedOnSelfEnvironment
                ? {
                      previousDeployments: [...acc.previousDeployments, curr],
                  }
                : acc.previousDeployments),
        }),
        {
            defaultVersions: [],
            previousDeployments: [],
        },
    )

export const diffStateTextMap: Record<DeploymentConfigDiffState, string> = {
    hasDiff: 'Has difference',
    added: 'Added',
    deleted: 'Deleted',
    noDiff: 'No change',
}

export const diffStateIconMap: Record<DeploymentConfigDiffState, FunctionComponent<SVGProps<SVGSVGElement>>> = {
    hasDiff: ICDiffFileUpdated,
    added: ICDiffFileAdded,
    deleted: ICDiffFileRemoved,
    noDiff: null,
}

export const diffStateTooltipTextMap: Record<DeploymentConfigDiffState, string> = {
    hasDiff: 'File has difference',
    added: 'File has been added',
    deleted: 'File has been deleted',
    noDiff: null,
}

export const diffStateTextColorMap: Record<DeploymentConfigDiffState, `c${string}`> = {
    hasDiff: 'cy-7',
    added: 'cg-5',
    deleted: 'cr-5',
    noDiff: 'cn-7',
}
