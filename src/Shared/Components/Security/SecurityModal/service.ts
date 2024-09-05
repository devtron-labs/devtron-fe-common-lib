/*
 * Copyright (c) 2024. Devtron Inc.
 */

import { get, post } from '@Common/Api'
import { ResponseType } from '@Common/Types'
import { getUrlWithSearchParams } from '@Common/Helper'
import { ROUTES } from '@Common/Constants'
import { getParsedScanResult } from '../Vulnerabilities'
import {
    ApiResponseResultType,
    GetResourceScanDetailsPayloadType,
    GetResourceScanDetailsResponseType,
    SecurityModalPropsType,
} from './types'
import { getTotalVulnerabilityCount, parseExecutionDetailResponse, parseGetResourceScanDetailsResponse } from './utils'

export const getExecutionDetails = async (
    executionDetailPayload: SecurityModalPropsType['executionDetailsPayload'],
): Promise<ResponseType<ApiResponseResultType>> => {
    // To replace url with constants in common
    const url = getUrlWithSearchParams('security/scan/executionDetail', executionDetailPayload)
    const response = await get(url)
    return { ...response, result: parseExecutionDetailResponse(response.result) }
}

export const getResourceScanDetails = async ({
    name,
    namespace,
    clusterId,
    group,
    version,
    kind,
    appId,
    appType,
    deploymentType,
    isAppDetailView,
}: GetResourceScanDetailsPayloadType): Promise<ResponseType<ApiResponseResultType>> => {
    const baseObject = {
        k8sRequest: {
            resourceIdentifier: {
                groupVersionKind: {
                    Group: group || '',
                    Version: version || 'v1',
                    Kind: kind,
                },
                namespace,
                name,
            },
        },
        clusterId: clusterId ? +clusterId : 0,
    }

    const payload = isAppDetailView
        ? {
              ...baseObject,
              appId,
              appType,
              deploymentType,
          }
        : baseObject

    const response = await post(ROUTES.K8S_RESOURCE_SECURITY, payload)
    const parsedScannedResult =
        response.result?.map((resourceData) => ({
            ...resourceData,
            scanResult: getParsedScanResult(resourceData.scanResult),
        })) ?? []
    const data: GetResourceScanDetailsResponseType = {
        ...getTotalVulnerabilityCount(parsedScannedResult),
        imageVulnerabilities: parsedScannedResult,
    }
    response.result = parseGetResourceScanDetailsResponse(data)
    return response
}

export const getSecurityScan = async ({
    appId,
    envId,
    installedAppId,
    artifactId,
    installedAppVersionHistoryId,
}: SecurityModalPropsType['appDetailsPayload']) => {
    const url = getUrlWithSearchParams(ROUTES.SCAN_RESULT, {
        appId,
        envId,
        installedAppId,
        artifactId,
        installedAppVersionHistoryId,
    })
    return get(url) as Promise<ResponseType<ApiResponseResultType>>
}
