import moment from 'moment'
import { DATE_TIME_FORMAT_STRING } from '../../constants'
import { sortCallback } from '../../../Common'
import { LastExecutionResponseType, LastExecutionResultType, Severity } from '../../types'

export const getParsedScanResult = (scanResult): LastExecutionResultType => {
    const vulnerabilities = scanResult?.vulnerabilities || []
    const critical = vulnerabilities
        .filter((v) => v.severity === Severity.CRITICAL)
        .sort((a, b) => sortCallback('cveName', a, b))
    const moderate = vulnerabilities
        .filter((v) => v.severity === Severity.MODERATE)
        .sort((a, b) => sortCallback('cveName', a, b))
    const low = vulnerabilities.filter((v) => v.severity === Severity.LOW).sort((a, b) => sortCallback('cveName', a, b))
    const sortedVulnerabilities = critical.concat(moderate, low)

    return {
        ...(scanResult || {}),
        lastExecution: scanResult?.executionTime
            ? moment(scanResult.executionTime).utc(false).format(DATE_TIME_FORMAT_STRING)
            : '',
        severityCount: {
            critical: scanResult?.severityCount?.high,
            moderate: scanResult?.severityCount?.moderate,
            low: scanResult?.severityCount?.low,
        },
        vulnerabilities: sortedVulnerabilities.map((cve) => ({
            name: cve.cveName,
            severity: cve.severity,
            package: cve.package,
            version: cve.currentVersion,
            fixedVersion: cve.fixedVersion,
            policy: cve.permission,
        })),
    }
}

export const parseLastExecutionResponse = (response): LastExecutionResponseType => ({
    ...response,
    result: getParsedScanResult(response.result),
})
