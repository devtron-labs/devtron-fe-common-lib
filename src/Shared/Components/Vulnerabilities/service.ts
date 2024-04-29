import moment from 'moment'
import { ROUTES, get, getUrlWithSearchParams, sortCallback } from '../../../Common'
import { LastExecutionResponseType, Severity } from '../../types'
import { DATE_TIME_FORMAT_STRING } from '../../constants'

function parseLastExecutionResponse(response): LastExecutionResponseType {
    const vulnerabilities = response.result.vulnerabilities || []
    const critical = vulnerabilities
        .filter((v) => v.severity === Severity.CRITICAL)
        .sort((a, b) => sortCallback('cveName', a, b))
    const moderate = vulnerabilities
        .filter((v) => v.severity === Severity.MODERATE)
        .sort((a, b) => sortCallback('cveName', a, b))
    const low = vulnerabilities.filter((v) => v.severity === Severity.LOW).sort((a, b) => sortCallback('cveName', a, b))
    const moderateAndLowVulnerabilities = critical.concat(moderate, low)
    return {
        ...response,
        result: {
            ...response.result,
            lastExecution: moment(response.result.executionTime).utc(false).format(DATE_TIME_FORMAT_STRING),
            severityCount: {
                critical: response.result?.severityCount?.high,
                moderate: response.result?.severityCount?.moderate,
                low: response.result?.severityCount?.low,
            },
            vulnerabilities: moderateAndLowVulnerabilities.map((cve) => ({
                name: cve.cveName,
                severity: cve.severity,
                package: cve.package,
                version: cve.currentVersion,
                fixedVersion: cve.fixedVersion,
                policy: cve.permission,
            })),
        },
    }
}

export function getLastExecutionByArtifactAppEnv(
    artifactId: string | number,
    appId: number | string,
    envId: number | string,
): Promise<LastExecutionResponseType> {
    return get(
        getUrlWithSearchParams(ROUTES.SECURITY_SCAN_EXECUTION_DETAILS, {
            artifactId,
            appId,
            envId,
        }),
    ).then((response) => parseLastExecutionResponse(response))
}
