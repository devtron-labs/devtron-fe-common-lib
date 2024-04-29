import moment from 'moment'
import { get, post } from './Api'
import { ROUTES } from './Constants'
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
} from './Types'

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

interface UserRole extends ResponseType {
    result?: {
        roles: string[]
        superAdmin: boolean
    }
}

const stageMap = {
    PRECD: 'PRE',
    CD: 'DEPLOY',
    POSTCD: 'POST',
    APPROVAL: 'APPROVAL',
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

const cdMaterialListModal = (artifacts: any[], offset: number, artifactId?: number, artifactStatus?: string, disableDefaultSelection?: boolean) => {
    if (!artifacts || !artifacts.length) return []

    const markFirstSelected = offset === 0
    const startIndex = offset
    let isImageMarked = disableDefaultSelection

    const materials = artifacts.map((material, index) => {
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
            userApprovalMetadata: material.userApprovalMetadata,
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
        }
    })
    return materials
}

const processCDMaterialsApprovalInfo = (enableApproval: boolean, cdMaterialsResult): CDMaterialsApprovalInfo => {
    if (!enableApproval || !cdMaterialsResult) {
        return {
            approvalUsers: [],
            userApprovalConfig: null,
            canApproverDeploy: cdMaterialsResult?.canApproverDeploy ?? false,
        }
    }

    return {
        approvalUsers: cdMaterialsResult.approvalUsers,
        userApprovalConfig: cdMaterialsResult.userApprovalConfig,
        canApproverDeploy: cdMaterialsResult.canApproverDeploy ?? false,
    }
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
        }
    }

    return {
        appReleaseTagNames: cdMaterialsResult.appReleaseTagNames ?? [],
        tagsEditable: cdMaterialsResult.tagsEditable ?? false,
        hideImageTaggingHardDelete: cdMaterialsResult.hideImageTaggingHardDelete,
        resourceFilters: cdMaterialsResult.resourceFilters ?? [],
        totalCount: cdMaterialsResult.totalCount ?? 0,
        requestedUserId: cdMaterialsResult.requestedUserId,
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
        }
    }

    const materials = cdMaterialListModal(
        cdMaterialsResult.ci_artifacts,
        offset ?? 0,
        cdMaterialsResult.latest_wf_artifact_id,
        cdMaterialsResult.latest_wf_artifact_status,
        disableDefaultSelection,
    )
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
            URL = getUrlWithSearchParams(`${ROUTES.CD_MATERIAL_GET}/${cdMaterialID}/material/rollback`, manipulatedParams)
            break

        case CDMaterialServiceEnum.IMAGE_PROMOTION:
            // Directly sending queryParams since do not need to get queryParams sanitized in case of image promotion
            URL = getUrlWithSearchParams(ROUTES.APP_ARTIFACT_PROMOTE_MATERIAL, queryParams)
            break
        // Meant for handling getCDMaterialList
        default:
            URL = getUrlWithSearchParams(`${ROUTES.CD_MATERIAL_GET}/${cdMaterialID}/material`, {
                ...manipulatedParams,
                stage: stageMap[stage],
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

export const getDefaultConfig = (): Promise<ResponseType> => {
    return get(`${ROUTES.NOTIFIER}/channel/config`)
}

export function getWebhookEventsForEventId(eventId: string | number) {
    const URL = `${ROUTES.GIT_HOST_EVENT}/${eventId}`
    return get(URL)
}
