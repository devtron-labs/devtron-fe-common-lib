/* eslint-disable dot-notation */
import { ROUTES, ResponseType, get, trash } from '../../../Common'
import { DEPLOYMENT_HISTORY_CONFIGURATION_LIST_MAP, EXTERNAL_TYPES } from './constants'
import {
    CDPipelines,
    DeploymentConfigurationsRes,
    DeploymentHistory,
    DeploymentHistoryDetail,
    DeploymentHistoryDetailRes,
    DeploymentHistoryResult,
    DeploymentHistorySingleValue,
    DeploymentStatusDetailsResponse,
    FetchIdDataStatus,
    HistoryDiffSelectorRes,
    ModuleConfigResponse,
    TriggerDetails,
} from './types'
import { decode } from './utils'

const getTriggerDetailsQuery = (fetchIdData) => {
    if (fetchIdData && fetchIdData === FetchIdDataStatus.FETCHING) {
        return '?SHOW_APPLIED_FILTERS=true'
    }

    return ''
}

export function getTriggerDetails({ appId, envId, pipelineId, triggerId, fetchIdData }): Promise<TriggerDetails> {
    if (triggerId) {
        return get(
            `${ROUTES.APP}/cd-pipeline/workflow/trigger-info/${appId}/${envId}/${pipelineId}/${triggerId}${getTriggerDetailsQuery(fetchIdData)}`,
        )
    }
    return get(
        `${ROUTES.APP}/cd-pipeline/workflow/trigger-info/${appId}/${envId}/${pipelineId}/last${getTriggerDetailsQuery(fetchIdData)}`,
    )
}

export const getTagDetails = (params) => {
    const URL = `${ROUTES.IMAGE_TAGGING}/${params.pipelineId}/${params.artifactId}`
    return get(URL)
}

export const cancelCiTrigger = (params, isForceAbort) => {
    const URL = `${ROUTES.CI_CONFIG_GET}/${params.pipelineId}/workflow/${params.workflowId}?forceAbort=${isForceAbort}`
    return trash(URL)
}

export const cancelPrePostCdTrigger = (pipelineId, workflowRunner) => {
    const URL = `${ROUTES.CD_MATERIAL_GET}/${pipelineId}/workflowRunner/${workflowRunner}`
    return trash(URL)
}

export function getDeploymentStatusDetail(
    appId: string,
    envId: string,
    showTimeline: boolean,
    triggerId?: string,
    isHelmApps?: boolean,
    installedAppVersionHistoryId?: number,
): Promise<DeploymentStatusDetailsResponse> {
    let appendUrl
    if (isHelmApps) {
        appendUrl = ROUTES.HELM_DEPLOYMENT_STATUS_TIMELINE_INSTALLED_APP
    } else {
        appendUrl = ROUTES.DEPLOYMENT_STATUS
    }
    return get(
        `${appendUrl}/${appId}/${envId}${`?showTimeline=${showTimeline}`}${triggerId ? `&wfrId=${triggerId}` : ``}${installedAppVersionHistoryId ? `&installedAppVersionHistoryId=${installedAppVersionHistoryId}` : ''}`,
    )
}

export function getManualSync(params: { appId: string; envId: string }): Promise<ResponseType> {
    return get(`${ROUTES.MANUAL_SYNC}/${params.appId}/${params.envId}`)
}

export const getDeploymentHistoryList = (
    appId: string,
    pipelineId: string,
    triggerId: string,
): Promise<DeploymentConfigurationsRes> => get(`app/history/deployed-configuration/${appId}/${pipelineId}/${triggerId}`)

export const getDeploymentHistoryDetail = (
    appId: string,
    pipelineId: string,
    id: string,
    historyComponent: string,
    historyComponentName: string,
): Promise<DeploymentHistoryDetailRes> =>
    get(
        `app/history/deployed-component/detail/${appId}/${pipelineId}/${id}?historyComponent=${historyComponent
            .replace('-', '_')
            .toUpperCase()}${historyComponentName ? `&historyComponentName=${historyComponentName}` : ''}`,
    )

export const prepareDeploymentTemplateData = (rawData): Record<string, DeploymentHistorySingleValue> => {
    const deploymentTemplateData = {}
    if (rawData.templateVersion) {
        deploymentTemplateData['templateVersion'] = { displayName: 'Chart Version', value: rawData.templateVersion }
    }
    if (rawData.isAppMetricsEnabled || rawData.isAppMetricsEnabled === false) {
        deploymentTemplateData['isAppMetricsEnabled'] = {
            displayName: 'Application metrics',
            value: rawData.isAppMetricsEnabled ? 'Enabled' : 'Disabled',
        }
    }
    return deploymentTemplateData
}

export const preparePipelineConfigData = (rawData): Record<string, DeploymentHistorySingleValue> => {
    const pipelineConfigData = {}
    if (rawData.pipelineTriggerType) {
        pipelineConfigData['pipelineTriggerType'] = {
            displayName: 'When do you want the pipeline to execute?',
            value: rawData.pipelineTriggerType,
        }
    }
    if (rawData.strategy) {
        pipelineConfigData['strategy'] = {
            displayName: 'Deployment strategy',
            value: rawData.strategy,
        }
    }
    return pipelineConfigData
}

export const prepareConfigMapAndSecretData = (
    rawData,
    type: string,
    historyData: DeploymentHistoryDetail,
    skipDecode?: boolean,
): Record<string, DeploymentHistorySingleValue> => {
    const secretValues = {}

    if (rawData.external !== undefined) {
        if (rawData.external) {
            if (rawData.externalType) {
                secretValues['external'] = {
                    displayName: 'Data type',
                    value: EXTERNAL_TYPES[type][rawData.externalType],
                }
            } else {
                secretValues['external'] = {
                    displayName: 'Data type',
                    value:
                        type === 'Secret'
                            ? EXTERNAL_TYPES[type].KubernetesSecret
                            : EXTERNAL_TYPES[type].KubernetesConfigMap,
                }
            }
        } else {
            secretValues['external'] = { displayName: 'Data type', value: EXTERNAL_TYPES[type][''] }
            if (type === 'Secret' && historyData.codeEditorValue.value) {
                const secretData = JSON.parse(historyData.codeEditorValue.value)
                let resolvedSecretData = {}
                if (historyData.codeEditorValue?.resolvedValue) {
                    resolvedSecretData = JSON.parse(historyData.codeEditorValue.resolvedValue)
                }
                const decodeNotRequired =
                    skipDecode || Object.keys(secretData).some((data) => secretData[data] === '*****') // Don't decode in case of non admin user

                // eslint-disable-next-line no-param-reassign
                historyData.codeEditorValue.value = decodeNotRequired
                    ? historyData.codeEditorValue.value
                    : JSON.stringify(decode(secretData))
                // eslint-disable-next-line no-param-reassign
                historyData.codeEditorValue.resolvedValue = decodeNotRequired
                    ? historyData.codeEditorValue.resolvedValue
                    : JSON.stringify(decode(resolvedSecretData))
            }
        }
    }
    if (rawData.type) {
        let typeValue = 'Environment Variable'
        if (rawData.type === 'volume') {
            typeValue = 'Data Volume'
            if (rawData.mountPath) {
                secretValues['mountPath'] = { displayName: 'Volume mount path', value: rawData.mountPath }
            }
            if (rawData.subPath) {
                secretValues['subPath'] = { displayName: 'Set SubPath', value: 'Yes' }
            }
            if (rawData.filePermission) {
                secretValues['filePermission'] = {
                    displayName: 'Set file permission',
                    value: rawData.filePermission,
                }
            }
        }
        secretValues['type'] = {
            displayName: `How do you want to use this ${type}?`,
            value: typeValue,
        }
    }
    if (type === 'Secret') {
        if (rawData.roleARN) {
            secretValues['roleARN'] = { displayName: 'Role ARN', value: rawData.roleARN }
        }
    }
    return secretValues
}

export const prepareHistoryData = (
    rawData,
    historyComponent: string,
    skipDecode?: boolean,
): DeploymentHistoryDetail => {
    let values
    const historyData = { codeEditorValue: rawData.codeEditorValue, values: {} }
    // eslint-disable-next-line no-param-reassign
    delete rawData.codeEditorValue
    if (historyComponent === DEPLOYMENT_HISTORY_CONFIGURATION_LIST_MAP.DEPLOYMENT_TEMPLATE.VALUE) {
        values = prepareDeploymentTemplateData(rawData)
    } else if (historyComponent === DEPLOYMENT_HISTORY_CONFIGURATION_LIST_MAP.PIPELINE_STRATEGY.VALUE) {
        values = preparePipelineConfigData(rawData)
    } else {
        values = prepareConfigMapAndSecretData(
            rawData,
            historyComponent === DEPLOYMENT_HISTORY_CONFIGURATION_LIST_MAP.CONFIGMAP.VALUE
                ? DEPLOYMENT_HISTORY_CONFIGURATION_LIST_MAP.CONFIGMAP.DISPLAY_NAME
                : DEPLOYMENT_HISTORY_CONFIGURATION_LIST_MAP.SECRET.DISPLAY_NAME,
            historyData,
            skipDecode,
        )
    }
    historyData.values = values
    return historyData
}

export const getDeploymentDiffSelector = (
    appId: string,
    pipelineId: string,
    historyComponent,
    baseConfigurationId,
    historyComponentName,
): Promise<HistoryDiffSelectorRes> =>
    get(
        `app/history/deployed-component/list/${appId}/${pipelineId}?baseConfigurationId=${baseConfigurationId}&historyComponent=${historyComponent
            .replace('-', '_')
            .toUpperCase()}${historyComponentName ? `&historyComponentName=${historyComponentName}` : ''}`,
    )

export function getCDBuildReport(appId, envId, pipelineId, workflowId) {
    return get(`app/cd-pipeline/workflow/download/${appId}/${envId}/${pipelineId}/${workflowId}`)
}

export async function getTriggerHistory(
    appId: number | string,
    envId: number | string,
    pipelineId: number | string,
    pagination,
): Promise<DeploymentHistoryResult> {
    return get(
        `app/cd-pipeline/workflow/history/${appId}/${envId}/${pipelineId}?offset=${pagination.offset}&size=${pagination.size}`,
    ).then(({ result, code, status }) => ({
        result: {
            cdWorkflows: (result.cdWorkflows || []).map((deploymentHistory: DeploymentHistory) => ({
                ...deploymentHistory,
                triggerId: deploymentHistory?.cd_workflow_id,
                podStatus: deploymentHistory?.pod_status,
                startedOn: deploymentHistory?.started_on,
                finishedOn: deploymentHistory?.finished_on,
                pipelineId: deploymentHistory?.pipeline_id,
                logLocation: deploymentHistory?.log_file_path,
                triggeredBy: deploymentHistory?.triggered_by,
                artifact: deploymentHistory?.image,
                triggeredByEmail: deploymentHistory?.email_id,
                stage: deploymentHistory?.workflow_type,
                image: deploymentHistory?.image,
                imageComment: deploymentHistory?.imageComment,
                imageReleaseTags: deploymentHistory?.imageReleaseTags,
                artifactId: deploymentHistory?.ci_artifact_id,
            })),
            appReleaseTagNames: result.appReleaseTagNames,
            tagsEditable: result.tagsEditable,
            hideImageTaggingHardDelete: result.hideImageTaggingHardDelete,
        },
        code,
        status,
    }))
}

export const getCDPipelines = (appId: number | string): Promise<CDPipelines> => {
    const URL = `${ROUTES.CD_CONFIG}/${appId}`
    return get(URL).then((response) => response.result)
}

export const getModuleConfigured = (moduleName: string): Promise<ModuleConfigResponse> =>
    get(`${ROUTES.MODULE_CONFIGURED}?name=${moduleName}`)
