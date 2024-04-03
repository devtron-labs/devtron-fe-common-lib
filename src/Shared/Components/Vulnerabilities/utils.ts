import moment from 'moment'
import { DATE_TIME_FORMAT_STRING } from '../../constants'
import { sortCallback } from '../../../Common'
import { LastExecutionResponseType, Severity } from '../../types'

export function parseLastExecutionResponse(response): LastExecutionResponseType {
    const vulnerabilities = response.result.vulnerabilities || []
    const critical = vulnerabilities
        .filter((v) => v.severity === Severity.CRITICAL)
        .sort((a, b) => sortCallback('cveName', a, b))
    const moderate = vulnerabilities
        .filter((v) => v.severity === Severity.MODERATE)
        .sort((a, b) => sortCallback('cveName', a, b))
    const low = vulnerabilities.filter((v) => v.severity === Severity.LOW).sort((a, b) => sortCallback('cveName', a, b))
    const sortedVulnerabilities = critical.concat(moderate, low)
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
            vulnerabilities: sortedVulnerabilities.map((cve) => ({
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
