import { SeverityCount } from '@Shared/types'
import { SeveritiesDTO } from './SecurityModal/types'

export const getTotalSeverityCount = (severityCount: SeverityCount): number => {
    const totalCount =
        (severityCount.critical || 0) +
        (severityCount.high || 0) +
        (severityCount.medium || 0) +
        (severityCount.low || 0) +
        (severityCount.unknown || 0)
    return totalCount
}

export const getSeverityCountFromSummary = (
    scanResultSeverities: Partial<Record<SeveritiesDTO, number>>,
): SeverityCount => ({
    critical: scanResultSeverities?.critical || 0,
    high: scanResultSeverities?.high || 0,
    medium: scanResultSeverities?.medium || 0,
    low: scanResultSeverities?.low || 0,
    unknown: scanResultSeverities?.unknown || 0,
})

export const getCVEUrlFromCVEName = (cveName: string): string =>
    `https://cve.mitre.org/cgi-bin/cvename.cgi?name=${cveName}`
