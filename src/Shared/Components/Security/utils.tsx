import { ScanResultDTO, SeveritiesDTO } from './SecurityModal'

export const getCVEUrlFromCVEName = (cveName: string): string =>
    `https://cve.mitre.org/cgi-bin/cvename.cgi?name=${cveName}`

export const getTotalSeverities = (severityCount: Partial<Record<SeveritiesDTO, number>>) =>
    Object.entries(severityCount)
        .filter(([key]) => key !== SeveritiesDTO.SUCCESSES)
        .reduce((acc, [, value]) => acc + value, 0)

export const getSecurityThreatsArray = (scanResult: ScanResultDTO): Partial<Record<SeveritiesDTO, number>>[] => {
    const { imageScan, codeScan, kubernetesManifest } = scanResult
    return [
        imageScan?.vulnerability?.summary?.severities || {},
        imageScan?.license?.summary?.severities || {},
        codeScan?.vulnerability?.summary.severities || {},
        codeScan?.license?.summary?.severities || {},
        codeScan?.misConfigurations?.misConfSummary?.status || {},
        codeScan?.exposedSecrets?.summary?.severities || {},
        kubernetesManifest?.misConfigurations?.misConfSummary?.status || {},
        kubernetesManifest?.exposedSecrets?.summary?.severities || {},
    ]
}
