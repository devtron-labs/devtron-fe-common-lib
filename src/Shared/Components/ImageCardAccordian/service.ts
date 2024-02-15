import moment from 'moment'
import { ROUTES, VulnerabilityType, get, sortCallback } from '../../../Common'

interface LastExecutionResponseType {
    code: number
    status: string
    result: {
        scanExecutionId: number
        lastExecution: string
        appId?: number
        appName?: string
        envId?: number
        envName?: string
        pod?: string
        replicaSet?: string
        image?: string
        objectType: 'app' | 'chart'
        scanned: boolean
        scanEnabled: boolean
        severityCount: {
            critical: number
            moderate: number
            low: number
        }
        vulnerabilities: VulnerabilityType[]
        scanToolId?: number
    }
}

function parseLastExecutionResponse(response): LastExecutionResponseType {
    const vulnerabilities = response.result.vulnerabilities || []
    const critical = vulnerabilities
        .filter((v) => v.severity === 'critical')
        .sort((a, b) => sortCallback('cveName', a, b))
    const moderate = vulnerabilities
        .filter((v) => v.severity === 'moderate')
        .sort((a, b) => sortCallback('cveName', a, b))
    const low = vulnerabilities.filter((v) => v.severity === 'low').sort((a, b) => sortCallback('cveName', a, b))
    const groupedVulnerabilities = critical.concat(moderate, low)
    return {
        ...response,
        result: {
            ...response.result,
            scanExecutionId: response.result.ScanExecutionId,
            lastExecution: moment(response.result.executionTime).utc(false).format('ddd DD MMM YYYY HH:mm:ss'),
            objectType: response.result.objectType,
            severityCount: {
                critical: response.result?.severityCount?.high,
                moderate: response.result?.severityCount?.moderate,
                low: response.result?.severityCount?.low,
            },
            vulnerabilities: groupedVulnerabilities.map((cve) => ({
                name: cve.cveName,
                severity: cve.severity,
                package: cve.package,
                version: cve.currentVersion,
                fixedVersion: cve.fixedVersion,
                policy: cve.permission,
            })),
            scanToolId: response.result.scanToolId,
        },
    }
}

function getLastExecution(queryString: number | string) {
    return get(`${ROUTES.SECURITY_SCAN_EXECUTION_DETAILS}?${queryString}`)
}

export function getLastExecutionByArtifactAppEnv(
    artifact: string | number,
    appId: number | string,
    envId: number | string,
): Promise<LastExecutionResponseType> {
    const queryString = `artifactId=${artifact}&appId=${appId}&envId=${envId}`
    return getLastExecution(queryString).then((response) => parseLastExecutionResponse(response))
}
