export interface VulnerabilitiesProps {
    isScanned: boolean
    isScanEnabled: boolean
    artifactId: number
    applicationId: number
    environmentId: number
    setVulnerabilityCount: React.Dispatch<React.SetStateAction<number>>
}
