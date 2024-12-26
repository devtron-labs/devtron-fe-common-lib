import { SeverityCount } from '@Shared/types'
import { SCAN_TOOL_ID_CLAIR, SCAN_TOOL_ID_TRIVY } from '@Shared/constants'
import { ScanResultDTO, SeveritiesDTO } from './SecurityModal/types'

export const getCVEUrlFromCVEName = (cveName: string): string =>
    `https://cve.mitre.org/cgi-bin/cvename.cgi?name=${cveName}`

export const getScanToolAndSeverityCount = (
    scanResult: ScanResultDTO,
): { scanToolId: number; severityCount: SeverityCount; totalCount: number } => {
    const scanToolId =
        scanResult?.imageScan?.vulnerability?.list?.[0].scanToolName === 'TRIVY'
            ? SCAN_TOOL_ID_TRIVY
            : SCAN_TOOL_ID_CLAIR

    const severities = scanResult?.imageScan?.vulnerability?.summary?.severities

    const severityCount: SeverityCount = {
        critical: severities?.[SeveritiesDTO.CRITICAL] || 0,
        high: severities?.[SeveritiesDTO.HIGH] || 0,
        medium: severities?.[SeveritiesDTO.MEDIUM] || 0,
        low: severities?.[SeveritiesDTO.LOW] || 0,
        unknown: severities?.[SeveritiesDTO.UNKNOWN] || 0,
    }

    const totalCount =
        severityCount.critical + severityCount.high + severityCount.medium + severityCount.low + severityCount.unknown

    return { scanToolId, severityCount, totalCount }
}
