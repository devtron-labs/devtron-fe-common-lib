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

import YAML from 'yaml'

import { ReactComponent as ICCheck } from '@Icons/ic-check.svg'
import { ReactComponent as ICCheckCircleDots } from '@Icons/ic-check-circle-dots.svg'
import { ReactComponent as ICEditFile } from '@Icons/ic-edit-file.svg'
import { ReactComponent as ICFileCode } from '@Icons/ic-file-code.svg'
import { deepEqual, noop, YAMLStringify } from '@Common/Helper'
import {
    AppEnvDeploymentConfigListParams,
    DeploymentConfigDiffProps,
    DeploymentConfigDiffState,
    DeploymentHistoryDetail,
    DeploymentHistorySingleValue,
    DiffHeadingDataType,
    GenericSectionErrorState,
    prepareHistoryData,
} from '@Shared/Components'
import { DEPLOYMENT_HISTORY_CONFIGURATION_LIST_MAP } from '@Shared/constants'
import { stringComparatorBySortOrder, yamlComparatorBySortOrder } from '@Shared/Helpers'
import { ManifestTemplateDTO } from '@Pages/Applications'

import {
    CMSecretExternalType,
    ConfigMapSecretDataConfigDatumDTO,
    ConfigMapSecretDataDTO,
    ConfigResourceType,
    DeploymentTemplateDTO,
    DraftState,
    EnvResourceType,
    PipelineConfigDataDTO,
    TemplateListDTO,
    TemplateListType,
} from '../../Services/app.types'
import { DiffViewerProps } from '../DiffViewer/types'

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

const getDeploymentTemplateAppMetricsAndTemplateVersion = (
    data: DeploymentTemplateDTO,
    templateOptions: TemplateListDTO[],
) => {
    const parsedDraftData = JSON.parse(data?.deploymentDraftData?.configData[0].draftMetadata.data || null)
    const draftTemplateVersion = templateOptions?.find(
        ({ chartRefId }) => parsedDraftData?.chartRefId === chartRefId,
    )?.chartVersion

    return {
        isAppMetricsEnabled:
            parsedDraftData || data ? parsedDraftData?.isAppMetricsEnabled || data?.isAppMetricsEnabled || false : null,
        templateVersion: draftTemplateVersion || data?.templateVersion,
    }
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
 * Checks if the given secret is an external Kubernetes secret.
 *
 * @param secret - The secret data object to check.
 * @returns `true` if the secret is an external Kubernetes secret else `false` \
 * or `null` if the secret is invalid.
 */
const isExternalKubernetesSecret = (secret: ConfigMapSecretDataConfigDatumDTO) => {
    if (!secret) {
        return null
    }
    return secret.subPath && secret.external && secret.externalType === 'KubernetesSecret'
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

const getSortedYAMLStringifiedValue = (
    value: Record<string, unknown>,
    sortingConfig: AppEnvDeploymentConfigListParams<false>['sortingConfig'],
) => {
    const { sortBy, sortOrder } = sortingConfig ?? { sortBy: '', sortOrder: null }

    try {
        return (
            JSON.stringify(
                YAML.parse(
                    YAMLStringify(value, {
                        sortMapEntries: sortBy ? (a, b) => yamlComparatorBySortOrder(a, b, sortOrder) : null,
                    }),
                ),
            ) || ''
        )
    } catch {
        return ''
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
    sortingConfig: AppEnvDeploymentConfigListParams<false>['sortingConfig'],
) => {
    const compareToConfigData = getConfigData(compareToValue, type)
    const compareWithConfigData = getConfigData(compareWithValue, type)

    let compareToCodeEditorData: DeploymentHistorySingleValue
    let compareWithCodeEditorData: DeploymentHistorySingleValue

    if (type === ConfigResourceType.Secret) {
        const { compareToObfuscatedData, compareWithObfuscatedData } = getObfuscatedData(
            compareToConfigData ?? {},
            compareWithConfigData ?? {},
            compareToIsAdmin || compareToValue?.external,
            compareWithIsAdmin || compareWithValue?.external,
        )

        compareToCodeEditorData = {
            displayName: 'data',
            ...(isExternalKubernetesSecret(compareToValue)
                ? {
                      value: null,
                      resolvedValue: getSortedYAMLStringifiedValue(compareToObfuscatedData, sortingConfig),
                  }
                : {
                      value: getSortedYAMLStringifiedValue(compareToObfuscatedData, sortingConfig),
                  }),
        }

        compareWithCodeEditorData = {
            displayName: 'data',
            ...(isExternalKubernetesSecret(compareWithValue)
                ? {
                      value: null,
                      resolvedValue: getSortedYAMLStringifiedValue(compareWithObfuscatedData, sortingConfig),
                  }
                : {
                      value: getSortedYAMLStringifiedValue(compareWithObfuscatedData, sortingConfig),
                  }),
        }
    } else {
        compareToCodeEditorData = {
            displayName: 'data',
            value: getSortedYAMLStringifiedValue(compareToConfigData, sortingConfig),
        }

        compareWithCodeEditorData = {
            displayName: 'data',
            value: getSortedYAMLStringifiedValue(compareWithConfigData, sortingConfig),
        }
    }

    return { compareToCodeEditorData, compareWithCodeEditorData }
}

/**
 * Compares two values and returns the appropriate deployment configuration difference state.
 *
 * @param compareToValue - The original value to compare.
 * @param compareWithValue - The new value to compare against the original.
 * @returns `DeploymentConfigDiffState` enum value indicating the difference between the two values
 */
const getDiffState = (compareToValue: DeploymentHistoryDetail, compareWithValue: DeploymentHistoryDetail) => {
    const isCompareToPresent = !!compareToValue.codeEditorValue.value
    const isCompareWithPresent = !!compareWithValue.codeEditorValue.value

    if (!isCompareToPresent && isCompareWithPresent) {
        return DeploymentConfigDiffState.DELETED
    }

    if (isCompareToPresent && !isCompareWithPresent) {
        return DeploymentConfigDiffState.ADDED
    }

    if (!deepEqual(compareToValue, compareWithValue)) {
        return DeploymentConfigDiffState.HAS_DIFF
    }

    return DeploymentConfigDiffState.NO_DIFF
}

const getCMSecretHistoryDataForDiffState = (
    configMapSecretData: ConfigMapSecretDataConfigDatumDTO,
    historyData: DeploymentHistoryDetail,
) => {
    // CHECKING FOR EXTERNAL CM/CS
    if (
        configMapSecretData &&
        configMapSecretData.external &&
        (configMapSecretData.externalType === '' ||
            configMapSecretData.externalType === CMSecretExternalType.KubernetesSecret)
    ) {
        const historyDataWhenExternal = structuredClone(historyData)
        historyDataWhenExternal.codeEditorValue.value = 'external'
        return historyDataWhenExternal
    }

    return historyData
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
    sortingConfig: AppEnvDeploymentConfigListParams<false>['sortingConfig'],
) => {
    // Prepare the code editor data for compareTo and compareWith items
    const { compareToCodeEditorData, compareWithCodeEditorData } = getCodeEditorData(
        compareTo,
        compareWith,
        type,
        compareToIsAdmin,
        compareWithIsAdmin,
        sortingConfig,
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
        diffState: getDiffState(
            getCMSecretHistoryDataForDiffState(compareTo, compareToDiff),
            getCMSecretHistoryDataForDiffState(compareWith, compareWithDiff),
        ),
    }
}

const getDeploymentTemplateDiffViewData = (
    data: DeploymentTemplateDTO | null,
    templateOptions: TemplateListDTO[],
    sortingConfig: AppEnvDeploymentConfigListParams<false>['sortingConfig'],
) => {
    const _data = getDeploymentTemplateData(data)
    const codeEditorValue = {
        displayName: 'data',
        value: _data ? getSortedYAMLStringifiedValue(_data, sortingConfig) : '',
    }

    const diffViewData = prepareHistoryData(
        {
            ...getDeploymentTemplateAppMetricsAndTemplateVersion(data, templateOptions),
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

const getPipelineConfigDiffViewData = (
    data: PipelineConfigDataDTO,
    sortingConfig: AppEnvDeploymentConfigListParams<false>['sortingConfig'],
) => {
    const codeEditorValue = {
        displayName: 'data',
        value: data?.data ? getSortedYAMLStringifiedValue(data.data, sortingConfig) : '',
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
                <ICCheckCircleDots className="icon-dim-16 dc__no-shrink" />
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
    sortingConfig: AppEnvDeploymentConfigListParams<false>['sortingConfig'],
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
            sortingConfig,
        )

        const pathType =
            resourceType === ConfigResourceType.ConfigMap ? EnvResourceType.ConfigMap : EnvResourceType.Secret

        return {
            id: `${pathType}-${currentItem?.name || compareItem?.name}`,
            pathType,
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

const getDeploymentTemplateResolvedData = (deploymentTemplate: DeploymentTemplateDTO): DeploymentTemplateDTO => {
    try {
        if (deploymentTemplate.deploymentDraftData) {
            const parsedDraftResolvedData = JSON.parse(
                deploymentTemplate.deploymentDraftData.configData[0].draftMetadata.draftResolvedValue,
            )

            return {
                ...deploymentTemplate,
                deploymentDraftData: {
                    ...deploymentTemplate.deploymentDraftData,
                    configData: [
                        {
                            ...deploymentTemplate.deploymentDraftData.configData[0],
                            draftMetadata: {
                                ...deploymentTemplate.deploymentDraftData.configData[0].draftMetadata,
                                data: JSON.stringify({
                                    ...JSON.parse(
                                        deploymentTemplate.deploymentDraftData.configData[0].draftMetadata.data,
                                    ),
                                    envOverrideValues: parsedDraftResolvedData,
                                }),
                            },
                        },
                    ],
                },
            }
        }

        return {
            ...deploymentTemplate,
            data: deploymentTemplate.resolvedValue,
        }
    } catch {
        return null
    }
}

const getConfigDataWithResolvedDeploymentTemplate = (
    data: AppEnvDeploymentConfigListParams<false>['compareList'],
    convertVariables: boolean,
): AppEnvDeploymentConfigListParams<false>['compareList'] => {
    if (!data) {
        return {
            deploymentTemplate: null,
            configMapData: null,
            isAppAdmin: null,
            secretsData: null,
            pipelineConfigData: null,
        }
    }

    if (!data.deploymentTemplate || !convertVariables) {
        return data
    }

    return {
        ...data,
        deploymentTemplate: getDeploymentTemplateResolvedData(data.deploymentTemplate),
    }
}

const removeTooltipContent = (
    valuesObj: Record<string, DeploymentHistorySingleValue>,
): Record<string, DeploymentHistorySingleValue> => {
    if (!valuesObj) return valuesObj
    return Object.fromEntries(
        Object.entries(valuesObj).map(([key, val]) => {
            if (val && typeof val === 'object' && 'tooltipContent' in val) {
                // Remove tooltipContent so that diff is not checked in this property
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { tooltipContent, ...rest } = val
                return [key, rest]
            }
            return [key, val]
        }),
    )
}

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
    compareToTemplateOptions,
    compareWithTemplateOptions,
    sortingConfig,
}: AppEnvDeploymentConfigListParams<ManifestView>): {
    configList: DeploymentConfigDiffProps['configList']
    navList: DeploymentConfigDiffProps['navList']
    collapsibleNavList: DeploymentConfigDiffProps['collapsibleNavList']
} => {
    if (!isManifestView) {
        const compareToObject = getConfigDataWithResolvedDeploymentTemplate(
            currentList as AppEnvDeploymentConfigListParams<false>['currentList'],
            convertVariables,
        )
        const compareWithObject = getConfigDataWithResolvedDeploymentTemplate(
            compareList as AppEnvDeploymentConfigListParams<false>['compareList'],
            convertVariables,
        )
        const currentDeploymentData = getDeploymentTemplateDiffViewData(
            compareToObject.deploymentTemplate,
            compareToTemplateOptions,
            sortingConfig,
        )
        const compareDeploymentData = getDeploymentTemplateDiffViewData(
            compareWithObject.deploymentTemplate,
            compareWithTemplateOptions,
            sortingConfig,
        )

        const deploymentTemplateData = {
            id: EnvResourceType.DeploymentTemplate,
            pathType: EnvResourceType.DeploymentTemplate,
            title: 'Deployment Template',
            primaryConfig: {
                heading: getDiffHeading(compareWithObject.deploymentTemplate, true),
                list: compareDeploymentData,
            },
            secondaryConfig: {
                heading: getDiffHeading(compareToObject.deploymentTemplate, true),
                list: currentDeploymentData,
            },
            diffState: getDiffState(currentDeploymentData, compareDeploymentData),
        }

        let currentPipelineConfigData: DeploymentHistoryDetail
        let comparePipelineConfigData: DeploymentHistoryDetail
        let pipelineConfigData: DeploymentConfigDiffProps['configList'][0]

        if (compareToObject.pipelineConfigData || compareWithObject.pipelineConfigData) {
            currentPipelineConfigData = getPipelineConfigDiffViewData(compareToObject.pipelineConfigData, sortingConfig)
            comparePipelineConfigData = getPipelineConfigDiffViewData(
                compareWithObject.pipelineConfigData,
                sortingConfig,
            )

            const currentPipelineConfigDataForDiff = {
                ...currentPipelineConfigData,
                values: removeTooltipContent(currentPipelineConfigData.values),
            }

            const comparePipelineConfigDataForDiff = {
                ...comparePipelineConfigData,
                values: removeTooltipContent(comparePipelineConfigData.values),
            }

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
                diffState: getDiffState(currentPipelineConfigDataForDiff, comparePipelineConfigDataForDiff),
            }
        }

        const cmData = getConfigMapSecretData(
            compareToObject.configMapData,
            compareWithObject.configMapData,
            ConfigResourceType.ConfigMap,
            compareToObject.isAppAdmin,
            compareWithObject.isAppAdmin,
            convertVariables,
            sortingConfig,
        )

        const secretData = getConfigMapSecretData(
            compareToObject.secretsData,
            compareWithObject.secretsData,
            ConfigResourceType.Secret,
            compareToObject.isAppAdmin,
            compareWithObject.isAppAdmin,
            convertVariables,
            sortingConfig,
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
                Icon: ICFileCode,
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
                          Icon: ICFileCode,
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

    const compareToObject = currentList as AppEnvDeploymentConfigListParams<true>['currentList']
    const compareWithObject = compareList as AppEnvDeploymentConfigListParams<true>['compareList']

    const currentManifestData = getManifestDiffViewData(compareToObject)
    const compareManifestData = getManifestDiffViewData(compareWithObject)

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
        diffState: getDiffState(currentManifestData, compareManifestData),
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

export const renderDiffViewNoDifferenceState = (
    lhsValue: string,
    rhsValue: string,
): DiffViewerProps['codeFoldMessageRenderer'] =>
    lhsValue === rhsValue
        ? () => (
              <GenericSectionErrorState
                  useInfoIcon
                  title="No diff in configurations"
                  subTitle=""
                  description=""
                  buttonText="View values"
                  // Click event is handled at the parent level
                  reload={noop}
              />
          )
        : null
