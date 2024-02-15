import { VulnerabilityType } from '../../../Common'

export interface VulnerabilitiesProps {
    isScanned: boolean
    isScanEnabled: boolean
    areVulnerabilitiesLoading: boolean
    vulnerabilities: VulnerabilityType[]
    lastExecution: string
    scanToolId: number
    hasError: boolean
    reloadVulnerabilities: () => void
}
