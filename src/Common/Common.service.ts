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

import { MutableRefObject } from 'react'
import moment from 'moment'
import {
    sanitizeApprovalConfigData,
    sanitizeTargetPlatforms,
    sanitizeUserApprovalList,
    stringComparatorBySortOrder,
} from '@Shared/Helpers'
import { PolicyBlockInfo, RuntimeParamsAPIResponseType, RuntimePluginVariables } from '@Shared/types'
import { GitProviderType, ROUTES } from './Constants'
import { getUrlWithSearchParams, sortCallback } from './Helper'
import {
    TeamList,
    ResponseType,
    DeploymentNodeType,
    CDModalTab,
    FilterStates,
    CDMaterialServiceEnum,
    CDMaterialServiceQueryParams,
    CDMaterialResponseType,
    CDMaterialsMetaInfo,
    CDMaterialsApprovalInfo,
    CDMaterialFilterQuery,
    ImagePromotionMaterialInfo,
    EnvironmentListHelmResponse,
    UserApprovalMetadataType,
    CDMaterialListModalServiceUtilProps,
    CDMaterialType,
    GlobalVariableDTO,
    GlobalVariableOptionType,
    UserRole,
} from './Types'
import { ApiResourceType, STAGE_MAP } from '../Pages'
import { RefVariableType, VariableTypeFormat } from './CIPipeline.Types'
import { get, post } from './API'

export const getTeamListMin = (): Promise<TeamList> => {
    // ignore active field
    const URL = `${ROUTES.PROJECT_LIST_MIN}`
    return get(URL).then((response) => {
        let list = []
        if (response && response.result && Array.isArray(response.result)) {
            list = response.result
        }
        list = list.sort((a, b) => sortCallback('name', a, b))
        return {
            code: response.code,
            status: response.status,
            result: list,
        }
    })
}

export const SourceTypeMap = {
    BranchFixed: 'SOURCE_TYPE_BRANCH_FIXED',
    WEBHOOK: 'WEBHOOK',
    BranchRegex: 'SOURCE_TYPE_BRANCH_REGEX',
}

export function getUserRole(appName?: string): Promise<UserRole> {
    return get(`${ROUTES.USER_CHECK_ROLE}${appName ? `?appName=${appName}` : ''}`)
}

export function setImageTags(request, pipelineId: number, artifactId: number) {
    return post(`${ROUTES.IMAGE_TAGGING}/${pipelineId}/${artifactId}`, request)
}

export const sanitizeUserApprovalMetadata = (
    userApprovalMetadata: UserApprovalMetadataType,
): UserApprovalMetadataType => ({
    ...userApprovalMetadata,
    hasCurrentUserApproved: userApprovalMetadata?.hasCurrentUserApproved ?? false,
    canCurrentUserApprove: userApprovalMetadata?.canCurrentUserApprove ?? false,
    approvalConfigData: sanitizeApprovalConfigData(userApprovalMetadata?.approvalConfigData),
})

const sanitizeDeploymentBlockedState = (deploymentBlockedState: PolicyBlockInfo) => {
    if (!deploymentBlockedState) {
        return {
            isBlocked: false,
            blockedBy: null,
            reason: '',
        }
    }
    return {
        isBlocked: deploymentBlockedState.isBlocked || false,
        blockedBy: deploymentBlockedState.blockedBy || null,
        reason: deploymentBlockedState.reason || '',
    }
}

const cdMaterialListModal = ({
    artifacts,
    offset,
    artifactId,
    artifactStatus,
    disableDefaultSelection,
}: CDMaterialListModalServiceUtilProps) => {
    if (!artifacts || !artifacts.length) return []

    const markFirstSelected = offset === 0
    const startIndex = offset
    let isImageMarked = disableDefaultSelection

    const materials = artifacts.map<CDMaterialType>((material, index) => {
        let artifactStatusValue = ''
        const filterState = material.filterState ?? FilterStates.ALLOWED

        if (artifactId && artifactStatus && material.id === artifactId) {
            artifactStatusValue = artifactStatus
        }

        const selectImage =
            !isImageMarked && markFirstSelected && filterState === FilterStates.ALLOWED ? !material.vulnerable : false
        if (selectImage) {
            isImageMarked = true
        }

        return {
            index: startIndex + index,
            id: material.id,
            deployedTime: material.deployed_time
                ? moment(material.deployed_time).format('ddd, DD MMM YYYY, hh:mm A')
                : 'Not Deployed',
            deployedBy: material.deployedBy,
            wfrId: material.wfrId,
            tab: CDModalTab.Changes,
            image: extractImage(material.image),
            showChanges: false,
            vulnerabilities: [],
            buildTime: material.build_time || '',
            isSelected: selectImage,
            showSourceInfo: false,
            deployed: material.deployed || false,
            latest: material.latest || false,
            vulnerabilitiesLoading: true,
            scanned: material.scanned,
            scanEnabled: material.scanEnabled,
            vulnerable: material.vulnerable,
            runningOnParentCd: material.runningOnParentCd,
            artifactStatus: artifactStatusValue,
            userApprovalMetadata: sanitizeUserApprovalMetadata(material.userApprovalMetadata),
            triggeredBy: material.triggeredBy,
            isVirtualEnvironment: material.isVirtualEnvironment,
            imageComment: material.imageComment,
            imageReleaseTags: material.imageReleaseTags,
            // It is going to be null but required in type so can't remove
            lastExecution: material.lastExecution,
            materialInfo: material.material_info
                ? material.material_info.map((mat) => ({
                      modifiedTime: mat.modifiedTime
                          ? moment(mat.modifiedTime).format('ddd, DD MMM YYYY, hh:mm A')
                          : '',
                      commitLink: createGitCommitUrl(mat.url, mat.revision),
                      author: mat.author || '',
                      message: mat.message || '',
                      revision: mat.revision || '',
                      tag: mat.tag || '',
                      webhookData: mat.webhookData || '',
                      url: mat.url || '',
                      branch:
                          (material.ciConfigureSourceType === SourceTypeMap.WEBHOOK
                              ? material.ciConfigureSourceValue
                              : mat.branch) || '',
                      type: material.ciConfigureSourceType || '',
                  }))
                : [],
            filterState,
            appliedFiltersTimestamp: material.appliedFiltersTimestamp ?? '',
            appliedFilters: material.appliedFilters ?? [],
            appliedFiltersState: material.appliedFiltersState ?? FilterStates.ALLOWED,
            createdTime: material.createdTime ?? '',
            dataSource: material.data_source ?? '',
            registryType: material.registryType ?? '',
            imagePath: material.image ?? '',
            registryName: material.registryName ?? '',
            promotionApprovalMetadata: material.promotionApprovalMetadata,
            deployedOnEnvironments: material.deployedOnEnvironments ?? [],
            deploymentWindowArtifactMetadata: material.deploymentWindowArtifactMetadata ?? null,
            configuredInReleases: material.configuredInReleases ?? [],
            appWorkflowId: material.appWorkflowId ?? null,
            deploymentBlockedState: sanitizeDeploymentBlockedState(material.deploymentBlockedState),
            targetPlatforms: sanitizeTargetPlatforms(material.targetPlatforms),
        }
    })
    return materials
}

const sanitizeDeploymentApprovalInfo = (
    deploymentApprovalInfo: CDMaterialsApprovalInfo['deploymentApprovalInfo'],
): CDMaterialsApprovalInfo['deploymentApprovalInfo'] => ({
    eligibleApprovers: {
        anyUsers: {
            approverList: sanitizeUserApprovalList(deploymentApprovalInfo?.eligibleApprovers?.anyUsers?.approverList),
        },
        specificUsers: {
            approverList: sanitizeUserApprovalList(
                deploymentApprovalInfo?.eligibleApprovers?.specificUsers?.approverList,
            ),
        },
        userGroups: (deploymentApprovalInfo?.eligibleApprovers?.userGroups ?? []).map(
            ({ groupName, groupIdentifier, approverList }) => ({
                groupIdentifier,
                groupName,
                approverList: sanitizeUserApprovalList(approverList),
            }),
        ),
    },
    approvalConfigData: sanitizeApprovalConfigData(deploymentApprovalInfo?.approvalConfigData),
})

const processCDMaterialsApprovalInfo = (enableApproval: boolean, cdMaterialsResult): CDMaterialsApprovalInfo => {
    if (!enableApproval || !cdMaterialsResult) {
        return {
            canApproverDeploy: cdMaterialsResult?.canApproverDeploy ?? false,
            deploymentApprovalInfo: null,
        }
    }

    return {
        canApproverDeploy: cdMaterialsResult.canApproverDeploy ?? false,
        deploymentApprovalInfo: sanitizeDeploymentApprovalInfo(cdMaterialsResult.deploymentApprovalInfo),
    }
}

export const parseRuntimeParams = (response: RuntimeParamsAPIResponseType): RuntimePluginVariables[] => {
    const envVariables = Object.entries(response?.envVariables || {}).map<RuntimePluginVariables>(([key, value]) => ({
        name: key,
        value,
        defaultValue: '',
        format: VariableTypeFormat.STRING,
        isRequired: false,
        valueType: RefVariableType.NEW,
        variableStepScope: RefVariableType.GLOBAL,
        stepName: null,
        stepType: null,
        stepVariableId: Math.floor(new Date().valueOf() * Math.random()),
        valueConstraint: null,
        description: null,
        fileReferenceId: null,
        fileMountDir: null,
    }))

    const runtimeParams = (response?.runtimePluginVariables ?? []).map<RuntimePluginVariables>((variable) => ({
        ...variable,
        defaultValue: variable.value,
        stepVariableId: variable.stepVariableId || Math.floor(new Date().valueOf() * Math.random()),
    }))

    runtimeParams.push(...envVariables)
    runtimeParams.sort((a, b) => stringComparatorBySortOrder(a.name, b.name))

    return runtimeParams
}

const processCDMaterialsMetaInfo = (cdMaterialsResult): CDMaterialsMetaInfo => {
    if (!cdMaterialsResult) {
        return {
            tagsEditable: false,
            appReleaseTagNames: [],
            hideImageTaggingHardDelete: false,
            resourceFilters: [],
            totalCount: 0,
            requestedUserId: 0,
            runtimeParams: [],
        }
    }

    return {
        appReleaseTagNames: cdMaterialsResult.appReleaseTagNames ?? [],
        tagsEditable: cdMaterialsResult.tagsEditable ?? false,
        hideImageTaggingHardDelete: cdMaterialsResult.hideImageTaggingHardDelete,
        resourceFilters: cdMaterialsResult.resourceFilters ?? [],
        totalCount: cdMaterialsResult.totalCount ?? 0,
        requestedUserId: cdMaterialsResult.requestedUserId,
        runtimeParams: parseRuntimeParams(cdMaterialsResult.runtimeParams),
    }
}

const processImagePromotionInfo = (cdMaterialsResult): ImagePromotionMaterialInfo => {
    if (!cdMaterialsResult) {
        return {
            isApprovalPendingForPromotion: false,
            imagePromotionApproverEmails: [],
        }
    }

    return {
        isApprovalPendingForPromotion: cdMaterialsResult.isApprovalPendingForPromotion,
        imagePromotionApproverEmails: cdMaterialsResult.imagePromotionApproverEmails ?? [],
    }
}

export const processCDMaterialServiceResponse = (
    cdMaterialsResult,
    stage: DeploymentNodeType,
    offset: number,
    filter: CDMaterialFilterQuery,
    disableDefaultSelection?: boolean,
): CDMaterialResponseType => {
    if (!cdMaterialsResult) {
        return {
            materials: [],
            ...processCDMaterialsMetaInfo(cdMaterialsResult),
            ...processCDMaterialsApprovalInfo(false, cdMaterialsResult),
            ...processImagePromotionInfo(cdMaterialsResult),
            isExceptionUser: false,
        }
    }

    const materials = cdMaterialListModal({
        artifacts: cdMaterialsResult.ci_artifacts,
        offset: offset ?? 0,
        artifactId: cdMaterialsResult.latest_wf_artifact_id,
        artifactStatus: cdMaterialsResult.latest_wf_artifact_status,
        disableDefaultSelection,
    })
    const approvalInfo = processCDMaterialsApprovalInfo(
        stage === DeploymentNodeType.CD || stage === DeploymentNodeType.APPROVAL,
        cdMaterialsResult,
    )
    const metaInfo = processCDMaterialsMetaInfo(cdMaterialsResult)
    const imagePromotionInfo = processImagePromotionInfo(cdMaterialsResult)

    // TODO: On update of service would remove from here
    const filteredMaterials =
        filter && filter === CDMaterialFilterQuery.RESOURCE
            ? materials.filter((material) => material.filterState === FilterStates.ALLOWED)
            : materials

    return {
        materials: filteredMaterials,
        ...approvalInfo,
        ...metaInfo,
        ...imagePromotionInfo,
        isExceptionUser: cdMaterialsResult.userApprovalConfig?.isExceptionUser ?? false,
    }
}

const getSanitizedQueryParams = (queryParams: CDMaterialServiceQueryParams): CDMaterialServiceQueryParams => {
    const { filter, ...rest } = queryParams
    return rest
}

export const genericCDMaterialsService = (
    serviceType: CDMaterialServiceEnum,
    /**
     * In case of multiple candidates are there like promotion, would be sending it as null
     */
    cdMaterialID: number,
    /**
     * Would be sending null in case we don't have stage like for case of promotion.
     */
    stage: DeploymentNodeType,
    signal: AbortSignal,
    queryParams: CDMaterialServiceQueryParams = {},
): Promise<CDMaterialResponseType> => {
    // TODO: On update of service would remove from here
    const manipulatedParams = getSanitizedQueryParams(queryParams)

    let URL
    switch (serviceType) {
        case CDMaterialServiceEnum.ROLLBACK:
            URL = getUrlWithSearchParams(
                `${ROUTES.CD_MATERIAL_GET}/${cdMaterialID}/material/rollback`,
                manipulatedParams,
            )
            break

        case CDMaterialServiceEnum.IMAGE_PROMOTION:
            // Directly sending queryParams since do not need to get queryParams sanitized in case of image promotion
            URL = getUrlWithSearchParams(ROUTES.APP_ARTIFACT_PROMOTE_MATERIAL, queryParams)
            break
        // Meant for handling getCDMaterialList
        default:
            URL = getUrlWithSearchParams(`${ROUTES.CD_MATERIAL_GET}/${cdMaterialID}/material`, {
                ...manipulatedParams,
                stage: STAGE_MAP[stage],
            })
            break
    }

    return get(URL, { signal }).then((response) =>
        processCDMaterialServiceResponse(response.result, stage, queryParams.offset, queryParams.filter),
    )
}

export function extractImage(image: string): string {
    return image ? image.split(':').pop() : ''
}

export function createGitCommitUrl(url: string, revision: string): string {
    if (!url || !revision) {
        return 'NA'
    }
    if (url.indexOf('gitlab') > 0 || url.indexOf('github') > 0 || url.indexOf('azure') > 0) {
        const urlpart = url.split('@')
        if (urlpart.length > 1) {
            return `https://${urlpart[1].split('.git')[0]}/commit/${revision}`
        }
        if (urlpart.length == 1) {
            return `${urlpart[0].split('.git')[0]}/commit/${revision}`
        }
    }
    if (url.indexOf('bitbucket') > 0) {
        const urlpart = url.split('@')
        if (urlpart.length > 1) {
            return `https://${urlpart[1].split('.git')[0]}/commits/${revision}`
        }
        if (urlpart.length == 1) {
            return `${urlpart[0].split('.git')[0]}/commits/${revision}`
        }
    }
    return 'NA'
}

export function fetchChartTemplateVersions() {
    return get(`${ROUTES.DEPLOYMENT_TEMPLATE_LIST}?appId=-1&envId=-1`)
}

export const getDefaultConfig = (): Promise<ResponseType> => get(`${ROUTES.NOTIFIER}/channel/config`)

export function getEnvironmentListMinPublic(includeAllowedDeploymentTypes?: boolean) {
    return get(
        `${ROUTES.ENVIRONMENT_LIST_MIN}?auth=false${includeAllowedDeploymentTypes ? '&showDeploymentOptions=true' : ''}`,
    )
}

export function getClusterListMin() {
    const URL = `${ROUTES.CLUSTER}/autocomplete`
    return get(URL)
}

export const getResourceGroupListRaw = (clusterId: string): Promise<ResponseType<ApiResourceType>> =>
    get(`${ROUTES.API_RESOURCE}/${ROUTES.GVK}/${clusterId}`)

export function getNamespaceListMin(clusterIdsCsv: string): Promise<EnvironmentListHelmResponse> {
    const URL = `${ROUTES.NAMESPACE}/autocomplete?ids=${clusterIdsCsv}`
    return get(URL)
}
export function getWebhookEventsForEventId(eventId: string | number) {
    const URL = `${ROUTES.GIT_HOST_EVENT}/${eventId}`
    return get(URL)
}

/**
 *
 * @param gitUrl Git URL of the repository
 * @param branchName Branch name
 * @returns URL to the branch in the Git repository
 */
export const getGitBranchUrl = (gitUrl: string, branchName: string): string | null => {
    if (!gitUrl) return null
    const trimmedGitUrl = gitUrl
        .trim()
        .replace(/\.git$/, '')
        .replace(/\/$/, '') // Remove any trailing slash
    if (trimmedGitUrl.includes(GitProviderType.GITLAB)) return `${trimmedGitUrl}/-/tree/${branchName}`
    else if (trimmedGitUrl.includes(GitProviderType.GITHUB)) return `${trimmedGitUrl}/tree/${branchName}`
    else if (trimmedGitUrl.includes(GitProviderType.BITBUCKET)) return `${trimmedGitUrl}/branch/${branchName}`
    else if (trimmedGitUrl.includes(GitProviderType.AZURE)) return `${trimmedGitUrl}/src/branch/${branchName}`
    return null
}

export const getGlobalVariables = async ({
    appId,
    isCD = false,
    abortControllerRef,
}: {
    appId: number
    isCD?: boolean
    abortControllerRef?: MutableRefObject<AbortController>
}): Promise<GlobalVariableOptionType[]> => {
    try {
        const { result } = await get<GlobalVariableDTO[]>(
            getUrlWithSearchParams(ROUTES.PLUGIN_GLOBAL_VARIABLES, { appId }),
            {
                abortControllerRef,
            },
        )
        const variableList = (result ?? [])
            .filter((item) => (isCD ? item.stageType !== 'ci' : item.stageType === 'ci'))
            .map<GlobalVariableOptionType>((variable) => {
                const { name, ...updatedVariable } = variable

                return {
                    ...updatedVariable,
                    label: name,
                    value: name,
                    description: updatedVariable.description || '',
                    variableType: RefVariableType.GLOBAL,
                }
            })

        return variableList
    } catch (err) {
        throw err
    }
}
